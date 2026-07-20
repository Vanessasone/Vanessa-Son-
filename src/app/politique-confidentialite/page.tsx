// Politique de confidentialité — BROUILLON à faire valider (spec RGPD §5).
// Structure conforme aux exigences RGPD, valeurs tirées de src/lib/legal.ts.
// NE PAS considérer comme un avis juridique : faire valider avant publication.
import type { Metadata } from 'next';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Audit de Dépendance™',
  robots: { index: false, follow: false },
};

export default function PolitiqueConfidentialite() {
  return (
    <main className="legal-page">
      <div className="legal-body">
        <p className="legal-draft">
          ⚠️ Brouillon à faire valider par un professionnel du droit (ou à partir
          d’un modèle CNIL) avant publication.
        </p>

        <h1>Politique de confidentialité</h1>
        <p className="legal-maj">Dernière mise à jour : à compléter.</p>

        <h2>1. Responsable du traitement</h2>
        <p>
          {LEGAL.responsable}, SIRET {LEGAL.siret}, {LEGAL.adresse}. Contact :{' '}
          <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>.
        </p>

        <h2>2. Données collectées</h2>
        <p>
          Dans le cadre de l’Audit de Dépendance™ : ton prénom, ton adresse
          email, tes réponses aux 18 questions, ton chiffre d’affaires mensuel
          déclaré (par tranche), la taille de ton équipe, ainsi que des données
          techniques éventuelles (source de la visite, horodatage).
        </p>

        <h2>3. Finalités</h2>
        <p>
          Ces données servent à : calculer et t’afficher ton score, t’envoyer
          ton résultat par email, et — si tu y as consenti — te transmettre des
          conseils et offres commerciales.
        </p>

        <h2>4. Base légale</h2>
        <p>
          Le traitement repose sur ton consentement, recueilli au moment de la
          demande de résultat. Tu peux le retirer à tout moment.
        </p>

        <h2>5. Durée de conservation</h2>
        <p>
          Tes données sont conservées {LEGAL.conservationAns} ans après notre
          dernier contact, puis supprimées ou anonymisées.
        </p>

        <h2>6. Destinataires et sous-traitants</h2>
        <p>
          Tes données sont traitées par les prestataires suivants, chacun dans
          le cadre de sa mission :
        </p>
        <ul>
          {LEGAL.sousTraitants.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p>
          Certains de ces prestataires sont des sociétés établies hors Union
          européenne ; l’hébergement des données est configuré, dans la mesure
          du possible, dans une région de l’Union européenne. (À préciser selon
          la configuration retenue.)
        </p>

        <h2>7. Tes droits</h2>
        <p>
          Tu disposes des droits d’accès, de rectification, d’effacement,
          d’opposition, de portabilité et de retrait du consentement. Tu peux
          les exercer en écrivant à{' '}
          <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>. Un
          lien de désinscription figure aussi dans chaque email.
        </p>

        <h2>8. Réclamation</h2>
        <p>
          Tu peux à tout moment introduire une réclamation auprès de la CNIL
          (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">cnil.fr</a>).
        </p>

        <p className="legal-links" style={{ marginTop: '3rem' }}>
          <a href="/mentions-legales">Mentions légales</a>
        </p>
      </div>
    </main>
  );
}
