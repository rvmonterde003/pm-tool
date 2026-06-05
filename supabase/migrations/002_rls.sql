-- Helper: is the current user a member of a project?
create or replace function is_project_member(p_project_id uuid)
returns boolean as $$
  select exists (
    select 1 from project_members
    where project_id = p_project_id
      and user_id = auth.uid()
  );
$$ language sql security definer;

-- PROFILES
alter table profiles enable row level security;
create policy "Users can read all profiles" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- PROJECTS
alter table projects enable row level security;
create policy "Members can read projects" on projects for select
  using (is_project_member(id));
create policy "Authenticated users can create projects" on projects for insert
  with check (auth.uid() = created_by);
create policy "Members can update projects" on projects for update
  using (is_project_member(id));
create policy "Only creator can delete project" on projects for delete
  using (auth.uid() = created_by);

-- PROJECT_MEMBERS
alter table project_members enable row level security;
create policy "Members can read project members" on project_members for select
  using (is_project_member(project_id));
create policy "Service role can insert members" on project_members for insert
  with check (auth.uid() = user_id);

-- ENTRIES
alter table entries enable row level security;
create policy "Members can read entries" on entries for select
  using (is_project_member(project_id));
create policy "Members can create entries" on entries for insert
  with check (is_project_member(project_id) and auth.uid() = author_id);

-- ENTRY_ATTACHMENTS
alter table entry_attachments enable row level security;
create policy "Members can read attachments" on entry_attachments for select
  using (
    exists (
      select 1 from entries e
      where e.id = entry_id and is_project_member(e.project_id)
    )
  );
create policy "Members can insert attachments" on entry_attachments for insert
  with check (
    auth.uid() = uploaded_by and
    exists (
      select 1 from entries e
      where e.id = entry_id and is_project_member(e.project_id)
    )
  );

-- PROJECT_INVITES
alter table project_invites enable row level security;
create policy "Invite tokens are publicly readable" on project_invites for select
  using (true);
create policy "Members can create invites" on project_invites for insert
  with check (is_project_member(project_id));
create policy "Accept own invite" on project_invites for update
  using (true);

-- STORAGE: covers bucket (public read, member write)
create policy "Public can read covers" on storage.objects for select
  using (bucket_id = 'covers');
create policy "Members can upload covers" on storage.objects for insert
  with check (
    bucket_id = 'covers' and auth.role() = 'authenticated'
  );
create policy "Members can delete covers" on storage.objects for delete
  using (bucket_id = 'covers' and auth.role() = 'authenticated');

-- STORAGE: attachments bucket (member read via signed URL, member write)
create policy "Members can upload attachments" on storage.objects for insert
  with check (bucket_id = 'attachments' and auth.role() = 'authenticated');
create policy "Members can read attachments" on storage.objects for select
  using (bucket_id = 'attachments' and auth.role() = 'authenticated');
