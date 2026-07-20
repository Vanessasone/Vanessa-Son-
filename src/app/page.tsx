import { redirect } from 'next/navigation';

// Point d'entrée : ManyChat « DÉPENDANCE » → /audit?src=manychat.
// La racine renvoie simplement vers le parcours.
export default function Home() {
  redirect('/audit');
}
