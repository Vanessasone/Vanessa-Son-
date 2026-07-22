'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Scores } from '@/lib/scoring';
import { routerOffre, OFFRES, BOOKING, type Offre } from '@/lib/eligibilite';

interface Stored {
  scores: Scores;
  prenom?: string;
  ca?: string | null;
}

// Mini-candidature après le résultat, puis orientation (Sprint vs coaching)
// et lien de prise de rendez-vous.
const Q1 = [
  { v: 'moins-1an', label: 'Moins d’un an' },
  { v: '1-3ans', label: 'Entre 1 et 3 ans' },
  { v: 'plus-3ans', label: 'Plus de 3 ans' },
];
const Q2 = [
  { v: 'oui', label: 'Oui, je veux avancer maintenant' },
  { v: 'renseigne', label: 'Je me renseigne pour l’instant' },
];

export default function EligibilitePage() {
  const router = useRouter();
  const [data, setData] = useState<Stored | null>(null);
  const [pret, setPret] = useState(false);
  const [duree, setDuree] = useState<string | null>(null);
  const [invest, setInvest] = useState<string | null>(null);
  const [envoye, setEnvoye] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('audit_resultat');
      if (raw) setData(JSON.parse(raw) as Stored);
    } catch {
      /* ignore */
    }
    setPret(true);
  }, []);

  useEffect(() => {
    if (pret && !data) router.replace('/audit');
  }, [pret, data, router]);

  if (!data) {
    return (
      <main className="screen">
        <div className="container" />
      </main>
    );
  }

  // Résultat de l'orientation
  if (envoye) {
    const offre: Offre = routerOffre(data.ca, data.scores.niveau);
    const meta = OFFRES[offre];
    const lien = BOOKING[offre];
    return (
      <main className="screen">
        <div className="container fade-in">
          <p className="eyebrow">Ta prochaine étape</p>
          <h1 className="question">{meta.titre}</h1>
          <p className="scenario" style={{ marginBottom: '1.5rem' }}>
            {meta.accroche}
          </p>
          <div className="axe-dev" style={{ margin: '0 auto 2rem' }}>
            {meta.corps.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {lien ? (
            <a className="btn" href={lien} target="_blank" rel="noopener noreferrer">
              {meta.bouton}
            </a>
          ) : (
            <p className="form-error">
              (Lien de rendez-vous à configurer — voir src/lib/eligibilite.ts)
            </p>
          )}
        </div>
      </main>
    );
  }

  // Mini-candidature
  const complet = duree && invest;
  return (
    <main className="screen">
      <div className="container fade-in">
        <p className="eyebrow">Dernière étape</p>
        <h1 className="question">
          {data.prenom ? `${data.prenom}, ` : ''}deux questions avant ton rendez-vous.
        </h1>

        <p className="scenario" style={{ marginTop: '1.5rem' }}>
          Depuis combien de temps ton activité tourne ?
        </p>
        <div className="choices">
          {Q1.map((o) => (
            <button
              key={o.v}
              type="button"
              className={`choice${duree === o.v ? ' selected' : ''}`}
              onClick={() => setDuree(o.v)}
            >
              {o.label}
            </button>
          ))}
        </div>

        <p className="scenario" style={{ marginTop: '2rem' }}>
          Tu es prête à investir pour régler ça dans les 30 prochains jours ?
        </p>
        <div className="choices">
          {Q2.map((o) => (
            <button
              key={o.v}
              type="button"
              className={`choice${invest === o.v ? ' selected' : ''}`}
              onClick={() => setInvest(o.v)}
            >
              {o.label}
            </button>
          ))}
        </div>

        <button
          className="btn"
          style={{ marginTop: '2rem' }}
          disabled={!complet}
          onClick={() => setEnvoye(true)}
        >
          Voir ma prochaine étape
        </button>
      </div>
    </main>
  );
}
