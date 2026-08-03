// GET /api/cron/sequence — envoie l'email dû du jour pour chaque prospect.
// Déclenché quotidiennement (Vercel Cron ou tout planificateur). Protégé par
// CRON_SECRET. Applique le filtre RGPD et n'envoie jamais deux fois la même
// étape. Au plus UN email par prospect et par exécution (le prochain part le
// lendemain), pour ne pas vider la séquence d'un coup après une interruption.
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { Niveau, Scores } from '@/lib/scoring';
import { getSupabaseAdmin } from '@/lib/supabase';
import { STEP_DAYS, stepsPourNiveau, flagColumn, type Step } from '@/lib/sequence';
import { buildSequenceEmail } from '@/lib/sequence-emails';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const JOUR_MS = 24 * 60 * 60 * 1000;
const BATCH = 500;

interface Row {
  id: string;
  prenom: string | null;
  email: string | null;
  completed_at: string | null;
  niveau: Niveau | null;
  score_ventes: number | null;
  score_delivery: number | null;
  score_admin: number | null;
  score_contenu: number | null;
  score_global: number | null;
  unsubscribe_token: string | null;
  email_j2_envoye: boolean;
  email_j4_envoye: boolean;
  email_j6_envoye: boolean;
  email_j9_envoye: boolean;
}

function autorise(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // pas de secret configuré → endpoint fermé
  const auth = req.headers.get('authorization');
  if (auth === `Bearer ${secret}`) return true;
  const url = new URL(req.url);
  return url.searchParams.get('secret') === secret;
}

function scoresDe(row: Row): Scores | null {
  if (
    row.niveau == null ||
    row.score_global == null ||
    row.score_ventes == null ||
    row.score_delivery == null ||
    row.score_admin == null ||
    row.score_contenu == null
  ) {
    return null;
  }
  return {
    ventes: row.score_ventes,
    delivery: row.score_delivery,
    admin: row.score_admin,
    contenu: row.score_contenu,
    global: row.score_global,
    niveau: row.niveau,
  };
}

export async function GET(req: Request) {
  if (!autorise(req)) {
    return NextResponse.json({ error: 'non autorisé' }, { status: 401 });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Supabase non configuré' }, { status: 500 });
  }

  const dry = new URL(req.url).searchParams.get('dry') === '1';
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM?.trim();
  const resend = resendKey ? new Resend(resendKey) : null;

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from('audit_responses')
    .select(
      'id, prenom, email, completed_at, niveau, score_ventes, score_delivery, score_admin, score_contenu, score_global, unsubscribe_token, email_j2_envoye, email_j4_envoye, email_j6_envoye, email_j9_envoye',
    )
    .not('completed_at', 'is', null)
    .eq('consentement_donne', true)
    .eq('desinscrit', false)
    .eq('suppression_demandee', false)
    .not('email', 'is', null)
    .limit(BATCH);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const now = Date.now();
  const compte: Record<string, number> = { j2: 0, j4: 0, j6: 0, j9: 0 };
  let examinees = 0;
  const apercu: Array<{ email: string; step: Step; subject: string }> = [];

  for (const row of (data ?? []) as Row[]) {
    examinees++;
    const scores = scoresDe(row);
    if (!scores || !row.email || !row.completed_at) continue;

    const ageJours = (now - new Date(row.completed_at).getTime()) / JOUR_MS;

    // Première étape due et non envoyée, dans l'ordre du track.
    const track = stepsPourNiveau(scores.niveau);
    const due = track.find(
      (s) => ageJours >= STEP_DAYS[s] && row[flagColumn(s) as keyof Row] === false,
    );
    if (!due) continue;

    const { subject, html } = buildSequenceEmail(
      due,
      { prenom: row.prenom ?? '', scores },
      { unsubscribeToken: row.unsubscribe_token },
    );

    if (dry) {
      apercu.push({ email: row.email, step: due, subject });
      compte[due]++;
      continue;
    }

    if (!resend || !from) continue; // Resend non configuré : rien n'est envoyé

    try {
      const { error: sendErr } = await resend.emails.send({
        from,
        to: row.email,
        subject,
        html,
      });
      if (sendErr) {
        console.warn('[sequence] envoi échoué', row.id, sendErr);
        continue;
      }
      await admin
        .from('audit_responses')
        .update({ [flagColumn(due)]: true })
        .eq('id', row.id);
      compte[due]++;
    } catch (e) {
      console.warn('[sequence] exception envoi', row.id, e);
    }
  }

  return NextResponse.json({ ok: true, dry, examinees, envoyes: compte, apercu });
}
