// POST /api/audit — écritures côté serveur (service_role, contourne la RLS).
// Remplace les écritures navigateur qui étaient bloquées silencieusement par
// la RLS (anon peut insérer mais pas mettre à jour sa ligne).
//   { action: 'start',   id, source?, utm_campaign? }
//   { action: 'save',    id, answers, progression }
//   { action: 'abandon', id, progression }
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface Body {
  action?: 'start' | 'save' | 'abandon';
  id?: string;
  source?: string;
  utm_campaign?: string | null;
  answers?: Record<string, number>;
  progression?: number;
}

export async function POST(req: Request) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    // Sans Supabase configuré, on ne bloque pas le parcours.
    return NextResponse.json({ ok: false, reason: 'supabase non configuré' });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON invalide' }, { status: 400 });
  }

  const { action, id } = body;
  if (!id) {
    return NextResponse.json({ ok: false, error: 'id requis' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  try {
    if (action === 'start') {
      const { error } = await admin.from('audit_responses').insert({
        id,
        source: body.source ?? 'manychat',
        utm_campaign: body.utm_campaign ?? null,
        answers: {},
        progression: 0,
      });
      if (error) throw error;
    } else if (action === 'save') {
      const { error } = await admin
        .from('audit_responses')
        .update({ answers: body.answers ?? {}, progression: body.progression ?? 0 })
        .eq('id', id);
      if (error) throw error;
    } else if (action === 'abandon') {
      const { error } = await admin
        .from('audit_responses')
        .update({ abandonne: true, progression: body.progression ?? 0 })
        .eq('id', id);
      if (error) throw error;
    } else {
      return NextResponse.json({ ok: false, error: 'action inconnue' }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.warn('[audit] /api/audit', action, e);
    return NextResponse.json({
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
