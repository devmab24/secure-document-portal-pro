
-- Helper function
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = 'SUPER_ADMIN')
$$;

-- Allow ADMIN to manage roles, but never SUPER_ADMIN
CREATE POLICY "Admins can insert non-superadmin roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_admin(auth.uid())
  AND role <> 'SUPER_ADMIN'::public.app_role
);

CREATE POLICY "Admins can update non-superadmin roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (
  public.is_admin(auth.uid())
  AND role <> 'SUPER_ADMIN'::public.app_role
)
WITH CHECK (
  public.is_admin(auth.uid())
  AND role <> 'SUPER_ADMIN'::public.app_role
);

CREATE POLICY "Admins can delete non-superadmin roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  public.is_admin(auth.uid())
  AND role <> 'SUPER_ADMIN'::public.app_role
);
