
-- Trigger-only functions: not meant to be called via API at all
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_profile_is_admin() FROM PUBLIC, anon, authenticated;

-- RLS helpers: keep callable by signed-in users only
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_current_user_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_current_user_admin() TO authenticated;
