-- 1) Security-definer helper: can the current user read a documents-bucket object?
CREATE OR REPLACE FUNCTION public.can_access_attachment(p_path text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    -- Owner: file lives under their UID folder
    (split_part(p_path, '/', 1) = auth.uid()::text)
    OR public.is_admin(auth.uid())
    OR public.is_executive(auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.document_shares ds
      WHERE (ds.to_user_id = auth.uid() OR ds.from_user_id = auth.uid())
        AND ds.feedback IS NOT NULL
        AND ds.feedback ~ '^\s*\{'  -- only attempt JSON parse on JSON strings
        AND (
          (ds.feedback::jsonb -> 'attachments') @> jsonb_build_array(jsonb_build_object('path', p_path))
          OR (ds.feedback::jsonb -> 'attachments') @> jsonb_build_array(jsonb_build_object('url', p_path))
        )
    );
$$;

-- 2) Replace the broad documents-bucket read policy
DROP POLICY IF EXISTS "Authenticated users can read documents bucket" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;

CREATE POLICY "Documents readable by owner, share recipients, and admins"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'documents' AND public.can_access_attachment(name));

CREATE POLICY "Users can upload to their own documents folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents'
  AND split_part(name, '/', 1) = auth.uid()::text
);

CREATE POLICY "Owners can delete their own documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents'
  AND split_part(name, '/', 1) = auth.uid()::text
);

-- 3) Avatars: prevent listing/enumeration. Public read of a specific path only.
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;

CREATE POLICY "Avatars readable by anyone for direct path access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Note: Listing prevention happens via bucket setting; we additionally scope writes.
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;

CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND split_part(name, '/', 1) = auth.uid()::text
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND split_part(name, '/', 1) = auth.uid()::text
);