# STRATÉGIE MANYCHAT — Audit de Dépendance™ → Closing

Objectif : transformer une audience Instagram en **appels de closing** pour LE
SPRINT™ (et L'Accélération pour les profils « sains »). Tutoiement, voix
Vanessa Soné / Wedding Bosses.

> Recherche à l'appui (voir sources en bas). Chiffre clé : **répondre en < 5 min
> multiplie la conversion par ~9**. La vitesse et le suivi automatique sont le
> cœur du système.

---

## 1. La vue d'ensemble du tunnel

```
Instagram (post / reel / story / DM)
        │  mot-clé « DÉPENDANCE »
        ▼
ManyChat  → DM instantané avec le lien
        │   /audit?src=manychat&mc_id={{user_id}}
        ▼
AUDIT (18 questions) → score + email capturé
        │
        ├── Email J+0 → J+9 (déjà en place) ....... nurture automatique
        ├── Supabase (données) + Notion (CRM) ...... fiche créée, Statut = température
        ▼
CTA « éligibilité » → PRISE DE RENDEZ-VOUS (appel de closing)
        ▼
Appel → vente de la prestation
```

**Idée maîtresse** : l'audit **pré-qualifie** déjà (score, CA, taille d'équipe).
Un score `critique`/`eleve` = lead chaud = on pousse vers l'appel **tout de
suite**. Pas besoin de re-qualifier lourdement dans ManyChat : le score fait le
tri.

---

## 2. Les 3 points d'entrée ManyChat

Configure les trois — chacun capte un moment différent :

| Déclencheur | Où | Réglage ManyChat |
|---|---|---|
| **Commentaire** sous un post/reel | Le post où tu parles de l'audit | *Automation → Instagram → Comments* · mot-clé `DÉPENDANCE` |
| **Réponse à une story** | Story « fais l'audit » avec sticker | *Story reply* · mot-clé ou « n'importe quelle réponse » |
| **DM direct** | Bio / call-to-action | *Keyword* `DÉPENDANCE` |

> Sur Instagram, ManyChat exige un **mot-clé** pour les DM déclenchés par
> commentaire (règle Meta). `DÉPENDANCE` est parfait.

---

## 3. Les messages (copie prête à coller)

### DM 1 — instantané (déclenché par le mot-clé)
Court, humain, **un seul lien** (bonne pratique clé) :

> Hello {{first_name}} 🙌
> Tu veux voir **à quel point ton business dépend de toi** ?
> 18 questions, 2 minutes. À la fin : ton **Indice de Dépendance™** + les
> endroits précis où tout repasse encore par toi.
>
> 👉 C'est ici : `https://[ton-domaine]/audit?src=manychat&mc_id={{user_id}}`
>
> (Réponds-moi « FAIT » quand tu as ton score, je veux voir 👀)

### DM 2 — relance si pas de clic (J+1, condition « n'a pas cliqué »)
> Tu as eu 2 min pour ton audit ? 👀 Ton score t'attend, ça pique un peu (dans
> le bon sens) : `[lien]`

### DM 3 — quand elle revient avec « FAIT » / son score
Bascule vers le closing (voir §4).

> Bravo d'avoir regardé les choses en face 👏 Ton score en dit long.
> Si tu veux, je te montre **comment on sort ton business de ta tête en 30
> jours** — c'est ce qu'on installe dans LE SPRINT™. On en parle 15 min ?
> 👉 Choisis ton créneau : `[lien de prise de rendez-vous]`

---

## 4. Le closing — LA pièce manquante aujourd'hui

⚠️ **Aujourd'hui, l'audit n'a PAS de lien de prise de rendez-vous.** Les boutons
« Voir si mon business est éligible » pointent vers des liens provisoires. C'est
LE maillon à ajouter pour vendre (voir §6).

Deux mécaniques selon la température (le score fait le tri) :

**A. Lead chaud (score critique / élevé)** → **rendez-vous direct**
Bouton d'audit + DM + emails J+6/J+9 pointent vers ton **agenda de closing**
(Calendly / Cal.com / TidyCal). Le moins de friction possible : elle a déjà
« payé » avec ses 18 réponses.

**B. Lead tiède ou gros ticket** → **mini-candidature puis rendez-vous**
Pour filtrer les curieux sur une prestation chère, une « application » avant
l'agenda augmente la qualité des appels :
1. Intérêt (« SPRINT »)
2. 2-3 questions : *depuis quand ton business tourne ? · qu'as-tu déjà essayé ? ·
   c'est quoi l'urgence, pourquoi maintenant ?* (le CA est déjà connu par l'audit)
3. Lien agenda **seulement** si les réponses collent.

> Recommandation : **A par défaut** (l'audit qualifie déjà), **B** si tu es
> submergée d'appels peu qualifiés.

**Vitesse** : quand un lead chaud arrive, une notif + une réponse en < 5 min
change tout (×9). Active les notifications ManyChat, ou un DM automatique
immédiat « je t'ai réservé un créneau, il tient 24 h ⏳ ».

---

## 5. Tags & segmentation dans ManyChat

Pose des tags pour piloter les relances :
- `audit-envoyé` (DM 1 parti)
- `audit-cliqué` (a ouvert le lien) — via bouton *Opened link*
- `audit-terminé` (voir §7, avancé)
- `niveau-critique` / `-eleve` / `-modere` / `-sain` (voir §7)
- `rdv-pris` → sort des relances

Segmente : les `sain` basculent vers **L'Accélération** (pas SPRINT), exactement
comme la séquence email le fait déjà.

---

## 6. À câbler côté code (je m'en occupe)

Pour que le closing existe vraiment :
1. Remplacer les liens provisoires SPRINT™ / L'Accélération par tes **vrais
   liens de prise de rendez-vous** — sur la **page de résultat** et dans les
   **emails J+6 / J+9**. (Fichiers `src/lib/resultats.ts` et
   `src/lib/sequence-emails.ts`.)
2. Idéalement : un **agenda dédié « Appel Sprint »** (15-20 min), pas ton
   agenda perso.

👉 **Il me faut juste ton lien d'agenda** (Calendly / Cal.com / autre) et je
l'intègre partout en 2 minutes.

---

## 7. Niveau avancé (optionnel, plan ManyChat PRO)

ManyChat PRO permet des **External Requests** (POST/GET vers une API, avec des
champs dynamiques `@@champ@@`). Deux usages puissants :

- **Passer l'ID ManyChat à l'audit** : déjà prévu via `?mc_id={{user_id}}` dans
  le lien. On peut le stocker pour relier la fiche Supabase à l'abonné ManyChat.
- **Récupérer le score dans ManyChat** : à la fin de l'audit, notre serveur peut
  « rappeler » ManyChat (API) pour poser le tag `niveau-critique` et déclencher
  le bon DM de closing automatiquement. C'est le niveau « machine à vendre ».

> Ça demande un peu de dev en plus (un webhook côté app). À faire dans un 2ᵉ
> temps, une fois le tunnel de base qui tourne.

---

## 8. Ordre de mise en place (checklist)

1. [ ] Créer l'agenda de closing (Calendly/Cal.com) → me donner le lien
2. [ ] Je câble le lien dans la page de résultat + les emails
3. [ ] ManyChat : les 3 déclencheurs sur `DÉPENDANCE`
4. [ ] ManyChat : DM 1 (lien audit) + DM 2 (relance) + DM 3 (closing)
5. [ ] Tags + règle « rdv-pris sort des relances »
6. [ ] (Plus tard) External Request pour l'automatisation du score → tag → DM

---

### Sources
- Manychat — Lead qualification funnel : https://manychat.com/blog/lead-qualification-funnel/
- Manychat — Influencers Instagram lead magnet : https://manychat.com/blog/influencers-instagram-lead-magnet/
- Manychat — Jenna Kutcher DM funnel (900K$) : https://manychat.com/blog/success-stories/jenna-kutcher/
- Manychat Help — Dev Tools / External request : https://help.manychat.com/hc/en-us/articles/14281285374364-Dev-Tools-External-request
- CreatorFlow — Qualify $10K+ coaching leads via IG DMs : https://creatorflow.so/blog/high-ticket-coaches-qualify-leads-instagram-dms/
- SetSmart — AI DM setter / book calls : https://setsmart.io/blog/ai-dm-setter
