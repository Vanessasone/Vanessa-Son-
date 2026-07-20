-- AUDIT DE DÉPENDANCE™ — installation complète de la base.
-- À coller d'un seul bloc dans le SQL Editor de Supabase (regroupe les
-- migrations 0001 + 0002 + 0003). Idempotent : ré-exécutable sans risque.

-- ─── Table principale (0001) ─────────────────────────────────────────────────
create table if not exists audit_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  completed_at timestamptz,

  prenom text,
  email text,
  instagram_handle text,

  ca_mensuel_range text,   -- '<5k' | '5k-10k' | '10k-20k' | '>20k'
  taille_equipe text,      -- 'seule' | '1-2' | '3-5' | '5+'

  answers jsonb not null default '{}'::jsonb,

  score_ventes int,
  score_delivery int,
  score_admin int,
  score_contenu int,
  score_global int,
  niveau text,             -- 'critique' | 'eleve' | 'modere' | 'sain'

  source text default 'manychat',
  utm_campaign text,
  progression int default 0,
  abandonne boolean default false,

  notion_page_id text,
  email_resultat_envoye boolean default false,
  sprint_pitch_envoye boolean default false
);

create index if not exists idx_audit_email on audit_responses(email);
create index if not exists idx_audit_created on audit_responses(created_at desc);
create index if not exists idx_audit_niveau on audit_responses(niveau);

alter table audit_responses enable row level security;

drop policy if exists "insert_anon" on audit_responses;
create policy "insert_anon" on audit_responses
  for insert to anon with check (true);

drop policy if exists "update_own_session" on audit_responses;
create policy "update_own_session" on audit_responses
  for update to anon using (true) with check (true);

drop policy if exists "select_admin" on audit_responses;
create policy "select_admin" on audit_responses
  for select to authenticated using (true);

-- ─── Conformité RGPD (0002) ──────────────────────────────────────────────────
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

update audit_responses
  set unsubscribe_token = gen_random_uuid()
  where unsubscribe_token is null;

create unique index if not exists idx_unsubscribe_token
  on audit_responses(unsubscribe_token);

create index if not exists idx_desinscrit on audit_responses(desinscrit)
  where desinscrit = false;

-- ─── Suivi de la séquence email (0003) ───────────────────────────────────────
alter table audit_responses
  add column if not exists email_j2_envoye boolean not null default false,
  add column if not exists email_j4_envoye boolean not null default false,
  add column if not exists email_j6_envoye boolean not null default false,
  add column if not exists email_j9_envoye boolean not null default false;

create index if not exists idx_audit_sequence
  on audit_responses(completed_at)
  where completed_at is not null
    and desinscrit = false
    and suppression_demandee = false
    and consentement_donne = true;
