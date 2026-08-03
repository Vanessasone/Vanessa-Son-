// POST /api/resultat — déclenché en fin de parcours (spec §5).
//  ├── Email transactionnel J+0 (Resend)
//  └── Webhook Notion « CRM Prospects — Toutes Marques »
// Puis marque email_resultat_envoye + notion_page_id sur la ligne Supabase.
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import type { Scores } from '@/lib/scoring';
import { calculerScores } from '@/lib/scoring';
import { htmlResultat, sujetResultat } from '@/lib/email';
import { pushToNotion } from '@/lib/notion';
import { getSupabaseAdmin } from '@/lib/supabase';

interface Body {
  id?: string | null;
  prenom?: string;
  email?: string;
  instagram_handle?: string | null;
  ca_mensuel_range?: string | null;
  taille_equipe?: string | null;
  scores?: Scores;
  answers?: Record<string, number>;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 });
  }

  const email = body.email?.trim();
  const prenom = body.prenom?.trim() ?? '';
  if (!email) {
    return NextResponse.json({ error: 'email requis' }, { status: 400 });
  }

  // Recalcule les scores côté serveur si les réponses sont fournies (source de
  // vérité) ; sinon on fait confiance à ceux transmis.
  const scores: Scores | undefined = body.answers
    ? calculerScores(body.answers)
    : body.scores;
  if (!scores) {
    return NextResponse.json({ error: 'scores manquants' }, { status: 400 });
  }

  const results: { email: boolean; notion: string | null } = {
    email: false,
    notion: null,
  };

  // Récupère le jeton de désinscription pour le pied de page de l'email.
  let unsubscribeToken: string | null = null;
  if (body.id && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { data } = await getSupabaseAdmin()
        .from('audit_responses')
        .select('unsubscribe_token')
        .eq('id', body.id)
        .single();
      unsubscribeToken = data?.unsubscribe_token ?? null;
    } catch (e) {
      console.warn('[audit] lecture unsubscribe_token échouée', e);
    }
  }

  // ─── Email (Resend) ────────────────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (resendKey && from) {
    try {
      const resend = new Resend(resendKey);
      const { error } = await resend.emails.send({
        from,
        to: email,
        subject: sujetResultat(scores),
        html: htmlResultat(prenom, scores, { unsubscribeToken }),
      });
      results.email = !error;
      if (error) console.warn('[audit] Resend a échoué', error);
    } catch (e) {
      console.warn('[audit] envoi email échoué', e);
    }
  }

  // ─── Notion ────────────────────────────────────────────────────────────────
  results.notion = await pushToNotion({
    prenom,
    email,
    instagram_handle: body.instagram_handle,
    ca_mensuel_range: body.ca_mensuel_range,
    taille_equipe: body.taille_equipe,
    scores,
  });

  // ─── Marquage Supabase (best-effort) ───────────────────────────────────────
  if (body.id && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      await getSupabaseAdmin()
        .from('audit_responses')
        .update({
          email_resultat_envoye: results.email,
          notion_page_id: results.notion,
        })
        .eq('id', body.id);
    } catch (e) {
      console.warn('[audit] marquage Supabase échoué', e);
    }
  }

  return NextResponse.json({ ok: true, ...results });
}
