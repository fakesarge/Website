import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { 
      type, 
      record, 
      old_record 
    } = await req.json()

    console.log('Webhook notification trigger:', { type, record })

    // Get all active webhooks
    const { data: webhooks, error: webhookError } = await supabase
      .from('webhook_notifications')
      .select('webhook_url')
      .eq('is_active', true)

    if (webhookError) {
      console.error('Error fetching webhooks:', webhookError)
      return new Response('Error fetching webhooks', { 
        status: 500, 
        headers: corsHeaders 
      })
    }

    if (!webhooks || webhooks.length === 0) {
      console.log('No active webhooks found')
      return new Response('No webhooks', { status: 200, headers: corsHeaders })
    }

    // Prepare Discord message based on action type
    let discordPayload
    
    if (type === 'INSERT') {
      discordPayload = {
        embeds: [{
          title: "🎬 New Order Received!",
          description: `**${record.order_name}** (${record.order_code})`,
          color: 5814783, // Blue
          fields: [
            {
              name: "Customer",
              value: `${record.customer_name} (${record.customer_email})`,
              inline: true
            },
            {
              name: "Service",
              value: record.service,
              inline: true
            },
            {
              name: "Category",
              value: record.category,
              inline: true
            },
            {
              name: "Price",
              value: `$${record.price}`,
              inline: true
            },
            {
              name: "Status",
              value: record.status,
              inline: true
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "74HRS VFX Studio"
          }
        }]
      }
    } else if (type === 'DELETE') {
      discordPayload = {
        embeds: [{
          title: "🗑️ Order Removed",
          description: `Order **${old_record.order_name}** (${old_record.order_code}) was removed.`,
          color: 15158332, // Red
          timestamp: new Date().toISOString(),
          footer: {
            text: "74HRS VFX Studio"
          }
        }]
      }
    } else if (type === 'UPDATE') {
      discordPayload = {
        embeds: [{
          title: "📝 Order Updated",
          description: `Order **${record.order_name}** (${record.order_code}) was updated.`,
          color: 16776960, // Yellow
          fields: [
            {
              name: "Status",
              value: `${old_record.status} → ${record.status}`,
              inline: true
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "74HRS VFX Studio"
          }
        }]
      }
    }

    // Send to all active webhooks
    const webhookPromises = webhooks.map(async (webhook) => {
      if (webhook.webhook_url.includes('placeholder')) {
        console.log('Skipping placeholder webhook')
        return
      }

      try {
        const response = await fetch(webhook.webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(discordPayload)
        })

        if (!response.ok) {
          console.error(`Webhook failed for ${webhook.webhook_url}:`, response.status)
        } else {
          console.log(`Webhook sent successfully to ${webhook.webhook_url}`)
        }
      } catch (error) {
        console.error(`Error sending webhook to ${webhook.webhook_url}:`, error)
      }
    })

    await Promise.all(webhookPromises)

    return new Response('Webhooks processed', { 
      status: 200, 
      headers: corsHeaders 
    })

  } catch (error) {
    console.error('Order webhook notifier error:', error)
    return new Response('Internal error', { 
      status: 500, 
      headers: corsHeaders 
    })
  }
})