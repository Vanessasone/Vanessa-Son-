-- AUDIT DE DÉPENDANCE™ — colonnes de conformité RGPD (consentement, preuve,
-- désinscription, droit à l'effacement). Voir docs/rgpd.md.

alter table audit_responses
  add column if not exists consentement_donne boolean not null default false,
  add column if not exists consentement_date timestamptz,
  add column if not exists consentement_texte text,
  add column if not exists consentement_version text,
  add column if not exists desinscrit boolean not null default false,
  add column if not exists desinscrit_date timestamptz,
  add column if not exists suppression_demandee boolean not null default false,
  add column if not exists suppression_date timestamptz,
  add column if not exists unsubscribe_token uuid default gen_random_uuid();

-- Rattrape les lignes existantes qui n'auraient pas de jeton.
update audit_responses
  set unsubscribe_token = gen_random_uuid()
  where unsubscribe_token is null;

create unique index if not exists idx_unsubscribe_token
  on audit_responses(unsubscribe_token);

create index if not exists idx_desinscrit on audit_responses(desinscrit)
  where desinscrit = false;
