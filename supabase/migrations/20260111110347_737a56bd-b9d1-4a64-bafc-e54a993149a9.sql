
-- Insert department units for each department (excluding Administration which already has units)
-- First, let's insert units for Surgery department
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Surgery' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Plastic Surgery', 'SURG-PLS', 'Plastic and reconstructive surgery services'),
  ('Accident and Emergency (A&E)', 'SURG-AE', 'Emergency surgical services and trauma care'),
  ('General Surgery', 'SURG-GEN', 'General surgical procedures and operations'),
  ('Urology', 'SURG-URO', 'Urological surgical services'),
  ('Theatre Services', 'SURG-THE', 'Operating theatre and surgical support services')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Surgery' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Medical Records units
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Medical Records' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Electronic Health Records', 'MR-EHR', 'Digital health records management and maintenance')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Medical Records' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Family Medicine units
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Family Medicine' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('General Outpatient Clinic', 'FM-GOPC', 'General outpatient clinical services'),
  ('NHIA Clinic', 'FM-NHIA', 'National Health Insurance Authority clinic services'),
  ('Retainership Services', 'FM-RET', 'Corporate retainership healthcare services'),
  ('Amenity Ward', 'FM-AMW', 'Premium amenity ward services'),
  ('Comprehensive Health Centre Apawa', 'FM-CHCA', 'Comprehensive primary healthcare at Apawa')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Family Medicine' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Internal Medicine units
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Internal Medicine' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('ECG Unit', 'IM-ECG', 'Electrocardiography diagnostic services'),
  ('Endoscopy', 'IM-END', 'Endoscopic procedures and diagnostics'),
  ('Dialysis Unit', 'IM-DIA', 'Renal dialysis treatment services'),
  ('Isolation Units & Lassa Fever Treatment Centre', 'IM-ISO', 'Infectious disease isolation and Lassa fever treatment'),
  ('ART Unit', 'IM-ART', 'Antiretroviral therapy services'),
  ('DOTS Unit', 'IM-DOTS', 'Directly Observed Treatment Short-course for TB')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Internal Medicine' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Paediatrics units
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Paediatrics' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Emergency Paediatric Unit', 'PED-EPU', 'Emergency paediatric care services')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Paediatrics' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Anaesthesia units
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Anaesthesia' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Critical Care Unit (CCU)', 'ANA-CCU', 'Intensive and critical care services')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Anaesthesia' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Pharmacy units
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Pharmacy' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Specialized Pharmaceutical Care', 'PHM-SPC', 'Specialized pharmaceutical care services'),
  ('Drug Production Unit', 'PHM-DPU', 'In-house drug production and compounding'),
  ('Drug Information Unit', 'PHM-DIU', 'Drug information and pharmacovigilance'),
  ('Central Pharmacy Administration', 'PHM-CPA', 'Central pharmacy administrative operations'),
  ('Bulk and Active Pharmacy Stores', 'PHM-BAS', 'Bulk drug storage and inventory management'),
  ('General Outpatient Clinic Pharmacy 1 & 2', 'PHM-GOP', 'Outpatient clinic pharmacy services'),
  ('Specialists Clinic Pharmacy 1 & 2', 'PHM-SCP', 'Specialists clinic pharmacy services'),
  ('Inpatient Pharmacy', 'PHM-IPP', 'Inpatient ward pharmacy services'),
  ('NHIA Pharmacy', 'PHM-NHP', 'NHIA-dedicated pharmacy services'),
  ('Accident and Emergency Pharmacy', 'PHM-AEP', 'Emergency pharmacy services'),
  ('Amenity and Retainership Pharmacy', 'PHM-ARP', 'Amenity and retainership pharmacy services'),
  ('Labour Ward Pharmacy', 'PHM-LWP', 'Labour ward pharmaceutical services'),
  ('Theatre Pharmacy', 'PHM-THP', 'Operating theatre pharmacy services'),
  ('Antiretroviral Drug Therapy Pharmacy 1, 2, & 3', 'PHM-ARV', 'ART pharmacy services'),
  ('Drug Compounding Unit', 'PHM-DCU', 'Custom drug compounding services'),
  ('Apawa Comprehensive Health Centre Pharmacy', 'PHM-APW', 'Apawa CHC pharmacy services'),
  ('Pharmacy Services at NYSC Orientation Camp', 'PHM-NYC', 'NYSC camp pharmacy services')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Pharmacy' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Histopathology units
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Histopathology' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Mortuary', 'HIS-MOR', 'Mortuary and body preservation services'),
  ('Histopathology Laboratory', 'HIS-LAB', 'Histopathology diagnostic laboratory')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Histopathology' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Medical Laboratory Services units
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Medical Laboratory Services' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Chemical Pathology Unit', 'MLS-CPU', 'Clinical chemistry and biochemistry testing'),
  ('Parasitology Unit', 'MLS-PAR', 'Parasitological diagnostic services'),
  ('Haematology Unit', 'MLS-HEM', 'Haematology and blood science services'),
  ('Microbiology Unit', 'MLS-MIC', 'Microbiological diagnostic services'),
  ('Molecular Laboratory Unit', 'MLS-MOL', 'Molecular diagnostics and PCR testing')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Medical Laboratory Services' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Public Health units
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Public Health' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Disease Surveillance', 'PH-DSU', 'Disease surveillance and outbreak response'),
  ('Environmental Health and Waste Management', 'PH-EHW', 'Environmental health and waste management'),
  ('Health Education', 'PH-HED', 'Community health education programs'),
  ('Immunization', 'PH-IMM', 'Vaccination and immunization services'),
  ('Research and Medical Statistics', 'PH-RMS', 'Health research and statistical analysis'),
  ('Tuberculosis and Leprosy Control', 'PH-TLC', 'TB and leprosy prevention and control')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Public Health' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Nutrition and Dietetics units
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Nutrition and Dietetics' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Nutrition Unit', 'ND-NUT', 'Clinical nutrition assessment and support'),
  ('Dietetics Unit', 'ND-DIE', 'Therapeutic diet planning and counseling'),
  ('Catering Unit', 'ND-CAT', 'Hospital catering and food services')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Nutrition and Dietetics' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Oncology Unit (as sub-unit)
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Oncology Unit' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Oncology Services', 'ONC-SRV', 'Cancer treatment and oncology services')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Oncology Unit' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Internal Audit units
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Internal Audit' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Prepayment Unit', 'IA-PRE', 'Pre-payment audit and verification'),
  ('Stores/Procurement Unit', 'IA-STP', 'Stores and procurement audit'),
  ('Payroll Unit', 'IA-PAY', 'Payroll audit and verification'),
  ('Advances Unit', 'IA-ADV', 'Advances audit and tracking'),
  ('Revenue Unit', 'IA-REV', 'Revenue audit and reconciliation'),
  ('Post-Payment Unit', 'IA-PST', 'Post-payment audit and verification')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Internal Audit' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Finance and Accounts units
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Finance and Accounts' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Cash Unit', 'FIN-CSH', 'Cash management and disbursement'),
  ('Advance Unit', 'FIN-ADV', 'Staff advances and recovery'),
  ('Salary/Payroll Unit', 'FIN-SAL', 'Salary processing and payroll management'),
  ('Revenue Unit', 'FIN-REV', 'Revenue collection and management'),
  ('NHIA Finance Unit', 'FIN-NHI', 'NHIA claims and financial processing'),
  ('Retainership Unit', 'FIN-RET', 'Retainership billing and accounts'),
  ('Final Accounts Unit', 'FIN-FAC', 'Final accounts and financial reporting'),
  ('Stores Unit', 'FIN-STO', 'Stores accounting and inventory valuation'),
  ('Asset Unit', 'FIN-AST', 'Asset management and depreciation'),
  ('Budget Unit', 'FIN-BUD', 'Budget preparation and monitoring')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Finance and Accounts' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Works and Maintenance units
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Works and Maintenance' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Mechanical Unit', 'WM-MEC', 'Mechanical systems maintenance'),
  ('Estate Unit', 'WM-EST', 'Estate and grounds management'),
  ('Building Unit', 'WM-BLD', 'Building maintenance and repairs'),
  ('Biomedical Unit', 'WM-BIO', 'Biomedical equipment maintenance'),
  ('Tailoring Unit', 'WM-TAI', 'Hospital linen and tailoring services')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Works and Maintenance' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Physical Planning units
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Physical Planning' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Planning Unit', 'PP-PLN', 'Physical development planning'),
  ('Engineering/Architectural Unit', 'PP-ENG', 'Engineering and architectural services'),
  ('Fire Service Unit', 'PP-FIR', 'Fire safety and prevention services')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Physical Planning' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- ACTU unit (self-referencing)
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Anti-Corruption and Transparency Unit (ACTU)' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('ACTU Operations', 'ACTU-OPS', 'Anti-corruption monitoring and enforcement')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Anti-Corruption and Transparency Unit (ACTU)' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;

-- Security Services unit
INSERT INTO public.department_units (name, code, department_id, description, is_active)
SELECT 
  unit_name,
  unit_code,
  (SELECT id FROM public.departments WHERE name = 'Security Services Unit' AND is_active = true LIMIT 1),
  unit_description,
  true
FROM (VALUES
  ('Security Operations', 'SEC-OPS', 'Hospital security and access control')
) AS units(unit_name, unit_code, unit_description)
WHERE (SELECT id FROM public.departments WHERE name = 'Security Services Unit' AND is_active = true LIMIT 1) IS NOT NULL
ON CONFLICT DO NOTHING;
