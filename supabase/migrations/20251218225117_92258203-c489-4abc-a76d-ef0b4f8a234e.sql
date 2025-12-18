-- ============================================
-- 1. CREATE APP_ROLE ENUM
-- ============================================
CREATE TYPE public.app_role AS ENUM (
  'CMD',
  'CMAC', 
  'HEAD_OF_NURSING',
  'REGISTRY',
  'DIRECTOR_ADMIN',
  'CHIEF_ACCOUNTANT',
  'CHIEF_PROCUREMENT_OFFICER',
  'MEDICAL_RECORDS_OFFICER',
  'HOD',
  'STAFF',
  'ADMIN',
  'SUPER_ADMIN'
);

-- ============================================
-- 2. CREATE USER_ROLES TABLE (Secure RBAC)
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CREATE SECURITY DEFINER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'SUPER_ADMIN' THEN 1
      WHEN 'ADMIN' THEN 2
      WHEN 'CMD' THEN 3
      WHEN 'CMAC' THEN 4
      WHEN 'DIRECTOR_ADMIN' THEN 5
      WHEN 'HEAD_OF_NURSING' THEN 6
      WHEN 'CHIEF_ACCOUNTANT' THEN 7
      WHEN 'CHIEF_PROCUREMENT_OFFICER' THEN 8
      WHEN 'MEDICAL_RECORDS_OFFICER' THEN 9
      WHEN 'REGISTRY' THEN 10
      WHEN 'HOD' THEN 11
      WHEN 'STAFF' THEN 12
    END
  LIMIT 1
$$;

-- Function to check if user is admin level
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('SUPER_ADMIN', 'ADMIN', 'CMD')
  )
$$;

-- ============================================
-- 4. RLS POLICIES FOR USER_ROLES
-- ============================================

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all roles
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Only super admins can insert roles
CREATE POLICY "Super admins can insert roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'SUPER_ADMIN'));

-- Only super admins can update roles
CREATE POLICY "Super admins can update roles"
ON public.user_roles
FOR UPDATE
USING (public.has_role(auth.uid(), 'SUPER_ADMIN'));

-- Only super admins can delete roles
CREATE POLICY "Super admins can delete roles"
ON public.user_roles
FOR DELETE
USING (public.has_role(auth.uid(), 'SUPER_ADMIN'));

-- ============================================
-- 5. CREATE SERVICE_TYPE ENUM
-- ============================================
CREATE TYPE public.service_type AS ENUM ('clinical', 'non_clinical', 'administrative');

-- ============================================
-- 6. ALTER DEPARTMENTS TABLE FOR HIERARCHY
-- ============================================
ALTER TABLE public.departments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.departments(id),
ADD COLUMN IF NOT EXISTS service_type public.service_type DEFAULT 'administrative',
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS code TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS head_user_id UUID REFERENCES public.users(id),
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS staff_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index for hierarchy queries
CREATE INDEX IF NOT EXISTS idx_departments_parent_id ON public.departments(parent_id);
CREATE INDEX IF NOT EXISTS idx_departments_service_type ON public.departments(service_type);

-- ============================================
-- 7. CREATE DEPARTMENT_UNITS TABLE
-- ============================================
CREATE TABLE public.department_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES public.departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  head_user_id UUID REFERENCES public.users(id),
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  staff_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.department_units ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX idx_department_units_department_id ON public.department_units(department_id);

-- ============================================
-- 8. RLS POLICIES FOR DEPARTMENT_UNITS
-- ============================================

-- Everyone can view active department units
CREATE POLICY "Anyone can view active department units"
ON public.department_units
FOR SELECT
USING (is_active = true);

-- Admins can manage department units
CREATE POLICY "Admins can insert department units"
ON public.department_units
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update department units"
ON public.department_units
FOR UPDATE
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete department units"
ON public.department_units
FOR DELETE
USING (public.is_admin(auth.uid()));

-- ============================================
-- 9. UPDATE DEPARTMENTS RLS POLICIES
-- ============================================

-- Everyone can view active departments
CREATE POLICY "Anyone can view active departments"
ON public.departments
FOR SELECT
USING (is_active = true);

-- Admins can manage departments
CREATE POLICY "Admins can insert departments"
ON public.departments
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update departments"
ON public.departments
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- ============================================
-- 10. TRIGGER TO SYNC ROLES ON USER CREATION
-- ============================================
CREATE OR REPLACE FUNCTION public.sync_user_role_on_create()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_text TEXT;
  user_role public.app_role;
BEGIN
  -- Get role from user metadata or users table
  user_role_text := COALESCE(
    NEW.raw_user_meta_data->>'role',
    'STAFF'
  );
  
  -- Try to cast to enum, default to STAFF if invalid
  BEGIN
    user_role := user_role_text::public.app_role;
  EXCEPTION WHEN OTHERS THEN
    user_role := 'STAFF'::public.app_role;
  END;
  
  -- Insert into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new auth users
CREATE TRIGGER on_auth_user_created_sync_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_role_on_create();

-- ============================================
-- 11. FUNCTION TO GET DEPARTMENT HIERARCHY
-- ============================================
CREATE OR REPLACE FUNCTION public.get_department_hierarchy(dept_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  level INTEGER,
  path TEXT[]
)
LANGUAGE sql
STABLE
AS $$
  WITH RECURSIVE dept_tree AS (
    -- Base case: start with the given department
    SELECT 
      d.id,
      d.name,
      d.level,
      ARRAY[d.name] as path
    FROM public.departments d
    WHERE d.id = dept_id
    
    UNION ALL
    
    -- Recursive case: get parent departments
    SELECT 
      parent.id,
      parent.name,
      parent.level,
      parent.name || tree.path
    FROM public.departments parent
    JOIN dept_tree tree ON tree.id = (
      SELECT d.parent_id FROM public.departments d WHERE d.id = tree.id
    )
    WHERE parent.id IS NOT NULL
  )
  SELECT * FROM dept_tree ORDER BY level;
$$;