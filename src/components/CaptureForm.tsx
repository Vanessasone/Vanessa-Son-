'use client';

import { useState } from 'react';

export interface Identite {
  prenom: string;
  email: string;
}

interface Props {
  onSubmit: (identite: Identite) => void;
  submitting: boolean;
  erreur?: string | null;
}

// Capture email + prénom en fin de parcours, avant le résultat (spec §5).
// « Le demander après Q18, quand elle veut son score, la transforme en échange. »
export default function CaptureForm({ onSubmit, submitting, erreur }: Props) {
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');

  const emailValide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const valide = prenom.trim().length > 0 && emailValide;

  return (
    <div className="container fade-in">
      <p className="question">Ton score est prêt.</p>
      <p className="scenario">
        Dis-moi où te l’envoyer — tu le verras aussi tout de suite à l’écran.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (valide && !submitting) {
            onSubmit({ prenom: prenom.trim(), email: email.trim() });
          }
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

        {erreur && <p className="form-error">{erreur}</p>}

        <button
          type="submit"
          className="btn"
          disabled={!valide || submitting}
          style={{ marginTop: '1rem', width: '100%' }}
        >
          {submitting ? 'Calcul en cours…' : 'Voir mon score'}
        </button>
      </form>
    </div>
  );
}
