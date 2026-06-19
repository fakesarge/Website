
-- Recreate view with security_invoker so it uses the caller's permissions
DROP VIEW IF EXISTS public.orders_public_queue;
CREATE VIEW public.orders_public_queue
WITH (security_invoker = true) AS
SELECT
  id,
  order_code,
  order_name,
  service,
  category,
  status,
  price,
  created_at,
  updated_at
FROM public.orders;

GRANT SELECT ON public.orders_public_queue TO anon, authenticated;

-- Re-add anon read policy on orders so the view (security_invoker) works.
-- Column-level GRANTs already restrict anon to a safe column set
-- (no customer_email, no referral_code).
CREATE POLICY "Anon can read orders (column-restricted)"
ON public.orders
FOR SELECT
TO anon
USING (true);
