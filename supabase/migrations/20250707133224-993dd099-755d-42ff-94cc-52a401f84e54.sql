
-- First, make password_hash nullable since we don't manage passwords in our users table
ALTER TABLE public.users ALTER COLUMN password_hash DROP NOT NULL;

-- Update the trigger function to not insert password_hash
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.users (id, first_name, last_name, email, role, department)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'STAFF'),
    COALESCE(new.raw_user_meta_data->>'department', 'Administration')
  );
  RETURN new;
END;
$function$;

-- Create the trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
