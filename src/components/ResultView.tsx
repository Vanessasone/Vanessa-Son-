'use client';

import { useEffect, useState } from 'react';
import type { Axe, Scores } from '@/lib/scoring';
import {
  NIVEAUX,
  AXE_LABELS,
  AXE_COUT,
  PROJECTION,
  couleurScore,
  axeLePlusRouge,
} from '@/lib/resultats';

const ORDRE_AXES: Axe[] = ['ventes', 'delivery', 'admin', 'contenu'];
const SPRINT_URL = 'https://vanysweddings.com/sprint';

// Page de résultat — structure verticale (spec §4).
export default function ResultView({
  scores,
  prenom,
}: {
  scores: Scores;
  prenom?: string;
}) {
  const niveau = NIVEAUX[scores.niveau];
  const pire = axeLePlusRouge(scores);

  // Anime le remplissage des barres au montage.
  const [monte, setMonte] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMonte(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="result-container fade-in">
      {/* 1. Score global */}
      <div style={{ textAlign: 'center' }}>
        <p className="eyebrow">
          {prenom ? `${prenom}, ton audit` : 'Ton audit de dépendance'}
        </p>
        <div className="score-global" style={{ color: couleurScore(scores.global) }}>
          {scores.global}
          <span className="score-sur"> / 100</span>
        </div>

        {/* 2. Verdict */}
        <p className="verdict">{niveau.verdict}</p>
      </div>

      {/* 3. Les 4 barres d'axe */}
      <div className="bars">
        {ORDRE_AXES.map((axe) => (
          <div className="bar-row" key={axe}>
            <div className="bar-head">
              <span>{AXE_LABELS[axe]}</span>
              <span style={{ color: couleurScore(scores[axe]) }}>
                {scores[axe]}
              </span>
            </div>
            <div className="bar-track">
              <div
                className="bar-fill"
                style={{
                  width: monte ? `${scores[axe]}%` : '0%',
                  background: couleurScore(scores[axe]),
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 4. L'axe le plus rouge — ce que ça coûte */}
      <div className="section">
        <h2>Là où ça te coûte le plus : {AXE_LABELS[pire]}</h2>
        <p>{AXE_COUT[pire]}</p>
      </div>

      {/* 5. La projection */}
      <div className="section projection">
        <p>{PROJECTION[scores.niveau]}</p>
      </div>

      {/* 6. CTA unique — LE SPRINT™ */}
      <div className="cta-block">
        <p className="kicker">La sortie</p>
        <p className="verdict" style={{ marginTop: 0, marginBottom: '2rem' }}>
          {scores.niveau === 'sain'
            ? 'Ta prochaine conversation, c’est la croissance.'
            : '30 jours pour sortir ton business de ta tête.'}
        </p>
        <a className="btn" href={SPRINT_URL}>
          Découvrir LE&nbsp;SPRINT™
        </a>
      </div>
    </div>
  );
}
