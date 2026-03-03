-- Add missing user_roles for all test accounts that exist in auth.users
INSERT INTO public.user_roles (user_id, role) VALUES
  ('0ad2f87f-2404-47d4-8526-a5ab1d131507', 'HOD'),
  ('d4253232-703c-4910-b2d3-321d1de882c9', 'HOD'),
  ('0344b135-ee21-4846-ad06-f3ab4e74cc95', 'HOD'),
  ('b0a18fa6-6d04-44b8-8273-8f8a885e7834', 'HOD'),
  ('a81428f3-24cb-4cee-b77f-c6d16a850893', 'HOD'),
  ('222caed9-baa1-456a-868d-a781f7ac527f', 'STAFF'),
  ('f95983dd-5ed7-4cbb-9d84-f27846fca4f1', 'STAFF'),
  ('af7d9b94-0221-4288-84a6-6e56de13afc5', 'STAFF'),
  ('08a69aec-96d2-4e0b-8aaf-31b78469348c', 'STAFF'),
  ('f067f33f-b36e-4804-9e0a-9762cd1b3402', 'STAFF'),
  ('3797bf18-bf41-4ead-ac8d-1bc3bc5eee9f', 'STAFF')
ON CONFLICT (user_id, role) DO NOTHING;