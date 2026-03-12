
-- Add unique constraint on discord_id for upsert support
ALTER TABLE public.profiles ADD CONSTRAINT profiles_discord_id_unique UNIQUE (discord_id);
