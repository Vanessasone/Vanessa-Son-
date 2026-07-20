'use client';

import type { Question } from '@/lib/questions';
import { CONSIGNE_ECHELLE } from '@/lib/questions';

interface Props {
  question: Question;
  value: number | undefined;
  onAnswer: (value: number) => void;
}

// Une seule question par écran (spec §5). Rendu selon le bloc :
// scénario/contexte → liste de choix ; échelle → 5 pastilles.
export default function QuestionScreen({ question, value, onAnswer }: Props) {
  const isEchelle = question.bloc === 'echelle';

  return (
    <div className="container fade-in" key={question.key}>
      {question.sousTitre && <p className="scenario">{question.sousTitre}</p>}
      <p className="question">{question.prompt}</p>

      {isEchelle ? (
        <>
          <p className="consigne">{CONSIGNE_ECHELLE}</p>
          <div className="echelle" role="radiogroup" aria-label={question.prompt}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={value === n}
                className={`echelle-btn${value === n ? ' selected' : ''}`}
                onClick={() => onAnswer(n)}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="echelle-legende">
            <span>pas du tout</span>
            <span>complètement</span>
          </div>
        </>
      ) : (
        <div className="choices" role="radiogroup" aria-label={question.prompt}>
          {question.choices?.map((choice) => (
            <button
              key={choice.value}
              type="button"
              role="radio"
              aria-checked={value === choice.value}
              className={`choice${value === choice.value ? ' selected' : ''}`}
              onClick={() => onAnswer(choice.value)}
            >
              {choice.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
