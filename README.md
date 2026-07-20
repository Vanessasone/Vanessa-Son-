# AUDIT DE DÉPENDANCE™

Lead magnet interactif — 18 questions, scoring sur 4 axes (Ventes · Delivery ·
Admin · Contenu). Entrée depuis ManyChat (`DÉPENDANCE` → `/audit`), sortie vers
une page de résultat et la séquence email **LE SPRINT™**.

Implémentation Next.js (App Router) + TypeScript + Supabase, conforme à la
spécification technique (`docs/spec.md`).

## Stack

| Rôle | Techno |
|---|---|
| Front / parcours | Next.js 14 (App Router), React 18 |
| Base de données | Supabase (Postgres + RLS) |
| Email transactionnel | Resend |
| CRM | Notion (webhook API) |
| Typographie | Playfair Display + Montserrat (`next/font`) |

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner les clés
npm run dev                  # http://localhost:3000 → redirige vers /audit
```

Le parcours **fonctionne sans backend** : sans clés Supabase / Resend / Notion,
les questions et le calcul du score tournent quand même (persistance et envois
dégradent proprement). Renseigner les clés active la sauvegarde, l'email et le
CRM.

### Base de données

Appliquer la migration :

```bash
supabase db push
# ou coller supabase/migrations/0001_audit_responses.sql dans le SQL editor
```

## Architecture

```
src/
  app/
    page.tsx                 → redirige / vers /audit
    audit/
      page.tsx               → Suspense + AuditFlow
      AuditFlow.tsx          → orchestrateur du parcours (intro → Q1..Q18 → capture)
      resultat/page.tsx      → page de résultat (lit sessionStorage)
    api/resultat/route.ts    → email (Resend) + Notion + marquage Supabase
    desinscription/          → désinscription en un clic (RGPD)
    supprimer-mes-donnees/   → droit à l'effacement (RGPD)
    politique-confidentialite/ · mentions-legales/  → pages légales (brouillon)
  components/
    QuestionScreen.tsx       → une question par écran (scénario / échelle)
    CaptureForm.tsx          → capture email + prénom (fin de parcours)
    ResultView.tsx           → score, verdict, 4 barres, axe le + rouge, projection, CTA
    ProgressBar.tsx          → barre bronze 2px
  lib/
    questions.ts             → les 18 questions
    scoring.ts               → normalisation + calcul des scores (spec §3)
    scoring.test.ts          → tests unitaires du scoring
    resultats.ts             → verdicts, couleurs, textes des axes
    persistence.ts           → insert/update Supabase côté client (progressif)
    supabase.ts              → clients anon (navigateur) + service role (serveur)
    email.ts                 → template email J+0 (+ pied de page RGPD)
    notion.ts                → push vers le CRM Notion (+ archivage RGPD)
    consentement.ts          → texte de consentement versionné
    legal.ts                 → coordonnées de l'entité (⚠️ à compléter)
supabase/migrations/         → schéma + RLS + colonnes RGPD
docs/spec.md                 → spécification technique de référence
docs/page-resultat.md        → copywriting de la page de résultat
docs/rgpd.md                 → conformité RGPD + étapes manuelles restantes
```

## Scoring (résumé, voir `docs/spec.md` §3)

- **Bloc 1 (Q1–Q6)** — réponses 1–4, normalisées sur 5 :
  `((r − 1) / 3) × 4 + 1`.
- **Bloc 2 (Q7–Q16)** — réponses 1–5 ; questions inversées (Q7, Q9, Q12, Q14)
  recodées `6 − r`.
- Score par axe = moyenne normalisée ramenée sur 100.
- Score global pondéré : **Ventes et Delivery pèsent double**.
- Niveaux : `critique` ≥ 75 · `eleve` ≥ 55 · `modere` ≥ 35 · `sain` < 35.

```bash
npm test   # vérifie la logique de scoring
```

## Sécurité

L'id de session n'apparaît jamais dans l'URL : il reste en state React pendant
le parcours et le résultat transite par `sessionStorage`. La RLS `anon`
n'autorise que `insert` / `update` ; la lecture est réservée au back-office
authentifié (voir la note de la spec §1).

## Confidentialité des clés

- `NEXT_PUBLIC_*` : exposées au navigateur (URL + clé anon Supabase uniquement).
- `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `NOTION_API_KEY` : serveur
  uniquement, jamais préfixées `NEXT_PUBLIC_`.
