-- Make user_id nullable in orders table so orders can exist without users
ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

-- Create new policies for public order access
CREATE POLICY "Anyone can view orders by order_code" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);

-- Update affiliate_claims policies to work without user dependency
DROP POLICY IF EXISTS "Affiliates can view their own claims" ON public.affiliate_claims;
DROP POLICY IF EXISTS "Affiliates can insert their claims" ON public.affiliate_claims;

CREATE POLICY "Anyone can view affiliate claims" 
ON public.affiliate_claims 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert affiliate claims" 
ON public.affiliate_claims 
FOR INSERT 
WITH CHECK (true);