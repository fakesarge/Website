-- Allow authenticated users to see the public orders queue.
-- The view orders_public_queue only exposes safe columns; switch to
-- security definer so it bypasses base-table RLS for all readers.
ALTER VIEW public.orders_public_queue SET (security_invoker = false);

-- Make sure both roles can read it (idempotent).
GRANT SELECT ON public.orders_public_queue TO anon, authenticated;