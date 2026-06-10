-- Run this in the Supabase SQL Editor for your project

-- Profiles (extends auth.users with name + gotra)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  gotra text not null,
  email text not null,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Temple events
create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  event_type text not null,
  price numeric(10,2) default 0,
  start_time timestamptz not null,
  end_time timestamptz,
  description text,
  user_id uuid references auth.users,
  payment_status text default 'pending',
  created_at timestamptz default now()
);

alter table public.events enable row level security;

create policy "Anyone authenticated can view events"
  on public.events for select
  to authenticated
  using (true);

create policy "Users can create events"
  on public.events for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own events"
  on public.events for update
  to authenticated
  using (auth.uid() = user_id);

-- Notifications
create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  body text not null,
  read boolean default false,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

create policy "Users can insert own notifications"
  on public.notifications for insert
  with check (auth.uid() = user_id);

-- Profiles are created from the app after signup, once the user has an active session.
-- Do not auto-create empty profile rows here, or users will skip the create-profile screen.
