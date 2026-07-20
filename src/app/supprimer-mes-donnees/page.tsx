// GET /supprimer-mes-donnees?token={unsubscribe_token} — droit à l'effacement
// (spec RGPD §4). Anonymisation : les scores restent pour les statistiques
// agrégées, toute identification est supprimée — y compris dans le CRM Notion.
import { getSupabaseAdmin } from '@/lib/supabase';
import { archiveNotionPage } from '@/lib/notion';

export const dynamic = 'force-dynamic';

export default async function SupprimerMesDonnees({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = typeof searchParams.token === 'string' ? searchParams.token : null;

  if (token && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const admin = getSupabaseAdmin();

      // Récupère le page_id Notion avant d'effacer l'identification.
      const { data } = await admin
        .from('audit_responses')
        .select('notion_page_id')
        .eq('unsubscribe_token', token)
        .single();

      await admin
        .from('audit_responses')
        .update({
          prenom: null,
          email: null,
          instagram_handle: null,
          notion_page_id: null,
          desinscrit: true,
          desinscrit_date: new Date().toISOString(),
          suppression_demandee: true,
          suppression_date: new Date().toISOString(),
        })
        .eq('unsubscribe_token', token);

      // Une suppression partielle ne vaut pas suppression : le CRM suit.
      if (data?.notion_page_id) {
        await archiveNotionPage(data.notion_page_id);
      }
    } catch {
      /* confirmation affichée quoi qu'il arrive */
    }
  }

  return (
    <main className="screen">
      <div className="container">
        <h1 className="question">Tes données sont supprimées.</h1>
        <p className="scenario">
          Ton prénom, ton email et ton profil ont été effacés — de la base comme
          du CRM. Il ne reste rien qui permette de remonter jusqu’à toi.
        </p>
        {!token && (
          <p className="form-error">
            Lien incomplet. Utilise le lien de suppression présent dans l’email.
          </p>
        )}
      </div>
    </main>
  );
}
