-- Clean up all policies and create simple ones for public access
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can view orders by order_code" ON public.orders;
DROP POLICY IF EXISTS "Anyone can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;

-- Create simple public policies without admin checks
CREATE POLICY "Public can view all orders" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);

-- Clean up affiliate claims policies
DROP POLICY IF EXISTS "Admins can manage all affiliate claims" ON public.affiliate_claims;
DROP POLICY IF EXISTS "Anyone can view affiliate claims" ON public.affiliate_claims;
DROP POLICY IF EXISTS "Anyone can insert affiliate claims" ON public.affiliate_claims;

CREATE POLICY "Public can view affiliate claims" 
ON public.affiliate_claims 
FOR SELECT 
USING (true);

CREATE POLICY "Public can insert affiliate claims" 
ON public.affiliate_claims 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can update affiliate claims" 
ON public.affiliate_claims 
FOR UPDATE 
USING (true);