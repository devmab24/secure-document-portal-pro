
ALTER TYPE public.service_type ADD VALUE IF NOT EXISTS 'nursing';
ALTER TYPE public.service_type ADD VALUE IF NOT EXISTS 'finance';
ALTER TYPE public.service_type ADD VALUE IF NOT EXISTS 'audit';

DO $$ BEGIN
  CREATE TYPE public.directorate_type AS ENUM (
    'OFFICE_OF_CMD','CLINICAL_SERVICES','NURSING_SERVICES',
    'ADMINISTRATION','FINANCE_ACCOUNTS','INTERNAL_AUDIT','BOARD'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.reports_to_type AS ENUM ('CMD','BOARD');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.directorates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  type public.directorate_type NOT NULL,
  reports_to public.reports_to_type NOT NULL DEFAULT 'CMD',
  head_user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.directorates TO authenticated;
GRANT ALL ON public.directorates TO service_role;

ALTER TABLE public.directorates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view directorates"
  ON public.directorates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins insert directorates"
  ON public.directorates FOR INSERT TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins update directorates"
  ON public.directorates FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins delete directorates"
  ON public.directorates FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_directorates_updated_at ON public.directorates;
CREATE TRIGGER trg_directorates_updated_at
  BEFORE UPDATE ON public.directorates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.departments
  ADD COLUMN IF NOT EXISTS directorate_id uuid REFERENCES public.directorates(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_departments_directorate ON public.departments(directorate_id);

INSERT INTO public.directorates (name, code, type, reports_to, description) VALUES
  ('Office of the Chief Medical Director','OCMD','OFFICE_OF_CMD','BOARD','CMD office; institutional leadership reporting to the Board of Management'),
  ('Clinical Services','CLIN','CLINICAL_SERVICES','CMD','All clinical departments, coordinated by the Chairman Medical Advisory Committee (CMAC)'),
  ('Nursing Services','NURS','NURSING_SERVICES','CMD','Nursing departments and units, led by the Director/Head of Nursing Services'),
  ('Administration','ADMN','ADMINISTRATION','CMD','Administrative departments and support services, led by the Director of Administration'),
  ('Finance and Accounts','FINA','FINANCE_ACCOUNTS','CMD','Financial management, led by the Director of Finance / Chief Accountant'),
  ('Internal Audit','IAUD','INTERNAL_AUDIT','BOARD','Independent internal audit function reporting directly to the Board of Management')
ON CONFLICT (code) DO NOTHING;

-- Fix clinical mis-tagging (only uses pre-existing 'clinical' value)
UPDATE public.departments SET service_type = 'clinical'
WHERE name IN ('Accident & Emergency','Antenatal','Dental','Eye Clinic','Surgical');

CREATE OR REPLACE FUNCTION public.get_user_directorate(_user_id uuid)
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT d.directorate_id FROM public.users u
  JOIN public.departments d ON d.name = u.department
  WHERE u.id = _user_id LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_directorate_head(_user_id uuid, _directorate_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.directorates
    WHERE id = _directorate_id AND head_user_id = _user_id)
$$;
