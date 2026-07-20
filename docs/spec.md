# AUDIT DE DÉPENDANCE™ — Spécification technique

Lead magnet interactif · 18 questions · Scoring 4 axes
Entrée : ManyChat `DÉPENDANCE` → `/audit`
Sortie : score + page de résultat → LE SPRINT™

> Document de référence pour l'implémentation. Le code de `src/` et
> `supabase/` suit cette spécification.

---

## 1. Schéma Supabase

Voir `supabase/migrations/0001_audit_responses.sql`.

Table `audit_responses` : identité (prénom, email, instagram), contexte
business (CA mensuel, taille équipe), réponses brutes (`answers` jsonb),
scores calculés (4 axes + global + niveau), tracking (source, utm,
progression, abandon) et sync (Notion, flags email).

### RLS

- `insert_anon` — insertion anonyme (le prospect n'a pas de compte).
- `update_own_session` — update volontairement permissif (pas d'auth prospect).
- `select_admin` — lecture réservée au back-office authentifié.

> `update_own_session` est permissif car il n'y a pas d'auth prospect.
> Sécuriser côté application en ne renvoyant jamais l'id dans l'URL et en le
> gardant en state React uniquement.

---

## 2. Les 18 questions

| Bloc | Questions | Format | Objectif |
|---|---|---|---|
| Ouverture | Q1–Q6 | Scénarios (1–4 pts) | Descente du symptôme |
| Diagnostic | Q7–Q16 | Échelle 1–5 | Mesurer les 4 axes |
| Contexte | Q17–Q18 | Choix | Qualification commerciale |

Axes : **V** = Ventes · **D** = Delivery · **A** = Admin · **C** = Contenu.
Questions inversées (⟲) : Q7, Q9, Q12, Q14.

Le contenu exact des questions est dans `src/lib/questions.ts`.

---

## 3. Logique de scoring

Voir `src/lib/scoring.ts` (et `scoring.test.ts` pour les cas de référence).

### Normalisation

- **Bloc 1 (Q1–Q6)** — réponses 1–4, converties sur 5 :
  `valeur_normalisee = ((reponse - 1) / 3) * 4 + 1`
- **Bloc 2 (Q7–Q16)** — réponses 1–5. Inversées : `valeur = 6 - reponse`.

### Répartition par axe

| Axe | Questions | Nombre |
|---|---|---|
| Ventes | Q2, Q6, Q7, Q8, Q16 | 5 |
| Delivery | Q1, Q4, Q9, Q10, Q15 | 5 |
| Admin | Q3, Q11, Q12 | 3 |
| Contenu | Q5, Q13, Q14 | 3 |

Score par axe = `round(total_normalisé / (nb * 5) * 100)`.
Global pondéré : `round((ventes*2 + delivery*2 + admin + contenu) / 6)`.

### Niveaux

| Score | Niveau | Verdict |
|---|---|---|
| 75–100 | Critique | Ton business ne tourne pas. C'est toi qui tournes. |
| 55–74 | Élevé | Tu as construit quelque chose. Mais tu es dedans, pas au-dessus. |
| 35–54 | Modéré | Il y a des systèmes. Il y a aussi des trous par lesquels tout repasse par toi. |
| 0–34 | Sain | Tu n'as pas un problème de dépendance. Tu as un problème de croissance. |

> Un score bas oriente vers une conversation différente (séquence
> L'Accélération), pas vers l'absence de conversation.

---

## 4. Page de résultat

Structure verticale (`src/components/ResultView.tsx`) :

1. Score global — grand chiffre, Playfair Display, fond `#121212`
2. Verdict — une phrase selon le niveau
3. Les 4 barres d'axe — code couleur
4. L'axe le plus rouge — développé : ce que ça coûte concrètement
5. La projection — « À ce rythme, dans 12 mois : … »
6. CTA unique — LE SPRINT™

### Code couleur des barres (pas de rouge — saturation croissante)

| Plage | Couleur | Hex |
|---|---|---|
| 0–34 | Beige clair | `#F7F4EF` |
| 35–54 | Sable | `#D6C5B0` |
| 55–74 | Bronze | `#BEA268` |
| 75–100 | Taupe foncé | `#908070` |

### Direction artistique

- Fond `#121212`, texte `#F7F4EF`
- Titres Playfair Display, corps Montserrat
- Une information par écran, beaucoup de vide
- Transitions lentes (240 ms), jamais nerveuses
- Barre de progression discrète, bronze `#BEA268`, 2px

---

## 5. Flux technique

```
ManyChat "DÉPENDANCE"
        ↓  /audit?src=manychat
  Q1 → Q18  (state React, insert Supabase dès Q1, update à chaque réponse)
        ↓  capture email + prénom
  calculerScores() → update Supabase
        ↓  /audit/resultat
  ├── Webhook → Notion "CRM Prospects — Toutes Marques"
  └── Email transactionnel (Resend) → résultat détaillé
        ↓  J+2 : séquence LE SPRINT™ selon le niveau
```

Points d'attention :

- **Insertion progressive** — insérer dès Q1, update à chaque réponse : les
  abandons deviennent une donnée.
- **Email en fin de parcours**, pas au début : demander l'email après Q18.
- **Resend plutôt qu'OVH** — OVH est en IMAP, inadapté au transactionnel.
- **Une seule question par écran** — chaque écran est une confrontation isolée.

---

## 6. Séquence email post-audit

| Jour | Objet | Contenu |
|---|---|---|
| J+0 | Ton score : [X]/100 | Résultat détaillé, les 4 axes, aucun pitch |
| J+2 | L'axe que tu as évité de regarder | Développement de l'axe le plus rouge |
| J+4 | Ce que ça coûte, en heures | Chiffrage du temps perdu |
| J+6 | 30 jours | Présentation LE SPRINT™ — premier CTA commercial |
| J+9 | Deux places | Rareté réelle (max 2 sprints en parallèle) |

Segmentation : les scores `sain` (0–34) sortent de cette séquence et basculent
vers une séquence L'Accélération.

> Seul l'email J+0 est implémenté ici (`src/app/api/resultat/route.ts` +
> `src/lib/email.ts`). Les envois J+2 → J+9 relèvent d'une automation
> (Resend Broadcasts / cron) branchée sur `niveau` et les flags de la table.
