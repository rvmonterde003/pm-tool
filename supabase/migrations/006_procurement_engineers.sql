-- Work status for engineer attendance
create type work_status as enum ('wfh', 'on-leave', 'in-office');

-- Procurement items
create table procurement_items (
  id uuid primary key default gen_random_uuid(),
  item_name text not null,
  qty int not null default 1 check (qty > 0),
  specification text not null default '',
  usage text not null default '',
  sample_link text,
  remarks text not null default 'waiting' check (remarks in ('delivered', 'purchased', 'waiting')),
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Daily engineer attendance
create table engineer_attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  attendance_date date not null,
  status work_status not null,
  created_at timestamptz not null default now(),
  unique (user_id, attendance_date)
);

create index engineer_attendance_user_date_idx on engineer_attendance (user_id, attendance_date desc);
create index procurement_items_created_at_idx on procurement_items (created_at desc);

-- RLS
alter table procurement_items enable row level security;
alter table engineer_attendance enable row level security;

create policy "Authenticated users can read procurement items"
  on procurement_items for select
  using (auth.role() = 'authenticated');

create policy "Authenticated users can create procurement items"
  on procurement_items for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update procurement items"
  on procurement_items for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete procurement items"
  on procurement_items for delete
  using (auth.role() = 'authenticated');

create policy "Authenticated users can read attendance"
  on engineer_attendance for select
  using (auth.role() = 'authenticated');

create policy "Users can insert own attendance"
  on engineer_attendance for insert
  with check (auth.uid() = user_id);

create policy "Users can update own attendance"
  on engineer_attendance for update
  using (auth.uid() = user_id);

create policy "Users can delete own attendance"
  on engineer_attendance for delete
  using (auth.uid() = user_id);
