// Routage éligibilité (spec closing) : après l'audit, on oriente vers
// LE SPRINT™ (done-for-you, selon le CA) ou vers le coaching (L'Accélération).
// L'audit qualifie déjà : on route sur le CA (Q17) + le niveau de dépendance.
import type { Niveau } from './scoring';

export type Offre = 'sprint' | 'coaching';

// ⚠️ À COMPLÉTER — tes vrais liens de prise de rendez-vous (Calendly / Cal.com).
// Tant qu'ils sont vides, la page affiche un message au lieu du bouton.
export const BOOKING: Record<Offre, string> = {
  sprint: '', // ex. 'https://calendly.com/vanessasone/appel-sprint'
  coaching: '', // ex. 'https://calendly.com/vanessasone/appel-acceleration'
};

// Tranches de CA (valeurs de l'audit Q17) qui rendent éligible au SPRINT™.
// Tranches possibles : '<5k' | '5k-10k' | '10k-20k' | '>20k'
// ⚠️ Ajuste ce seuil selon ta stratégie commerciale.
export const SPRINT_CA_ELIGIBLE = ['10k-20k', '>20k'];

// Le Sprint = installation done-for-you : il faut assez de CA pour l'amortir
// ET une vraie dépendance à installer. Sinon → coaching (croissance d'abord).
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
  accroche: string;
  corps: string[];
  bouton: string;
}

export const OFFRES: Record<Offre, OffreMeta> = {
  sprint: {
    titre: 'Ton profil correspond au SPRINT™.',
    accroche:
      'Tu as le chiffre et la matière. Ce qu’il te manque, c’est l’installation.',
    corps: [
      'LE SPRINT™, c’est 30 jours pendant lesquels on installe l’infrastructure qui manque à ton business — on ne t’apprend pas à le faire, on le fait.',
      'La prochaine étape, c’est un appel pour voir si ton business est éligible. Deux entreprises maximum en même temps.',
    ],
    bouton: 'Réserver mon appel',
  },
  coaching: {
    titre: 'Le bon point de départ pour toi : l’accompagnement.',
    accroche:
      'Ton levier n’est pas (encore) une installation clé en main — c’est de poser les bonnes fondations.',
    corps: [
      'On travaille ensemble ton positionnement, tes offres et ta façon de vendre pour faire décoller ton chiffre — c’est le cœur de L’Accélération.',
      'La prochaine étape, c’est un appel pour définir ton plan.',
    ],
    bouton: 'Réserver mon appel',
  },
};
