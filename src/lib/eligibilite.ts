// Tunnel d'éligibilité / pré-vente (closing). Après l'audit : une mini-
// consultation en plusieurs questions qui fait prendre conscience du problème,
// qualifie l'offre la plus adaptée, et oriente vers la prise de rendez-vous.
import type { Niveau } from './scoring';

export type Offre = 'sprint' | 'coaching';

// ⚠️ À COMPLÉTER — tes vrais liens de prise de rendez-vous (Calendly / Cal.com).
// Tant qu'ils sont vides, la page affiche un message au lieu du bouton.
export const BOOKING: Record<Offre, string> = {
  sprint: '', // ex. 'https://calendly.com/vanessasone/appel-sprint'
  coaching: '', // ex. 'https://calendly.com/vanessasone/appel-acceleration'
};

// Tranches de CA (valeurs de la question CA) éligibles au SPRINT™.
// ⚠️ Ajuste ce seuil selon ta stratégie commerciale.
export const SPRINT_CA_ELIGIBLE = ['10k-20k', '>20k'];

// ─── Les questions de la mini-consultation (une par écran) ───────────────────
export interface EligQuestion {
  key: string;
  sousTitre?: string;
  prompt: string;
  choices: { v: string; label: string }[];
}

export const QUESTIONS: EligQuestion[] = [
  {
    key: 'cout',
    sousTitre:
      'Ton audit a mis un chiffre sur ta dépendance. Maintenant, le vrai enjeu.',
    prompt:
      'Si rien ne change dans les 6 prochains mois, qu’est-ce que ça te coûte le plus ?',
    choices: [
      { v: 'energie', label: 'Mon énergie — je suis à bout' },
      { v: 'temps', label: 'Mon temps — je n’ai plus de vie à côté' },
      { v: 'chiffre', label: 'Mon chiffre — je plafonne, je n’avance plus' },
      { v: 'serenite', label: 'Ma sérénité — je pense au boulot en permanence' },
    ],
  },
  {
    key: 'blocage',
    prompt:
      'Quand tu penses à sortir ton business de ta tête, qu’est-ce qui te bloque vraiment ?',
    choices: [
      { v: 'temps', label: 'Je n’ai pas le temps de tout poser à plat' },
      { v: 'peur', label: 'J’ai peur que ce soit moins bien fait sans moi' },
      { v: 'commencer', label: 'Je ne sais pas par où commencer' },
      { v: 'deja', label: 'J’ai déjà essayé, mais tout est revenu vers moi' },
    ],
  },
  {
    key: 'ca',
    prompt: 'Aujourd’hui, ton chiffre d’affaires mensuel moyen se situe plutôt :',
    choices: [
      { v: '<5k', label: 'Moins de 5 000 €' },
      { v: '5k-10k', label: '5 000 – 10 000 €' },
      { v: '10k-20k', label: '10 000 – 20 000 €' },
      { v: '>20k', label: 'Plus de 20 000 €' },
    ],
  },
  {
    key: 'essaye',
    prompt: 'Qu’as-tu déjà mis en place pour t’en sortir ?',
    choices: [
      { v: 'rien', label: 'Rien de structurel pour l’instant' },
      { v: 'outils', label: 'Des outils, en solo' },
      { v: 'delegue', label: 'J’ai délégué, mais ça repasse par moi' },
      { v: 'accompagnement', label: 'Un accompagnement, sans résultat durable' },
    ],
  },
  {
    key: 'delai',
    prompt: 'Dans combien de temps tu veux que ça tourne sans toi ?',
    choices: [
      { v: 'hier', label: 'Hier — c’est urgent' },
      { v: '3mois', label: 'Dans les 3 mois' },
      { v: 'annee', label: 'Cette année' },
      { v: 'sais-pas', label: 'Je ne sais pas encore' },
    ],
  },
  {
    key: 'invest',
    prompt:
      'Pour régler ça pour de bon, tu es prête à investir dans un accompagnement sérieux ?',
    choices: [
      { v: 'oui', label: 'Oui, je veux avancer maintenant' },
      { v: 'si-bon', label: 'Oui, si c’est le bon' },
      { v: 'renseigne', label: 'Je me renseigne pour l’instant' },
    ],
  },
];

// ─── Routage vers l'offre ────────────────────────────────────────────────────
// Le Sprint = installation done-for-you : assez de CA pour l'amortir + vraie
// dépendance. Sinon → coaching (poser les fondations d'abord).
export function routerOffre(
  caRange: string | null | undefined,
  niveau: Niveau,
): Offre {
  const caOk = caRange ? SPRINT_CA_ELIGIBLE.includes(caRange) : false;
  if (caOk && niveau !== 'sain') return 'sprint';
  return 'coaching';
}

export interface OffreMeta {
  titre: string;
  corps: string[];
  bouton: string;
}

export const OFFRES: Record<Offre, OffreMeta> = {
  sprint: {
    titre: 'Ton profil appelle une installation, pas des conseils.',
    corps: [
      'Vu ton chiffre et ton niveau de dépendance, tu n’as pas besoin qu’on t’explique quoi faire — tu as besoin qu’on le fasse avec toi. C’est exactement ça, LE SPRINT™ : 30 jours pour installer l’infrastructure qui te manque, les mains dedans.',
      'L’appel qui suit n’est pas un argumentaire déguisé : c’est là qu’on regarde ensemble, concrètement, ce qu’on installerait en premier chez toi. Deux entreprises maximum en même temps.',
    ],
    bouton: 'Réserver mon appel Sprint',
  },
  coaching: {
    titre: 'Ta priorité, c’est de poser les bonnes fondations.',
    corps: [
      'Avant une installation clé en main, ton levier immédiat, c’est ton positionnement, tes offres et ta façon de vendre — c’est ce qu’on construit ensemble dans L’Accélération.',
      'L’appel qui suit sert à définir ton plan précis : par où commencer pour que ton business arrête de reposer entièrement sur toi.',
    ],
    bouton: 'Réserver mon appel',
  },
};
