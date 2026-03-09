INSERT INTO public.profiles (id, discord_id, discord_username, discord_avatar_url)
VALUES (
  'd176c57d-e0eb-4da7-b1df-7a65eaa4723e',
  '1201255976683196426',
  'fakesarge',
  'https://cdn.discordapp.com/avatars/1201255976683196426/5f793b7872b4e06c7a85554c67aedd0e.png'
) ON CONFLICT (id) DO UPDATE SET
  discord_id = EXCLUDED.discord_id,
  discord_username = EXCLUDED.discord_username,
  discord_avatar_url = EXCLUDED.discord_avatar_url;