import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { userId } = await req.json();

    // Verify the user is requesting their own roles or is an admin
    if (userId !== user.id) {
      const { data: hasAdminRole } = await supabase
        .rpc('has_role', { _user_id: user.id, _role: 'admin' });
      
      if (!hasAdminRole) {
        throw new Error('Forbidden');
      }
    }

    // Get user's Discord profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('discord_id')
      .eq('id', userId)
      .single();

    if (profileError || !profile?.discord_id) {
      throw new Error('Discord profile not found');
    }

    const discordBotToken = Deno.env.get('DISCORD_BOT_TOKEN');
    const guildId = Deno.env.get('DISCORD_GUILD_ID');

    if (!discordBotToken || !guildId) {
      console.error('Discord credentials not configured');
      throw new Error('Discord integration not configured');
    }

    // Fetch user's roles from Discord
    const discordResponse = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/members/${profile.discord_id}`,
      {
        headers: {
          'Authorization': `Bot ${discordBotToken}`,
        },
      }
    );

    if (!discordResponse.ok) {
      console.error('Failed to fetch Discord member:', await discordResponse.text());
      throw new Error('Failed to fetch Discord roles');
    }

    const member = await discordResponse.json();
    const roleIds = member.roles || [];

    console.log('User Discord roles:', roleIds);

    // Map Discord role IDs to app roles (you'll need to configure these)
    const adminRoleId = Deno.env.get('DISCORD_ADMIN_ROLE_ID');
    const modRoleId = Deno.env.get('DISCORD_MOD_ROLE_ID');
    const vipRoleId = Deno.env.get('DISCORD_VIP_ROLE_ID');

    const rolesToAdd: string[] = [];
    
    if (adminRoleId && roleIds.includes(adminRoleId)) {
      rolesToAdd.push('admin');
    }
    if (modRoleId && roleIds.includes(modRoleId)) {
      rolesToAdd.push('moderator');
    }
    if (vipRoleId && roleIds.includes(vipRoleId)) {
      rolesToAdd.push('vip');
    }
    
    // Always add user role
    rolesToAdd.push('user');

    // Clear existing roles
    await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    // Insert new roles
    if (rolesToAdd.length > 0) {
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert(
          rolesToAdd.map(role => ({
            user_id: userId,
            role: role
          }))
        );

      if (insertError) {
        console.error('Error inserting roles:', insertError);
        throw insertError;
      }
    }

    console.log('Roles synced successfully:', rolesToAdd);

    return new Response(
      JSON.stringify({ success: true, roles: rolesToAdd }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-discord-roles:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
