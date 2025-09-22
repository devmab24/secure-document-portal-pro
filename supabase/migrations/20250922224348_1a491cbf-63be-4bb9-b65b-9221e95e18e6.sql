-- Seed database with proper UUIDs

-- Seed departments with proper UUIDs
INSERT INTO public.departments (id, name, description) VALUES 
(gen_random_uuid(), 'Radiology', 'Medical imaging and diagnostic services'),
(gen_random_uuid(), 'Dental', 'Dental care and oral health services'),
(gen_random_uuid(), 'Eye Clinic', 'Ophthalmology and eye care services'),
(gen_random_uuid(), 'Antenatal', 'Prenatal care and maternal health services'),
(gen_random_uuid(), 'Accident & Emergency', 'Emergency medical services and trauma care'),
(gen_random_uuid(), 'Physiotherapy', 'Physical therapy and rehabilitation services'),
(gen_random_uuid(), 'Pharmacy', 'Pharmaceutical services and medication management'),
(gen_random_uuid(), 'Human Resources', 'Human resources and staff management'),
(gen_random_uuid(), 'Finance', 'Financial management and accounting services'),
(gen_random_uuid(), 'Information Technology', 'IT services and system administration'),
(gen_random_uuid(), 'Administration', 'General administration and management');

-- Seed users (CMD, HODs, and Staff)
INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at) VALUES 
-- CMD
(gen_random_uuid(), 'James', 'Wilson', 'cmd@hospital.org', 'CMD', 'Administration', true, '2024-01-15T08:00:00Z'),
-- HODs
(gen_random_uuid(), 'Sarah', 'Johnson', 'radiology-hod@hospital.org', 'HOD', 'Radiology', true, '2024-02-01T10:00:00Z'),
(gen_random_uuid(), 'Michael', 'Chen', 'dental-hod@hospital.org', 'HOD', 'Dental', true, '2024-02-01T10:00:00Z'),
(gen_random_uuid(), 'Emily', 'Patel', 'eyeclinic-hod@hospital.org', 'HOD', 'Eye Clinic', true, '2024-02-01T10:00:00Z'),
(gen_random_uuid(), 'Grace', 'Thompson', 'antenatal-hod@hospital.org', 'HOD', 'Antenatal', true, '2024-02-01T10:00:00Z'),
(gen_random_uuid(), 'Marcus', 'Williams', 'ae-hod@hospital.org', 'HOD', 'Accident & Emergency', true, '2024-02-01T10:00:00Z'),
(gen_random_uuid(), 'Sophia', 'Lee', 'physio-hod@hospital.org', 'HOD', 'Physiotherapy', true, '2024-02-01T10:00:00Z'),
(gen_random_uuid(), 'Victoria', 'Adekunle', 'pharmacy-hod@hospital.org', 'HOD', 'Pharmacy', true, '2024-02-01T10:00:00Z'),
(gen_random_uuid(), 'Jennifer', 'Clarke', 'hr-hod@hospital.org', 'HOD', 'Human Resources', true, '2024-02-01T10:00:00Z'),
-- Staff
(gen_random_uuid(), 'Lisa', 'Garcia', 'radiology-tech@hospital.org', 'STAFF', 'Radiology', true, '2024-03-15T11:00:00Z'),
(gen_random_uuid(), 'Mark', 'Rodriguez', 'radiology-nurse@hospital.org', 'STAFF', 'Radiology', true, '2024-03-20T12:00:00Z'),
(gen_random_uuid(), 'Kevin', 'Zhao', 'dental-assistant@hospital.org', 'STAFF', 'Dental', true, '2024-03-20T12:00:00Z'),
(gen_random_uuid(), 'Maria', 'Santos', 'dental-hygienist@hospital.org', 'STAFF', 'Dental', true, '2024-03-25T13:00:00Z'),
(gen_random_uuid(), 'Priya', 'Sharma', 'optometrist@hospital.org', 'STAFF', 'Eye Clinic', true, '2024-04-01T14:00:00Z'),
(gen_random_uuid(), 'Amanda', 'Foster', 'emergency-nurse@hospital.org', 'STAFF', 'Accident & Emergency', true, '2024-04-05T15:00:00Z'),
-- Admin
(gen_random_uuid(), 'Alex', 'Morgan', 'admin@hospital.org', 'ADMIN', 'Information Technology', true, '2024-01-20T13:00:00Z');

-- Create some sample documents
INSERT INTO public.documents (name, description, document_type, status, created_by, file_url, file_size, file_type, priority, tags, requires_signature, is_digital_form, created_at, updated_at, version)
SELECT 
    'Monthly Radiology Report - June 2025',
    'Monthly performance report for Radiology department including patient statistics and equipment status',
    'REPORT',
    'SUBMITTED',
    u.id,
    '/documents/radiology-report-june-2025.pdf',
    2450000,
    'application/pdf',
    'medium',
    ARRAY['report', 'monthly', 'radiology', 'statistics'],
    true,
    false,
    '2025-06-30T09:00:00Z',
    '2025-06-30T09:00:00Z',
    1
FROM public.users u 
WHERE u.email = 'radiology-hod@hospital.org'
LIMIT 1;

INSERT INTO public.documents (name, description, document_type, status, created_by, file_url, file_size, file_type, priority, tags, requires_signature, is_digital_form, created_at, updated_at, version)
SELECT 
    'Hospital Safety Policy Update',
    'Updated hospital-wide safety protocols and emergency procedures',
    'POLICY',
    'APPROVED',
    u.id,
    '/documents/safety-policy-update-2025.pdf',
    3200000,
    'application/pdf',
    'high',
    ARRAY['policy', 'safety', 'emergency', 'procedures'],
    true,
    false,
    '2025-06-28T11:30:00Z',
    '2025-06-29T14:20:00Z',
    2
FROM public.users u 
WHERE u.email = 'cmd@hospital.org'
LIMIT 1;

-- Create sample form templates
INSERT INTO public.form_templates (title, description, created_by, created_at)
SELECT 
    'Patient Referral Letter',
    'Digital form for patient referrals between departments',
    u.id,
    '2024-01-15T00:00:00Z'
FROM public.users u 
WHERE u.email = 'cmd@hospital.org'
LIMIT 1;

INSERT INTO public.form_templates (title, description, created_by, created_at)
SELECT 
    'Leave Application',
    'Apply for leave from work',
    u.id,
    '2024-02-01T00:00:00Z'
FROM public.users u 
WHERE u.email = 'hr-hod@hospital.org'
LIMIT 1;