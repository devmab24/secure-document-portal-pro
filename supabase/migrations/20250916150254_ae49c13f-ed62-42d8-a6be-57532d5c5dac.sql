-- Fix search_path for the function to address security warning
CREATE OR REPLACE FUNCTION public.update_inter_dept_message_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;