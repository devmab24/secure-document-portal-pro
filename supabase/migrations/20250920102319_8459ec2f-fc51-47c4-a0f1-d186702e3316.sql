-- Clean database seeding with proper relationships

-- Seed departments
INSERT INTO public.departments (id, name, description) VALUES 
('dept-radiology', 'Radiology', 'Medical imaging and diagnostic services'),
('dept-dental', 'Dental', 'Dental care and oral health services'),
('dept-eye-clinic', 'Eye Clinic', 'Ophthalmology and eye care services'),
('dept-antenatal', 'Antenatal', 'Prenatal care and maternal health services'),
('dept-emergency', 'Accident & Emergency', 'Emergency medical services and trauma care'),
('dept-physiotherapy', 'Physiotherapy', 'Physical therapy and rehabilitation services'),
('dept-pharmacy', 'Pharmacy', 'Pharmaceutical services and medication management'),
('dept-hr', 'Human Resources', 'Human resources and staff management'),
('dept-finance', 'Finance', 'Financial management and accounting services'),
('dept-it', 'Information Technology', 'IT services and system administration'),
('dept-admin', 'Administration', 'General administration and management');

-- Seed users with properly mapped UUIDs
INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at) VALUES 
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e501'::uuid, 'James', 'Wilson', 'cmd@hospital.org', 'CMD', 'Administration', true, '2024-01-15T08:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e502'::uuid, 'Robert', 'Martinez', 'superadmin@hospital.org', 'SUPER_ADMIN', 'Information Technology', true, '2024-01-10T09:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e503'::uuid, 'Sarah', 'Johnson', 'radiology-hod@hospital.org', 'HOD', 'Radiology', true, '2024-02-01T10:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e504'::uuid, 'Michael', 'Chen', 'dental-hod@hospital.org', 'HOD', 'Dental', true, '2024-02-01T10:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e505'::uuid, 'Emily', 'Patel', 'eyeclinic-hod@hospital.org', 'HOD', 'Eye Clinic', true, '2024-02-01T10:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e506'::uuid, 'Grace', 'Thompson', 'antenatal-hod@hospital.org', 'HOD', 'Antenatal', true, '2024-02-01T10:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e507'::uuid, 'Marcus', 'Williams', 'ae-hod@hospital.org', 'HOD', 'Accident & Emergency', true, '2024-02-01T10:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e508'::uuid, 'Sophia', 'Lee', 'physio-hod@hospital.org', 'HOD', 'Physiotherapy', true, '2024-02-01T10:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e509'::uuid, 'Victoria', 'Adekunle', 'pharmacy-hod@hospital.org', 'HOD', 'Pharmacy', true, '2024-02-01T10:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e510'::uuid, 'Jennifer', 'Clarke', 'hr-hod@hospital.org', 'HOD', 'Human Resources', true, '2024-02-01T10:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e511'::uuid, 'Lisa', 'Garcia', 'radiology-tech@hospital.org', 'STAFF', 'Radiology', true, '2024-03-15T11:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e512'::uuid, 'Mark', 'Rodriguez', 'radiology-nurse@hospital.org', 'STAFF', 'Radiology', true, '2024-03-20T12:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e513'::uuid, 'Kevin', 'Zhao', 'dental-assistant@hospital.org', 'STAFF', 'Dental', true, '2024-03-20T12:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e514'::uuid, 'Maria', 'Santos', 'dental-hygienist@hospital.org', 'STAFF', 'Dental', true, '2024-03-25T13:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e515'::uuid, 'Priya', 'Sharma', 'optometrist@hospital.org', 'STAFF', 'Eye Clinic', true, '2024-04-01T14:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e516'::uuid, 'Amanda', 'Foster', 'emergency-nurse@hospital.org', 'STAFF', 'Accident & Emergency', true, '2024-04-05T15:00:00Z'),
('a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e517'::uuid, 'Alex', 'Morgan', 'admin@hospital.org', 'ADMIN', 'Information Technology', true, '2024-01-20T13:00:00Z');

-- Seed form templates
INSERT INTO public.form_templates (id, title, description, created_by, created_at) VALUES 
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f601'::uuid, 'Hospital Policy Document', 'Create and manage hospital-wide policies', 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e501'::uuid, '2024-01-01T00:00:00Z'),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f602'::uuid, 'Patient Referral Letter', 'Digital form for patient referrals between departments', 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e501'::uuid, '2024-01-15T00:00:00Z'),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f603'::uuid, 'Leave Application', 'Apply for leave from work', 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e510'::uuid, '2024-02-01T00:00:00Z'),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f604'::uuid, 'Incident Report', 'Report workplace incidents and safety concerns', 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e502'::uuid, '2024-02-15T00:00:00Z');

-- Seed form fields
INSERT INTO public.form_fields (template_id, label, field_type, required, order_index, options) VALUES 
-- Policy template fields
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f601'::uuid, 'Policy Title', 'text', true, 0, null),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f601'::uuid, 'Policy Number', 'text', true, 1, null),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f601'::uuid, 'Effective Date', 'date', true, 2, null),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f601'::uuid, 'Policy Content', 'richtext', true, 3, null),
-- Patient referral fields
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f602'::uuid, 'Patient Name', 'text', true, 0, null),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f602'::uuid, 'Patient ID/Hospital Number', 'text', true, 1, null),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f602'::uuid, 'Age', 'number', true, 2, null),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f602'::uuid, 'Gender', 'select', true, 3, ARRAY['Male', 'Female', 'Other']),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f602'::uuid, 'Chief Complaint', 'richtext', true, 4, null),
-- Leave application fields
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f603'::uuid, 'Applicant Name', 'text', true, 0, null),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f603'::uuid, 'Employee ID', 'text', true, 1, null),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f603'::uuid, 'Type of Leave', 'select', true, 2, ARRAY['Annual Leave', 'Sick Leave', 'Maternity Leave', 'Emergency Leave', 'Study Leave']),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f603'::uuid, 'Start Date', 'date', true, 3, null),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f603'::uuid, 'End Date', 'date', true, 4, null),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f603'::uuid, 'Reason for Leave', 'textarea', true, 5, null),
-- Incident report fields
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f604'::uuid, 'Incident Date', 'date', true, 0, null),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f604'::uuid, 'Time of Incident', 'text', true, 1, null),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f604'::uuid, 'Location', 'text', true, 2, null),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f604'::uuid, 'Type of Incident', 'select', true, 3, ARRAY['Patient Fall', 'Medication Error', 'Equipment Failure', 'Workplace Injury', 'Security Issue', 'Other']),
('b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f604'::uuid, 'Incident Description', 'richtext', true, 4, null);

-- Seed documents 
INSERT INTO public.documents (id, name, description, document_type, status, created_by, assigned_to, current_approver, 
                            approval_chain, file_url, file_size, file_type, priority, tags, requires_signature, 
                            is_digital_form, created_at, updated_at, version) VALUES 
('c3c3c3c3-d4d4-e5e5-f6f6-171717171701'::uuid, 'Monthly Radiology Report - June 2025', 
 'Monthly performance report for Radiology department including patient statistics and equipment status',
 'REPORT', 'SUBMITTED', 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e503'::uuid, 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e501'::uuid, 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e501'::uuid, 
 ARRAY['a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e501'::uuid], '/documents/radiology-report-june-2025.pdf', 2450000, 'application/pdf', 
 'medium', ARRAY['report', 'monthly', 'radiology', 'statistics'], true, false, 
 '2025-06-30T09:00:00Z', '2025-06-30T09:00:00Z', 1),

('c3c3c3c3-d4d4-e5e5-f6f6-171717171702'::uuid, 'Hospital Safety Policy Update', 
 'Updated hospital-wide safety protocols and emergency procedures',
 'POLICY', 'APPROVED', 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e501'::uuid, null, null, 
 ARRAY['a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e501'::uuid], '/documents/safety-policy-update-2025.pdf', 3200000, 'application/pdf', 
 'high', ARRAY['policy', 'safety', 'emergency', 'procedures'], true, false, 
 '2025-06-28T11:30:00Z', '2025-06-29T14:20:00Z', 2),

('c3c3c3c3-d4d4-e5e5-f6f6-171717171703'::uuid, 'Dental Equipment Maintenance Schedule', 
 'Quarterly maintenance schedule for all dental equipment and instruments',
 'PROCEDURE', 'DRAFT', 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e504'::uuid, null, null, 
 ARRAY['a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e504'::uuid, 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e501'::uuid], '/documents/dental-equipment-maintenance.pdf', 1800000, 'application/pdf', 
 'medium', ARRAY['dental', 'equipment', 'maintenance', 'schedule'], false, false, 
 '2025-06-26T13:45:00Z', '2025-06-26T13:45:00Z', 1);

-- Seed form submissions
INSERT INTO public.form_submissions (id, template_id, user_id, form_data, status, submitted_at, reviewed_by, reviewed_at) VALUES 
('d4d4d4d4-e5e5-f6f6-1717-282828282801'::uuid, 'b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f602'::uuid, 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e511'::uuid, 
 '{"patient-name": "John Smith", "patient-id": "HSP-2025-001234", "patient-age": 45, "patient-gender": "Male", "chief-complaint": "Persistent headaches and vision problems"}',
 'PENDING', '2025-06-15T10:30:00Z', null, null),

('d4d4d4d4-e5e5-f6f6-1717-282828282802'::uuid, 'b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f603'::uuid, 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e513'::uuid,
 '{"applicant-name": "Kevin Zhao", "employee-id": "EMP-2024-0156", "leave-type": "Annual Leave", "start-date": "2025-07-15", "end-date": "2025-07-22", "reason": "Family vacation and personal time"}',
 'APPROVED', '2025-06-20T14:15:00Z', 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e504'::uuid, '2025-06-22T09:00:00Z'),

('d4d4d4d4-e5e5-f6f6-1717-282828282803'::uuid, 'b2b2b2b2-c3c3-d4d4-e5e5-f6f6f6f6f604'::uuid, 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e511'::uuid,
 '{"incident-date": "2025-06-25", "incident-time": "15:30", "location": "Radiology Department - Room 203", "incident-type": "Equipment Failure", "incident-description": "X-ray machine malfunctioned during patient examination, causing unexpected shutdown and requiring patient rescheduling."}',
 'PENDING', '2025-06-25T16:45:00Z', null, null);

-- Seed audit logs
INSERT INTO public.audit_logs (id, user_id, action, target_type, target_id, metadata, created_at) VALUES 
('e5e5e5e5-f6f6-1717-2828-393939393901'::uuid, 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e503'::uuid, 'create', 'document', 'c3c3c3c3-d4d4-e5e5-f6f6-171717171701'::uuid, 
 '{"details": "Monthly Radiology Report created and submitted for CMD review", "ipAddress": "192.168.1.102", "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}',
 '2025-06-30T09:00:00Z'),

('e5e5e5e5-f6f6-1717-2828-393939393902'::uuid, 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e501'::uuid, 'approve', 'document', 'c3c3c3c3-d4d4-e5e5-f6f6-171717171702'::uuid,
 '{"details": "Hospital Safety Policy Update approved with digital signature", "ipAddress": "192.168.1.100", "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}',
 '2025-06-29T14:20:00Z'),

('e5e5e5e5-f6f6-1717-2828-393939393903'::uuid, 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e511'::uuid, 'create', 'form_submission', 'd4d4d4d4-e5e5-f6f6-1717-282828282801'::uuid,
 '{"details": "Patient Referral Letter submitted for approval", "ipAddress": "192.168.1.110", "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}',
 '2025-06-15T10:30:00Z'),

('e5e5e5e5-f6f6-1717-2828-393939393904'::uuid, 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e504'::uuid, 'approve', 'form_submission', 'd4d4d4d4-e5e5-f6f6-1717-282828282802'::uuid,
 '{"details": "Leave Application approved for Kevin Zhao", "ipAddress": "192.168.1.105", "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}',
 '2025-06-22T09:00:00Z'),

('e5e5e5e5-f6f6-1717-2828-393939393905'::uuid, 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e511'::uuid, 'create', 'form_submission', 'd4d4d4d4-e5e5-f6f6-1717-282828282803'::uuid,
 '{"details": "Incident Report submitted regarding equipment failure", "ipAddress": "192.168.1.110", "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}',
 '2025-06-25T16:45:00Z');

-- Seed digital signatures (only for actual documents)
INSERT INTO public.digital_signatures (id, document_id, user_id, signature_image, signed_at) VALUES 
('f6f6f6f6-1717-2828-3939-505050505001'::uuid, 'c3c3c3c3-d4d4-e5e5-f6f6-171717171702'::uuid, 'a1a1a1a1-b2b2-c3c3-d4d4-e5e5e5e5e501'::uuid, 
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
 '2025-06-29T14:20:00Z');