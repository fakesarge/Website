ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON public.orders FOR SELECT
  USING (
    discord_id = (SELECT discord_id FROM public.profiles WHERE id = auth.uid())
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Public can read orders for queue"
  ON public.orders FOR SELECT
  TO anon
  USING (true);