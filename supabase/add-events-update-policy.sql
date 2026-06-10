-- Run once in Supabase SQL Editor if events already exist but updates fail after payment.

create policy "Users can update own events"
  on public.events for update
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own notifications"
  on public.notifications for insert
  with check (auth.uid() = user_id);
