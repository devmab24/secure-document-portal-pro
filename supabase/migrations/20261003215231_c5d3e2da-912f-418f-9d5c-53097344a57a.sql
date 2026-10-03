create policy "Auditors can view all documents"
on public.documents
for select
to authenticated
using (public.is_auditor(auth.uid()));