
-- Fix search_path on update_profile_is_admin function
CREATE OR REPLACE FUNCTION public.update_profile_is_admin()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE profiles
  SET is_admin = EXISTS (
    SELECT 1 FROM user_roles ur
    WHERE ur.user_id = NEW.user_id
    AND ur.role = 'admin'
  )
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$function$;

-- Create trigger for syncing is_admin flag
DROP TRIGGER IF EXISTS on_role_change_update_admin ON public.user_roles;
CREATE TRIGGER on_role_change_update_admin
  AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_is_admin();
