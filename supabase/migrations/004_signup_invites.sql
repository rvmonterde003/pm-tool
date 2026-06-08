-- Signup invite keys (24h expiry, required to create an account)
create table signup_invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  invite_key text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create index signup_invites_email_idx on signup_invites (lower(email));
create index signup_invites_expires_at_idx on signup_invites (expires_at);

alter table signup_invites enable row level security;
