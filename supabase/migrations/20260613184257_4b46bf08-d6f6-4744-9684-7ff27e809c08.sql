
-- 0. Remove stale trigger pointing at a renamed column
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- 1. Backfill profiles from auth.users
INSERT INTO public.profiles (id, discord_id, username, avatar_url, email, last_login)
SELECT
  u.id,
  u.raw_user_meta_data->>'provider_id',
  COALESCE(u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'preferred_username'),
  u.raw_user_meta_data->>'avatar_url',
  u.email,
  now()
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

UPDATE public.profiles SET is_admin = true WHERE discord_id = '1201255976683196426';

-- 2. VIP flag
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS vip boolean NOT NULL DEFAULT false;

-- 3. Assets
CREATE TABLE IF NOT EXISTS public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'other',
  tags text[] NOT NULL DEFAULT '{}',
  preview_url text,
  file_url text,
  video_url text,
  is_premium boolean NOT NULL DEFAULT true,
  download_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT ALL ON public.assets TO service_role;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read free assets" ON public.assets FOR SELECT USING (is_premium = false);
CREATE POLICY "VIPs and admins read premium assets" ON public.assets FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND (p.vip OR p.is_admin)) OR public.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins manage assets" ON public.assets FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER set_assets_updated_at BEFORE UPDATE ON public.assets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Favorites
CREATE TABLE IF NOT EXISTS public.asset_favorites (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, asset_id)
);
GRANT SELECT, INSERT, DELETE ON public.asset_favorites TO authenticated;
GRANT ALL ON public.asset_favorites TO service_role;
ALTER TABLE public.asset_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorites" ON public.asset_favorites FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 5. Views
CREATE TABLE IF NOT EXISTS public.asset_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  viewed_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_asset_views_user_time ON public.asset_views(user_id, viewed_at DESC);
GRANT SELECT, INSERT, DELETE ON public.asset_views TO authenticated;
GRANT ALL ON public.asset_views TO service_role;
ALTER TABLE public.asset_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own view history" ON public.asset_views FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
