/**
 * Single entry point to the backend transport (Supabase).
 * Backend modules must import the client from here — never from UI code.
 */
export { supabase } from "@/integrations/supabase/client";
export type { Database } from "@/integrations/supabase/types";
