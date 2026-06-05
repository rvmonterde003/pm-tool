-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Profiles (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Auto-create profile on user sign-up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references profiles(id) on delete cascade,
  progress int not null default 0 check (progress >= 0 and progress <= 100),
  cover_url text,
  invite_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now()
);

-- Project members (many-to-many)
create table project_members (
  project_id uuid not null references projects(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

-- Auto-add creator as member
create or replace function add_creator_as_member()
returns trigger as $$
begin
  insert into project_members (project_id, user_id)
  values (new.id, new.created_by);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_project_created
  after insert on projects
  for each row execute procedure add_creator_as_member();

-- Entries
create table entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  week_start date not null,
  what_shipped text not null default '',
  what_slipped text not null default '',
  whats_blocking text not null default '',
  created_at timestamptz not null default now()
);

-- Entry attachments
create table entry_attachments (
  id uuid primary key default gen_random_uuid(),
  entry_id uuid not null references entries(id) on delete cascade,
  file_url text not null,
  file_name text not null,
  uploaded_by uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Project invites (email-based)
create table project_invites (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  invited_email text not null,
  token uuid not null default gen_random_uuid() unique,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);
