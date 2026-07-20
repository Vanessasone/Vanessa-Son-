// Séquence email — rendu HTML (spec §6). Réutilise le gabarit de email.ts.
import type { Axe, Scores } from './scoring';
import { AXE_LABELS, AXE_DEV, axeLePlusFaible, autonomie } from './resultats';
import { emailDoc, pRow, hRow, btnRow, S, type EmailOpts } from './email';
import { coutHeures, type Step } from './sequence';

const SPRINT_URL = 'https://vanysweddings.com/sprint';
const ACCELERATION_URL = 'https://vanysweddings.com/acceleration';

export interface SequenceInput {
  prenom: string;
  scores: Scores;
}

export interface BuiltEmail {
  subject: string;
  html: string;
}

const bonjour = (prenom: string) => (prenom ? `${prenom},` : 'Hello,');

export function buildSequenceEmail(
  step: Step,
  input: SequenceInput,
  opts: EmailOpts = {},
): BuiltEmail {
  const { prenom, scores } = input;
  const pire = axeLePlusFaible(scores);
  const isSain = scores.niveau === 'sain';

  switch (step) {
    case 'j2':
      return isSain
        ? j2Acceleration(prenom, scores, pire, opts)
        : j2Sprint(prenom, scores, pire, opts);
    case 'j4':
      return j4Sprint(prenom, scores, pire, opts);
    case 'j6':
      return isSain ? j6Acceleration(prenom, opts) : j6Sprint(prenom, opts);
    case 'j9':
      return j9Sprint(prenom, pire, opts);
  }
}

// ─── SPRINT J+2 — « L'axe que tu as évité de regarder » ──────────────────────
function j2Sprint(prenom: string, scores: Scores, pire: Axe, opts: EmailOpts): BuiltEmail {
  const autoAxe = autonomie(scores[pire]);
  const dev = AXE_DEV[pire][scores.niveau].map((p) => pRow(p, S.paraDim)).join('');
  const inner = `
    ${pRow(`${bonjour(prenom)} il y a deux jours, tu as fait l’Audit. Ton Indice : ${scores.global}. Mais un chiffre global, ça arrondit tout. Le vrai sujet est ailleurs.`)}
    ${hRow(`${AXE_LABELS[pire]} — autonome à ${autoAxe} %`)}
    ${dev}
    ${pRow('C’est l’axe où tout repasse encore par toi. Dans deux jours, je te montre ce que ça coûte — pas en principe, en heures.', S.paraDim)}`;
  return { subject: 'L’axe que tu as évité de regarder', html: emailDoc(inner, opts) };
}

// ─── SPRINT J+4 — « Ce que ça coûte, en heures » ─────────────────────────────
function j4Sprint(prenom: string, scores: Scores, pire: Axe, opts: EmailOpts): BuiltEmail {
  const c = coutHeures(pire, scores[pire]);
  const inner = `
    ${pRow(`${bonjour(prenom)} on va mettre un chiffre sur ${AXE_LABELS[pire]}. Pas une métaphore. Un ordre de grandeur.`)}
    ${hRow(`≈ ${c.semaine} h par semaine`)}
    ${pRow(`À ton niveau de dépendance sur cet axe, tu passes environ ${c.semaine} heures par semaine à faire à la main ce qui devrait tourner seul. Des relances, des reprises, des « je le fais moi-même, ça ira plus vite ».`)}
    ${pRow(`Sur un an, ça fait à peu près ${c.an} heures — l’équivalent de ${c.semainesTravail} semaines de travail à temps plein. Passées à faire le boulot d’un système que tu n’as pas encore.`)}
    ${pRow('C’est une estimation, pas une facture. Mais l’ordre de grandeur, lui, ne ment pas : ce temps-là ne revient pas, et il ne produit rien.', S.paraDim)}`;
  return { subject: 'Ce que ça coûte, en heures', html: emailDoc(inner, opts) };
}

// ─── SPRINT J+6 — « 30 jours » (premier CTA commercial) ──────────────────────
function j6Sprint(prenom: string, opts: EmailOpts): BuiltEmail {
  const inner = `
    ${pRow(`${bonjour(prenom)} depuis le début, je te montre le problème. Aujourd’hui, la sortie.`)}
    ${hRow('Ce n’est pas une fatalité. C’est un problème d’installation.')}
    ${pRow('LE SPRINT™, c’est 30 jours pendant lesquels on installe l’infrastructure qui manque à ton business. Pas un accompagnement où tu apprends à le faire. Une installation où on le fait.')}
    ${pRow('Deux entreprises maximum en même temps.', S.paraDim)}
    ${btnRow(SPRINT_URL, 'Voir si mon business est éligible')}`;
  return { subject: '30 jours', html: emailDoc(inner, opts) };
}

// ─── SPRINT J+9 — « Deux places » (rareté réelle) ────────────────────────────
function j9Sprint(prenom: string, pire: Axe, opts: EmailOpts): BuiltEmail {
  const inner = `
    ${pRow(`${bonjour(prenom)} un dernier mot, et je te laisse.`)}
    ${hRow('Deux places. Vraiment deux.')}
    ${pRow('LE SPRINT™, c’est deux entreprises en parallèle. Pas par posture marketing — parce qu’une installation, ça se fait les mains dedans, et je ne peux pas être les mains dedans de dix business à la fois.')}
    ${pRow(`Si ${AXE_LABELS[pire]} t’a parlé — et je crois que oui — c’est le moment de regarder si c’est pour toi.`)}
    ${btnRow(SPRINT_URL, 'Voir si mon business est éligible')}`;
  return { subject: 'Deux places', html: emailDoc(inner, opts) };
}

// ─── ACCÉLÉRATION J+2 (sain) — « Ton plafond n'est pas là où tu crois » ───────
function j2Acceleration(prenom: string, scores: Scores, pire: Axe, opts: EmailOpts): BuiltEmail {
  const autoAxe = autonomie(scores[pire]);
  const dev = AXE_DEV[pire].sain.map((p) => pRow(p, S.paraDim)).join('');
  const inner = `
    ${pRow(`${bonjour(prenom)} ton Indice : ${scores.global}. Autonomie ${autonomie(scores.global)} %. Ton business tient sans toi — la plupart des gens n’en sont pas là.`)}
    ${hRow(`Ton point le plus bas reste haut : ${AXE_LABELS[pire]}, autonome à ${autoAxe} %`)}
    ${dev}
    ${pRow('Ton plafond n’est pas structurel. Il est stratégique. Dans quelques jours, je te montre où il se situe vraiment.', S.paraDim)}`;
  return { subject: 'Ton plafond n’est pas là où tu crois', html: emailDoc(inner, opts) };
}

// ─── ACCÉLÉRATION J+6 (sain) — « L'Accélération » ────────────────────────────
function j6Acceleration(prenom: string, opts: EmailOpts): BuiltEmail {
  const inner = `
    ${pRow(`${bonjour(prenom)} ton problème n’est pas structurel. Inutile de te vendre une structure.`)}
    ${hRow('L’Accélération')}
    ${pRow('Ce que ton score indique, c’est que tu as construit une base solide et que tu es maintenant limitée par autre chose : ton positionnement, tes prix, ou la façon dont tu vends.')}
    ${pRow('C’est exactement ce qu’on travaille dans L’Accélération.')}
    ${btnRow(ACCELERATION_URL, 'En savoir plus sur L’Accélération')}`;
  return { subject: 'L’Accélération', html: emailDoc(inner, opts) };
}
