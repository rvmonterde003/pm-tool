-- Allow creators to read their own projects immediately after insert (.insert().select())
-- before project_members visibility is relied on.
create policy "Creators can read own projects" on projects for select
  using (auth.uid() = created_by);
