'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Scores } from '@/lib/scoring';
import {
  QUESTIONS,
  routerOffre,
  OFFRES,
  BOOKING,
  type Offre,
} from '@/lib/eligibilite';
import ProgressBar from '@/components/ProgressBar';

interface Stored {
  scores: Scores;
  prenom?: string;
  ca?: string | null;
}

const TOTAL = QUESTIONS.length;
const AVANCE_MS = 260;

// Mini-consultation de closing : une question par écran, puis recommandation
// personnalisée (Sprint vs coaching) et lien de prise de rendez-vous.
export default function EligibilitePage() {
  const router = useRouter();
  const [data, setData] = useState<Stored | null>(null);
  const [pret, setPret] = useState(false);
  const [index, setIndex] = useState(0);
  const [reponses, setReponses] = useState<Record<string, string>>({});
  const [fini, setFini] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

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

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!data) {
    return (
      <main className="screen">
        <div className="container" />
      </main>
    );
  }

  // ─── Recommandation finale ──────────────────────────────────────────────────
  if (fini) {
    const caChoisi = reponses.ca ?? data.ca ?? null;
    const offre: Offre = routerOffre(caChoisi, data.scores.niveau);
    const meta = OFFRES[offre];
    const lien = BOOKING[offre];
    return (
      <main className="screen">
        <div className="container fade-in">
          <p className="eyebrow">Ta recommandation</p>
          <h1 className="verdict-titre">{meta.titre}</h1>
          <div className="axe-dev" style={{ margin: '1.5rem auto 2rem' }}>
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
              (Lien de rendez-vous à configurer — src/lib/eligibilite.ts)
            </p>
          )}
        </div>
      </main>
    );
  }

  const q = QUESTIONS[index];
  const repondre = (v: string) => {
    setReponses((r) => ({ ...r, [q.key]: v }));
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (index + 1 < TOTAL) setIndex(index + 1);
      else setFini(true);
    }, AVANCE_MS);
  };

  return (
    <main className="screen">
      <ProgressBar ratio={index / TOTAL} />
      <p className="progress-label">
        Question {index + 1} sur {TOTAL}
      </p>
      <div className="container fade-in" key={q.key}>
        {q.sousTitre && <p className="scenario">{q.sousTitre}</p>}
        <p className="question">{q.prompt}</p>
        <div className="choices" role="radiogroup" aria-label={q.prompt}>
          {q.choices.map((c) => (
            <button
              key={c.v}
              type="button"
              role="radio"
              aria-checked={reponses[q.key] === c.v}
              className={`choice${reponses[q.key] === c.v ? ' selected' : ''}`}
              onClick={() => repondre(c.v)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
      {index > 0 && (
        <button
          className="back"
          onClick={() => {
            clearTimeout(timer.current);
            setIndex(index - 1);
          }}
        >
          ← Retour
        </button>
      )}
    </main>
  );
}
