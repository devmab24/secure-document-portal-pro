
-- Drop role check constraint if exists
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- Executive Leadership
INSERT INTO public.users (id, email, first_name, last_name, role, department, is_active)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'cmd@fmcj.gov.ng', 'Abubakar', 'Mohammed', 'CMD', 'Administration', true),
  ('00000000-0000-0000-0000-000000000002', 'cmac@fmcj.gov.ng', 'Fatima', 'Ibrahim', 'CMAC', 'Administration', true),
  ('00000000-0000-0000-0000-000000000003', 'director.admin@fmcj.gov.ng', 'Yakubu', 'Adamu', 'DIRECTOR_ADMIN', 'Administration', true),
  ('00000000-0000-0000-0000-000000000004', 'head.nursing@fmcj.gov.ng', 'Halima', 'Yusuf', 'HEAD_OF_NURSING', 'Nursing Services', true),
  ('00000000-0000-0000-0000-000000000005', 'chief.accountant@fmcj.gov.ng', 'Musa', 'Aliyu', 'CHIEF_ACCOUNTANT', 'Finance and Accounts', true),
  ('00000000-0000-0000-0000-000000000006', 'chief.procurement@fmcj.gov.ng', 'Binta', 'Suleiman', 'CHIEF_PROCUREMENT_OFFICER', 'Procurement', true),
  ('00000000-0000-0000-0000-000000000007', 'medical.records@fmcj.gov.ng', 'Hassan', 'Danjuma', 'MEDICAL_RECORDS_OFFICER', 'Medical Records', true),
  ('00000000-0000-0000-0000-000000000008', 'registry@fmcj.gov.ng', 'Amina', 'Tanko', 'REGISTRY', 'Administration', true),
  ('00000000-0000-0000-0000-000000000009', 'superadmin@fmcj.gov.ng', 'System', 'Administrator', 'SUPER_ADMIN', 'Administration', true),
  ('00000000-0000-0000-0000-000000000010', 'admin@fmcj.gov.ng', 'ICT', 'Admin', 'ADMIN', 'Administration', true)
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, department = EXCLUDED.department;

-- Clinical HODs
INSERT INTO public.users (id, email, first_name, last_name, role, department, is_active)
VALUES 
  ('00000000-0000-0000-0001-000000000001', 'hod.medicalrecords@fmcj.gov.ng', 'Ibrahim', 'Garba', 'HOD', 'Medical Records', true),
  ('00000000-0000-0000-0001-000000000002', 'hod.familymedicine@fmcj.gov.ng', 'Aisha', 'Bello', 'HOD', 'Family Medicine', true),
  ('00000000-0000-0000-0001-000000000003', 'hod.internalmedicine@fmcj.gov.ng', 'Abdullahi', 'Usman', 'HOD', 'Internal Medicine', true),
  ('00000000-0000-0000-0001-000000000004', 'hod.paediatrics@fmcj.gov.ng', 'Zainab', 'Musa', 'HOD', 'Paediatrics', true),
  ('00000000-0000-0000-0001-000000000005', 'hod.obstetrics@fmcj.gov.ng', 'Hauwa', 'Ahmed', 'HOD', 'Obstetrics and Gynaecology', true),
  ('00000000-0000-0000-0001-000000000006', 'hod.surgery@fmcj.gov.ng', 'Yusuf', 'Lawal', 'HOD', 'Surgery', true),
  ('00000000-0000-0000-0001-000000000007', 'hod.anaesthesia@fmcj.gov.ng', 'Khadija', 'Sani', 'HOD', 'Anaesthesia', true),
  ('00000000-0000-0000-0001-000000000008', 'hod.orthopaedic@fmcj.gov.ng', 'Muhammed', 'Isa', 'HOD', 'Orthopaedic Surgery', true),
  ('00000000-0000-0000-0001-000000000009', 'hod.ent@fmcj.gov.ng', 'Salamatu', 'Baba', 'HOD', 'Otorhinolaryngology', true),
  ('00000000-0000-0000-0001-000000000010', 'hod.ophthalmology@fmcj.gov.ng', 'Adamu', 'Yakubu', 'HOD', 'Ophthalmology', true),
  ('00000000-0000-0000-0001-000000000011', 'hod.dentistry@fmcj.gov.ng', 'Fatima', 'Danladi', 'HOD', 'Dentistry', true),
  ('00000000-0000-0000-0001-000000000012', 'hod.nursing@fmcj.gov.ng', 'Hafsat', 'Abubakar', 'HOD', 'Nursing Services', true),
  ('00000000-0000-0000-0001-000000000013', 'hod.pharmacy@fmcj.gov.ng', 'Gambo', 'Shehu', 'HOD', 'Pharmacy', true),
  ('00000000-0000-0000-0001-000000000014', 'hod.radiology@fmcj.gov.ng', 'Maryam', 'Umar', 'HOD', 'Radiology', true),
  ('00000000-0000-0000-0001-000000000015', 'hod.histopathology@fmcj.gov.ng', 'Sule', 'Danjuma', 'HOD', 'Histopathology', true),
  ('00000000-0000-0000-0001-000000000016', 'hod.labservices@fmcj.gov.ng', 'Bilkisu', 'Haruna', 'HOD', 'Medical Laboratory Services', true),
  ('00000000-0000-0000-0001-000000000017', 'hod.physiotherapy@fmcj.gov.ng', 'Ismail', 'Abdullahi', 'HOD', 'Physiotherapy', true),
  ('00000000-0000-0000-0001-000000000018', 'hod.publichealth@fmcj.gov.ng', 'Rashida', 'Mahmud', 'HOD', 'Public Health', true),
  ('00000000-0000-0000-0001-000000000019', 'hod.nutrition@fmcj.gov.ng', 'Jamila', 'Idris', 'HOD', 'Nutrition and Dietetics', true),
  ('00000000-0000-0000-0001-000000000020', 'hod.socialservices@fmcj.gov.ng', 'Badamasi', 'Yusuf', 'HOD', 'Medical Social Services', true),
  ('00000000-0000-0000-0001-000000000021', 'hod.nemsas@fmcj.gov.ng', 'Saidu', 'Ibrahim', 'HOD', 'NEMSAS', true),
  ('00000000-0000-0000-0001-000000000022', 'hod.oncology@fmcj.gov.ng', 'Hassana', 'Musa', 'HOD', 'Oncology Unit', true),
  ('00000000-0000-0000-0001-000000000023', 'hod.ipc@fmcj.gov.ng', 'Babangida', 'Sani', 'HOD', 'Infection Prevention and Control', true)
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, department = EXCLUDED.department;

-- Non-Clinical HODs
INSERT INTO public.users (id, email, first_name, last_name, role, department, is_active)
VALUES 
  ('00000000-0000-0000-0002-000000000001', 'hod.administration@fmcj.gov.ng', 'Abdulkadir', 'Bello', 'HOD', 'Administration', true),
  ('00000000-0000-0000-0002-000000000002', 'hod.internalaudit@fmcj.gov.ng', 'Raliya', 'Danladi', 'HOD', 'Internal Audit', true),
  ('00000000-0000-0000-0002-000000000003', 'hod.finance@fmcj.gov.ng', 'Garba', 'Shehu', 'HOD', 'Finance and Accounts', true),
  ('00000000-0000-0000-0002-000000000004', 'hod.procurement@fmcj.gov.ng', 'Hadiza', 'Aliyu', 'HOD', 'Procurement', true),
  ('00000000-0000-0000-0002-000000000005', 'hod.works@fmcj.gov.ng', 'Sulaiman', 'Tanko', 'HOD', 'Works and Maintenance', true),
  ('00000000-0000-0000-0002-000000000006', 'hod.planning@fmcj.gov.ng', 'Asabe', 'Mohammed', 'HOD', 'Physical Planning', true),
  ('00000000-0000-0000-0002-000000000007', 'hod.actu@fmcj.gov.ng', 'Yau', 'Ibrahim', 'HOD', 'ACTU', true),
  ('00000000-0000-0000-0002-000000000008', 'hod.ethics@fmcj.gov.ng', 'Rakiya', 'Abubakar', 'HOD', 'Health Research and Ethics', true),
  ('00000000-0000-0000-0002-000000000009', 'hod.security@fmcj.gov.ng', 'Adamu', 'Garba', 'HOD', 'Security Services', true)
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, department = EXCLUDED.department;

-- Head of Unit Users
INSERT INTO public.users (id, email, first_name, last_name, role, department, is_active)
VALUES 
  ('00000000-0000-0000-0003-000000000001', 'head.plasticsurgery@fmcj.gov.ng', 'Bashir', 'Lawal', 'HEAD_OF_UNIT', 'Surgery', true),
  ('00000000-0000-0000-0003-000000000002', 'head.ae@fmcj.gov.ng', 'Fatima', 'Usman', 'HEAD_OF_UNIT', 'Surgery', true),
  ('00000000-0000-0000-0003-000000000003', 'head.generalsurgery@fmcj.gov.ng', 'Mohammed', 'Bello', 'HEAD_OF_UNIT', 'Surgery', true),
  ('00000000-0000-0000-0003-000000000004', 'head.urology@fmcj.gov.ng', 'Aisha', 'Danjuma', 'HEAD_OF_UNIT', 'Surgery', true),
  ('00000000-0000-0000-0003-000000000005', 'head.theatre@fmcj.gov.ng', 'Suleiman', 'Ahmed', 'HEAD_OF_UNIT', 'Surgery', true),
  ('00000000-0000-0000-0003-000000000006', 'head.ecg@fmcj.gov.ng', 'Halima', 'Ibrahim', 'HEAD_OF_UNIT', 'Internal Medicine', true),
  ('00000000-0000-0000-0003-000000000007', 'head.endoscopy@fmcj.gov.ng', 'Yusuf', 'Musa', 'HEAD_OF_UNIT', 'Internal Medicine', true),
  ('00000000-0000-0000-0003-000000000008', 'head.dialysis@fmcj.gov.ng', 'Zainab', 'Haruna', 'HEAD_OF_UNIT', 'Internal Medicine', true),
  ('00000000-0000-0000-0003-000000000009', 'head.isolation@fmcj.gov.ng', 'Abdullahi', 'Garba', 'HEAD_OF_UNIT', 'Internal Medicine', true),
  ('00000000-0000-0000-0003-000000000010', 'head.art@fmcj.gov.ng', 'Maryam', 'Sani', 'HEAD_OF_UNIT', 'Internal Medicine', true),
  ('00000000-0000-0000-0003-000000000011', 'head.dots@fmcj.gov.ng', 'Ibrahim', 'Yusuf', 'HEAD_OF_UNIT', 'Internal Medicine', true),
  ('00000000-0000-0000-0003-000000000012', 'head.specializedpharm@fmcj.gov.ng', 'Hafsat', 'Bello', 'HEAD_OF_UNIT', 'Pharmacy', true),
  ('00000000-0000-0000-0003-000000000013', 'head.drugproduction@fmcj.gov.ng', 'Gambo', 'Lawal', 'HEAD_OF_UNIT', 'Pharmacy', true),
  ('00000000-0000-0000-0003-000000000014', 'head.druginfo@fmcj.gov.ng', 'Salamatu', 'Usman', 'HEAD_OF_UNIT', 'Pharmacy', true),
  ('00000000-0000-0000-0003-000000000015', 'head.centralpharm@fmcj.gov.ng', 'Adamu', 'Shehu', 'HEAD_OF_UNIT', 'Pharmacy', true),
  ('00000000-0000-0000-0003-000000000016', 'head.gopc@fmcj.gov.ng', 'Bilkisu', 'Ahmed', 'HEAD_OF_UNIT', 'Family Medicine', true),
  ('00000000-0000-0000-0003-000000000017', 'head.nhiaclinic@fmcj.gov.ng', 'Ismail', 'Tanko', 'HEAD_OF_UNIT', 'Family Medicine', true),
  ('00000000-0000-0000-0003-000000000018', 'head.retainership@fmcj.gov.ng', 'Rashida', 'Danladi', 'HEAD_OF_UNIT', 'Family Medicine', true),
  ('00000000-0000-0000-0003-000000000019', 'head.cashunit@fmcj.gov.ng', 'Jamila', 'Mohammed', 'HEAD_OF_UNIT', 'Finance and Accounts', true),
  ('00000000-0000-0000-0003-000000000020', 'head.payroll@fmcj.gov.ng', 'Badamasi', 'Ibrahim', 'HEAD_OF_UNIT', 'Finance and Accounts', true),
  ('00000000-0000-0000-0003-000000000021', 'head.budget@fmcj.gov.ng', 'Saidu', 'Aliyu', 'HEAD_OF_UNIT', 'Finance and Accounts', true),
  ('00000000-0000-0000-0003-000000000022', 'head.publicrelations@fmcj.gov.ng', 'Hassana', 'Garba', 'HEAD_OF_UNIT', 'Administration', true),
  ('00000000-0000-0000-0003-000000000023', 'head.ict@fmcj.gov.ng', 'Babangida', 'Usman', 'HEAD_OF_UNIT', 'Administration', true),
  ('00000000-0000-0000-0003-000000000024', 'head.library@fmcj.gov.ng', 'Raliya', 'Bello', 'HEAD_OF_UNIT', 'Administration', true),
  ('00000000-0000-0000-0003-000000000025', 'head.legal@fmcj.gov.ng', 'Garba', 'Musa', 'HEAD_OF_UNIT', 'Administration', true),
  ('00000000-0000-0000-0003-000000000026', 'head.registry@fmcj.gov.ng', 'Hadiza', 'Sani', 'HEAD_OF_UNIT', 'Administration', true),
  ('00000000-0000-0000-0003-000000000027', 'head.chempathology@fmcj.gov.ng', 'Sulaiman', 'Yusuf', 'HEAD_OF_UNIT', 'Medical Laboratory Services', true),
  ('00000000-0000-0000-0003-000000000028', 'head.haematology@fmcj.gov.ng', 'Asabe', 'Haruna', 'HEAD_OF_UNIT', 'Medical Laboratory Services', true),
  ('00000000-0000-0000-0003-000000000029', 'head.microbiology@fmcj.gov.ng', 'Yau', 'Lawal', 'HEAD_OF_UNIT', 'Medical Laboratory Services', true),
  ('00000000-0000-0000-0003-000000000030', 'head.surveillance@fmcj.gov.ng', 'Rakiya', 'Ibrahim', 'HEAD_OF_UNIT', 'Public Health', true),
  ('00000000-0000-0000-0003-000000000031', 'head.immunization@fmcj.gov.ng', 'Adamu', 'Danjuma', 'HEAD_OF_UNIT', 'Public Health', true),
  ('00000000-0000-0000-0003-000000000032', 'head.mechanical@fmcj.gov.ng', 'Bashir', 'Shehu', 'HEAD_OF_UNIT', 'Works and Maintenance', true),
  ('00000000-0000-0000-0003-000000000033', 'head.biomedical@fmcj.gov.ng', 'Fatima', 'Aliyu', 'HEAD_OF_UNIT', 'Works and Maintenance', true)
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, department = EXCLUDED.department;

-- Staff Users
INSERT INTO public.users (id, email, first_name, last_name, role, department, is_active)
VALUES 
  ('00000000-0000-0000-0004-000000000001', 'staff1.surgery@fmcj.gov.ng', 'Aliyu', 'Tanko', 'STAFF', 'Surgery', true),
  ('00000000-0000-0000-0004-000000000002', 'staff2.surgery@fmcj.gov.ng', 'Khadija', 'Mohammed', 'STAFF', 'Surgery', true),
  ('00000000-0000-0000-0004-000000000003', 'staff3.surgery@fmcj.gov.ng', 'Muhammed', 'Garba', 'STAFF', 'Surgery', true),
  ('00000000-0000-0000-0004-000000000004', 'staff1.internalmedicine@fmcj.gov.ng', 'Hauwa', 'Suleiman', 'STAFF', 'Internal Medicine', true),
  ('00000000-0000-0000-0004-000000000005', 'staff2.internalmedicine@fmcj.gov.ng', 'Yusuf', 'Bello', 'STAFF', 'Internal Medicine', true),
  ('00000000-0000-0000-0004-000000000006', 'staff3.internalmedicine@fmcj.gov.ng', 'Amina', 'Ibrahim', 'STAFF', 'Internal Medicine', true),
  ('00000000-0000-0000-0004-000000000007', 'staff1.familymedicine@fmcj.gov.ng', 'Hassan', 'Usman', 'STAFF', 'Family Medicine', true),
  ('00000000-0000-0000-0004-000000000008', 'staff2.familymedicine@fmcj.gov.ng', 'Fatima', 'Haruna', 'STAFF', 'Family Medicine', true),
  ('00000000-0000-0000-0004-000000000009', 'staff1.pharmacy@fmcj.gov.ng', 'Musa', 'Ahmed', 'STAFF', 'Pharmacy', true),
  ('00000000-0000-0000-0004-000000000010', 'staff2.pharmacy@fmcj.gov.ng', 'Binta', 'Lawal', 'STAFF', 'Pharmacy', true),
  ('00000000-0000-0000-0004-000000000011', 'staff3.pharmacy@fmcj.gov.ng', 'Gambo', 'Danladi', 'STAFF', 'Pharmacy', true),
  ('00000000-0000-0000-0004-000000000012', 'staff1.labservices@fmcj.gov.ng', 'Zainab', 'Shehu', 'STAFF', 'Medical Laboratory Services', true),
  ('00000000-0000-0000-0004-000000000013', 'staff2.labservices@fmcj.gov.ng', 'Abdullahi', 'Musa', 'STAFF', 'Medical Laboratory Services', true),
  ('00000000-0000-0000-0004-000000000014', 'staff1.radiology@fmcj.gov.ng', 'Maryam', 'Tanko', 'STAFF', 'Radiology', true),
  ('00000000-0000-0000-0004-000000000015', 'staff2.radiology@fmcj.gov.ng', 'Ibrahim', 'Aliyu', 'STAFF', 'Radiology', true),
  ('00000000-0000-0000-0004-000000000016', 'staff1.nursing@fmcj.gov.ng', 'Hafsat', 'Sani', 'STAFF', 'Nursing Services', true),
  ('00000000-0000-0000-0004-000000000017', 'staff2.nursing@fmcj.gov.ng', 'Salamatu', 'Yusuf', 'STAFF', 'Nursing Services', true),
  ('00000000-0000-0000-0004-000000000018', 'staff3.nursing@fmcj.gov.ng', 'Bilkisu', 'Garba', 'STAFF', 'Nursing Services', true),
  ('00000000-0000-0000-0004-000000000019', 'staff1.admin@fmcj.gov.ng', 'Ismail', 'Mohammed', 'STAFF', 'Administration', true),
  ('00000000-0000-0000-0004-000000000020', 'staff2.admin@fmcj.gov.ng', 'Rashida', 'Ibrahim', 'STAFF', 'Administration', true),
  ('00000000-0000-0000-0004-000000000021', 'staff3.admin@fmcj.gov.ng', 'Jamila', 'Bello', 'STAFF', 'Administration', true),
  ('00000000-0000-0000-0004-000000000022', 'staff1.finance@fmcj.gov.ng', 'Badamasi', 'Lawal', 'STAFF', 'Finance and Accounts', true),
  ('00000000-0000-0000-0004-000000000023', 'staff2.finance@fmcj.gov.ng', 'Saidu', 'Usman', 'STAFF', 'Finance and Accounts', true),
  ('00000000-0000-0000-0004-000000000024', 'staff1.publichealth@fmcj.gov.ng', 'Hassana', 'Danjuma', 'STAFF', 'Public Health', true),
  ('00000000-0000-0000-0004-000000000025', 'staff2.publichealth@fmcj.gov.ng', 'Babangida', 'Ahmed', 'STAFF', 'Public Health', true),
  ('00000000-0000-0000-0004-000000000026', 'staff1.medicalrecords@fmcj.gov.ng', 'Raliya', 'Haruna', 'STAFF', 'Medical Records', true),
  ('00000000-0000-0000-0004-000000000027', 'staff2.medicalrecords@fmcj.gov.ng', 'Garba', 'Shehu', 'STAFF', 'Medical Records', true),
  ('00000000-0000-0000-0004-000000000028', 'staff1.paediatrics@fmcj.gov.ng', 'Hadiza', 'Musa', 'STAFF', 'Paediatrics', true),
  ('00000000-0000-0000-0004-000000000029', 'staff2.paediatrics@fmcj.gov.ng', 'Sulaiman', 'Sani', 'STAFF', 'Paediatrics', true),
  ('00000000-0000-0000-0004-000000000030', 'staff1.obstetrics@fmcj.gov.ng', 'Asabe', 'Yusuf', 'STAFF', 'Obstetrics and Gynaecology', true),
  ('00000000-0000-0000-0004-000000000031', 'staff2.obstetrics@fmcj.gov.ng', 'Yau', 'Garba', 'STAFF', 'Obstetrics and Gynaecology', true)
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, role = EXCLUDED.role, department = EXCLUDED.department;
