-- Insert missing user profile for directoradmin@test.com auth user
INSERT INTO public.users (id, first_name, last_name, email, role, department)
VALUES (
  '2928b438-335a-40d8-a78e-66500d8e9902',
  'Director',
  'Admin',
  'directoradmin@test.com',
  'DIRECTOR_ADMIN',
  'Administration'
)
ON CONFLICT (id) DO NOTHING;

-- Also ensure user_roles entry exists
INSERT INTO public.user_roles (user_id, role)
VALUES ('2928b438-335a-40d8-a78e-66500d8e9902', 'DIRECTOR_ADMIN')
ON CONFLICT (user_id, role) DO NOTHING;