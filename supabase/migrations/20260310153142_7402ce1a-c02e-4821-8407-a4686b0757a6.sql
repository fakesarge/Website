
-- Create users table for IP logging and user tracking
CREATE TABLE public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_id text UNIQUE NOT NULL,
  email text,
  username text,
  avatar_url text,
  ip_address text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_login timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read own record
CREATE POLICY "Users can read own record" ON public.users
  FOR SELECT TO authenticated
  USING (discord_id = (SELECT profiles.discord_id FROM profiles WHERE profiles.id = auth.uid()));

-- Admins can read all users
CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow service role / edge functions to insert/update (no restrictive policy for service role)
-- Edge function uses service role key which bypasses RLS
