-- Auth triggers run without public in search_path; qualify tables and lock search_path.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$;

create or replace function public.add_creator_as_member()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.project_members (project_id, user_id)
  values (new.id, new.created_by);
  return new;
end;
$$;

create or replace function public.is_project_member(p_project_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.project_members
    where project_id = p_project_id
      and user_id = auth.uid()
  );
$$;

revoke all on function public.handle_new_user() from public;
revoke all on function public.add_creator_as_member() from public;
revoke all on function public.is_project_member(uuid) from public;
grant execute on function public.handle_new_user() to service_role;
grant execute on function public.add_creator_as_member() to service_role;
grant execute on function public.is_project_member(uuid) to authenticated, service_role;
