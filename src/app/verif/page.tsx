'use client';

// Vérification TEMPORAIRE côté navigateur. À SUPPRIMER après le débogage.
// Affiche la présence des variables NEXT_PUBLIC et permet de tester une
// insertion + mise à jour Supabase DEPUIS LE NAVIGATEUR (comme le fait l'audit),
// en montrant l'erreur exacte s'il y en a une.
import { useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase';

export default function Verif() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const env = {
    navigateur_a_URL: !!url,
    URL_apercu: url ? url.slice(0, 34) : '(vide)',
    navigateur_a_ANON_KEY: !!anon,
    ANON_KEY_longueur: anon ? anon.length : 0,
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? '(vide)',
  };

  const [resultat, setResultat] = useState('(clique le bouton ci-dessous)');
  const [enCours, setEnCours] = useState(false);

  async function tester() {
    setEnCours(true);
    setResultat('test en cours…');
    try {
      const sb = getSupabaseBrowser();
      const id = crypto.randomUUID();
      const ins = await sb
        .from('audit_responses')
        .insert({ id, source: 'verif-client' });
      const upd = await sb
        .from('audit_responses')
        .update({
          prenom: 'verif',
          email: 'verif@test.fr',
          completed_at: new Date().toISOString(),
          answers: { q1: 1 },
          progression: 18,
          consentement_donne: true,
          consentement_date: new Date().toISOString(),
          consentement_texte: 'verif',
          consentement_version: 'verif',
          ca_mensuel_range: '<5k',
          taille_equipe: 'seule',
          score_ventes: 50,
          score_delivery: 50,
          score_admin: 50,
          score_contenu: 50,
          score_global: 50,
          niveau: 'modere',
        })
        .eq('id', id);
      setResultat(
        JSON.stringify(
          {
            insertion_erreur: ins.error?.message ?? 'aucune (OK)',
            maj_erreur: upd.error?.message ?? 'aucune (OK)',
            id,
          },
          null,
          2,
        ),
      );
    } catch (e) {
      setResultat('EXCEPTION: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setEnCours(false);
    }
  }

  return (
    <main
      style={{
        padding: 24,
        fontFamily: 'monospace',
        color: '#f7f4ef',
        background: '#121212',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ fontSize: 18, marginBottom: 16 }}>Vérif navigateur</h1>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14, marginBottom: 24 }}>
        {JSON.stringify(env, null, 2)}
      </pre>

      <button
        onClick={tester}
        disabled={enCours}
        style={{
          padding: '12px 20px',
          background: '#bea268',
          color: '#121212',
          border: 'none',
          borderRadius: 4,
          fontFamily: 'inherit',
          fontSize: 14,
          cursor: 'pointer',
        }}
      >
        Tester l’enregistrement
      </button>

      <h2 style={{ fontSize: 15, margin: '24px 0 8px' }}>Résultat du test :</h2>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{resultat}</pre>
    </main>
  );
}
