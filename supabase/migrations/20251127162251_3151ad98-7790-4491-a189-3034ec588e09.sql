-- ============================================================
-- COMPREHENSIVE RLS FIX FOR ALL TABLES
-- This migration fixes all RLS policies to work properly
-- ============================================================

-- ============================================================
-- 1. PROFILES TABLE - Fix RLS Policies
-- ============================================================

-- Drop existing policies that may be causing conflicts
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can select their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create new, clean policies for profiles
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- 2. USER_ROLES TABLE - Fix RLS Policies
-- ============================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can modify roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can select all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow user to read their roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can select their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Create new, clean policies for user_roles
CREATE POLICY "Users can read own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert roles"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
  ON public.user_roles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- 3. ORDERS TABLE - Fix RLS Policies
-- ============================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can read all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can read their own orders" ON public.orders;

-- Create new, clean policies for orders
CREATE POLICY "Users can read own orders by discord_id"
  ON public.orders
  FOR SELECT
  USING (
    discord_id = (
      SELECT p.discord_id 
      FROM public.profiles p 
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Admins can read all orders"
  ON public.orders
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete orders"
  ON public.orders
  FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ============================================================
-- 4. Add helper function to check if user is admin (optimize)
-- ============================================================

-- This function is already created, but let's ensure it's optimized
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role)
$$;

-- ============================================================
-- 5. Create index for performance optimization
-- ============================================================

-- Add index on discord_id for faster order lookups
CREATE INDEX IF NOT EXISTS idx_profiles_discord_id ON public.profiles(discord_id);
CREATE INDEX IF NOT EXISTS idx_orders_discord_id ON public.orders(discord_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);