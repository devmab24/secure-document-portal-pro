
UPDATE public.departments SET service_type = 'nursing' WHERE name = 'Nursing Services';
UPDATE public.departments SET service_type = 'finance' WHERE name IN ('Finance','Finance and Accounts');
UPDATE public.departments SET service_type = 'audit'   WHERE name = 'Internal Audit';

UPDATE public.departments d SET directorate_id = dir.id
FROM public.directorates dir
WHERE dir.code = 'CLIN' AND d.service_type = 'clinical' AND d.directorate_id IS NULL;

UPDATE public.departments d SET directorate_id = dir.id
FROM public.directorates dir
WHERE dir.code = 'NURS' AND d.service_type = 'nursing' AND d.directorate_id IS NULL;

UPDATE public.departments d SET directorate_id = dir.id
FROM public.directorates dir
WHERE dir.code = 'FINA' AND d.service_type = 'finance' AND d.directorate_id IS NULL;

UPDATE public.departments d SET directorate_id = dir.id
FROM public.directorates dir
WHERE dir.code = 'IAUD' AND d.service_type = 'audit' AND d.directorate_id IS NULL;

UPDATE public.departments d SET directorate_id = dir.id
FROM public.directorates dir
WHERE dir.code = 'ADMN'
  AND d.directorate_id IS NULL
  AND d.service_type IN ('administrative','non_clinical');
