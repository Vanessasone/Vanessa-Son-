// Informations de l'entité responsable du traitement.
//
// ⚠️  À VÉRIFIER / COMPLÉTER AVANT PUBLICATION.
// Ces valeurs alimentent les mentions légales, la politique de confidentialité
// et les pieds de page d'emails. Elles ne constituent pas un avis juridique —
// faire valider la politique par un professionnel du droit ou un modèle CNIL.
export const LEGAL = {
  // Responsable du traitement
  responsable: 'Vanessa Soné',

  // ⚠️ SIRET fourni dans les notes Wedding Bosses — CONFIRMER qu'il correspond
  // bien à l'entité qui porte vanessasone.com avant toute mise en ligne.
  siret: '521 703 595 00053',

  // ⚠️ À compléter avec l'adresse du siège de l'entité.
  adresse: '[Adresse du siège — à compléter]',

  // ⚠️ Adresse de contact pour l'exercice des droits RGPD. Confirmer qu'elle
  // est bien relevée et rattachée à la bonne marque.
  contactEmail: 'contact@vanysweddings.com',

  site: 'vanessasone.com',

  // Durée de conservation (usage courant en prospection : 3 ans après le
  // dernier contact).
  conservationAns: 3,

  // Sous-traitants à nommer dans la politique de confidentialité.
  sousTraitants: [
    'Supabase — hébergement de la base de données',
    'Resend — envoi des emails transactionnels et marketing',
    'Notion — CRM (suivi des prospects)',
    'Vercel — hébergement de l’application',
  ],

  // ⚠️ Certains sous-traitants sont des sociétés américaines. Choisir une
  // région d'hébergement UE (Supabase) AVANT le déploiement — non modifiable
  // ensuite sans migration.
} as const;

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'http://localhost:3000'
  );
}
