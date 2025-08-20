
-- First, delete all existing users from the users table
DELETE FROM public.users;

-- Insert new test users for authentication testing
INSERT INTO public.users (id, email, first_name, last_name, role, department, is_active) VALUES
-- CMD user
('11111111-1111-1111-1111-111111111111', 'cmd@test.com', 'Chief Medical', 'Director', 'CMD', 'Administration', true),

-- Super Admin user  
('22222222-2222-2222-2222-222222222222', 'superadmin@test.com', 'Super', 'Admin', 'SUPER_ADMIN', 'Information Technology', true),

-- Admin user
('33333333-3333-3333-3333-333333333333', 'admin@test.com', 'System', 'Admin', 'ADMIN', 'Information Technology', true),

-- HOD users for different departments
('44444444-4444-4444-4444-444444444444', 'hod.radiology@test.com', 'Dr. Sarah', 'Johnson', 'HOD', 'Radiology', true),
('55555555-5555-5555-5555-555555555555', 'hod.dental@test.com', 'Dr. Michael', 'Chen', 'HOD', 'Dental', true),
('66666666-6666-6666-6666-666666666666', 'hod.emergency@test.com', 'Dr. Marcus', 'Williams', 'HOD', 'Accident & Emergency', true),

-- Staff users
('77777777-7777-7777-7777-777777777777', 'staff.radiology@test.com', 'Lisa', 'Garcia', 'STAFF', 'Radiology', true),
('88888888-8888-8888-8888-888888888888', 'staff.dental@test.com', 'Kevin', 'Zhao', 'STAFF', 'Dental', true),
('99999999-9999-9999-9999-999999999999', 'staff.emergency@test.com', 'Amanda', 'Foster', 'STAFF', 'Accident & Emergency', true);
