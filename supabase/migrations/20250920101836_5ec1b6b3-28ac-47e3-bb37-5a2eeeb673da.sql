-- Seed database with mock data

-- First, insert departments
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

-- Insert users (using the mock IDs as UUIDs for testing)
INSERT INTO public.users (id, first_name, last_name, email, role, department, is_active, created_at) VALUES 
('user-cmd-1'::uuid, 'James', 'Wilson', 'cmd@hospital.org', 'CMD', 'Administration', true, '2024-01-15T08:00:00Z'),
('user-super-admin-1'::uuid, 'Robert', 'Martinez', 'superadmin@hospital.org', 'SUPER_ADMIN', 'Information Technology', true, '2024-01-10T09:00:00Z'),
('user-hod-radiology'::uuid, 'Sarah', 'Johnson', 'radiology-hod@hospital.org', 'HOD', 'Radiology', true, '2024-02-01T10:00:00Z'),
('user-hod-dental'::uuid, 'Michael', 'Chen', 'dental-hod@hospital.org', 'HOD', 'Dental', true, '2024-02-01T10:00:00Z'),
('user-hod-eye'::uuid, 'Emily', 'Patel', 'eyeclinic-hod@hospital.org', 'HOD', 'Eye Clinic', true, '2024-02-01T10:00:00Z'),
('user-hod-antenatal'::uuid, 'Grace', 'Thompson', 'antenatal-hod@hospital.org', 'HOD', 'Antenatal', true, '2024-02-01T10:00:00Z'),
('user-hod-emergency'::uuid, 'Marcus', 'Williams', 'ae-hod@hospital.org', 'HOD', 'Accident & Emergency', true, '2024-02-01T10:00:00Z'),
('user-hod-physio'::uuid, 'Sophia', 'Lee', 'physio-hod@hospital.org', 'HOD', 'Physiotherapy', true, '2024-02-01T10:00:00Z'),
('user-hod-pharmacy'::uuid, 'Victoria', 'Adekunle', 'pharmacy-hod@hospital.org', 'HOD', 'Pharmacy', true, '2024-02-01T10:00:00Z'),
('user-hod-hr'::uuid, 'Jennifer', 'Clarke', 'hr-hod@hospital.org', 'HOD', 'Human Resources', true, '2024-02-01T10:00:00Z'),
('user-staff-radiology-1'::uuid, 'Lisa', 'Garcia', 'radiology-tech@hospital.org', 'STAFF', 'Radiology', true, '2024-03-15T11:00:00Z'),
('user-staff-radiology-2'::uuid, 'Mark', 'Rodriguez', 'radiology-nurse@hospital.org', 'STAFF', 'Radiology', true, '2024-03-20T12:00:00Z'),
('user-staff-dental-1'::uuid, 'Kevin', 'Zhao', 'dental-assistant@hospital.org', 'STAFF', 'Dental', true, '2024-03-20T12:00:00Z'),
('user-staff-dental-2'::uuid, 'Maria', 'Santos', 'dental-hygienist@hospital.org', 'STAFF', 'Dental', true, '2024-03-25T13:00:00Z'),
('user-staff-eye-1'::uuid, 'Priya', 'Sharma', 'optometrist@hospital.org', 'STAFF', 'Eye Clinic', true, '2024-04-01T14:00:00Z'),
('user-staff-emergency-1'::uuid, 'Amanda', 'Foster', 'emergency-nurse@hospital.org', 'STAFF', 'Accident & Emergency', true, '2024-04-05T15:00:00Z'),
('user-admin-1'::uuid, 'Alex', 'Morgan', 'admin@hospital.org', 'ADMIN', 'Information Technology', true, '2024-01-20T13:00:00Z');

-- Insert form templates
INSERT INTO public.form_templates (id, title, description, created_by, created_at) VALUES 
('hospital-policy'::uuid, 'Hospital Policy Document', 'Create and manage hospital-wide policies', 'user-cmd-1'::uuid, '2024-01-01T00:00:00Z'),
('patient-referral'::uuid, 'Patient Referral Letter', 'Digital form for patient referrals between departments', 'user-cmd-1'::uuid, '2024-01-15T00:00:00Z'),
('leave-application'::uuid, 'Leave Application', 'Apply for leave from work', 'user-hod-hr'::uuid, '2024-02-01T00:00:00Z'),
('incident-report'::uuid, 'Incident Report', 'Report workplace incidents and safety concerns', 'user-super-admin-1'::uuid, '2024-02-15T00:00:00Z');

-- Insert form fields for hospital policy template
INSERT INTO public.form_fields (template_id, label, field_type, required, order_index) VALUES 
('hospital-policy'::uuid, 'Policy Title', 'text', true, 0),
('hospital-policy'::uuid, 'Policy Number', 'text', true, 1),
('hospital-policy'::uuid, 'Effective Date', 'date', true, 2),
('hospital-policy'::uuid, 'Policy Content', 'richtext', true, 3);

-- Insert form fields for patient referral template
INSERT INTO public.form_fields (template_id, label, field_type, required, order_index, options) VALUES 
('patient-referral'::uuid, 'Patient Name', 'text', true, 0, null),
('patient-referral'::uuid, 'Patient ID/Hospital Number', 'text', true, 1, null),
('patient-referral'::uuid, 'Age', 'number', true, 2, null),
('patient-referral'::uuid, 'Gender', 'select', true, 3, ARRAY['Male', 'Female', 'Other']),
('patient-referral'::uuid, 'Chief Complaint', 'richtext', true, 4, null);

-- Insert form fields for leave application template
INSERT INTO public.form_fields (template_id, label, field_type, required, order_index, options) VALUES 
('leave-application'::uuid, 'Applicant Name', 'text', true, 0, null),
('leave-application'::uuid, 'Employee ID', 'text', true, 1, null),
('leave-application'::uuid, 'Type of Leave', 'select', true, 2, ARRAY['Annual Leave', 'Sick Leave', 'Maternity Leave', 'Emergency Leave', 'Study Leave']),
('leave-application'::uuid, 'Start Date', 'date', true, 3, null),
('leave-application'::uuid, 'End Date', 'date', true, 4, null),
('leave-application'::uuid, 'Reason for Leave', 'textarea', true, 5, null);

-- Insert form fields for incident report template
INSERT INTO public.form_fields (template_id, label, field_type, required, order_index, options) VALUES 
('incident-report'::uuid, 'Incident Date', 'date', true, 0, null),
('incident-report'::uuid, 'Time of Incident', 'text', true, 1, null),
('incident-report'::uuid, 'Location', 'text', true, 2, null),
('incident-report'::uuid, 'Type of Incident', 'select', true, 3, ARRAY['Patient Fall', 'Medication Error', 'Equipment Failure', 'Workplace Injury', 'Security Issue', 'Other']),
('incident-report'::uuid, 'Incident Description', 'richtext', true, 4, null);

-- Insert documents
INSERT INTO public.documents (id, name, description, document_type, status, created_by, assigned_to, current_approver, 
                            approval_chain, file_url, file_size, file_type, priority, tags, requires_signature, 
                            is_digital_form, created_at, updated_at, version) VALUES 
('doc-001'::uuid, 'Monthly Radiology Report - June 2025', 
 'Monthly performance report for Radiology department including patient statistics and equipment status',
 'REPORT', 'SUBMITTED', 'user-hod-radiology'::uuid, 'user-cmd-1'::uuid, 'user-cmd-1'::uuid, 
 ARRAY['user-cmd-1'::uuid], '/documents/radiology-report-june-2025.pdf', 2450000, 'application/pdf', 
 'medium', ARRAY['report', 'monthly', 'radiology', 'statistics'], true, false, 
 '2025-06-30T09:00:00Z', '2025-06-30T09:00:00Z', 1),

('doc-002'::uuid, 'Hospital Safety Policy Update', 
 'Updated hospital-wide safety protocols and emergency procedures',
 'POLICY', 'APPROVED', 'user-cmd-1'::uuid, null, null, 
 ARRAY['user-cmd-1'::uuid], '/documents/safety-policy-update-2025.pdf', 3200000, 'application/pdf', 
 'high', ARRAY['policy', 'safety', 'emergency', 'procedures'], true, false, 
 '2025-06-28T11:30:00Z', '2025-06-29T14:20:00Z', 2),

('doc-003'::uuid, 'Dental Equipment Maintenance Schedule', 
 'Quarterly maintenance schedule for all dental equipment and instruments',
 'PROCEDURE', 'DRAFT', 'user-hod-dental'::uuid, null, null, 
 ARRAY['user-hod-dental'::uuid, 'user-cmd-1'::uuid], '/documents/dental-equipment-maintenance.pdf', 1800000, 'application/pdf', 
 'medium', ARRAY['dental', 'equipment', 'maintenance', 'schedule'], false, false, 
 '2025-06-26T13:45:00Z', '2025-06-26T13:45:00Z', 1);

-- Insert form submissions
INSERT INTO public.form_submissions (id, template_id, user_id, form_data, status, submitted_at, reviewed_by, reviewed_at) VALUES 
('form-sub-001'::uuid, 'patient-referral'::uuid, 'user-staff-radiology-1'::uuid, 
 '{"patient-name": "John Smith", "patient-id": "HSP-2025-001234", "patient-age": 45, "patient-gender": "Male", "chief-complaint": "Persistent headaches and vision problems"}',
 'PENDING', '2025-06-15T10:30:00Z', null, null),

('form-sub-002'::uuid, 'leave-application'::uuid, 'user-staff-dental-1'::uuid,
 '{"applicant-name": "Kevin Zhao", "employee-id": "EMP-2024-0156", "leave-type": "Annual Leave", "start-date": "2025-07-15", "end-date": "2025-07-22", "reason": "Family vacation and personal time"}',
 'APPROVED', '2025-06-20T14:15:00Z', 'user-hod-dental'::uuid, '2025-06-22T09:00:00Z'),

('form-sub-003'::uuid, 'incident-report'::uuid, 'user-staff-radiology-1'::uuid,
 '{"incident-date": "2025-06-25", "incident-time": "15:30", "location": "Radiology Department - Room 203", "incident-type": "Equipment Failure", "incident-description": "X-ray machine malfunctioned during patient examination, causing unexpected shutdown and requiring patient rescheduling."}',
 'PENDING', '2025-06-25T16:45:00Z', null, null);

-- Insert audit logs
INSERT INTO public.audit_logs (id, user_id, action, target_type, target_id, metadata, created_at) VALUES 
('audit-001'::uuid, 'user-hod-radiology'::uuid, 'create', 'document', 'doc-001'::uuid, 
 '{"details": "Monthly Radiology Report created and submitted for CMD review", "ipAddress": "192.168.1.102", "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}',
 '2025-06-30T09:00:00Z'),

('audit-002'::uuid, 'user-cmd-1'::uuid, 'approve', 'document', 'doc-002'::uuid,
 '{"details": "Hospital Safety Policy Update approved with digital signature", "ipAddress": "192.168.1.100", "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}',
 '2025-06-29T14:20:00Z'),

('audit-003'::uuid, 'user-staff-radiology-1'::uuid, 'create', 'form_submission', 'form-sub-001'::uuid,
 '{"details": "Patient Referral Letter submitted for approval", "ipAddress": "192.168.1.110", "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}',
 '2025-06-15T10:30:00Z'),

('audit-004'::uuid, 'user-hod-dental'::uuid, 'approve', 'form_submission', 'form-sub-002'::uuid,
 '{"details": "Leave Application approved for Kevin Zhao", "ipAddress": "192.168.1.105", "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}',
 '2025-06-22T09:00:00Z'),

('audit-005'::uuid, 'user-staff-radiology-1'::uuid, 'create', 'form_submission', 'form-sub-003'::uuid,
 '{"details": "Incident Report submitted regarding equipment failure", "ipAddress": "192.168.1.110", "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}',
 '2025-06-25T16:45:00Z'),

('audit-006'::uuid, 'user-cmd-1'::uuid, 'view', 'document', 'doc-001'::uuid,
 '{"details": "Viewed Monthly Radiology Report for review", "ipAddress": "192.168.1.100", "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}',
 '2025-07-01T08:15:00Z');

-- Insert digital signatures
INSERT INTO public.digital_signatures (id, document_id, user_id, signature_image, signed_at) VALUES 
('sig-001'::uuid, 'doc-002'::uuid, 'user-cmd-1'::uuid, 
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
 '2025-06-29T14:20:00Z'),

('sig-002'::uuid, 'form-sub-002'::uuid, 'user-hod-dental'::uuid,
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
 '2025-06-22T09:00:00Z');