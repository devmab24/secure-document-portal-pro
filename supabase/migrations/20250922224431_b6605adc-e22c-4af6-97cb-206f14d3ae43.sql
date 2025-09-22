-- Seed additional data only if it doesn't already exist

-- Only insert users that don't already exist
INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at)
SELECT gen_random_uuid(), 'James', 'Wilson', 'cmd@hospital.org', 'CMD', 'Administration', true, '2024-01-15T08:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'cmd@hospital.org');

INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at)
SELECT gen_random_uuid(), 'Sarah', 'Johnson', 'radiology-hod@hospital.org', 'HOD', 'Radiology', true, '2024-02-01T10:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'radiology-hod@hospital.org');

INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at)
SELECT gen_random_uuid(), 'Michael', 'Chen', 'dental-hod@hospital.org', 'HOD', 'Dental', true, '2024-02-01T10:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'dental-hod@hospital.org');

INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at)
SELECT gen_random_uuid(), 'Emily', 'Patel', 'eyeclinic-hod@hospital.org', 'HOD', 'Eye Clinic', true, '2024-02-01T10:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'eyeclinic-hod@hospital.org');

INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at)
SELECT gen_random_uuid(), 'Grace', 'Thompson', 'antenatal-hod@hospital.org', 'HOD', 'Antenatal', true, '2024-02-01T10:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'antenatal-hod@hospital.org');

INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at)
SELECT gen_random_uuid(), 'Marcus', 'Williams', 'ae-hod@hospital.org', 'HOD', 'Accident & Emergency', true, '2024-02-01T10:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'ae-hod@hospital.org');

INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at)
SELECT gen_random_uuid(), 'Sophia', 'Lee', 'physio-hod@hospital.org', 'HOD', 'Physiotherapy', true, '2024-02-01T10:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'physio-hod@hospital.org');

INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at)
SELECT gen_random_uuid(), 'Victoria', 'Adekunle', 'pharmacy-hod@hospital.org', 'HOD', 'Pharmacy', true, '2024-02-01T10:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'pharmacy-hod@hospital.org');

INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at)
SELECT gen_random_uuid(), 'Jennifer', 'Clarke', 'hr-hod@hospital.org', 'HOD', 'Human Resources', true, '2024-02-01T10:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'hr-hod@hospital.org');

-- Staff members
INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at)
SELECT gen_random_uuid(), 'Lisa', 'Garcia', 'radiology-tech@hospital.org', 'STAFF', 'Radiology', true, '2024-03-15T11:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'radiology-tech@hospital.org');

INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at)
SELECT gen_random_uuid(), 'Mark', 'Rodriguez', 'radiology-nurse@hospital.org', 'STAFF', 'Radiology', true, '2024-03-20T12:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'radiology-nurse@hospital.org');

INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at)
SELECT gen_random_uuid(), 'Kevin', 'Zhao', 'dental-assistant@hospital.org', 'STAFF', 'Dental', true, '2024-03-20T12:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'dental-assistant@hospital.org');

INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at)
SELECT gen_random_uuid(), 'Alex', 'Morgan', 'admin@hospital.org', 'ADMIN', 'Information Technology', true, '2024-01-20T13:00:00Z'
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'admin@hospital.org');

-- Create some sample documents only if they don't exist
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
AND NOT EXISTS (SELECT 1 FROM public.documents WHERE name = 'Monthly Radiology Report - June 2025')
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
AND NOT EXISTS (SELECT 1 FROM public.documents WHERE name = 'Hospital Safety Policy Update')
LIMIT 1;