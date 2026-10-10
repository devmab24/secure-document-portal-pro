do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname='public' loop
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
  end loop;
end $$;