-- Phase 4: RLS Policies & Official FMCJ Department Update
-- Step 1: Update existing departments and add new official FMCJ departments

-- First, deactivate departments that are NOT in the official list
-- Keep: Administration (has units), Pharmacy, Radiology, Physiotherapy
-- Remove: Accident & Emergency, Admin, Antenatal, Dental, Director of Administration, 
--         Eye Clinic, Finance, HR, ICT, IT, NHIA, Records, Registry, Surgical

UPDATE departments SET is_active = false 
WHERE name IN (
  'Accident & Emergency', 'Admin', 'Antenatal', 'Dental', 
  'Director of Administration', 'Eye Clinic', 'Finance', 'HR', 
  'ICT', 'IT', 'NHIA', 'Records', 'Registry', 'Surgical'
);

-- Update existing departments with correct service_type
UPDATE departments SET service_type = 'clinical', code = 'RAD' WHERE name = 'Radiology';
UPDATE departments SET service_type = 'clinical', code = 'PHA' WHERE name = 'Pharmacy';
UPDATE departments SET service_type = 'clinical', code = 'PHY' WHERE name = 'Physiotherapy';
UPDATE departments SET service_type = 'non_clinical', code = 'ADM' WHERE name = 'Administration';

-- Insert all official FMCJ Clinical Departments
INSERT INTO departments (name, code, description, service_type, is_active, level) VALUES
  -- Clinical Departments (1-23)
  ('Medical Records', 'MRD', 'Patient records management and health information', 'clinical', true, 2),
  ('Family Medicine', 'FAM', 'Primary healthcare and family practice services', 'clinical', true, 2),
  ('Internal Medicine', 'INT', 'Internal medicine and general adult medical care', 'clinical', true, 2),
  ('Paediatrics', 'PED', 'Child health and pediatric services', 'clinical', true, 2),
  ('Obstetrics and Gynaecology', 'OBG', 'Maternal health, obstetrics and gynecological services', 'clinical', true, 2),
  ('Surgery', 'SUR', 'General and specialized surgical services', 'clinical', true, 2),
  ('Anaesthesia', 'ANA', 'Anaesthesiology and perioperative medicine', 'clinical', true, 2),
  ('Orthopaedic Surgery', 'ORT', 'Musculoskeletal and orthopedic surgical services', 'clinical', true, 2),
  ('Otorhinolaryngology', 'ENT', 'Ear, Nose and Throat (ENT) services', 'clinical', true, 2),
  ('Ophthalmology', 'OPH', 'Eye care and ophthalmic services', 'clinical', true, 2),
  ('Dentistry', 'DEN', 'Dental care and oral health services', 'clinical', true, 2),
  ('Nursing Services', 'NUR', 'Nursing care coordination and management', 'clinical', true, 2),
  ('Histopathology', 'HIS', 'Histopathology and tissue analysis services', 'clinical', true, 2),
  ('Medical Laboratory Services', 'MLS', 'Clinical laboratory and diagnostic services', 'clinical', true, 2),
  ('Public Health', 'PUB', 'Public health programs and community health services', 'clinical', true, 2),
  ('Nutrition and Dietetics', 'NUT', 'Clinical nutrition and dietary services', 'clinical', true, 2),
  ('Medical Social Services', 'MSS', 'Medical social work and patient support services', 'clinical', true, 2),
  ('NEMSAS', 'NEM', 'National Emergency Medical System and Ambulance Service', 'clinical', true, 2),
  ('Oncology Unit', 'ONC', 'Cancer care and oncology services', 'clinical', true, 2),
  ('Infection Prevention and Control', 'IPC', 'Infection prevention and control committee', 'clinical', true, 2)
ON CONFLICT (name) DO UPDATE SET
  code = EXCLUDED.code,
  description = EXCLUDED.description,
  service_type = EXCLUDED.service_type,
  is_active = true;

-- Insert all official FMCJ Non-Clinical Departments
INSERT INTO departments (name, code, description, service_type, is_active, level) VALUES
  -- Non-Clinical Departments (24-32)
  ('Internal Audit', 'AUD', 'Internal audit and compliance services', 'non_clinical', true, 2),
  ('Finance and Accounts', 'FIN', 'Financial management and accounting services', 'non_clinical', true, 2),
  ('Procurement', 'PRO', 'Procurement and supply chain management', 'non_clinical', true, 2),
  ('Works and Maintenance', 'WKS', 'Facility maintenance and engineering services', 'non_clinical', true, 2),
  ('Physical Planning', 'PPL', 'Physical planning and infrastructure development', 'non_clinical', true, 2),
  ('ACTU', 'ACT', 'Anti-Corruption and Transparency Unit', 'non_clinical', true, 2),
  ('Health Research and Ethics', 'HRE', 'Health Research and Ethics Committee', 'non_clinical', true, 2),
  ('Security Services', 'SEC', 'Security services and safety management', 'non_clinical', true, 2)
ON CONFLICT (name) DO UPDATE SET
  code = EXCLUDED.code,
  description = EXCLUDED.description,
  service_type = EXCLUDED.service_type,
  is_active = true;

-- Step 2: Create security definer functions for document routing workflow

-- Function to check if user is a head of department
CREATE OR REPLACE FUNCTION public.is_hod(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('HOD', 'HEAD_OF_NURSING', 'MEDICAL_RECORDS_OFFICER')
  )
$$;

-- Function to check if user is director admin
CREATE OR REPLACE FUNCTION public.is_director_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'DIRECTOR_ADMIN'
  )
$$;

-- Function to check if user is executive level (CMD, CMAC)
CREATE OR REPLACE FUNCTION public.is_executive(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('CMD', 'CMAC')
  )
$$;

-- Function to check if user can route documents
CREATE OR REPLACE FUNCTION public.can_route_documents(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('CMD', 'CMAC', 'DIRECTOR_ADMIN', 'HEAD_OF_UNIT', 'HOD', 'REGISTRY', 'HEAD_OF_NURSING')
  )
$$;

-- Step 3: Enhanced RLS policies for inter_department_messages (document routing)

-- Allow users with routing privileges to see messages for their workflow
CREATE POLICY "Director Admin can view all unit head messages"
ON inter_department_messages FOR SELECT
USING (
  is_director_admin(auth.uid()) 
  AND (metadata->>'workflow_step' = 'director_to_unit_head' OR metadata->>'workflow_step' = 'unit_head_to_staff')
);

-- Unit heads can view messages in their workflow
CREATE POLICY "Unit heads can view their workflow messages"
ON inter_department_messages FOR SELECT
USING (
  has_role(auth.uid(), 'HEAD_OF_UNIT') 
  AND (to_user_id = auth.uid() OR from_user_id = auth.uid())
);

-- Step 4: Enhanced RLS policies for documents table

-- Allow HODs to view documents in their department
CREATE POLICY "HODs can view department documents"
ON documents FOR SELECT
USING (
  is_hod(auth.uid())
  AND EXISTS (
    SELECT 1 FROM users u
    WHERE u.id = auth.uid()
    AND u.department = (
      SELECT u2.department FROM users u2 
      WHERE u2.id = documents.created_by
    )
  )
);

-- Allow executives to view all documents
CREATE POLICY "Executives can view all documents"
ON documents FOR SELECT
USING (is_executive(auth.uid()));

-- Allow admins to view all documents
CREATE POLICY "Admins can view all documents"
ON documents FOR SELECT
USING (is_admin(auth.uid()));

-- Step 5: Enhanced RLS for document_shares

-- Allow document routing recipients to update share status
CREATE POLICY "Recipients can update share status"
ON document_shares FOR UPDATE
USING (to_user_id = auth.uid());

-- Allow admins to manage all shares
CREATE POLICY "Admins can manage all shares"
ON document_shares FOR ALL
USING (is_admin(auth.uid()));

-- Step 6: Allow message recipients to insert records
CREATE POLICY "Message senders can insert recipients"
ON message_recipients FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM inter_department_messages m
    WHERE m.id = message_id
    AND m.from_user_id = auth.uid()
  )
);

-- Allow viewing messages by department heads
CREATE POLICY "Department heads can view department messages"
ON message_recipients FOR SELECT
USING (
  is_hod(auth.uid()) OR is_director_admin(auth.uid()) OR is_executive(auth.uid())
);

-- Step 7: Allow attachment uploads for message senders
CREATE POLICY "Message senders can insert attachments"
ON message_attachments FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM inter_department_messages m
    WHERE m.id = message_id
    AND m.from_user_id = auth.uid()
  )
);

-- Step 8: Enhanced audit log access for admins
CREATE POLICY "Admins can view all audit logs"
ON audit_logs FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert audit logs"
ON audit_logs FOR INSERT
WITH CHECK (is_admin(auth.uid()) OR auth.uid() IS NOT NULL);

-- Step 9: Allow users to view all active users (for document routing)
CREATE POLICY "Authenticated users can view active users"
ON users FOR SELECT
USING (is_active = true);

-- Step 10: Form submissions access for reviewers
CREATE POLICY "HODs can review form submissions"
ON form_submissions FOR SELECT
USING (
  is_hod(auth.uid()) OR is_admin(auth.uid())
);

CREATE POLICY "Reviewers can update form submissions"
ON form_submissions FOR UPDATE
USING (
  reviewed_by = auth.uid() OR is_hod(auth.uid()) OR is_admin(auth.uid())
);