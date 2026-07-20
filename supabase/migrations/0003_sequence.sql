-- AUDIT DE DÉPENDANCE™ — suivi d'envoi de la séquence email (spec §6).
-- Un booléen par étape, pour que le cron n'envoie jamais deux fois la même.

alter table audit_responses
  add column if not exists email_j2_envoye boolean not null default false,
  add column if not exists email_j4_envoye boolean not null default false,
  add column if not exists email_j6_envoye boolean not null default false,
  add column if not exists email_j9_envoye boolean not null default false;

-- Accélère la sélection des lignes éligibles à la séquence.
create index if not exists idx_audit_sequence
  on audit_responses(completed_at)
  where completed_at is not null
    and desinscrit = false
    and suppression_demandee = false
    and consentement_donne = true;
