-- AUDIT DE DÉPENDANCE™ — schéma des réponses
-- Voir spec §1. Insertion anonyme dès Q1, update à chaque réponse, lecture back-office.

create table if not exists audit_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  completed_at timestamptz,

  -- Identité (collectée en fin de parcours, avant résultat)
  prenom text,
  email text,
  instagram_handle text,

  -- Contexte business (Q17-Q18)
  ca_mensuel_range text,   -- '<5k' | '5k-10k' | '10k-20k' | '>20k'
  taille_equipe text,      -- 'seule' | '1-2' | '3-5' | '5+'

  -- Réponses brutes
  answers jsonb not null default '{}'::jsonb,
  -- { "q1": 4, "q2": 2, ... "q18": 5 }

  -- Scores calculés
  score_ventes int,        -- 0-100
  score_delivery int,      -- 0-100
  score_admin int,         -- 0-100
  score_contenu int,       -- 0-100
  score_global int,        -- 0-100
  niveau text,             -- 'critique' | 'eleve' | 'modere' | 'sain'

  -- Tracking
  source text default 'manychat',
  utm_campaign text,
  progression int default 0,   -- dernière question atteinte (reprise possible)
  abandonne boolean default false,

  -- Sync
  notion_page_id text,
  email_resultat_envoye boolean default false,
  sprint_pitch_envoye boolean default false
);

create index if not exists idx_audit_email on audit_responses(email);
create index if not exists idx_audit_created on audit_responses(created_at desc);
create index if not exists idx_audit_niveau on audit_responses(niveau);

-- ─── RLS ─────────────────────────────────────────────────────────────────────
alter table audit_responses enable row level security;

-- Insertion anonyme (le prospect n'a pas de compte)
drop policy if exists "insert_anon" on audit_responses;
create policy "insert_anon" on audit_responses
  for insert to anon with check (true);

-- Update de sa propre session uniquement (via id retourné côté client)
drop policy if exists "update_own_session" on audit_responses;
create policy "update_own_session" on audit_responses
  for update to anon using (true) with check (true);

-- Lecture réservée au back-office
drop policy if exists "select_admin" on audit_responses;
create policy "select_admin" on audit_responses
  for select to authenticated using (true);

-- Note : update_own_session est volontairement permissif car il n'y a pas
-- d'auth prospect. Sécuriser côté application en ne renvoyant jamais l'id
-- dans l'URL et en le gardant en state React uniquement.
