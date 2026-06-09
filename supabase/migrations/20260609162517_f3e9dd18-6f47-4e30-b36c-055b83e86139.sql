
ALTER TABLE public.user_roles
  ADD COLUMN IF NOT EXISTS is_acting boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS acting_until timestamptz NULL;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('SUPER_ADMIN', 'ADMIN')
      AND (acting_until IS NULL OR acting_until > now())
  )
$$;

CREATE OR REPLACE FUNCTION public.is_board_member(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'BOARD_MEMBER'
      AND (acting_until IS NULL OR acting_until > now())
  )
$$;

CREATE OR REPLACE FUNCTION public.is_auditor(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = 'AUDITOR'
      AND (acting_until IS NULL OR acting_until > now())
  )
$$;

DROP POLICY IF EXISTS "Auditors can view all audit logs" ON public.audit_logs;
CREATE POLICY "Auditors can view all audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.is_auditor(auth.uid()) OR public.is_admin(auth.uid()));
