// Aperçu de tous les emails (J+0 + séquence), avec données factices.
// Outil de relecture interne — noindex, aucune donnée réelle.
import type { Metadata } from 'next';
import type { Scores } from '@/lib/scoring';
import { htmlResultat, sujetResultat } from '@/lib/email';
import { buildSequenceEmail } from '@/lib/sequence-emails';
import { stepsPourNiveau, type Step } from '@/lib/sequence';

export const metadata: Metadata = {
  title: 'Aperçu des emails — Audit de Dépendance™',
  robots: { index: false, follow: false },
};

const CRITIQUE: Scores = {
  ventes: 84, delivery: 88, admin: 73, contenu: 73, global: 82, niveau: 'critique',
};
const SAIN: Scores = {
  ventes: 20, delivery: 24, admin: 20, contenu: 20, global: 22, niveau: 'sain',
};
const OPTS = { unsubscribeToken: 'apercu-token' };

function Preview({ titre, subject, html }: { titre: string; subject: string; html: string }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <p style={{ color: '#bea268', letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.72rem', marginBottom: '0.35rem' }}>
        {titre}
      </p>
      <p style={{ color: '#f7f4ef', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
        Objet : <strong>{subject}</strong>
      </p>
      <iframe
        srcDoc={html}
        title={titre}
        style={{ width: '100%', height: 760, border: '1px solid rgba(247,244,239,0.14)', borderRadius: 4, background: '#121212' }}
      />
    </section>
  );
}

export default function ApercuEmails() {
  const prenom = 'Vanessa';

  const sprint = (['j2', 'j4', 'j6', 'j9'] as Step[]).map((step) => {
    const e = buildSequenceEmail(step, { prenom, scores: CRITIQUE }, OPTS);
    return { step, ...e };
  });

  const sain = stepsPourNiveau('sain').map((step) => {
    const e = buildSequenceEmail(step, { prenom: 'Léa', scores: SAIN }, OPTS);
    return { step, ...e };
  });

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 1.25rem' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', color: '#f7f4ef', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
        Aperçu des emails
      </h1>
      <p style={{ color: 'rgba(247,244,239,0.55)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
        Données factices · page noindex. Track SPRINT (score {CRITIQUE.global},
        critique) puis track L’Accélération (score {SAIN.global}, sain).
      </p>

      <Preview titre="J+0 — Résultat" subject={sujetResultat(CRITIQUE)} html={htmlResultat(prenom, CRITIQUE, OPTS)} />

      {sprint.map((e) => (
        <Preview key={`sprint-${e.step}`} titre={`SPRINT ${e.step.toUpperCase()}`} subject={e.subject} html={e.html} />
      ))}

      {sain.map((e) => (
        <Preview key={`sain-${e.step}`} titre={`ACCÉLÉRATION ${e.step.toUpperCase()} (sain)`} subject={e.subject} html={e.html} />
      ))}
    </main>
  );
}
