-- Remove anon (signed-out) visibility of public objects in the GraphQL schema
REVOKE ALL ON public.directorates FROM anon;
REVOKE SELECT ON ALL TABLES IN SCHEMA public FROM anon;
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE SELECT ON TABLES FROM anon;