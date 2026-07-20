// Séquence email post-audit — logique pure (spec §6). Aucun import de rendu :
// ce module reste testable en isolation (node --test).
//
//  Track SPRINT (critique / eleve / modere) : J+2 · J+4 · J+6 · J+9
//  Track ACCÉLÉRATION (sain)                : J+2 · J+6
//
// Segmentation : les scores « sain » sortent de la séquence SPRINT et
// basculent vers L'Accélération.
import type { Axe, Niveau } from './scoring';

export type Step = 'j2' | 'j4' | 'j6' | 'j9';

export const STEP_DAYS: Record<Step, number> = { j2: 2, j4: 4, j6: 6, j9: 9 };

// Les étapes envoyées selon le niveau.
export function stepsPourNiveau(niveau: Niveau): Step[] {
  return niveau === 'sain' ? ['j2', 'j6'] : ['j2', 'j4', 'j6', 'j9'];
}

// Colonne de suivi d'envoi (migration 0003).
export function flagColumn(step: Step): string {
  return `email_${step}_envoye`;
}

// ─── Chiffrage du temps perdu (J+4) ──────────────────────────────────────────
// Heures/semaine perdues à pleine dépendance, par axe. Ordre de grandeur
// volontairement prudent — présenté comme une estimation, pas une facture.
const HEURES_MAX: Record<Axe, number> = {
  delivery: 10,
  ventes: 7,
  admin: 5,
  contenu: 3,
};

export interface CoutHeures {
  semaine: number;
  an: number;
  semainesTravail: number; // équivalent en semaines de 35 h
}

export function coutHeures(axe: Axe, scoreAxe: number): CoutHeures {
  const semaine = Math.round((HEURES_MAX[axe] * scoreAxe) / 100);
  const an = semaine * 52;
  return { semaine, an, semainesTravail: Math.round(an / 35) };
}
