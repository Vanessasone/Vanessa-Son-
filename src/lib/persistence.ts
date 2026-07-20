// Persistance côté navigateur (spec §5 — insertion progressive).
// Insert dès Q1, update à chaque réponse. L'id reste en mémoire, jamais dans
// l'URL. Toutes les opérations dégradent proprement si Supabase n'est pas
// configuré : le parcours et le score fonctionnent quand même.
'use client';

import { getSupabaseBrowser } from './supabase';
import { calculerScores, type Answers, type Scores } from './scoring';
import { CA_MENSUEL_MAP, TAILLE_EQUIPE_MAP } from './questions';
import { CONSENTEMENT } from './consentement';

export function supabaseConfigure(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

// Insert de la ligne au démarrage → renvoie l'id de session (ou null).
export async function startSession(opts: {
  source?: string;
  utm_campaign?: string;
}): Promise<string | null> {
  if (!supabaseConfigure()) return null;
  try {
    const { data, error } = await getSupabaseBrowser()
      .from('audit_responses')
      .insert({
        source: opts.source ?? 'manychat',
        utm_campaign: opts.utm_campaign ?? null,
        answers: {},
        progression: 0,
      })
      .select('id')
      .single();
    if (error) throw error;
    return data?.id ?? null;
  } catch (e) {
    console.warn('[audit] startSession échoué, on continue sans persistance', e);
    return null;
  }
}

// Update des réponses + progression à chaque question.
export async function saveAnswer(
  id: string | null,
  answers: Answers,
  progression: number,
): Promise<void> {
  if (!id || !supabaseConfigure()) return;
  try {
    await getSupabaseBrowser()
      .from('audit_responses')
      .update({ answers, progression })
      .eq('id', id);
  } catch (e) {
    console.warn('[audit] saveAnswer échoué', e);
  }
}

// Marque l'abandon (déclenché sur beforeunload avant complétion).
export async function markAbandon(
  id: string | null,
  progression: number,
): Promise<void> {
  if (!id || !supabaseConfigure()) return;
  try {
    await getSupabaseBrowser()
      .from('audit_responses')
      .update({ abandonne: true, progression })
      .eq('id', id);
  } catch {
    /* best-effort */
  }
}

export interface FinalizeInput {
  id: string | null;
  answers: Answers;
  prenom: string;
  email: string;
  consentement: boolean;
}

// Calcule les scores, écrit la ligne finale, puis déclenche email + Notion.
// L'écriture Supabase est best-effort (dégrade en silence). En revanche le
// déclenchement de /api/resultat (email + CRM) peut lever : l'appelant
// affiche alors le message d'erreur et propose de réessayer (spec §5).
export async function finalize(input: FinalizeInput): Promise<Scores> {
  const scores = calculerScores(input.answers);

  const ca = input.answers.q17 ? CA_MENSUEL_MAP[input.answers.q17] : null;
  const taille = input.answers.q18
    ? TAILLE_EQUIPE_MAP[input.answers.q18]
    : null;

  if (input.id && supabaseConfigure()) {
    try {
      await getSupabaseBrowser()
        .from('audit_responses')
        .update({
          prenom: input.prenom,
          email: input.email,
          ca_mensuel_range: ca,
          taille_equipe: taille,
          answers: input.answers,
          progression: 18,
          completed_at: new Date().toISOString(),
          consentement_donne: input.consentement,
          consentement_date: input.consentement
            ? new Date().toISOString()
            : null,
          consentement_texte: input.consentement ? CONSENTEMENT.texte : null,
          consentement_version: input.consentement
            ? CONSENTEMENT.version
            : null,
          score_ventes: scores.ventes,
          score_delivery: scores.delivery,
          score_admin: scores.admin,
          score_contenu: scores.contenu,
          score_global: scores.global,
          niveau: scores.niveau,
        })
        .eq('id', input.id);
    } catch (e) {
      console.warn('[audit] finalize update échoué', e);
    }
  }

  // Déclenche l'email transactionnel + le webhook Notion côté serveur.
  // Une erreur réseau / un statut non-2xx remonte à l'appelant.
  const res = await fetch('/api/resultat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: input.id,
      prenom: input.prenom,
      email: input.email,
      ca_mensuel_range: ca,
      taille_equipe: taille,
      scores,
    }),
  });
  if (!res.ok) {
    throw new Error(`/api/resultat a répondu ${res.status}`);
  }

  return scores;
}
