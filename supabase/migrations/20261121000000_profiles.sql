-- Profiles (docs/decisions.md D11, D12): one row per account, created
-- by the welcome step. Only the account itself can read or write it
-- (row level security), and only the age fields: the plan is set by the
-- server with the secret key, never by the user.
create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  birth_month text check (birth_month ~ '^[0-9]{4}-(0[1-9]|1[0-2])$'),
  guardian_consent_at timestamptz,
  plan text not null default 'free' check (plan in ('free', 'paid')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own" on public.profiles
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "profiles: insert own" on public.profiles
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "profiles: update own" on public.profiles
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Column privileges: users may write only these columns.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant insert (user_id, birth_month, guardian_consent_at)
  on public.profiles to authenticated;
grant update (birth_month, guardian_consent_at, updated_at)
  on public.profiles to authenticated;
