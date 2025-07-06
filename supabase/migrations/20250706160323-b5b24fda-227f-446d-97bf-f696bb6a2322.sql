
-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Super admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'SUPER_ADMIN'
    )
  );

-- Create RLS policies for documents
CREATE POLICY "Users can view documents they created" ON public.documents
  FOR SELECT USING (created_by = auth.uid());

CREATE POLICY "Users can view documents assigned to them" ON public.documents
  FOR SELECT USING (assigned_to = auth.uid());

CREATE POLICY "Users can create documents" ON public.documents
  FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update documents they created" ON public.documents
  FOR UPDATE USING (created_by = auth.uid());

-- Create RLS policies for document_shares
CREATE POLICY "Users can view shares they sent" ON public.document_shares
  FOR SELECT USING (from_user_id = auth.uid());

CREATE POLICY "Users can view shares sent to them" ON public.document_shares
  FOR SELECT USING (to_user_id = auth.uid());

CREATE POLICY "Users can create document shares" ON public.document_shares
  FOR INSERT WITH CHECK (from_user_id = auth.uid());

-- Create RLS policies for form_submissions
CREATE POLICY "Users can view their own form submissions" ON public.form_submissions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create form submissions" ON public.form_submissions
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Seed initial departments
INSERT INTO public.departments (name, description) VALUES
  ('Administration', 'Administrative department'),
  ('IT', 'Information Technology department'),
  ('Finance', 'Finance and accounting department'),
  ('HR', 'Human Resources department'),
  ('Radiology', 'Radiology department'),
  ('Dental', 'Dental department'),
  ('Eye Clinic', 'Ophthalmology department'),
  ('Accident & Emergency', 'Emergency department'),
  ('Pharmacy', 'Pharmacy department'),
  ('Physiotherapy', 'Physiotherapy department'),
  ('Antenatal', 'Antenatal care department')
ON CONFLICT (name) DO NOTHING;

-- Seed test users with proper authentication integration
-- Note: These users will need to be created through Supabase Auth, but we'll prepare the profile data
INSERT INTO public.users (id, first_name, last_name, email, password_hash, role, department) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'James', 'Wilson', 'cmd@fmcjalingo.org', 'hashed_password', 'CMD', 'Administration'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Robert', 'Martinez', 'superadmin@fmcjalingo.org', 'hashed_password', 'SUPER_ADMIN', 'IT'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Michael', 'Director', 'admin@fmcjalingo.org', 'hashed_password', 'ADMIN', 'Administration'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Sarah', 'Johnson', 'radiology.hod@fmcjalingo.org', 'hashed_password', 'HOD', 'Radiology'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Michael', 'Chen', 'dental.hod@fmcjalingo.org', 'hashed_password', 'HOD', 'Dental'),
  ('550e8400-e29b-41d4-a716-446655440006', 'Emily', 'Patel', 'eyeclinic.hod@fmcjalingo.org', 'hashed_password', 'HOD', 'Eye Clinic'),
  ('550e8400-e29b-41d4-a716-446655440007', 'Lisa', 'Garcia', 'radiology.staff@fmcjalingo.org', 'hashed_password', 'STAFF', 'Radiology'),
  ('550e8400-e29b-41d4-a716-446655440008', 'Kevin', 'Zhao', 'dental.staff@fmcjalingo.org', 'hashed_password', 'STAFF', 'Dental'),
  ('550e8400-e29b-41d4-a716-446655440009', 'Priya', 'Sharma', 'eyeclinic.staff@fmcjalingo.org', 'hashed_password', 'STAFF', 'Eye Clinic'),
  ('550e8400-e29b-41d4-a716-446655440010', 'David', 'Williams', 'finance.hod@fmcjalingo.org', 'hashed_password', 'HOD', 'Finance')
ON CONFLICT (id) DO NOTHING;

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name, email, role, department)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'STAFF'),
    COALESCE(new.raw_user_meta_data->>'department', 'Administration')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
