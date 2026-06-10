
-- Helper
CREATE OR REPLACE FUNCTION public.can_view_board_documents(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('SUPER_ADMIN','BOARD_MEMBER','CMD')
      AND (acting_until IS NULL OR acting_until > now())
  )
$$;

-- Replace SELECT policies to honor board restriction
DROP POLICY IF EXISTS "Executives can view all documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can view all documents" ON public.documents;
DROP POLICY IF EXISTS "HODs can view department documents" ON public.documents;
DROP POLICY IF EXISTS "Users can view documents assigned to them" ON public.documents;

CREATE POLICY "Executives can view non-board documents"
  ON public.documents FOR SELECT TO authenticated
  USING (
    public.is_executive(auth.uid())
    AND (COALESCE(board_restricted, false) = false OR public.can_view_board_documents(auth.uid()))
  );

CREATE POLICY "Admins can view non-board documents"
  ON public.documents FOR SELECT TO authenticated
  USING (
    public.is_admin(auth.uid())
    AND (COALESCE(board_restricted, false) = false OR public.can_view_board_documents(auth.uid()))
  );

CREATE POLICY "HODs view dept non-board documents"
  ON public.documents FOR SELECT TO authenticated
  USING (
    public.is_hod(auth.uid())
    AND (COALESCE(board_restricted, false) = false OR public.can_view_board_documents(auth.uid()))
    AND EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
        AND u.department = (SELECT u2.department FROM public.users u2 WHERE u2.id = documents.created_by)
    )
  );

CREATE POLICY "Assignees view non-board documents"
  ON public.documents FOR SELECT TO authenticated
  USING (
    assigned_to = auth.uid()
    AND (COALESCE(board_restricted, false) = false OR public.can_view_board_documents(auth.uid()))
  );

-- Board cohort sees every board-restricted document
CREATE POLICY "Board cohort view board-restricted"
  ON public.documents FOR SELECT TO authenticated
  USING (
    COALESCE(board_restricted, false) = true
    AND public.can_view_board_documents(auth.uid())
  );

-- Trigger: only Board cohort can flip board_restricted on
CREATE OR REPLACE FUNCTION public.enforce_board_restriction_setter()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF COALESCE(NEW.board_restricted, false) = true
       AND (auth.uid() IS NULL OR NOT public.can_view_board_documents(auth.uid())) THEN
      RAISE EXCEPTION 'Only CMD, Board Members, or Super Admin can mark documents as board-restricted';
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF COALESCE(NEW.board_restricted, false) IS DISTINCT FROM COALESCE(OLD.board_restricted, false)
       AND (auth.uid() IS NULL OR NOT public.can_view_board_documents(auth.uid())) THEN
      RAISE EXCEPTION 'Only CMD, Board Members, or Super Admin can change board-restricted status';
    END IF;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_enforce_board_restriction ON public.documents;
CREATE TRIGGER trg_enforce_board_restriction
  BEFORE INSERT OR UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.enforce_board_restriction_setter();
