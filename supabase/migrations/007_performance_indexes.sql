-- Performance indexes for hot read paths.
-- All additive and safe to run on an existing database.

-- Project detail feed: filter by project_id, order by created_at.
create index if not exists entries_project_created_idx
  on entries (project_id, created_at);

-- Attachment join when loading an entry's files.
create index if not exists entry_attachments_entry_idx
  on entry_attachments (entry_id);

-- Membership lookups / RLS checks keyed on user_id.
-- The project_members primary key (project_id, user_id) does not serve
-- queries that filter on user_id alone.
create index if not exists project_members_user_idx
  on project_members (user_id);
