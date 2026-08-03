'use client';

// Vérification TEMPORAIRE côté navigateur : est-ce que les variables
// NEXT_PUBLIC_* sont bien inlinées dans le bundle client ? (Si « Sensitive »
// dans Vercel, elles ne le sont pas.) À SUPPRIMER après le débogage.
export default function Verif() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const site = process.env.NEXT_PUBLIC_SITE_URL;

  const data = {
    navigateur_a_URL: !!url,
    URL_apercu: url ? url.slice(0, 34) : '(vide côté navigateur)',
    navigateur_a_ANON_KEY: !!anon,
    ANON_KEY_longueur: anon ? anon.length : 0,
    SITE_URL: site ?? '(vide)',
  };

  return (
    <main style={{ padding: 24, fontFamily: 'monospace', color: '#f7f4ef', background: '#121212', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 18, marginBottom: 16 }}>Vérif navigateur</h1>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}
