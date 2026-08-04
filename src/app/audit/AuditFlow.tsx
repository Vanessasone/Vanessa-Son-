'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QUESTIONS, CA_MENSUEL_MAP } from '@/lib/questions';
import type { Answers } from '@/lib/scoring';
import QuestionScreen from '@/components/QuestionScreen';
import CaptureForm, { type Identite } from '@/components/CaptureForm';
import ProgressBar from '@/components/ProgressBar';
import {
  startSession,
  saveAnswer,
  markAbandon,
  finalize,
} from '@/lib/persistence';

type Phase = 'intro' | 'question' | 'capture';

const TOTAL = QUESTIONS.length; // 18
const AVANCE_MS = 260; // transition lente entre questions (spec §4)

export default function AuditFlow() {
  const router = useRouter();
  const params = useSearchParams();

  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const sessionId = useRef<string | null>(null); // id en state, jamais dans l'URL
  const completed = useRef(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout>>();

  // Démarrage : insert de la ligne dès le début du parcours (spec §5).
  const commencer = useCallback(async () => {
    setPhase('question');
    const src = params.get('src') ?? 'manychat';
    const utm = params.get('utm_campaign') ?? undefined;
    sessionId.current = await startSession({ source: src, utm_campaign: utm });
  }, [params]);

  // Enregistre l'abandon si l'utilisatrice quitte avant la fin.
  useEffect(() => {
    const onUnload = () => {
      if (!completed.current && phase !== 'intro') {
        markAbandon(sessionId.current, index + 1);
      }
    };
    window.addEventListener('beforeunload', onUnload);
    return () => window.removeEventListener('beforeunload', onUnload);
  }, [phase, index]);

  useEffect(() => () => clearTimeout(advanceTimer.current), []);

  const repondre = (value: number) => {
    const q = QUESTIONS[index];
    const next = { ...answers, [q.key]: value };
    setAnswers(next);
    saveAnswer(sessionId.current, next, index + 1); // update à chaque réponse

    clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      if (index + 1 < TOTAL) {
        setIndex(index + 1);
      } else {
        setPhase('capture');
      }
    }, AVANCE_MS);
  };

  const revenir = () => {
    clearTimeout(advanceTimer.current);
    if (index > 0) setIndex(index - 1);
    else setPhase('intro');
  };

  const soumettreIdentite = async (identite: Identite) => {
    setSubmitting(true);
    setErreur(null);
    try {
      const scores = await finalize({
        id: sessionId.current,
        answers,
        prenom: identite.prenom,
        email: identite.email,
        consentement: identite.consentement,
      });
      completed.current = true;

      // Résultat transmis via sessionStorage — l'id ne transite jamais par l'URL.
      try {
        sessionStorage.setItem(
          'audit_resultat',
          JSON.stringify({
            scores,
            prenom: identite.prenom,
            email: identite.email,
            ca: answers.q17 ? CA_MENSUEL_MAP[answers.q17] : null,
          }),
        );
      } catch {
        /* stockage indisponible : la page résultat gère l'absence */
      }
      router.push('/audit/resultat');
    } catch (e) {
      console.warn('[audit] soumission échouée', e);
      setErreur('L’envoi n’a pas abouti. Vérifie ton adresse et réessaie.');
      setSubmitting(false);
    }
  };

  // ─── Rendu ────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <main className="screen">
        <div className="container fade-in">
          <p className="eyebrow">Audit de Dépendance™</p>
          <h1 className="question">
            À quel point ton business dépend-il de toi ?
          </h1>
          <p className="scenario">
            18 questions. Aucune bonne réponse. À la fin, un score — et ce qu’il
            te coûte, concrètement.
          </p>
          <button className="btn" onClick={commencer}>
            Commencer
          </button>
        </div>
      </main>
    );
  }

  if (phase === 'capture') {
    return (
      <main className="screen">
        <ProgressBar ratio={1} />
        <CaptureForm
          onSubmit={soumettreIdentite}
          submitting={submitting}
          erreur={erreur}
        />
      </main>
    );
  }

  const question = QUESTIONS[index];
  return (
    <main className="screen">
      <ProgressBar ratio={index / TOTAL} />
      <p className="progress-label">Question {index + 1} sur {TOTAL}</p>
      <QuestionScreen
        question={question}
        value={answers[question.key]}
        onAnswer={repondre}
      />
      <button className="back" onClick={revenir}>
        ← Retour
      </button>
    </main>
  );
}
