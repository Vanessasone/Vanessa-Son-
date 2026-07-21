// Webhook Notion — « 🎯 CRM Prospects — Toutes Marques » (spec §5).
// Crée une page dans le CRM existant en écrivant dans ses colonnes réelles
// (pipeline multi-marques). Les détails du score vont dans « Notes ».
import type { Niveau, Scores } from './scoring';
import { AXE_LABELS, axeLePlusFaible, autonomie } from './resultats';

const NOTION_VERSION = '2022-06-28';

export interface NotionProspect {
  prenom: string;
  email: string;
  instagram_handle?: string | null;
  ca_mensuel_range?: string | null;
  taille_equipe?: string | null;
  scores: Scores;
}

// Niveau d'audit → température du pipeline (colonne « Statut »).
function statutPourNiveau(niveau: Niveau): string {
  switch (niveau) {
    case 'critique':
    case 'eleve':
      return 'Chaud';
    case 'modere':
      return 'Tiede';
    case 'sain':
      return 'Froid';
  }
}

function notesAudit(p: NotionProspect): string {
  const s = p.scores;
  const pire = axeLePlusFaible(s);
  const parts = [
    `Audit de Dépendance — Indice ${s.global}/100 (${s.niveau}), autonomie ${autonomie(s.global)} %.`,
    `Ventes ${s.ventes} · Delivery ${s.delivery} · Admin ${s.admin} · Contenu ${s.contenu}.`,
    `Axe le plus faible : ${AXE_LABELS[pire]}.`,
    `CA : ${p.ca_mensuel_range ?? '—'} · Équipe : ${p.taille_equipe ?? '—'}.`,
  ];
  if (p.instagram_handle) parts.push(`Instagram : ${p.instagram_handle}.`);
  return parts.join(' ');
}

// Retourne l'id de la page créée, ou null si Notion n'est pas configuré /
// si l'appel échoue (best-effort, ne bloque pas le parcours).
export async function pushToNotion(
  p: NotionProspect,
): Promise<string | null> {
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_CRM_DATABASE_ID;
  if (!apiKey || !dbId) return null;

  const aujourdhui = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const properties: Record<string, unknown> = {
    Nom: { title: [{ text: { content: p.prenom || p.email } }] },
    'Email / Instagram': { url: p.email || null },
    Marque: { select: { name: 'vanessasone.com' } },
    Source: { select: { name: 'Audit Dépendance' } },
    Statut: { select: { name: statutPourNiveau(p.scores.niveau) } },
    Notes: { rich_text: [{ text: { content: notesAudit(p) } }] },
    'Dernier contact': { date: { start: aujourdhui } },
  };
  // Les scores sains basculent vers L'Accélération.
  if (p.scores.niveau === 'sain') {
    properties['Offre visée'] = { select: { name: 'L Acceleration' } };
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

// Archive (supprime) une page CRM — droit à l'effacement (spec RGPD §4).
// Une suppression partielle ne vaut pas suppression : le CRM doit suivre.
export async function archiveNotionPage(pageId: string): Promise<boolean> {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey || !pageId) return false;
  try {
    const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ archived: true }),
    });
    return res.ok;
  } catch (e) {
    console.warn('[audit] archiveNotionPage échoué', e);
    return false;
  }
}
