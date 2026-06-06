REVOKE ALL ON TABLE public.security_alert_config FROM anon;
REVOKE ALL ON TABLE public.document_stats FROM anon;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_user_role_on_create() FROM anon;
REVOKE EXECUTE ON FUNCTION public.sync_user_role_on_create() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admins_on_security_event() FROM anon;
REVOKE EXECUTE ON FUNCTION public.notify_admins_on_security_event() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.update_inter_dept_message_updated_at() FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_inter_dept_message_updated_at() FROM authenticated;