// AUDIT DE DÉPENDANCE™ — logique de scoring (spec §3)
//
// Bloc 1 (Q1–Q6) : réponses 1–4, normalisées sur 5.
// Bloc 2 (Q7–Q16) : réponses 1–5. Questions inversées recodées 6 − réponse.
// Bloc 3 (Q17–Q18) : contexte, hors score.

export type Axe = 'ventes' | 'delivery' | 'admin' | 'contenu';
export type Niveau = 'critique' | 'eleve' | 'modere' | 'sain';

export type Answers = Record<string, number>;

export interface Scores {
  ventes: number;
  delivery: number;
  admin: number;
  contenu: number;
  global: number;
  niveau: Niveau;
}

export const AXES: Record<Axe, string[]> = {
  ventes: ['q2', 'q6', 'q7', 'q8', 'q16'],
  delivery: ['q1', 'q4', 'q9', 'q10', 'q15'],
  admin: ['q3', 'q11', 'q12'],
  contenu: ['q5', 'q13', 'q14'],
};

export const INVERSEES = ['q7', 'q9', 'q12', 'q14'];
export const BLOC1 = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'];

// Toutes les questions qui comptent dans le score (Bloc 1 + Bloc 2).
export const SCORED_QUESTIONS: string[] = Object.values(AXES).flat();

export function normaliser(key: string, valeur: number): number {
  if (BLOC1.includes(key)) {
    // 1–4 → 1–5
    return ((valeur - 1) / 3) * 4 + 1;
  }
  return INVERSEES.includes(key) ? 6 - valeur : valeur;
}

export function calculerScores(answers: Answers): Scores {
  const scores = {} as Scores;

  (Object.entries(AXES) as [Axe, string[]][]).forEach(([axe, questions]) => {
    const total = questions.reduce(
      (acc, q) => acc + normaliser(q, answers[q]),
      0,
    );
    // Ramené sur 100
    scores[axe] = Math.round((total / (questions.length * 5)) * 100);
  });

  // Global pondéré : Ventes et Delivery pèsent double
  scores.global = Math.round(
    (scores.ventes * 2 +
      scores.delivery * 2 +
      scores.admin +
      scores.contenu) /
      6,
  );

  scores.niveau =
    scores.global >= 75
      ? 'critique'
      : scores.global >= 55
        ? 'eleve'
        : scores.global >= 35
          ? 'modere'
          : 'sain';

  return scores;
}

// Vrai si toutes les questions scorées ont une réponse valide.
export function auditComplet(answers: Answers): boolean {
  return SCORED_QUESTIONS.every(
    (q) => typeof answers[q] === 'number' && !Number.isNaN(answers[q]),
  );
}
