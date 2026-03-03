-- Add RLS policies to document_access_log table
-- Currently RLS is enabled but no policies exist, exposing sensitive audit data

-- Admins can view all access logs
CREATE POLICY "Admins can view all access logs"
ON public.document_access_log FOR SELECT
USING (public.is_admin(auth.uid()));

-- Users can view logs for their own access
CREATE POLICY "Users can view their own access logs"
ON public.document_access_log FOR SELECT
USING (user_id = auth.uid());

-- Document owners can view access logs for their documents
CREATE POLICY "Document owners can view access logs"
ON public.document_access_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.documents d
    WHERE d.id = document_access_log.document_id
    AND d.created_by = auth.uid()
  )
);

-- Authenticated users can log their own access
CREATE POLICY "Authenticated users can log access"
ON public.document_access_log FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());