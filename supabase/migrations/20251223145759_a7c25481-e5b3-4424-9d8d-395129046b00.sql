-- Phase 1 Step 2: Seed Administrative Department Units

-- 1. General Administration & Support
INSERT INTO public.department_units (department_id, name, code, description, is_active)
VALUES ('87245127-7b75-413a-b717-dee7cc3d09bc', 'General Administration & Support', 'GAS', 'Secretariat Services, Official Documents, Leave Management, NHF, NYSC Matters', true);

-- 2. Medical Library
INSERT INTO public.department_units (department_id, name, code, description, is_active)
VALUES ('87245127-7b75-413a-b717-dee7cc3d09bc', 'Medical Library', 'MED-LIB', 'Medical records, journals, and academic resource management', true);

-- 3. AP & D (Appointments, Promotion & Discipline)
INSERT INTO public.department_units (department_id, name, code, description, is_active)
VALUES ('87245127-7b75-413a-b717-dee7cc3d09bc', 'Appointments, Promotion & Discipline', 'APD', 'Appointments (Permanent, Contract, Locum), Promotions (Senior/Junior Staff), Discipline, HR Management', true);

-- 4. Public Relations Unit (PRU)
INSERT INTO public.department_units (department_id, name, code, description, is_active)
VALUES ('87245127-7b75-413a-b717-dee7cc3d09bc', 'Public Relations Unit', 'PRU', 'Internal Communication, Media Relations, Content Creation, Crisis Management, Community Relations', true);

-- 5. National Health Insurance Authority (NHIA)
INSERT INTO public.department_units (department_id, name, code, description, is_active)
VALUES ('87245127-7b75-413a-b717-dee7cc3d09bc', 'National Health Insurance Authority', 'NHIA', 'NHIA administration and documentation', true);

-- 6. Registry Unit
INSERT INTO public.department_units (department_id, name, code, description, is_active)
VALUES ('87245127-7b75-413a-b717-dee7cc3d09bc', 'Registry Unit', 'REG', 'Open Registry (Senior/Junior), Secret Registry (Senior/Junior), Subject Registry', true);

-- 7. IPPIS & Nominal Roll
INSERT INTO public.department_units (department_id, name, code, description, is_active)
VALUES ('87245127-7b75-413a-b717-dee7cc3d09bc', 'IPPIS & Nominal Roll', 'IPPIS', 'Payroll integration documentation, Staff nominal roll management', true);

-- 8. Staff Welfare & Relations
INSERT INTO public.department_units (department_id, name, code, description, is_active)
VALUES ('87245127-7b75-413a-b717-dee7cc3d09bc', 'Staff Welfare & Relations', 'SWR', 'Staff welfare programs, Industrial and employee relations', true);

-- 9. Information and Communication Technology (ICT)
INSERT INTO public.department_units (department_id, name, code, description, is_active)
VALUES ('87245127-7b75-413a-b717-dee7cc3d09bc', 'Information and Communication Technology', 'ICT', 'Systems Administration, Technical Support, Software Development', true);

-- 10. Staff Development & Training
INSERT INTO public.department_units (department_id, name, code, description, is_active)
VALUES ('87245127-7b75-413a-b717-dee7cc3d09bc', 'Staff Development & Training', 'SDT', 'Non-Regular Staff Training (SIWES, Interns, NYSC), Workshops, In-Service Training', true);

-- 11. Legal Unit
INSERT INTO public.department_units (department_id, name, code, description, is_active)
VALUES ('87245127-7b75-413a-b717-dee7cc3d09bc', 'Legal Unit', 'LEGAL', 'Legal Advisory, Contract and Agreement Management', true);

-- 12. Planning, Research & Statistics
INSERT INTO public.department_units (department_id, name, code, description, is_active)
VALUES ('87245127-7b75-413a-b717-dee7cc3d09bc', 'Planning, Research & Statistics', 'PRS', 'Research and Statistics, Planning and Budgeting, PMS, M&E', true);

-- 13. Pension Matters
INSERT INTO public.department_units (department_id, name, code, description, is_active)
VALUES ('87245127-7b75-413a-b717-dee7cc3d09bc', 'Pension Matters', 'PENSION', 'Pension processing and documentation', true);

-- 14. Insurance Unit
INSERT INTO public.department_units (department_id, name, code, description, is_active)
VALUES ('87245127-7b75-413a-b717-dee7cc3d09bc', 'Insurance Unit', 'INS', 'Group Life Insurance (Employees), General Insurance (Hospital Assets)', true);

-- Update the get_user_role function to include HEAD_OF_UNIT in priority order
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
 RETURNS app_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
      WHEN 'HEAD_OF_UNIT' THEN 12
      WHEN 'STAFF' THEN 13
    END
  LIMIT 1
$function$;

-- Add helper function to check if user is head of a specific unit
CREATE OR REPLACE FUNCTION public.is_head_of_unit(_user_id uuid, _unit_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.department_units
    WHERE id = _unit_id
      AND head_user_id = _user_id
  )
$$;

-- Add helper function to get user's assigned unit
CREATE OR REPLACE FUNCTION public.get_user_unit(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id
  FROM public.department_units
  WHERE head_user_id = _user_id
  LIMIT 1
$$;