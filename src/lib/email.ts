// Email transactionnel J+0 — « Ton score : [X]/100 » (spec §6).
// Résultat détaillé, les 4 axes, aucun pitch.
import type { Axe, Scores } from './scoring';
import {
  NIVEAUX,
  AXE_LABELS,
  AXE_COUT,
  PROJECTION,
  couleurScore,
  axeLePlusRouge,
} from './resultats';

const ORDRE: Axe[] = ['ventes', 'delivery', 'admin', 'contenu'];

export function sujetResultat(scores: Scores): string {
  return `Ton score : ${scores.global}/100`;
}

export function htmlResultat(prenom: string, scores: Scores): string {
  const niveau = NIVEAUX[scores.niveau];
  const pire = axeLePlusRouge(scores);

  const barres = ORDRE.map((axe) => {
    const c = couleurScore(scores[axe]);
    return `
      <tr>
        <td style="padding:6px 0;font:14px/1.4 Arial,sans-serif;color:#f7f4ef;width:110px">${AXE_LABELS[axe]}</td>
        <td style="padding:6px 0;width:100%">
          <div style="background:rgba(247,244,239,0.14);border-radius:3px;height:8px;width:100%">
            <div style="background:${c};height:8px;border-radius:3px;width:${scores[axe]}%"></div>
          </div>
        </td>
        <td style="padding:6px 0 6px 12px;font:14px/1.4 Arial,sans-serif;color:${c};text-align:right">${scores[axe]}</td>
      </tr>`;
  }).join('');

  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;background:#121212;padding:0">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#121212">
    <tr><td align="center" style="padding:40px 20px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px">
        <tr><td style="font:11px/1 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#bea268;padding-bottom:24px">
          Audit de Dépendance™
        </td></tr>
        <tr><td style="font:22px/1.3 Georgia,serif;color:#f7f4ef;padding-bottom:8px">
          ${prenom ? `${escapeHtml(prenom)}, voici ton score.` : 'Voici ton score.'}
        </td></tr>
        <tr><td style="font:72px/1 Georgia,serif;color:${couleurScore(scores.global)};padding:8px 0">
          ${scores.global}<span style="font-size:22px;color:rgba(247,244,239,0.55)"> / 100</span>
        </td></tr>
        <tr><td style="font:18px/1.5 Georgia,serif;color:#f7f4ef;padding:8px 0 28px">
          ${escapeHtml(niveau.verdict)}
        </td></tr>
        <tr><td style="padding:8px 0 28px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${barres}</table>
        </td></tr>
        <tr><td style="font:16px/1.3 Georgia,serif;color:#f7f4ef;padding:8px 0">
          Là où ça te coûte le plus : ${AXE_LABELS[pire]}
        </td></tr>
        <tr><td style="font:14px/1.7 Arial,sans-serif;color:rgba(247,244,239,0.7);padding:4px 0 24px">
          ${escapeHtml(AXE_COUT[pire])}
        </td></tr>
        <tr><td style="border-left:2px solid #bea268;padding:4px 0 4px 16px;font:14px/1.7 Arial,sans-serif;color:rgba(247,244,239,0.7)">
          ${escapeHtml(PROJECTION[scores.niveau])}
        </td></tr>
        <tr><td style="font:12px/1.6 Arial,sans-serif;color:rgba(247,244,239,0.4);padding:36px 0 0">
          Tu recevras dans les prochains jours le détail de chaque axe.
        </td></tr>
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
