// Persistance du parcours (spec §5). Les écritures passent désormais par des
// routes serveur (service_role) : la RLS bloquait silencieusement les mises à
// jour côté navigateur (anon peut insérer mais pas relire/mettre à jour sa
// ligne). L'id reste en state React, jamais dans l'URL.
'use client';

import { calculerScores, type Answers, type Scores } from './scoring';
import { CA_MENSUEL_MAP, TAILLE_EQUIPE_MAP } from './questions';

async function postAudit(payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean };
    return res.ok && json.ok === true;
  } catch (e) {
    console.warn('[audit] postAudit échoué', payload.action, e);
    return false;
  }
}

// Insert de la ligne au démarrage → renvoie l'id de session (ou null).
export async function startSession(opts: {
  source?: string;
  utm_campaign?: string;
}): Promise<string | null> {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : null;
  if (!id) return null;
  const ok = await postAudit({
    action: 'start',
    id,
    source: opts.source ?? 'manychat',
    utm_campaign: opts.utm_campaign ?? null,
  });
  return ok ? id : null;
}

// Update des réponses + progression à chaque question.
export async function saveAnswer(
  id: string | null,
  answers: Answers,
  progression: number,
): Promise<void> {
  if (!id) return;
  await postAudit({ action: 'save', id, answers, progression });
}

// Marque l'abandon (déclenché sur beforeunload avant complétion).
export async function markAbandon(
  id: string | null,
  progression: number,
): Promise<void> {
  if (!id) return;
  await postAudit({ action: 'abandon', id, progression });
}

export interface FinalizeInput {
  id: string | null;
  answers: Answers;
  prenom: string;
  email: string;
  consentement: boolean;
}

// Calcule les scores, puis envoie tout au serveur : écriture de la ligne
// finale (service_role) + email + Notion. Peut lever si l'appel échoue —
// l'appelant affiche alors le message d'erreur et propose de réessayer.
export async function finalize(input: FinalizeInput): Promise<Scores> {
  const scores = calculerScores(input.answers);

  const ca = input.answers.q17 ? CA_MENSUEL_MAP[input.answers.q17] : null;
  const taille = input.answers.q18
    ? TAILLE_EQUIPE_MAP[input.answers.q18]
    : null;

  const res = await fetch('/api/resultat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: input.id,
      prenom: input.prenom,
      email: input.email,
      consentement: input.consentement,
      ca_mensuel_range: ca,
      taille_equipe: taille,
      answers: input.answers,
      scores,
    }),
  });
  if (!res.ok) {
    throw new Error(`/api/resultat a répondu ${res.status}`);
  }

  return scores;
}
