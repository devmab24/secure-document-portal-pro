
-- 1) Restrict public reference tables to authenticated users
DROP POLICY IF EXISTS "Anyone can view active departments" ON public.departments;
CREATE POLICY "Authenticated users can view active departments"
ON public.departments FOR SELECT TO authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Anyone can view active department units" ON public.department_units;
CREATE POLICY "Authenticated users can view active department units"
ON public.department_units FOR SELECT TO authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Anyone can view form fields" ON public.form_fields;
CREATE POLICY "Authenticated users can view form fields"
ON public.form_fields FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Anyone can view form templates" ON public.form_templates;
CREATE POLICY "Authenticated users can view form templates"
ON public.form_templates FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Authenticated users can view active users" ON public.users;
CREATE POLICY "Authenticated users can view active users"
ON public.users FOR SELECT TO authenticated
USING (is_active = true);

-- Revoke anon table access (GraphQL exposure)
REVOKE SELECT ON public.departments FROM anon;
REVOKE SELECT ON public.department_units FROM anon;
REVOKE SELECT ON public.form_fields FROM anon;
REVOKE SELECT ON public.form_templates FROM anon;
REVOKE SELECT ON public.users FROM anon;

-- 2) Avatars bucket: drop any anonymous read policy, allow authenticated reads + owner writes
DROP POLICY IF EXISTS "Avatars readable by anyone for direct path access" ON storage.objects;
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view avatars" ON storage.objects;

CREATE POLICY "Authenticated users can view avatars"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'avatars');

-- 3) Realtime: scope channel subscriptions to the user's own notification topic
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can subscribe to their own notification channel" ON realtime.messages;
CREATE POLICY "Users can subscribe to their own notification channel"
ON realtime.messages FOR SELECT TO authenticated
USING (
  -- Allow only topics that match the user's UID (e.g. user:<uid> or notifications:<uid>)
  realtime.topic() LIKE '%' || auth.uid()::text || '%'
);
