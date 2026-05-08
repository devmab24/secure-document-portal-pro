
-- Index to keep audit queries fast
CREATE INDEX IF NOT EXISTS audit_logs_user_created_at_idx
  ON public.audit_logs (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS audit_logs_action_created_at_idx
  ON public.audit_logs (action, created_at DESC);

CREATE INDEX IF NOT EXISTS document_access_log_user_time_idx
  ON public.document_access_log (user_id, access_timestamp DESC);

-- Helper: write an audit event for the current user.
-- Forces user_id = auth.uid() so callers cannot spoof other users.
CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_action      text,
  p_target_type text DEFAULT NULL,
  p_target_id   uuid DEFAULT NULL,
  p_metadata    jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  new_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required to log audit event';
  END IF;

  INSERT INTO public.audit_logs (user_id, action, target_type, target_id, metadata)
  VALUES (auth.uid(), p_action, p_target_type, p_target_id, COALESCE(p_metadata, '{}'::jsonb))
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.log_audit_event(text, text, uuid, jsonb) FROM anon;
GRANT  EXECUTE ON FUNCTION public.log_audit_event(text, text, uuid, jsonb) TO authenticated;

-- View: flag users with abnormal download activity in the last hour
CREATE OR REPLACE VIEW public.abnormal_download_alerts
WITH (security_invoker = true) AS
SELECT
  user_id,
  COUNT(*)::int           AS download_count,
  MIN(access_timestamp)   AS window_start,
  MAX(access_timestamp)   AS last_download,
  ARRAY_AGG(DISTINCT document_id) FILTER (WHERE document_id IS NOT NULL) AS documents_touched
FROM public.document_access_log
WHERE access_timestamp > now() - interval '1 hour'
  AND access_type LIKE 'attachment_%'
GROUP BY user_id
HAVING COUNT(*) > 20;

REVOKE ALL ON public.abnormal_download_alerts FROM anon;
GRANT  SELECT ON public.abnormal_download_alerts TO authenticated;
-- The underlying document_access_log RLS limits access; admins see all rows,
-- everyone else sees only their own — so the view naturally scopes per role.
