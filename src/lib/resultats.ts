// AUDIT DE DÉPENDANCE™ — copywriting de la page de résultat.
// Descente du Symptôme · tutoiement partout (ne jamais réutiliser pour Vany's
// Weddings ou Maison Romance, qui vouvoient).
import type { Axe, Niveau } from './scoring';

// ─── Couches d'affichage (spec §0) ──────────────────────────────────────────
export function autonomie(score: number): number {
  return 100 - score; // dépendance → autonomie
}

export function joursDeTenue(scoreGlobal: number): number {
  return Math.round((autonomie(scoreGlobal) * 30) / 100);
}

// Les jours ne s'affichent QUE pour critique et eleve : au-delà de ~55 %
// d'autonomie l'extrapolation devient contestable et affaiblirait le reste.
export function afficherJours(niveau: Niveau): boolean {
  return niveau === 'critique' || niveau === 'eleve';
}

// ─── Verdicts (spec §1) ──────────────────────────────────────────────────────
export interface NiveauMeta {
  label: string;
  titre: string;
  paragraphes: string[];
}

export const NIVEAUX: Record<Niveau, NiveauMeta> = {
  critique: {
    label: 'Critique',
    titre: 'Ton business ne tourne pas. C’est toi qui tournes.',
    paragraphes: [
      'Tu as construit quelque chose qui marche. Le chiffre le prouve — sinon tu ne serais pas en train de lire ça, tu serais en train de chercher des clients.',
      'Mais ce que tu as construit n’est pas une entreprise. C’est un poste à temps plein, très bien rémunéré, dont tu es la seule employée possible. Et personne ne peut te remplacer parce que le mode d’emploi n’existe nulle part.',
    ],
  },
  eleve: {
    label: 'Élevé',
    titre: 'Tu as construit quelque chose. Mais tu es dedans, pas au-dessus.',
    paragraphes: [
      'Il y a des morceaux qui tiennent. Tu as commencé à documenter, à déléguer, à mettre des choses en place. Ça se voit dans tes réponses.',
      'Et c’est précisément ce qui rend la situation difficile à voir : tu n’es pas débordée au point de craquer. Tu es débordée juste assez pour ne jamais avoir le temps de régler ce qui te déborde.',
    ],
  },
  modere: {
    label: 'Modéré',
    titre:
      'Il y a des systèmes. Il y a aussi des trous par lesquels tout repasse par toi.',
    paragraphes: [
      'Une bonne partie de ton business tient sans toi. Ce n’est pas rien — la plupart des entrepreneures à ton niveau n’en sont pas là.',
      'Mais il reste deux ou trois endroits précis où tout converge vers toi. Et ces endroits-là ne se voient pas quand tout va bien. Ils se voient le jour où tu tombes malade, ou le jour où tu veux passer à l’échelle supérieure et que tu découvres que tu ne peux pas.',
    ],
  },
  sain: {
    label: 'Sain',
    titre: 'Tu n’as pas un problème de dépendance. Tu as un problème de croissance.',
    paragraphes: [
      'Ton business tient debout sans toi. Tu as fait le travail que la plupart des gens repoussent, et ça se voit dans chacune de tes réponses.',
      'Ce qui veut dire que ton plafond actuel n’est pas structurel. Il est stratégique. Ce n’est pas le même problème, et ça ne se règle pas avec les mêmes outils.',
    ],
  },
};

// ─── Code couleur (spec §4 originale) — pas de rouge, saturation croissante ──
// Toujours calculé sur la DÉPENDANCE de l'axe, pour que l'axe le plus faible
// reste le plus saturé quelle que soit la couche d'affichage.
export function couleurDependance(dependance: number): string {
  if (dependance >= 75) return '#908070'; // Taupe foncé
  if (dependance >= 55) return '#BEA268'; // Bronze
  if (dependance >= 35) return '#D6C5B0'; // Sable
  return '#F7F4EF'; // Beige clair
}

export const AXE_LABELS: Record<Axe, string> = {
  ventes: 'Ventes',
  delivery: 'Delivery',
  admin: 'Admin',
  contenu: 'Contenu',
};

// ─── Développement de l'axe le plus faible (spec §2) ─────────────────────────
// Un seul axe développé — celui à la dépendance la plus forte. Structure en
// trois temps : la scène · la traduction · le shame removal.
export const AXE_DEV: Record<Axe, Record<Niveau, string[]>> = {
  ventes: {
    critique: [
      'Ta dernière vente s’est jouée dans une conversation que toi seule pourrais retrouver. Un message, un moment, une phrase que tu as trouvée sur l’instant.',
      'Ça veut dire que ton chiffre d’affaires ne repose pas sur un processus. Il repose sur ta présence, ton énergie du jour, et ta capacité à être disponible au bon moment. Chaque mois, tu recommences à zéro — pas parce que tu manques de clients, mais parce que rien de ce qui a marché le mois dernier n’a été capturé.',
      'Ce n’est pas un manque de méthode. C’est que ta méthode existe, mais elle est dans ta tête. Et une méthode dans une tête ne se duplique pas, ne se délègue pas, et ne se déclenche pas sans toi.',
    ],
    eleve: [
      'Tu sais vendre. Ce n’est pas la question, et tes réponses le montrent.',
      'Le problème est ailleurs : entre le moment où quelqu’un te découvre et le moment où elle paie, il y a une série d’étapes qui n’existent que si tu les déclenches manuellement. Une relance que tu penses à envoyer. Un message que tu écris à nouveau. Une proposition que tu reconstruis.',
      'Tu n’as pas un problème de conversion. Tu as un problème de continuité — et les deux ne se soignent pas pareil.',
    ],
    modere: [
      'L’essentiel de ton processus commercial tient sans intervention permanente de ta part.',
      'Il reste un point de passage obligé : quelque part entre le premier contact et la signature, il y a une étape que tu es la seule à pouvoir franchir. C’est souvent le closing lui-même, parfois la proposition, parfois simplement la relance.',
      'Tant que cette étape existe, ton chiffre d’affaires reste plafonné par ton agenda.',
    ],
    sain: [
      'Ton système de vente fonctionne sans que tu aies à le porter. C’est rare, et ça mérite d’être dit.',
      'À ce stade, la question n’est plus « comment vendre sans moi » mais « comment vendre plus cher ». Ce n’est pas une question de structure. C’est une question de positionnement.',
    ],
  },
  delivery: {
    critique: [
      'Tu as répondu que tu ne pars pas dix jours. Ce n’était pas une réponse sur ton business. C’était une réponse sur ta vie.',
      'Chaque prestation que tu livres existe uniquement dans ta tête. Pas dans un document, pas dans un process — dans ta tête. Ce qui signifie qu’il n’existe aucune version de ton entreprise qui fonctionne sans que tu sois joignable. Pas « difficile ». Aucune.',
      'Ce n’est pas un problème d’organisation. C’est un problème de structure. Et ça ne se règle pas en étant plus rigoureuse.',
    ],
    eleve: [
      'Tu as documenté une partie de ce que tu fais. Il existe des trames, des modèles, des choses réutilisables.',
      'Mais entre ces morceaux documentés, il y a des passages que tu improvises à chaque fois. Et comme tu les improvises bien, personne ne voit qu’ils sont improvisés — toi comprise. Ce sont exactement ces passages qui t’empêchent de déléguer : tu ne peux pas transmettre ce que tu n’as jamais eu besoin d’écrire.',
    ],
    modere: [
      'Ta livraison suit un cadre. Une autre personne pourrait reprendre la majorité de ce que tu fais.',
      'Il reste des moments de bascule — les cas particuliers, les demandes hors cadre, les clientes qui sortent du scénario. Aujourd’hui, tous ces moments remontent vers toi. Ce n’est pas grave tant que les volumes restent stables. Ça le devient dès que tu doubles.',
    ],
    sain: [
      'Ta livraison est un système, pas une performance. Tu pourrais partir et ça continuerait.',
      'Le levier n’est plus dans la structure de ta livraison. Il est dans ce que tu livres — et à quel prix.',
    ],
  },
  admin: {
    critique: [
      'Tu ne connais pas ton chiffre du mois dernier. Pas approximativement — précisément.',
      'Ce n’est pas un détail comptable. Ça veut dire que tu pilotes à l’instinct : tu ne sais pas quelle offre est réellement rentable, quel canal ramène les bonnes clientes, ni combien d’heures tu passes sur chaque euro encaissé. Tu prends des décisions importantes avec des informations que tu reconstitues de mémoire.',
      'Et pendant ce temps, les relances, les factures et les confirmations partent parce que tu y penses. Le jour où tu n’y penses pas, elles ne partent pas.',
    ],
    eleve: [
      'Tes chiffres existent, mais ils sont éparpillés. Pour répondre à une question simple, tu dois recouper deux ou trois sources.',
      'Résultat : tu ne regardes pas souvent. Et ce que tu ne regardes pas souvent, tu le découvres tard — généralement quand le problème est déjà installé depuis deux mois.',
    ],
    modere: [
      'Tu as tes chiffres et une partie de tes routines administratives tourne seule.',
      'Il reste une zone manuelle : quelques relances, quelques envois, quelques vérifications que tu fais encore à la main. Chacune prend cinq minutes. Ensemble, elles prennent ta semaine.',
    ],
    sain: [
      'Tes chiffres sont accessibles et tes routines tournent sans toi.',
      'Tu as l’infrastructure qui permet de décider vite. La question devient : qu’est-ce que tu décides ?',
    ],
  },
  contenu: {
    critique: [
      'Six jours sans publier, et ce que tu ressens en ouvrant l’application, c’est de l’angoisse.',
      'Ce n’est pas un problème de discipline. C’est que ta visibilité repose entièrement sur ton état émotionnel du moment. Les semaines où tu vas bien, tu publies. Les semaines où tu es submergée — donc les semaines où tu aurais le plus besoin de clients — tu disparais.',
      'Ton contenu est indexé sur ton énergie. Et ton énergie n’est pas un système.',
    ],
    eleve: [
      'Tu publies, mais chaque publication repart d’une page blanche.',
      'Tu ne manques pas d’idées. Tu manques d’un endroit où les idées attendent d’être utilisées. Résultat : tu produis en flux tendu, tu décides du sujet le jour même, et la qualité dépend de combien de temps il te restait.',
    ],
    modere: [
      'Tu as un début de système : des formats qui reviennent, des angles identifiés.',
      'Ce qui manque, c’est l’avance. Tu tiens la cadence, mais sans marge — donc la première semaine chargée casse la série, et il faut ensuite plusieurs semaines pour la reprendre.',
    ],
    sain: [
      'Ton contenu sort même les semaines où tu n’es pas inspirée. C’est la définition d’un système qui fonctionne.',
      'Le sujet n’est plus la régularité. C’est ce que cette régularité convertit.',
    ],
  },
};

// ─── Projection à 12 mois (spec §3) ──────────────────────────────────────────
export const PROJECTION: Record<Niveau, string> = {
  critique:
    'Dans 12 mois, à ce rythme : le même chiffre d’affaires, la même charge, et 365 jours de plus passés à être la seule personne qui sait comment tout fonctionne.',
  eleve:
    'Dans 12 mois, à ce rythme : tu auras probablement plus de clientes. Et exactement le même problème, en plus lourd.',
  modere:
    'Dans 12 mois, à ce rythme : les trous que tu as aujourd’hui seront toujours là. Ils ne se referment pas tout seuls — ils s’élargissent avec le volume.',
  sain:
    'Dans 12 mois, à ce rythme : ton business tiendra toujours debout. La question est de savoir s’il sera plus grand.',
};

// ─── CTA (spec §4) ───────────────────────────────────────────────────────────
export interface CtaMeta {
  accroche: string;
  corps: string[];
  bouton: string;
  href: string;
}

// Toutes les CTA passent par le tunnel d'éligibilité, qui oriente ensuite vers
// LE SPRINT™ ou le coaching et affiche le lien de prise de rendez-vous.
const SPRINT_URL = '/eligibilite';
const ACCELERATION_URL = '/eligibilite';

export const CTA_SPRINT: CtaMeta = {
  accroche:
    'Ce que tu viens de lire n’est pas une fatalité. C’est un problème d’installation.',
  corps: [
    'LE SPRINT™, c’est 30 jours pendant lesquels on installe l’infrastructure qui manque à ton business. Pas un accompagnement où tu apprends à le faire. Une installation où on le fait.',
    'Deux entreprises maximum en même temps.',
  ],
  bouton: 'Voir si mon business est éligible',
  href: SPRINT_URL,
};

export const CTA_ACCELERATION: CtaMeta = {
  accroche:
    'Ton problème n’est pas structurel. Inutile de te vendre une structure.',
  corps: [
    'Ce que ton score indique, c’est que tu as construit une base solide et que tu es maintenant limitée par autre chose : ton positionnement, tes prix, ou la façon dont tu vends.',
    'C’est exactement ce qu’on travaille dans L’Accélération.',
  ],
  bouton: 'En savoir plus sur L’Accélération',
  href: ACCELERATION_URL,
};

export function ctaPour(niveau: Niveau): CtaMeta {
  return niveau === 'sain' ? CTA_ACCELERATION : CTA_SPRINT;
}

// ─── Axe le plus faible ──────────────────────────────────────────────────────
// Score de dépendance le plus élevé. En cas d'égalité, priorité (spec §6) :
// Delivery > Ventes > Admin > Contenu.
export function axeLePlusFaible(scores: Record<Axe, number>): Axe {
  const priorite: Axe[] = ['delivery', 'ventes', 'admin', 'contenu'];
  return priorite.reduce((pire, axe) =>
    scores[axe] > scores[pire] ? axe : pire,
  );
}
