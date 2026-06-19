
-- 1) Remove overly-permissive anon SELECT policy on orders
DROP POLICY IF EXISTS "Public queue view can read safe order columns" ON public.orders;
DROP POLICY IF EXISTS "Public can read orders for queue" ON public.orders;

-- 2) Create a safe public view for the queue (no customer_email, discord_id, referral_code)
DROP VIEW IF EXISTS public.orders_public_queue;
CREATE VIEW public.orders_public_queue
WITH (security_invoker = false) AS
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

-- 3) Restrict order-images uploads to the order's owner or admins
DROP POLICY IF EXISTS "Authenticated users can upload order images" ON storage.objects;

CREATE POLICY "Order owners or admins can upload order images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'order-images'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1
      FROM public.orders o
      JOIN public.profiles p ON p.id = auth.uid()
      WHERE o.id::text = (storage.foldername(name))[1]
        AND o.discord_id = p.discord_id
    )
  )
);
