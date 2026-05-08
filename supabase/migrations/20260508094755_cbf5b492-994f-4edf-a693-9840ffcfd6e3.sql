
-- ============ 1. AVATARS BUCKET HARDENING ============
-- Make the avatars bucket private (no anonymous public listing/serving).
UPDATE storage.buckets SET public = false WHERE id = 'avatars';

-- Drop any prior overly-broad avatar policies, then re-add owner-scoped ones.
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Avatars: owners read" ON storage.objects;
DROP POLICY IF EXISTS "Avatars: owners write" ON storage.objects;
DROP POLICY IF EXISTS "Avatars: owners update" ON storage.objects;
DROP POLICY IF EXISTS "Avatars: owners delete" ON storage.objects;
DROP POLICY IF EXISTS "Avatars: admins read" ON storage.objects;

CREATE POLICY "Avatars: owners read"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Avatars: admins read"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'avatars'
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Avatars: owners write"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Avatars: owners update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Avatars: owners delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- ============ 2. REVOKE ANON ACCESS TO TABLES (lint 0026) ============
REVOKE SELECT ON public.audit_logs              FROM anon;
REVOKE SELECT ON public.department_units        FROM anon;
REVOKE SELECT ON public.departments             FROM anon;
REVOKE SELECT ON public.digital_signatures      FROM anon;
REVOKE SELECT ON public.document_access_log     FROM anon;
REVOKE SELECT ON public.document_comments       FROM anon;
REVOKE SELECT ON public.document_requests       FROM anon;
REVOKE SELECT ON public.document_shares         FROM anon;
REVOKE SELECT ON public.document_versions       FROM anon;
REVOKE SELECT ON public.documents               FROM anon;
REVOKE SELECT ON public.form_fields             FROM anon;
REVOKE SELECT ON public.form_submissions        FROM anon;
REVOKE SELECT ON public.form_templates          FROM anon;
REVOKE SELECT ON public.inter_department_messages FROM anon;
REVOKE SELECT ON public.message_attachments     FROM anon;
REVOKE SELECT ON public.message_recipients      FROM anon;
REVOKE SELECT ON public.notifications           FROM anon;
REVOKE SELECT ON public.user_roles              FROM anon;
REVOKE SELECT ON public.users                   FROM anon;

-- ============ 3. REVOKE ANON EXECUTE ON SECURITY DEFINER FUNCTIONS (lint 0028) ============
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role)        FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_hod(uuid)                           FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_director_admin(uuid)                FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_executive(uuid)                     FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid)                         FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_head_of_unit(uuid, uuid)            FROM anon;
REVOKE EXECUTE ON FUNCTION public.can_route_documents(uuid)              FROM anon;
REVOKE EXECUTE ON FUNCTION public.can_access_attachment(text)            FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid)                    FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_unit(uuid)                    FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_department_hierarchy(uuid)         FROM anon;

-- ============ 4. AUDIT LOG INSERT POLICY (so app can record actions) ============
DROP POLICY IF EXISTS "Authenticated users can insert their own audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated users can insert their own audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
