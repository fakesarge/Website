import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      webhook_url, 
      message_content, 
      embed_title, 
      embed_description, 
      embed_color = 5814783 
    } = await req.json()

    console.log('Sending Discord webhook:', {
      webhook_url: webhook_url?.slice(0, 50) + '...',
      embed_title
    })

    if (!webhook_url || webhook_url.includes('placeholder')) {
      console.log('Skipping placeholder webhook URL')
      return new Response('Skipped placeholder', { status: 200, headers: corsHeaders })
    }

    // Prepare Discord webhook payload
    const discordPayload = {
      content: message_content,
      embeds: [{
        title: embed_title,
        description: embed_description,
        color: embed_color,
        timestamp: new Date().toISOString(),
        footer: {
          text: "74HRS Order System"
        }
      }]
    }

    // Send to Discord webhook
    const response = await fetch(webhook_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload)
    })

    if (!response.ok) {
      console.error('Discord webhook failed:', response.status, await response.text())
      return new Response('Webhook failed', { 
        status: response.status, 
        headers: corsHeaders 
      })
    }

    console.log('Discord webhook sent successfully')
    return new Response('Webhook sent', { 
      status: 200, 
      headers: corsHeaders 
    })

  } catch (error) {
    console.error('Discord webhook error:', error)
    return new Response('Internal error', { 
      status: 500, 
      headers: corsHeaders 
    })
  }
})