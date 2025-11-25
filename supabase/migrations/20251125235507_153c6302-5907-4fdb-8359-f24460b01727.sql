-- Add last_signed_in_ip to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_signed_in_ip text;

-- Update RLS policies for orders to use has_role function properly
-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can insert any orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update any orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;

-- Create comprehensive RLS policies for orders
-- Users can view their own orders (matching discord_id)
CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (
  discord_id IN (
    SELECT discord_id FROM public.profiles WHERE id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- Users can insert their own orders
CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (
  discord_id IN (
    SELECT discord_id FROM public.profiles WHERE id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- Only admins can update orders
CREATE POLICY "Admins can update any orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete orders
CREATE POLICY "Admins can delete orders"
ON public.orders
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Update profiles RLS to allow admins to view all profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can update any profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage user roles
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create a helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role)
$$;