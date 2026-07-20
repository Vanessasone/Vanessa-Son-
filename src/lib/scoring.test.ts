// Tests de la logique de scoring (spec §3).
// Exécuter : npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normaliser,
  calculerScores,
  auditComplet,
  type Answers,
} from './scoring.ts';

test('normalisation Bloc 1 : 1→1, 4→5', () => {
  assert.equal(normaliser('q1', 1), 1);
  assert.equal(normaliser('q1', 4), 5);
  assert.equal(normaliser('q1', 2), 1 + (1 / 3) * 4); // ≈ 2.333
});

test('normalisation questions inversées : 6 − réponse', () => {
  assert.equal(normaliser('q7', 5), 1);
  assert.equal(normaliser('q7', 1), 5);
  assert.equal(normaliser('q14', 4), 2);
});

test('normalisation échelle non inversée : identité', () => {
  assert.equal(normaliser('q8', 3), 3);
  assert.equal(normaliser('q11', 5), 5);
});

// Réponses « dépendance minimale » : scénarios=1, échelle basse, inversées=5.
const MINIMAL: Answers = {
  q1: 1, q2: 1, q3: 1, q4: 1, q5: 1, q6: 1,
  q7: 5, q8: 1, q9: 5, q10: 1, q11: 1, q12: 5,
  q13: 1, q14: 5, q15: 1, q16: 1,
};

// Réponses « dépendance maximale » : scénarios=4, échelle haute, inversées=1.
const MAXIMAL: Answers = {
  q1: 4, q2: 4, q3: 4, q4: 4, q5: 4, q6: 4,
  q7: 1, q8: 5, q9: 1, q10: 5, q11: 5, q12: 1,
  q13: 5, q14: 1, q15: 5, q16: 5,
};

test('dépendance minimale → tous les axes à 20, niveau sain', () => {
  const s = calculerScores(MINIMAL);
  assert.equal(s.ventes, 20);
  assert.equal(s.delivery, 20);
  assert.equal(s.admin, 20);
  assert.equal(s.contenu, 20);
  assert.equal(s.global, 20);
  assert.equal(s.niveau, 'sain');
});

test('dépendance maximale → tous les axes à 100, niveau critique', () => {
  const s = calculerScores(MAXIMAL);
  assert.equal(s.ventes, 100);
  assert.equal(s.delivery, 100);
  assert.equal(s.admin, 100);
  assert.equal(s.contenu, 100);
  assert.equal(s.global, 100);
  assert.equal(s.niveau, 'critique');
});

test('global pondéré : Ventes et Delivery pèsent double', () => {
  // ventes/delivery hauts, admin/contenu bas.
  const a: Answers = {
    ...MINIMAL,
    // ventes max : q2=4(→5), q6=4(→5), q7=1(→5), q8=5, q16=5
    q2: 4, q6: 4, q7: 1, q8: 5, q16: 5,
    // delivery max : q1=4(→5), q4=4(→5), q9=1(→5), q10=5, q15=5
    q1: 4, q4: 4, q9: 1, q10: 5, q15: 5,
  };
  const s = calculerScores(a);
  assert.equal(s.ventes, 100);
  assert.equal(s.delivery, 100);
  assert.equal(s.admin, 20);
  assert.equal(s.contenu, 20);
  // (100*2 + 100*2 + 20 + 20) / 6 = 440/6 = 73.33 → 73
  assert.equal(s.global, 73);
  assert.equal(s.niveau, 'eleve');
});

test('seuils de niveau', () => {
  // Jeu « intermédiaire » : scénarios=2 (→2.333), échelle=2, inversées=4 (→2).
  // Chaque axe tombe autour de 42-43 → global 43, niveau modéré.
  const mod: Answers = {
    q1: 2, q2: 2, q3: 2, q4: 2, q5: 2, q6: 2,
    q7: 4, q8: 2, q9: 4, q10: 2, q11: 2, q12: 4,
    q13: 2, q14: 4, q15: 2, q16: 2,
  };
  const s = calculerScores(mod);
  assert.ok(s.global >= 35 && s.global < 55, `global=${s.global}`);
  assert.equal(s.niveau, 'modere');
});

test('auditComplet détecte les réponses manquantes', () => {
  assert.equal(auditComplet(MINIMAL), true);
  const partiel = { ...MINIMAL };
  delete (partiel as Answers).q10;
  assert.equal(auditComplet(partiel), false);
});
