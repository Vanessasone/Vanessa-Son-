// Mentions légales — BROUILLON à faire valider (spec RGPD §5).
// Valeurs tirées de src/lib/legal.ts. Compléter éditeur, hébergeur, directeur
// de publication avant publication.
import type { Metadata } from 'next';
import { LEGAL } from '@/lib/legal';

export const metadata: Metadata = {
  title: 'Mentions légales — Audit de Dépendance™',
  robots: { index: false, follow: false },
};

export default function MentionsLegales() {
  return (
    <main className="legal-page">
      <div className="legal-body">
        <p className="legal-draft">
          ⚠️ Brouillon à compléter et faire valider avant publication.
        </p>

        <h1>Mentions légales</h1>

        <h2>Éditeur</h2>
        <p>
          {LEGAL.responsable}
          <br />
          SIRET {LEGAL.siret}
          <br />
          {LEGAL.adresse}
          <br />
          <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>
        </p>

        <h2>Directeur de la publication</h2>
        <p>{LEGAL.responsable}. (À confirmer.)</p>

        <h2>Hébergement</h2>
        <p>
          Application hébergée par Vercel Inc. ; base de données hébergée par
          Supabase. (Compléter les coordonnées exactes et la région
          d’hébergement retenue.)
        </p>

        <h2>Propriété intellectuelle</h2>
        <p>
          L’ensemble des contenus de ce site (textes, marques « Audit de
          Dépendance™ », « LE SPRINT™ », mise en page) est protégé. Toute
          reproduction sans autorisation est interdite.
        </p>

        <p className="legal-links" style={{ marginTop: '3rem' }}>
          <a href="/politique-confidentialite">Politique de confidentialité</a>
        </p>
      </div>
    </main>
  );
}
