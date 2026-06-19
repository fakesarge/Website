
DROP VIEW IF EXISTS public.orders_public_queue;
CREATE VIEW public.orders_public_queue
WITH (security_invoker = true) AS
SELECT
  id,
  order_code,
  order_name,
  customer_name,
  service,
  category,
  description,
  status,
  price,
  created_at,
  updated_at
FROM public.orders;

GRANT SELECT ON public.orders_public_queue TO anon, authenticated;
