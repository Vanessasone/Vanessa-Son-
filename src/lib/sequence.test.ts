// Tests de la logique de séquence (spec §6). Exécuter : npm test
// Le rendu HTML des emails (sequence-emails.ts) est vérifié via /apercu-emails.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  STEP_DAYS,
  stepsPourNiveau,
  flagColumn,
  coutHeures,
} from './sequence.ts';

test('délais des étapes', () => {
  assert.deepEqual(STEP_DAYS, { j2: 2, j4: 4, j6: 6, j9: 9 });
});

test('segmentation : sain sort de la séquence SPRINT', () => {
  assert.deepEqual(stepsPourNiveau('critique'), ['j2', 'j4', 'j6', 'j9']);
  assert.deepEqual(stepsPourNiveau('eleve'), ['j2', 'j4', 'j6', 'j9']);
  assert.deepEqual(stepsPourNiveau('modere'), ['j2', 'j4', 'j6', 'j9']);
  assert.deepEqual(stepsPourNiveau('sain'), ['j2', 'j6']);
});

test('nom de colonne de suivi', () => {
  assert.equal(flagColumn('j2'), 'email_j2_envoye');
  assert.equal(flagColumn('j9'), 'email_j9_envoye');
});

test('chiffrage des heures — delivery à 88', () => {
  const c = coutHeures('delivery', 88);
  assert.equal(c.semaine, 9); // round(10 * 88 / 100)
  assert.equal(c.an, 468); // 9 * 52
  assert.equal(c.semainesTravail, 13); // round(468 / 35)
});

test('chiffrage des heures — contenu à 0 = 0', () => {
  const c = coutHeures('contenu', 0);
  assert.equal(c.semaine, 0);
  assert.equal(c.an, 0);
  assert.equal(c.semainesTravail, 0);
});
