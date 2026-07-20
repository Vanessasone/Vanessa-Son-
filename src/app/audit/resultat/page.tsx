'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Scores } from '@/lib/scoring';
import ResultView from '@/components/ResultView';

interface Stored {
  scores: Scores;
  prenom?: string;
}

// Le résultat est transmis via sessionStorage depuis le parcours — l'id de
// session ne transite jamais par l'URL (spec §1, note RLS).
export default function ResultatPage() {
  const router = useRouter();
  const [data, setData] = useState<Stored | null>(null);
  const [pret, setPret] = useState(false);

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
    if (pret && !data) {
      // Accès direct sans avoir passé l'audit → on renvoie au parcours.
      router.replace('/audit');
    }
  }, [pret, data, router]);

  if (!data) {
    return (
      <main className="screen">
        <div className="container" />
      </main>
    );
  }

  return (
    <main>
      <ResultView scores={data.scores} prenom={data.prenom} />
    </main>
  );
}
