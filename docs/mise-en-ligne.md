# MISE EN LIGNE — pas à pas

Guide non technique. Compte ~1 h la première fois. L'ordre compte (surtout le
point 1 : la région Supabase ne se change pas après coup).

Tu auras besoin de 4 comptes gratuits : **Supabase**, **Resend**, **Notion**,
**Vercel**. À la fin tu colleras 9 « clés » dans Vercel.

---

## 1. Supabase (base de données)

1. Crée un compte sur supabase.com → **New project**.
2. **Region : choisis une région Union européenne** (ex. *Frankfurt* / *Paris*).
   ⚠️ Impossible à changer ensuite sans tout recréer.
3. Note le mot de passe de la base (pas utilisé ici mais à garder).
4. Une fois le projet créé : menu **SQL Editor** → **New query** → colle tout le
   contenu du fichier `supabase/setup.sql` → **Run**. La table est créée.
5. Menu **Project Settings → API**. Copie ces 3 valeurs :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - clé **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - clé **service_role** (secrète !) → `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Resend (emails)

1. Crée un compte sur resend.com.
2. **Domains → Add domain** : ajoute le domaine depuis lequel tu enverras
   (ex. `vanessasone.com`). Resend te donne des enregistrements DNS (SPF/DKIM)
   à ajouter chez ton registrar (OVH, Gandi…). Tant que le domaine n'est pas
   « Verified », les emails ne partent pas.
3. **API Keys → Create** → copie la clé → `RESEND_API_KEY`.
4. Choisis l'adresse d'expédition → `RESEND_FROM`, au format :
   `Vanessa Soné <audit@vanessasone.com>` (le domaine doit être celui vérifié).

> Sans domaine vérifié, tu peux tester avec l'adresse de bac à sable de Resend,
> mais pour la vraie diffusion il faut un domaine à toi.

---

## 3. Notion (CRM)

Le CRM existe déjà : **🎯 CRM Prospects — Toutes Marques**. Le code a été adapté
pour écrire dans ses colonnes réelles (Nom, Email / Instagram, Marque, Source,
Statut, Offre visée, Notes, Dernier contact — les scores vont dans *Notes*).
Rien à créer, il suffit d'autoriser l'app à écrire dedans.

1. Va sur notion.so/my-integrations → **New integration** (type *Internal*) →
   copie le secret (`ntn_...` ou `secret_...`) → `NOTION_API_KEY`.
2. Ouvre le CRM **🎯 CRM Prospects — Toutes Marques** → bouton **⋯** (en haut à
   droite) → **Connections** → **Connect to** → choisis ton intégration.
   (C'est ce qui autorise l'app à créer des fiches.)
3. `NOTION_CRM_DATABASE_ID` = **`ebdcb5bcae2e4508b8f482eb0917871e`**
   (déjà identifié — c'est l'ID de ce CRM).

Mapping appliqué à chaque lead d'audit :

| Colonne CRM | Valeur écrite |
|---|---|
| Nom | prénom |
| Email / Instagram | email |
| Marque | `vanessasone.com` |
| Source | `Audit Dépendance` (option créée automatiquement) |
| Statut | critique/élevé → Chaud · modéré → Tiede · sain → Froid |
| Offre visée | `L Acceleration` si score sain |
| Notes | Indice, autonomie, les 4 scores, axe faible, CA, équipe |
| Dernier contact | date de l'audit |

---

## 4. Compléter le code (je peux le faire pour toi)

Avant le déploiement, deux fichiers à finaliser — **donne-moi les infos et je
m'en occupe**, ou édite-les toi-même :

- `src/lib/legal.ts` : SIRET (à confirmer), adresse du siège, email de contact
  RGPD.
- Les vrais liens **LE SPRINT™** et **L'Accélération** (aujourd'hui des
  placeholders `vanysweddings.com/...`) dans `src/lib/resultats.ts` et
  `src/lib/sequence-emails.ts`.

---

## 5. Vercel (hébergement)

1. Crée un compte sur vercel.com et connecte-le à GitHub.
2. **Add New → Project** → importe le dépôt `Vanessa-Son-`.
3. Avant de déployer, ouvre **Environment Variables** et ajoute les 9 clés :

   | Clé | D'où elle vient |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase (1) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase (1) |
   | `SUPABASE_SERVICE_ROLE_KEY` | Supabase (1) |
   | `RESEND_API_KEY` | Resend (2) |
   | `RESEND_FROM` | Resend (2) |
   | `NOTION_API_KEY` | Notion (3) |
   | `NOTION_CRM_DATABASE_ID` | Notion (3) |
   | `CRON_SECRET` | invente une longue chaîne aléatoire |
   | `NEXT_PUBLIC_SITE_URL` | l'URL finale (voir ci-dessous) |

4. **Deploy**. Vercel te donne une URL (ex. `audit-xxxx.vercel.app`).
5. Renseigne `NEXT_PUBLIC_SITE_URL` avec cette URL (ou ton domaine final si tu
   en branches un), puis **redeploy** une fois pour qu'elle soit prise en compte
   (les liens de désinscription des emails en dépendent).

> Le cron de la séquence email (`vercel.json`) s'active tout seul sur Vercel :
> il tourne chaque jour à 9 h UTC. Rien à configurer d'autre.

---

## 6. Vérifier que tout marche

1. Ouvre `TON_URL/audit` → fais l'audit en entier → tu dois voir ton score.
2. Vérifie que la ligne apparaît dans Supabase (**Table Editor → audit_responses**)
   et la fiche dans Notion.
3. Vérifie que l'email de résultat arrive (regarde aussi les spams).
4. Clique **Me désinscrire** dans l'email → la page de confirmation s'affiche.
5. Test à blanc du cron (sans rien envoyer) :
   `TON_URL/api/cron/sequence?dry=1&secret=TON_CRON_SECRET`
   → tu vois ce qui *serait* envoyé.
6. Relis les emails de la séquence : `TON_URL/apercu-emails`.

---

## 7. ManyChat (dernière étape)

Dans ton flow ManyChat, sur le mot-clé **DÉPENDANCE**, envoie un bouton/lien
vers `TON_URL/audit?src=manychat`. C'est tout.

---

## Rappel — à ne pas oublier avant la vraie diffusion

- Région Supabase = UE ✅ (point 1)
- Domaine Resend vérifié ✅ (point 2)
- Politique de confidentialité + mentions légales **relues par un pro**
  (elles sont en brouillon : `/politique-confidentialite`, `/mentions-legales`)
- `src/lib/legal.ts` complété (SIRET, adresse, contact)
