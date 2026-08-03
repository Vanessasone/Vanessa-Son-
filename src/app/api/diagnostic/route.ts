// GET /api/diagnostic — outil de dépannage TEMPORAIRE.
// Vérifie la présence des variables d'environnement et teste une insertion
// Supabase (service_role + anon), sans jamais exposer de secret : seulement
// des booléens « présent/absent », l'URL (non secrète) et les messages d'erreur.
// À SUPPRIMER une fois le débogage terminé.
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const env = {
    NEXT_PUBLIC_SUPABASE_URL_present: !!url,
    NEXT_PUBLIC_SUPABASE_URL_apercu: url ? url.slice(0, 34) : null,
    NEXT_PUBLIC_SUPABASE_ANON_KEY_present: !!anonKey,
    NEXT_PUBLIC_SUPABASE_ANON_KEY_longueur: anonKey ? anonKey.length : 0,
    SUPABASE_SERVICE_ROLE_KEY_present: !!serviceKey,
    SUPABASE_SERVICE_ROLE_KEY_longueur: serviceKey ? serviceKey.length : 0,
    RESEND_API_KEY_present: !!process.env.RESEND_API_KEY,
    RESEND_FROM_valeur: process.env.RESEND_FROM ?? null, // non secret
    NOTION_API_KEY_present: !!process.env.NOTION_API_KEY,
    NOTION_CRM_DATABASE_ID_present: !!process.env.NOTION_CRM_DATABASE_ID,
    NEXT_PUBLIC_SITE_URL_valeur: process.env.NEXT_PUBLIC_SITE_URL ?? null,
  };

  // Test 1 — insertion via la clé ANON (exactement ce que fait le navigateur).
  let test_anon = 'non exécuté (URL ou clé anon manquante)';
  // Test 1b — mise à jour (le « remplissage » prénom/email/scores/consentement).
  let test_anon_update = 'non exécuté';
  if (url && anonKey) {
    try {
      const anon = createClient(url, anonKey, { auth: { persistSession: false } });
      const id = crypto.randomUUID();
      const { error } = await anon
        .from('audit_responses')
        .insert({ id, source: 'diagnostic-anon' });
      test_anon = error ? `ERREUR: ${error.message}` : `OK (ligne ${id} créée)`;
      if (!error) {
        // Teste des colonnes des 3 migrations (0001 scores, 0002 consentement).
        // Réplique EXACTEMENT toutes les colonnes que remplit l'audit (finalize).
        const { error: upErr } = await anon
          .from('audit_responses')
          .update({
            prenom: 'diag',
            email: 'diag@test.fr',
            ca_mensuel_range: '<5k',
            taille_equipe: 'seule',
            answers: { q1: 1 },
            progression: 18,
            completed_at: new Date().toISOString(),
            consentement_donne: true,
            consentement_date: new Date().toISOString(),
            consentement_texte: 'diag',
            consentement_version: 'diag',
            score_ventes: 50,
            score_delivery: 50,
            score_admin: 50,
            score_contenu: 50,
            score_global: 50,
            niveau: 'modere',
          })
          .eq('id', id);
        test_anon_update = upErr ? `ERREUR: ${upErr.message}` : 'OK';
      }
    } catch (e) {
      test_anon = `EXCEPTION: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  // Test 2 — insertion via la clé SERVICE_ROLE (contourne la RLS).
  let test_service = 'non exécuté (URL ou clé service manquante)';
  if (url && serviceKey) {
    try {
      const admin = createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const id = crypto.randomUUID();
      const { error } = await admin
        .from('audit_responses')
        .insert({ id, source: 'diagnostic-service' });
      test_service = error ? `ERREUR: ${error.message}` : `OK (ligne ${id} créée)`;
    } catch (e) {
      test_service = `EXCEPTION: ${e instanceof Error ? e.message : String(e)}`;
    }
  }

  // Test 3 — envoi d'un email de test via Resend (ajoute ?email=ton@email.com).
  let test_email = 'non exécuté (ajoute ?email=ton@email.com à l’URL)';
  const emailTo = new URL(req.url).searchParams.get('email');
  const resendKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  if (emailTo) {
    if (!resendKey || !from) {
      test_email = `clé/from manquant (RESEND_API_KEY=${!!resendKey}, RESEND_FROM="${from ?? ''}")`;
    } else {
      try {
        const resend = new Resend(resendKey);
        const { data, error } = await resend.emails.send({
          from,
          to: emailTo,
          subject: 'Test — Audit de Dépendance',
          html: '<p>Ceci est un email de test envoyé depuis le diagnostic.</p>',
        });
        test_email = error
          ? `ERREUR: ${JSON.stringify(error)}`
          : `OK (envoyé, id ${data?.id})`;
      } catch (e) {
        test_email = `EXCEPTION: ${e instanceof Error ? e.message : String(e)}`;
      }
    }
  }

  return NextResponse.json({
    version: 'v8',
    env,
    test_anon,
    test_anon_update,
    test_service,
    test_email,
  });
}
