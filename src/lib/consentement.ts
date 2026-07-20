// Texte de consentement affiché à la capture email (spec RGPD §1/§2).
// IMPORTANT : à chaque modification de `texte`, incrémenter `version`. Les
// consentements déjà enregistrés restent rattachés à l'ancien texte via la
// colonne consentement_texte — c'est la preuve de ce à quoi la personne a
// consenti, pas seulement qu'elle a consenti.
export const CONSENTEMENT = {
  version: 'v1-2026-07',
  texte:
    'J’accepte de recevoir mon résultat par email, ainsi que les conseils et ' +
    'offres de Vanessa Soné. Je peux me désinscrire à tout moment via le lien ' +
    'présent dans chaque email.',
} as const;

// Phrase de réassurance sous le bouton.
export const REASSURANCE =
  'Tes réponses sont utilisées pour calculer ton score et te recontacter. ' +
  'Elles ne sont ni vendues ni transmises à des tiers à des fins commerciales.';
