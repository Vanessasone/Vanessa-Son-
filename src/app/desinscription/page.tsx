// GET /desinscription?token={unsubscribe_token} — désinscription en un clic
// (spec RGPD §3). Aucun formulaire, aucune connexion, aucune friction.
import { getSupabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Desinscription({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = typeof searchParams.token === 'string' ? searchParams.token : null;

  if (token && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      await getSupabaseAdmin()
        .from('audit_responses')
        .update({ desinscrit: true, desinscrit_date: new Date().toISOString() })
        .eq('unsubscribe_token', token);
    } catch {
      /* on affiche la confirmation quoi qu'il arrive : pas d'énumération */
    }
  }

  return (
    <main className="screen">
      <div className="container">
        <h1 className="question">C’est fait.</h1>
        <p className="scenario">Tu ne recevras plus d’emails de ma part.</p>
        {!token && (
          <p className="form-error">
            Lien incomplet. Utilise le lien « Me désinscrire » présent dans l’email.
          </p>
        )}
        {token && (
          <p className="legal-links" style={{ marginTop: '2.5rem' }}>
            Si tu veux aussi que je supprime toutes tes données, y compris tes
            réponses à l’audit :{' '}
            <a href={`/supprimer-mes-donnees?token=${encodeURIComponent(token)}`}>
              supprimer mes données
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
