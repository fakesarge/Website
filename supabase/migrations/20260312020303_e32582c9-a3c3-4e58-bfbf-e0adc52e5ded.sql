
-- Rename columns in profiles table
ALTER TABLE public.profiles RENAME COLUMN discord_username TO username;
ALTER TABLE public.profiles RENAME COLUMN discord_avatar_url TO avatar_url;
ALTER TABLE public.profiles RENAME COLUMN last_signed_in_ip TO signup_ip;
ALTER TABLE public.profiles RENAME COLUMN updated_at TO last_login;

-- Add email column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;

-- Update handle_new_user trigger to use new column names
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, discord_id, username, avatar_url, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'provider_id',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email
  );
  RETURN NEW;
END;
$function$;

-- Ensure owner is marked admin
UPDATE public.profiles SET is_admin = true WHERE discord_id = '1201255976683196426';
