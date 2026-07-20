// Webhook Notion — « CRM Prospects — Toutes Marques » (spec §5).
// Crée une page dans la base CRM avec le résultat de l'audit.
import type { Scores } from './scoring';

const NOTION_VERSION = '2022-06-28';

export interface NotionProspect {
  prenom: string;
  email: string;
  instagram_handle?: string | null;
  ca_mensuel_range?: string | null;
  taille_equipe?: string | null;
  scores: Scores;
}

// Retourne l'id de la page créée, ou null si Notion n'est pas configuré /
// si l'appel échoue (best-effort, ne bloque pas le parcours).
export async function pushToNotion(
  p: NotionProspect,
): Promise<string | null> {
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_CRM_DATABASE_ID;
  if (!apiKey || !dbId) return null;

  const properties: Record<string, unknown> = {
    Nom: { title: [{ text: { content: p.prenom || p.email } }] },
    Email: { email: p.email || null },
    'Score global': { number: p.scores.global },
    Niveau: { select: { name: p.scores.niveau } },
    'Score Ventes': { number: p.scores.ventes },
    'Score Delivery': { number: p.scores.delivery },
    'Score Admin': { number: p.scores.admin },
    'Score Contenu': { number: p.scores.contenu },
    Source: { select: { name: 'Audit de Dépendance' } },
  };
  if (p.instagram_handle) {
    properties.Instagram = {
      rich_text: [{ text: { content: p.instagram_handle } }],
    };
  }
  if (p.ca_mensuel_range) {
    properties['CA mensuel'] = { select: { name: p.ca_mensuel_range } };
  }
  if (p.taille_equipe) {
    properties['Taille équipe'] = { select: { name: p.taille_equipe } };
  }

  try {
    const res = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parent: { database_id: dbId }, properties }),
    });
    if (!res.ok) {
      console.warn('[audit] Notion a répondu', res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as { id?: string };
    return json.id ?? null;
  } catch (e) {
    console.warn('[audit] pushToNotion échoué', e);
    return null;
  }
}
