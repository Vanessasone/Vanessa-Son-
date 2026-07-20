// AUDIT DE DÉPENDANCE™ — les 18 questions (spec §2)
import type { Axe } from './scoring';

export type Bloc = 'scenario' | 'echelle' | 'contexte';

export interface Choice {
  value: number;
  label: string;
}

export interface Question {
  key: string;
  bloc: Bloc;
  axe: Axe | null; // null pour le contexte (Q17-Q18)
  inversee?: boolean;
  prompt: string;
  sousTitre?: string; // texte de mise en situation avant la question
  choices?: Choice[]; // scénarios / contexte
  field?: 'ca_mensuel_range' | 'taille_equipe'; // pour Q17-Q18
}

// ─── BLOC 1 — SCÉNARIOS (Q1–Q6) ────────────────────────────────────────────
const scenarios: Question[] = [
  {
    key: 'q1',
    bloc: 'scenario',
    axe: 'delivery',
    sousTitre:
      "Tu pars 10 jours. Vrai départ : pas de réseau, pas de wifi, téléphone au fond d'une valise.",
    prompt: "Qu'est-ce qui se passe dans ton business ?",
    choices: [
      { value: 1, label: 'Tout tourne. Je reçois un récap à mon retour.' },
      {
        value: 2,
        label:
          "Ça tourne, mais quelqu'un m'écrit une ou deux fois « juste pour valider un truc ».",
      },
      {
        value: 3,
        label: 'Je sais déjà que je vais devoir décrocher au moins une fois.',
      },
      { value: 4, label: "Je ne pars pas 10 jours. C'est la vraie réponse." },
    ],
  },
  {
    key: 'q2',
    bloc: 'scenario',
    axe: 'ventes',
    sousTitre:
      "Il est 22h47. Tu es dans ton lit. Ton téléphone s'allume : un prospect qui hésite depuis trois semaines vient d'écrire.",
    prompt: 'Tu fais quoi ?',
    choices: [
      {
        value: 1,
        label: 'Je le vois demain matin. Ma séquence de relance tourne sans moi.',
      },
      { value: 2, label: "Je réponds demain. Mais j'y pense en m'endormant." },
      { value: 3, label: "Je réponds. Vite. Avant qu'il change d'avis." },
      {
        value: 4,
        label: "Je réponds, et ensuite je relis trois fois ce que j'ai écrit.",
      },
    ],
  },
  {
    key: 'q3',
    bloc: 'scenario',
    axe: 'admin',
    sousTitre:
      'On est le 3 du mois. Quelqu\'un te demande, là, tout de suite : « Tu as fait combien le mois dernier ? »',
    prompt: "Combien de temps il te faut pour répondre avec le chiffre exact ?",
    choices: [
      { value: 1, label: "Zéro. Je l'ai sous les yeux, c'est automatique." },
      { value: 2, label: 'Deux minutes, le temps d\'ouvrir le bon fichier.' },
      {
        value: 3,
        label: 'Une demi-heure. Je dois recouper plusieurs sources.',
      },
      {
        value: 4,
        label:
          'Honnêtement ? Je donnerais une fourchette. Et je ne serais pas sûre.',
      },
    ],
  },
  {
    key: 'q4',
    bloc: 'scenario',
    axe: 'delivery',
    sousTitre:
      "Une cliente t'écrit avec une question sur son dossier. Une question que trois autres clientes t'ont déjà posée cette année.",
    prompt: 'Ta réponse existe où ?',
    choices: [
      {
        value: 1,
        label: 'Dans un système. Elle a la réponse avant même de me la poser.',
      },
      { value: 2, label: 'Dans un document que je lui envoie.' },
      {
        value: 3,
        label: 'Dans un ancien message que je retrouve et que je copie-colle.',
      },
      { value: 4, label: 'Dans ma tête. Je la réécris à chaque fois.' },
    ],
  },
  {
    key: 'q5',
    bloc: 'scenario',
    axe: 'contenu',
    sousTitre:
      "Tu n'as rien publié depuis six jours. Tu ouvres l'application.",
    prompt: "Qu'est-ce que tu ressens en premier ?",
    choices: [
      {
        value: 1,
        label: 'Rien de spécial. Mon planning est calé, ça part sans moi.',
      },
      { value: 2, label: 'Un léger décalage. Je vais rattraper.' },
      {
        value: 3,
        label:
          'De la culpabilité. Je me dis que je suis en train de perdre du terrain.',
      },
      {
        value: 4,
        label: "De l'angoisse. Et je publie n'importe quoi juste pour publier.",
      },
    ],
  },
  {
    key: 'q6',
    bloc: 'scenario',
    axe: 'ventes',
    sousTitre:
      "Ta meilleure cliente de l'année dernière. Celle qui a payé plein tarif, sans négocier, et qui t'a recommandée deux fois.",
    prompt: 'Tu sais exactement par où elle est arrivée ?',
    choices: [
      {
        value: 1,
        label: 'Oui. Je peux retracer le parcours complet, étape par étape.',
      },
      { value: 2, label: "Oui, en gros. Je sais d'où elle vient." },
      {
        value: 3,
        label: 'Je crois savoir. Mais je ne pourrais pas le reproduire.',
      },
      { value: 4, label: "Non. Et c'est exactement le problème." },
    ],
  },
];

// ─── BLOC 2 — ÉCHELLE 1–5 (Q7–Q16) ─────────────────────────────────────────
const echelle: Question[] = [
  {
    key: 'q7',
    bloc: 'echelle',
    axe: 'ventes',
    inversee: true,
    prompt:
      "Mon processus de vente est écrit quelque part, et quelqu'un d'autre pourrait le suivre.",
  },
  {
    key: 'q8',
    bloc: 'echelle',
    axe: 'ventes',
    prompt:
      "Si je m'arrête de prospecter deux semaines, mon chiffre du mois suivant s'effondre.",
  },
  {
    key: 'q9',
    bloc: 'echelle',
    axe: 'delivery',
    inversee: true,
    prompt:
      'Mes livrables suivent un cadre standardisé que je ne réinvente pas à chaque client.',
  },
  {
    key: 'q10',
    bloc: 'echelle',
    axe: 'delivery',
    prompt:
      "Je suis la seule personne qui sait comment une prestation se déroule vraiment du début à la fin.",
  },
  {
    key: 'q11',
    bloc: 'echelle',
    axe: 'admin',
    prompt:
      "Je passe plus de temps à gérer l'administratif et la coordination qu'à faire ce pour quoi on me paie.",
  },
  {
    key: 'q12',
    bloc: 'echelle',
    axe: 'admin',
    inversee: true,
    prompt:
      "Mes relances, factures et confirmations partent automatiquement, sans que j'y pense.",
  },
  {
    key: 'q13',
    bloc: 'echelle',
    axe: 'contenu',
    prompt: "Chaque publication me demande de repartir d'une page blanche.",
  },
  {
    key: 'q14',
    bloc: 'echelle',
    axe: 'contenu',
    inversee: true,
    prompt:
      "J'ai un système de contenu qui produit même les semaines où je ne suis pas inspirée.",
  },
  {
    key: 'q15',
    bloc: 'echelle',
    axe: 'delivery',
    prompt:
      "Il y a des choses que je n'ai jamais déléguées parce que « ça irait plus vite si je le fais moi-même ».",
  },
  {
    key: 'q16',
    bloc: 'echelle',
    axe: 'ventes',
    prompt:
      "Quand une prospect ne répond pas, il n'y a rien qui se déclenche automatiquement pour la relancer.",
  },
];

// ─── BLOC 3 — CONTEXTE (Q17–Q18) ───────────────────────────────────────────
const contexte: Question[] = [
  {
    key: 'q17',
    bloc: 'contexte',
    axe: null,
    field: 'ca_mensuel_range',
    prompt:
      'Sur les 3 derniers mois, ton chiffre d\'affaires mensuel moyen se situe plutôt :',
    choices: [
      { value: 1, label: '< 5 000 €' },
      { value: 2, label: '5 000 – 10 000 €' },
      { value: 3, label: '10 000 – 20 000 €' },
      { value: 4, label: '> 20 000 €' },
    ],
  },
  {
    key: 'q18',
    bloc: 'contexte',
    axe: null,
    field: 'taille_equipe',
    prompt: "Aujourd'hui, tu travailles :",
    choices: [
      { value: 1, label: 'Seule' },
      { value: 2, label: 'Avec 1 à 2 personnes' },
      { value: 3, label: 'Avec 3 à 5 personnes' },
      { value: 4, label: 'Avec plus de 5 personnes' },
    ],
  },
];

export const QUESTIONS: Question[] = [...scenarios, ...echelle, ...contexte];

export const CONSIGNE_ECHELLE = '1 = pas du tout · 5 = complètement';

// Mapping des valeurs de contexte vers les libellés stockés en base (spec §1).
export const CA_MENSUEL_MAP: Record<number, string> = {
  1: '<5k',
  2: '5k-10k',
  3: '10k-20k',
  4: '>20k',
};

export const TAILLE_EQUIPE_MAP: Record<number, string> = {
  1: 'seule',
  2: '1-2',
  3: '3-5',
  4: '5+',
};
