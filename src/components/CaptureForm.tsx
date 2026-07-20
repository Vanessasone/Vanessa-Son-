'use client';

import { useState } from 'react';
import { CONSENTEMENT, REASSURANCE } from '@/lib/consentement';

export interface Identite {
  prenom: string;
  email: string;
  consentement: boolean;
}

interface Props {
  onSubmit: (identite: Identite) => void;
  submitting: boolean;
  erreur?: string | null;
}

// Capture email + prénom en fin de parcours, avant le résultat (spec §5).
// Case de consentement RGPD : jamais pré-cochée, une seule case couvrant
// résultat + marketing, bouton désactivé tant qu'elle n'est pas cochée.
export default function CaptureForm({ onSubmit, submitting, erreur }: Props) {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);

  const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const champsValides = prenom.trim().length > 0 && emailValide;
  // Rappel affiché quand tout est rempli mais la case reste décochée.
  const rappelConsent = champsValides && !consent;

  return (
    <div className="container fade-in">
      <p className="question">Ton score est prêt.</p>
      <p className="scenario">
        Dis-moi où te l’envoyer — tu le verras aussi tout de suite à l’écran.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (submitting || !consent || !champsValides) return;
          onSubmit({ prenom: prenom.trim(), email: email.trim(), consentement: true });
        }}
      >
        <div className="field">
          <label htmlFor="prenom">Prénom</label>
          <input
            id="prenom"
            type="text"
            autoComplete="given-name"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <label className="consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span>{CONSENTEMENT.texte}</span>
        </label>

        {rappelConsent && (
          <p className="consent-hint">
            Coche la case pour que je puisse t’envoyer ton résultat.
          </p>
        )}
        {erreur && <p className="form-error">{erreur}</p>}

        <button
          type="submit"
          className="btn"
          disabled={!champsValides || !consent || submitting}
          style={{ marginTop: '1rem', width: '100%' }}
        >
          {submitting ? 'Calcul en cours…' : 'Voir mon score'}
        </button>
      </form>

      <p className="reassurance">{REASSURANCE}</p>
      <p className="legal-links">
        <a href="/politique-confidentialite" target="_blank" rel="noopener noreferrer">
          Politique de confidentialité
        </a>
        {' · '}
        <a href="/mentions-legales" target="_blank" rel="noopener noreferrer">
          Mentions légales
        </a>
      </p>
    </div>
  );
}
