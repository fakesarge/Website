import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const clientIp = req.headers.get('x-forwarded-for') ||
                     req.headers.get('x-real-ip') ||
                     'unknown';

    const discordId = user.user_metadata?.provider_id;
    const username = user.user_metadata?.preferred_username || user.user_metadata?.full_name;
    const avatarUrl = user.user_metadata?.avatar_url;
    const email = user.email;

    console.log(`[update-profile-ip] User ${user.id}, discord: ${discordId}, username: ${username}, IP: ${clientIp}`);
    console.log(`[update-profile-ip] Full metadata:`, JSON.stringify(user.user_metadata));

    // Check if profile exists and if signup_ip is set
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('signup_ip')
      .eq('id', user.id)
      .maybeSingle();

    const isNewUser = !existingProfile;
    const needsIp = !existingProfile?.signup_ip;

    // Build upsert payload
    const upsertPayload: Record<string, any> = {
      id: user.id,
      discord_id: discordId,
      username: username,
      avatar_url: avatarUrl,
      email: email,
      last_login: new Date().toISOString(),
    };

    // Only store IP on first signup (when signup_ip is null)
    if (needsIp) {
      upsertPayload.signup_ip = clientIp;
    }

    // Upsert profile — insert if missing, update if exists
    const { error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert(upsertPayload, { onConflict: 'id' });

    if (upsertError) {
      console.error('[update-profile-ip] Upsert error:', upsertError);
    } else {
      console.log('[update-profile-ip] Profile upserted successfully, isNew:', isNewUser);
    }

    // Send signup webhook for new users
    if (isNewUser) {
      console.log('[update-profile-ip] New user detected, sending webhook');
      const webhookUrl = Deno.env.get('DISCORD_ACTIVITY_WEBHOOK');
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              embeds: [{
                title: '👤 New User Signup',
                color: 5814783,
                fields: [
                  { name: 'Username', value: username || 'Unknown', inline: true },
                  { name: 'Email', value: email || 'N/A', inline: true },
                  { name: 'Discord ID', value: discordId || 'N/A', inline: true },
                  { name: 'Signup IP', value: clientIp, inline: true },
                ],
                footer: { text: '74HRS VFX Studio' },
                timestamp: new Date().toISOString(),
              }],
            }),
          });
        } catch (e) {
          console.error('[update-profile-ip] Webhook error:', e);
        }
      }
    }

    return new Response(JSON.stringify({ success: true, isNewUser }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[update-profile-ip] Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
