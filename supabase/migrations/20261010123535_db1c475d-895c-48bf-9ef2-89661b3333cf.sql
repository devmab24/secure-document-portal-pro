drop policy if exists "Users can create notifications for themselves" on public.notifications;
create policy "Signed-in users can create notifications"
on public.notifications
for insert
to authenticated
with check (auth.uid() is not null);