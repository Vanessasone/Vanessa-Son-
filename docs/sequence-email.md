# SÉQUENCE EMAIL POST-AUDIT (spec §6)

Tutoiement, Descente du Symptôme. Deux tracks selon le niveau.

## Calendrier

| Jour | Track SPRINT (critique/eleve/modere) | Track ACCÉLÉRATION (sain) |
|---|---|---|
| J+0 | Ton Indice de Dépendance : {score}/100 — résultat, aucun pitch | idem |
| J+2 | L'axe que tu as évité de regarder | Ton plafond n'est pas là où tu crois |
| J+4 | Ce que ça coûte, en heures | — |
| J+6 | 30 jours — 1ᵉʳ CTA (LE SPRINT™) | L'Accélération |
| J+9 | Deux places — rareté réelle | — |

Segmentation : les scores `sain` (0–34) **sortent** de la séquence SPRINT et
reçoivent le track L'Accélération (J+2 + J+6 seulement).

> J+0 part immédiatement à la fin du parcours (`/api/resultat`).
> J+2 → J+9 sont envoyés par le cron.

## Où c'est dans le code

| | |
|---|---|
| Logique pure (délais, tracks, chiffrage heures) | `src/lib/sequence.ts` |
| Rendu HTML des emails | `src/lib/sequence-emails.ts` |
| Gabarit partagé (en-tête + pied RGPD) | `src/lib/email.ts` |
| Cron d'envoi | `src/app/api/cron/sequence/route.ts` |
| Planification | `vercel.json` (tous les jours 09:00 UTC) |
| Aperçu de tous les emails | `/apercu-emails` (noindex, données factices) |
| Suivi d'envoi (1 booléen/étape) | migration `0003_sequence.sql` |

## Chiffrage des heures (J+4)

Estimation prudente, présentée comme un ordre de grandeur, pas une facture.
Heures/semaine perdues à pleine dépendance, par axe :
Delivery 10 · Ventes 7 · Admin 5 · Contenu 3, proratisées par le score de
dépendance de l'axe le plus faible.

## Fonctionnement du cron

`GET /api/cron/sequence` (protégé par `CRON_SECRET`) :

1. Sélectionne les lignes éligibles — filtre RGPD : `completed_at` non nul,
   `consentement_donne = true`, `desinscrit = false`,
   `suppression_demandee = false`, `email` non nul.
2. Pour chaque prospect, calcule l'âge depuis `completed_at` et envoie **la
   première étape due non encore envoyée** de son track (au plus un email par
   prospect et par exécution — le suivant part le lendemain).
3. Marque le booléen `email_jX_envoye` pour ne jamais renvoyer la même étape.

Test à blanc : `GET /api/cron/sequence?dry=1&secret=…` renvoie ce qui *serait*
envoyé sans rien envoyer.

## ⚠️ Étapes manuelles restantes

1. **Resend** : vérifier le domaine d'envoi et renseigner `RESEND_API_KEY` +
   `RESEND_FROM`.
2. **`CRON_SECRET`** : définir une valeur longue et aléatoire (Vercel envoie
   automatiquement `Authorization: Bearer $CRON_SECRET` au cron).
3. **Planificateur** : `vercel.json` couvre Vercel. Sur un autre hébergeur,
   appeler `/api/cron/sequence` une fois par jour (cron système, GitHub
   Actions, etc.).
4. **Vrais liens** SPRINT™ / L'Accélération (placeholders `vanysweddings.com`
   dans `sequence-emails.ts`).
5. **Relire les copies** via `/apercu-emails` — le track L'Accélération est un
   premier jet à affiner.
