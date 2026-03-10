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
    const { event_type, data } = await req.json()

    const webhookUrl = Deno.env.get('DISCORD_ACTIVITY_WEBHOOK')
    if (!webhookUrl) {
      console.log('[discord-activity] No webhook URL configured')
      return new Response('No webhook configured', { status: 200, headers: corsHeaders })
    }

    let embed: any = null

    switch (event_type) {
      case 'order_created':
        embed = {
          title: '📦 New Order Created',
          color: 5814783,
          fields: [
            { name: 'Customer', value: data.customer_name || 'Unknown', inline: true },
            { name: 'Order', value: data.order_name || 'N/A', inline: true },
            { name: 'Service', value: data.service || 'N/A', inline: true },
            { name: 'Price', value: `$${data.price || 0}`, inline: true },
          ],
        }
        break

      case 'customer_message':
        embed = {
          title: '💬 Customer Message',
          color: 3447003,
          fields: [
            { name: 'Customer', value: data.sender_name || 'Unknown', inline: true },
            { name: 'Order', value: data.order_name || 'N/A', inline: true },
            { name: 'Message', value: (data.message || '').substring(0, 100) || 'N/A', inline: false },
          ],
          ...(data.dashboard_url ? { url: data.dashboard_url } : {}),
        }
        break

      case 'admin_message':
        embed = {
          title: '💬 Admin Reply Sent',
          color: 16776960,
          fields: [
            { name: 'Order', value: data.order_name || 'N/A', inline: true },
            { name: 'Customer', value: data.customer_name || 'Unknown', inline: true },
          ],
        }
        break

      case 'image_uploaded':
        embed = {
          title: '🖼 Order Update',
          description: 'Admin uploaded new image',
          color: 10181046,
          fields: [
            { name: 'Order', value: data.order_name || 'N/A', inline: true },
            { name: 'Customer', value: data.customer_name || 'Unknown', inline: true },
          ],
        }
        break

      case 'order_progress_updated':
        embed = {
          title: '🔄 Order Progress Updated',
          color: 16776960,
          fields: [
            { name: 'Order', value: data.order_name || 'N/A', inline: true },
            { name: 'Customer', value: data.customer_name || 'Unknown', inline: true },
            { name: 'New Status', value: data.new_status || 'N/A', inline: true },
          ],
        }
        break

      default:
        console.log('[discord-activity] Unknown event type:', event_type)
        return new Response('Unknown event', { status: 200, headers: corsHeaders })
    }

    if (embed) {
      embed.footer = { text: '74HRS VFX Studio' }
      embed.timestamp = new Date().toISOString()

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] }),
      })

      if (!response.ok) {
        console.error('[discord-activity] Webhook failed:', response.status, await response.text())
      } else {
        console.log('[discord-activity] Webhook sent for:', event_type)
      }
    }

    return new Response('OK', { status: 200, headers: corsHeaders })
  } catch (error) {
    console.error('[discord-activity] Error:', error)
    return new Response('Internal error', { status: 500, headers: corsHeaders })
  }
})
