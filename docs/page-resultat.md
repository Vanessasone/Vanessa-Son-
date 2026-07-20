# PAGE DE RÉSULTAT — copywriting

Descente du Symptôme · **tutoiement partout**. Le copywriting complet vit dans
`src/lib/resultats.ts` (source de vérité). Ce document résume la logique
d'affichage et les règles à ne pas casser.

## Trois couches d'affichage (§0)

```js
const dependance = score_global;              // 0-100 (l'Indice affiché)
const autonomie  = 100 - score_global;        // 0-100
const jours      = Math.round(autonomie * 30 / 100);
const afficherJours = ['critique', 'eleve'].includes(niveau);
```

Hiérarchie du bloc de tête (`ResultView` → `.indice-block`) :

```
        87                    ← Indice de Dépendance™ (Playfair ~180px, crème)
   Indice de Dépendance™      ← Montserrat 300, taupe, lettrage espacé
   Autonomie réelle : 13 %    ← Montserrat 400, or
   Ton business tient environ
   4 jours sans toi.          ← Montserrat 300, sable — MASQUÉ si modéré/sain
```

## Structure de la page

1. **Indice + autonomie + jours** (couche 0)
2. **Verdict** — titre + paragraphes (`NIVEAUX[niveau]`)
3. **Les 4 axes** — lecture rapide en autonomie ; saturation = alarme
4. **Développement de l'axe le plus faible** (`AXE_DEV[axe][niveau]`)
5. **Projection à 12 mois** (`PROJECTION[niveau]`), isolée
6. **CTA unique** — `ctaPour(niveau)` : SPRINT™ (critique/élevé/modéré) ou
   L'Accélération (sain)

## Règles d'implémentation (§6)

- **Le pronom.** Tutoiement partout, ici et dans la séquence email. Ne jamais
  réutiliser ces textes pour Vany's Weddings ou Maison Romance (qui vouvoient).
- **Les jours.** `afficherJours` reste `false` en modéré et sain : au-delà de
  ~55 % d'autonomie l'extrapolation devient contestable et une seule
  affirmation contestable décrédibilise toute la page.
- **Un seul axe développé** — celui à la dépendance la plus forte. En cas
  d'égalité, priorité : **Delivery > Ventes > Admin > Contenu**
  (`axeLePlusFaible`). Afficher les quatre développements diluerait le choc.
- **Cohérence d'inversion.** `autonomie_axe = 100 - score_axe`. Toute la page
  parle en autonomie ; la couleur, elle, reste calculée sur la dépendance
  (`couleurDependance`) pour que l'axe le plus faible reste le plus saturé.
- **Ce que la page ne fait pas.** Pas de compte à rebours, pas de « 2 places
  restantes » dynamique, pas de pop-up de sortie. La rareté (2 sprints en
  parallèle) se dit une fois, sobrement.

## Micro-copie (§5)

| Emplacement | Texte |
|---|---|
| Barre de progression | `Question {n} sur 18` |
| Écran capture — titre | `Ton score est prêt.` |
| Écran capture — sous-titre | `Dis-moi où te l'envoyer — tu le verras aussi tout de suite à l'écran.` |
| Bouton | `Voir mon score` |
| État de calcul | `Calcul en cours…` |
| Erreur | `L'envoi n'a pas abouti. Vérifie ton adresse et réessaie.` |
| Objet email J+0 | `Ton Indice de Dépendance : {score}/100` |

## Note d'implémentation — les 4 barres

La spec §4 originale exige « les 4 barres d'axe » ; ce document de copy ne les
re-mentionne pas mais insiste sur « ne pas diluer » (un seul *développement*).
Les barres sont donc conservées comme **lecture rapide** (une ligne par axe,
pas un paragraphe) en cadrage autonomie — elles orientent sans diluer. À
retirer en une ligne dans `ResultView` si un affichage encore plus dépouillé
est souhaité.
