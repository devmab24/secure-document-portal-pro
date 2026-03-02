-- Insert missing user profile for CPO
INSERT INTO public.users (id, first_name, last_name, email, role, department)
VALUES ('1c10f78c-94fb-4940-8b76-20594e7034c5', 'Chief', 'Procurement', 'cpo@test.com', 'CHIEF_PROCUREMENT_OFFICER', 'Procurement')
ON CONFLICT (id) DO NOTHING;

-- Ensure user_roles entries for CMD and CPO
INSERT INTO public.user_roles (user_id, role)
VALUES 
  ('e5b3496c-9e0f-45d9-9155-aa36b3e95d61', 'CMD'),
  ('1c10f78c-94fb-4940-8b76-20594e7034c5', 'CHIEF_PROCUREMENT_OFFICER')
ON CONFLICT (user_id, role) DO NOTHING;