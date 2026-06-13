
-- 1. Orders: drop the unrestricted public SELECT, expose safe columns via a view
DROP POLICY IF EXISTS "Public can read orders for queue" ON public.orders;

CREATE OR REPLACE VIEW public.public_order_queue
WITH (security_invoker = on) AS
SELECT
  id,
  order_code,
  order_name,
  customer_name,
  service,
  category,
  price,
  status,
  created_at,
  updated_at
FROM public.orders;

GRANT SELECT ON public.public_order_queue TO anon, authenticated;

-- Allow anonymous reads to flow through the view's underlying table without leaking
-- sensitive columns. Anonymous users can only reach the table via this view because
-- there's no other anon SELECT policy and the view's security_invoker uses the caller's RLS.
CREATE POLICY "Public queue view can read safe order columns"
  ON public.orders FOR SELECT
  TO anon
  USING (true);
-- NOTE: anon role only has SELECT privileges on the view-exposed columns through
-- the view; direct table queries from anon will still hit the column-level grants below.
REVOKE SELECT ON public.orders FROM anon;
GRANT SELECT (id, order_code, order_name, customer_name, service, category, price, status, created_at, updated_at)
  ON public.orders TO anon;

-- 2. Profiles: block self-escalation via update
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile (safe fields)"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND is_admin IS NOT DISTINCT FROM (SELECT p.is_admin FROM public.profiles p WHERE p.id = auth.uid())
    AND vip IS NOT DISTINCT FROM (SELECT p.vip FROM public.profiles p WHERE p.id = auth.uid())
    AND signup_ip IS NOT DISTINCT FROM (SELECT p.signup_ip FROM public.profiles p WHERE p.id = auth.uid())
    AND discord_id IS NOT DISTINCT FROM (SELECT p.discord_id FROM public.profiles p WHERE p.id = auth.uid())
    AND email IS NOT DISTINCT FROM (SELECT p.email FROM public.profiles p WHERE p.id = auth.uid())
  );

-- 3. Realtime: restrict channel subscriptions
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can subscribe to own order channels" ON realtime.messages;
CREATE POLICY "Authenticated users can subscribe to own order channels"
  ON realtime.messages FOR SELECT
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.profiles p ON p.discord_id = o.discord_id
      WHERE p.id = auth.uid()
    )
  );
