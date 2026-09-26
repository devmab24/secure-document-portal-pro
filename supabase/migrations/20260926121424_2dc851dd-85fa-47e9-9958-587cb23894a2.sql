-- Allow internal auditors read-only access to document access logs
create policy "Auditors can view all access logs"
on public.document_access_log
for select
to authenticated
using (public.is_auditor(auth.uid()));