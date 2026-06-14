
-- 1. Profiles: simple self-update policy + trigger that blocks privilege escalation
DROP POLICY IF EXISTS "Users can update own profile (safe fields)" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.prevent_profile_privilege_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow service_role (edge functions) and admins to change anything
  IF auth.uid() IS NULL OR public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RETURN NEW;
  END IF;
  -- Regular users cannot change these columns on their own profile
  NEW.is_admin   := OLD.is_admin;
  NEW.vip        := OLD.vip;
  NEW.signup_ip  := OLD.signup_ip;
  NEW.discord_id := OLD.discord_id;
  NEW.email      := OLD.email;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.prevent_profile_privilege_escalation() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS prevent_profile_escalation ON public.profiles;
CREATE TRIGGER prevent_profile_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_profile_privilege_escalation();

-- 2. Realtime: drop the RLS that broke subscriptions
DROP POLICY IF EXISTS "Authenticated users can subscribe to own order channels" ON realtime.messages;
ALTER TABLE realtime.messages DISABLE ROW LEVEL SECURITY;

-- 3. Orders: restore broad read but keep email/referral redacted from anon
DROP POLICY IF EXISTS "Public queue view can read safe order columns" ON public.orders;
CREATE POLICY "Public can read orders for queue"
  ON public.orders FOR SELECT
  TO anon, authenticated
  USING (true);

-- Reset column grants: anon can read everything except customer_email and referral_code
REVOKE SELECT ON public.orders FROM anon;
GRANT SELECT (id, order_code, order_name, customer_name, service, category, price, description, status, created_at, updated_at, discord_id)
  ON public.orders TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
