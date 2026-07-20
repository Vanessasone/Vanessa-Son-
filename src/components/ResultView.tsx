'use client';

import { useEffect, useState } from 'react';
import type { Axe, Scores } from '@/lib/scoring';
import {
  NIVEAUX,
  AXE_LABELS,
  AXE_DEV,
  PROJECTION,
  couleurDependance,
  axeLePlusFaible,
  autonomie,
  joursDeTenue,
  afficherJours,
  ctaPour,
} from '@/lib/resultats';

const ORDRE_AXES: Axe[] = ['ventes', 'delivery', 'admin', 'contenu'];

// Page de résultat — trois couches d'affichage (spec §0) : Indice de
// Dépendance™ / Autonomie réelle / Jours de tenue.
export default function ResultView({
  scores,
  prenom,
}: {
  scores: Scores;
  prenom?: string;
}) {
  const niveau = NIVEAUX[scores.niveau];
  const auto = autonomie(scores.global);
  const jours = joursDeTenue(scores.global);
  const montrerJours = afficherJours(scores.niveau);

  const pire = axeLePlusFaible(scores);
  const autoPire = autonomie(scores[pire]);
  const cta = ctaPour(scores.niveau);

  // Anime le remplissage des barres au montage.
  const [monte, setMonte] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMonte(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="result-container fade-in">
      {/* 0. Indice + autonomie + jours */}
      <div className="indice-block">
        <div className="indice">{scores.global}</div>
        <p className="indice-label">Indice de Dépendance™</p>
        <p className="autonomie-line">Autonomie réelle : {auto}&nbsp;%</p>
        {montrerJours && (
          <p className="jours-line">
            Ton business tient environ {jours}&nbsp;jour{jours > 1 ? 's' : ''}{' '}
            sans toi.
          </p>
        )}
      </div>

      {/* 1. Verdict */}
      <h1 className="verdict-titre">{niveau.titre}</h1>
      <div className="verdict-para">
        {niveau.paragraphes.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* Les 4 axes — lecture rapide (autonomie), saturation = alarme */}
      <div className="bars">
        {ORDRE_AXES.map((axe) => {
          const autoAxe = autonomie(scores[axe]);
          return (
            <div className="bar-row" key={axe}>
              <div className="bar-head">
                <span>{AXE_LABELS[axe]}</span>
                <span style={{ color: couleurDependance(scores[axe]) }}>
                  autonome à {autoAxe}&nbsp;%
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: monte ? `${autoAxe}%` : '0%',
                    background: couleurDependance(scores[axe]),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Développement de l'axe le plus faible */}
      <div className="axe-dev">
        <h2 className="axe-dev-head">
          {AXE_LABELS[pire]} — autonome à {autoPire}&nbsp;%
        </h2>
        {AXE_DEV[pire][scores.niveau].map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* 3. Projection à 12 mois */}
      <div className="projection-12">
        <p className="projection-eyebrow">À ce rythme</p>
        <p className="projection-text">{PROJECTION[scores.niveau]}</p>
      </div>

      {/* 4. CTA unique — selon le niveau */}
      <div className="cta-block">
        <p className="cta-accroche">{cta.accroche}</p>
        <div className="cta-corps">
          {cta.corps.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <a className="btn" href={cta.href}>
          {cta.bouton}
        </a>
      </div>

      {prenom && <p className="signature">— pour toi, {prenom}.</p>}
    </div>
  );
}
