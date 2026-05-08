
-- 1) Drop deprecated password_hash column from users (no longer populated, security anti-pattern)
ALTER TABLE public.users DROP COLUMN IF EXISTS password_hash;

-- 2) Remove the overly broad documents-bucket INSERT policy (folder-scoped one already exists)
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;

-- 3) Remove the loose shared-documents SELECT policy that uses LIKE matching on file name.
--    The "Documents readable by owner, share recipients, and admins" policy already enforces
--    proper access via public.can_access_attachment().
DROP POLICY IF EXISTS "Users can view shared documents" ON storage.objects;

-- 4) Tighten notifications INSERT so a user can only target themselves
DROP POLICY IF EXISTS "Authenticated users can create notifications" ON public.notifications;
CREATE POLICY "Users can create notifications for themselves"
ON public.notifications FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 5) Harden can_access_attachment(): require the attachment path to live inside the
--    SENDER's own folder, so a malicious user cannot craft a share with feedback
--    referencing somebody else's file path to gain read access.
CREATE OR REPLACE FUNCTION public.can_access_attachment(p_path text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT
    -- Owner: file lives under their UID folder
    (split_part(p_path, '/', 1) = auth.uid()::text)
    OR public.is_admin(auth.uid())
    OR public.is_executive(auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.document_shares ds
      WHERE (ds.to_user_id = auth.uid() OR ds.from_user_id = auth.uid())
        -- Path MUST belong to the share's sender folder, preventing spoofing
        AND split_part(p_path, '/', 1) = ds.from_user_id::text
        AND ds.feedback IS NOT NULL
        AND ds.feedback ~ '^\s*\{'
        AND (
          (ds.feedback::jsonb -> 'attachments') @> jsonb_build_array(jsonb_build_object('path', p_path))
          OR (ds.feedback::jsonb -> 'attachments') @> jsonb_build_array(jsonb_build_object('url', p_path))
        )
    );
$function$;

-- Re-revoke anon execute since we replaced the function
REVOKE EXECUTE ON FUNCTION public.can_access_attachment(text) FROM anon;
