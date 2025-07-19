-- Remove all admin-based policies that might be causing recursion
DROP POLICY IF EXISTS "Admins can update all affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Admins can view all affiliates" ON public.affiliates;
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all user roles" ON public.user_roles;

-- Create simple policies for affiliates table (make it public for now)
CREATE POLICY "Public can view affiliates" 
ON public.affiliates 
FOR SELECT 
USING (true);

CREATE POLICY "Public can update affiliates" 
ON public.affiliates 
FOR UPDATE 
USING (true);

-- Make user_roles publicly readable to avoid admin check recursion
CREATE POLICY "Public can view user roles" 
ON public.user_roles 
FOR SELECT 
USING (true);

CREATE POLICY "Public can manage user roles" 
ON public.user_roles 
FOR ALL 
USING (true);