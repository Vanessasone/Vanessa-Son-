# CONFORMITÉ RGPD — Audit de Dépendance™

> **Ce document n'est pas un avis juridique.** Il décrit l'implémentation
> technique. La politique de confidentialité et les mentions légales doivent
> être **validées par un professionnel du droit** (ou construites à partir d'un
> modèle CNIL — cnil.fr) avant mise en ligne.

## Ce qui est implémenté

| Élément | Où |
|---|---|
| Colonnes de consentement + preuve + désinscription | `supabase/migrations/0002_rgpd.sql` |
| Texte de consentement versionné | `src/lib/consentement.ts` |
| Case de consentement (jamais pré-cochée, bouton bloqué) | `src/components/CaptureForm.tsx` |
| Enregistrement de la preuve (texte + version + date) | `src/lib/persistence.ts` |
| Désinscription en un clic | `src/app/desinscription/page.tsx` |
| Droit à l'effacement (anonymisation + archivage Notion) | `src/app/supprimer-mes-donnees/page.tsx` |
| Pied de page email (désinscription + politique + SIRET) | `src/lib/email.ts` |
| Politique de confidentialité (brouillon) | `src/app/politique-confidentialite/page.tsx` |
| Mentions légales (brouillon) | `src/app/mentions-legales/page.tsx` |
| Coordonnées de l'entité (config unique) | `src/lib/legal.ts` |

## Principes retenus

- **Consentement = acte positif.** Case jamais pré-cochée. Bouton « Voir mon
  score » désactivé tant qu'elle n'est pas cochée ; un rappel s'affiche quand
  le formulaire est rempli mais la case décochée.
- **Une seule case** couvrant résultat *et* marketing — la séquence J+2 → J+9
  est du marketing, la phrase l'annonce explicitement.
- **Preuve du consentement.** On stocke le **texte intégral** affiché
  (`consentement_texte`) et sa **version** (`consentement_version`), pas
  seulement le booléen. Incrémenter `CONSENTEMENT.version` à chaque
  modification de la formulation.
- **Désinscription sans friction** : un clic, pas de connexion, pas de
  formulaire. Jeton unique `unsubscribe_token` (jamais l'email dans l'URL).
- **Effacement** par anonymisation : les scores restent pour les statistiques
  agrégées, toute identification disparaît — base **et** CRM Notion.
- **Filtre d'envoi** pour la future séquence email :

  ```sql
  select * from audit_responses
  where desinscrit = false
    and suppression_demandee = false
    and consentement_donne = true
    and email is not null;
  ```

## ⚠️ Étapes manuelles restantes (avant mise en ligne)

1. **Région Supabase = UE** — à choisir **à la création du projet**, non
   modifiable ensuite sans migration. Supabase et Resend sont des sociétés
   américaines.
2. **Vérifier / compléter `src/lib/legal.ts`** : SIRET (confirmer qu'il
   correspond à l'entité derrière vanessasone.com), adresse du siège, adresse
   de contact RGPD.
3. **Faire valider** la politique de confidentialité et les mentions légales
   (elles sont en brouillon, avec bannière d'avertissement).
4. Appliquer la migration `0002_rgpd.sql`.
5. Vérifier que le filtre d'exclusion ci-dessus s'applique à toute la séquence
   email quand elle sera construite.

Rien ne part vers ManyChat tant que ces points ne sont pas faits.
