-- Add discord_id column to orders table
ALTER TABLE public.orders ADD COLUMN discord_id text;

-- Create index for better query performance
CREATE INDEX idx_orders_discord_id ON public.orders(discord_id);

-- Drop existing public access policies
DROP POLICY IF EXISTS "Allow public insert access to orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public read access to orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update access to orders" ON public.orders;

-- Create new RLS policies based on discord_id
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  discord_id IN (
    SELECT discord_id FROM public.profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
  discord_id IN (
    SELECT discord_id FROM public.profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Admins can insert any orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update any orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));