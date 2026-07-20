// AUDIT DE DÉPENDANCE™ — contenu de la page de résultat (spec §4)
import type { Axe, Niveau } from './scoring';

export interface NiveauMeta {
  label: string;
  verdict: string;
}

export const NIVEAUX: Record<Niveau, NiveauMeta> = {
  critique: {
    label: 'Critique',
    verdict: 'Ton business ne tourne pas. C’est toi qui tournes.',
  },
  eleve: {
    label: 'Élevé',
    verdict: 'Tu as construit quelque chose. Mais tu es dedans, pas au-dessus.',
  },
  modere: {
    label: 'Modéré',
    verdict:
      'Il y a des systèmes. Il y a aussi des trous par lesquels tout repasse par toi.',
  },
  sain: {
    label: 'Sain',
    verdict:
      'Tu n’as pas un problème de dépendance. Tu as un problème de croissance.',
  },
};

// Code couleur des barres (spec §4). Pas de rouge — saturation croissante.
export function couleurScore(score: number): string {
  if (score >= 75) return '#908070'; // Taupe foncé
  if (score >= 55) return '#BEA268'; // Bronze
  if (score >= 35) return '#D6C5B0'; // Sable
  return '#F7F4EF'; // Beige clair
}

export const AXE_LABELS: Record<Axe, string> = {
  ventes: 'Ventes',
  delivery: 'Delivery',
  admin: 'Admin',
  contenu: 'Contenu',
};

// Développement « ce que ça coûte concrètement » pour l'axe le plus rouge.
export const AXE_COUT: Record<Axe, string> = {
  ventes:
    "Ta croissance dépend entièrement de ta présence. Chaque vente passe par toi, dans l’instant, à la main. Il n’existe aucune séquence qui rattrape un prospect pendant que tu dors — donc chaque prospect qui n’achète pas tout de suite est un prospect perdu. Tu ne construis pas un actif commercial. Tu recommences chaque mois à zéro.",
  delivery:
    "La prestation, c’est toi. Pas ta méthode, pas ton système : toi. Chaque dossier réinvente la roue, chaque cliente a besoin de ta tête pour avancer. Résultat : tu ne peux pas déléguer, tu ne peux pas partir, et tu ne peux pas augmenter tes volumes sans t’épuiser. Ton plafond de revenu, c’est le nombre d’heures que ton corps tient.",
  admin:
    "Tu pilotes à l’aveugle. Les chiffres ne sont pas sous tes yeux, les relances partent quand tu y penses, les factures traînent. Tout ce temps passé à recoller les morceaux administratifs, c’est du temps qui ne produit rien — et pendant ce temps, les décisions se prennent au feeling au lieu de se prendre sur les faits.",
  contenu:
    "Ta visibilité s’arrête quand tu t’arrêtes. Chaque publication part d’une page blanche, chaque semaine sans inspiration est une semaine sans présence. Tu confonds « être présente » et « avoir un système » — donc ta notoriété ne capitalise jamais. Le jour où tu lèves le pied, le silence est immédiat.",
};

// La projection « À ce rythme, dans 12 mois : … » selon le niveau.
export const PROJECTION: Record<Niveau, string> = {
  critique:
    "Dans 12 mois, au même rythme, tu seras exactement là où tu es — en plus fatiguée. Le business n’aura pas grandi parce qu’il ne peut pas grandir : il est plafonné par toi. La seule variable qui aura bougé, c’est ton niveau d’épuisement.",
  eleve:
    "Dans 12 mois, tu auras probablement plus de clientes. Et donc plus de dépendance. Chaque nouveau contrat ajoute une charge qui repasse par toi — la croissance, ici, aggrave le problème au lieu de le résoudre. Tu montes en chiffre et tu descends en liberté.",
  modere:
    "Dans 12 mois, tes systèmes existants auront tenu — mais les trous, eux, se seront élargis. Ce qui repasse aujourd’hui par toi « juste parfois » deviendra le goulot d’étranglement du jour où tu voudras passer un cap. Tu répares les fuites une par une au lieu de refaire la plomberie.",
  sain:
    "Dans 12 mois, la question ne sera plus « comment tenir » mais « comment aller plus vite ». Tu as les fondations. Ce qui te manque, ce n’est pas un système de survie — c’est un moteur de croissance. C’est une autre conversation.",
};

// Retourne l'axe au score le plus élevé (le plus « rouge »).
export function axeLePlusRouge(scores: Record<Axe, number>): Axe {
  const ordre: Axe[] = ['ventes', 'delivery', 'admin', 'contenu'];
  return ordre.reduce((pire, axe) =>
    scores[axe] > scores[pire] ? axe : pire,
  );
}
