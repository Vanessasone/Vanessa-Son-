// Email transactionnel J+0 — « Ton Indice de Dépendance : [X]/100 » (spec §5/§6).
// Résultat détaillé, les 4 axes, aucun pitch.
import type { Axe, Scores } from './scoring';
import {
  NIVEAUX,
  AXE_LABELS,
  AXE_DEV,
  PROJECTION,
  couleurDependance,
  axeLePlusFaible,
  autonomie,
  joursDeTenue,
  afficherJours,
} from './resultats';
import { LEGAL, siteUrl } from './legal';

const ORDRE: Axe[] = ['ventes', 'delivery', 'admin', 'contenu'];

export function sujetResultat(scores: Scores): string {
  return `Ton Indice de Dépendance : ${scores.global}/100`;
}

export interface EmailOpts {
  // Jeton de désinscription (colonne unsubscribe_token). Sans lui, le pied de
  // page renvoie seulement vers la politique de confidentialité.
  unsubscribeToken?: string | null;
}

export function htmlResultat(
  prenom: string,
  scores: Scores,
  opts: EmailOpts = {},
): string {
  const niveau = NIVEAUX[scores.niveau];
  const pire = axeLePlusFaible(scores);
  const auto = autonomie(scores.global);
  const jours = joursDeTenue(scores.global);

  const barres = ORDRE.map((axe) => {
    const c = couleurDependance(scores[axe]);
    const autoAxe = autonomie(scores[axe]);
    return `
      <tr>
        <td style="padding:6px 0;font:14px/1.4 Arial,sans-serif;color:#f7f4ef;width:110px">${AXE_LABELS[axe]}</td>
        <td style="padding:6px 0;width:100%">
          <div style="background:rgba(247,244,239,0.14);border-radius:3px;height:8px;width:100%">
            <div style="background:${c};height:8px;border-radius:3px;width:${autoAxe}%"></div>
          </div>
        </td>
        <td style="padding:6px 0 6px 12px;font:13px/1.4 Arial,sans-serif;color:${c};text-align:right;white-space:nowrap">${autoAxe}&nbsp;%</td>
      </tr>`;
  }).join('');

  const devAxe = AXE_DEV[pire][scores.niveau]
    .map(
      (p) =>
        `<p style="font:14px/1.7 Arial,sans-serif;color:rgba(247,244,239,0.7);margin:0 0 12px">${escapeHtml(p)}</p>`,
    )
    .join('');

  const verdictParas = niveau.paragraphes
    .map(
      (p) =>
        `<p style="font:15px/1.7 Arial,sans-serif;color:rgba(247,244,239,0.82);margin:0 0 14px">${escapeHtml(p)}</p>`,
    )
    .join('');

  const joursLigne = afficherJours(scores.niveau)
    ? `<tr><td style="font:14px/1.5 Arial,sans-serif;color:#d6c5b0;padding:0 0 4px">Ton business tient environ ${jours} jour${jours > 1 ? 's' : ''} sans toi.</td></tr>`
    : '';

  // Pied de page RGPD : désinscription + politique + identité de l'expéditeur.
  const base = siteUrl();
  const politiqueUrl = `${base}/politique-confidentialite`;
  const desinscrireLien = opts.unsubscribeToken
    ? `<a href="${base}/desinscription?token=${opts.unsubscribeToken}" style="color:rgba(247,244,239,0.5)">Me désinscrire</a> · `
    : '';
  const pied = `
    <tr><td style="border-top:1px solid rgba(247,244,239,0.12);padding:28px 0 0;margin-top:24px">
      <p style="font:12px/1.7 Arial,sans-serif;color:rgba(247,244,239,0.4);margin:0 0 8px">
        Tu reçois cet email parce que tu as fait l’Audit de Dépendance™.
      </p>
      <p style="font:12px/1.7 Arial,sans-serif;color:rgba(247,244,239,0.4);margin:0 0 8px">
        ${desinscrireLien}<a href="${politiqueUrl}" style="color:rgba(247,244,239,0.5)">Politique de confidentialité</a>
      </p>
      <p style="font:12px/1.7 Arial,sans-serif;color:rgba(247,244,239,0.4);margin:0">
        ${escapeHtml(LEGAL.responsable)} — SIRET ${escapeHtml(LEGAL.siret)}
      </p>
    </td></tr>`;

  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:#121212;padding:0">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#121212">
    <tr><td align="center" style="padding:40px 20px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
        <tr><td style="font:11px/1 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#bea268;padding-bottom:24px">
          Audit de Dépendance™
        </td></tr>
        <tr><td style="font:72px/1 Georgia,serif;color:#f7f4ef;padding:8px 0 4px">
          ${scores.global}
        </td></tr>
        <tr><td style="font:11px/1 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#908070;padding-bottom:18px">
          Indice de Dépendance™
        </td></tr>
        <tr><td style="font:16px/1.5 Arial,sans-serif;color:#bea268;padding:0 0 4px">Autonomie réelle : ${auto}&nbsp;%</td></tr>
        ${joursLigne}
        <tr><td style="font:22px/1.3 Georgia,serif;color:#f7f4ef;padding:24px 0 12px">
          ${prenom ? `${escapeHtml(prenom)}, ` : ''}${escapeHtml(niveau.titre)}
        </td></tr>
        <tr><td style="padding:0 0 20px">${verdictParas}</td></tr>
        <tr><td style="padding:8px 0 24px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${barres}</table>
        </td></tr>
        <tr><td style="font:16px/1.3 Georgia,serif;color:#f7f4ef;padding:8px 0 12px">
          ${AXE_LABELS[pire]} — autonome à ${autonomie(scores[pire])}&nbsp;%
        </td></tr>
        <tr><td style="padding:0 0 12px">${devAxe}</td></tr>
        <tr><td style="border-left:2px solid #bea268;padding:4px 0 4px 16px;font:15px/1.7 Georgia,serif;color:#f7f4ef">
          ${escapeHtml(PROJECTION[scores.niveau])}
        </td></tr>
        <tr><td style="font:12px/1.6 Arial,sans-serif;color:rgba(247,244,239,0.4);padding:36px 0 0">
          Tu recevras dans les prochains jours le détail de chaque axe.
        </td></tr>
        ${pied}
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
