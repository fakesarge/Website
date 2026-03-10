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
    // Auth client (user context)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Service role client (bypass RLS for users table)
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
    const username = user.user_metadata?.full_name;
    const avatarUrl = user.user_metadata?.avatar_url;
    const email = user.email;

    console.log(`[update-profile-ip] User ${user.id}, discord: ${discordId}, IP: ${clientIp}`);

    // Update profiles table (existing behavior)
    await supabaseClient
      .from('profiles')
      .update({
        last_signed_in_ip: clientIp,
        discord_id: discordId,
        discord_username: username,
        discord_avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // Check if user exists in users table
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('discord_id', discordId)
      .maybeSingle();

    let isNewUser = false;

    if (!existingUser) {
      // New user: insert with IP
      isNewUser = true;
      const { error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          discord_id: discordId,
          email: email,
          username: username,
          avatar_url: avatarUrl,
          ip_address: clientIp,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        });

      if (insertError) {
        console.error('[update-profile-ip] Error inserting user:', insertError);
      } else {
        console.log('[update-profile-ip] New user created, sending webhook');
      }

      // Send signup webhook
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
    } else {
      // Existing user: only update last_login, NOT ip_address
      await supabaseAdmin
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('discord_id', discordId);
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
