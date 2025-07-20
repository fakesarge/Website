import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Discord bot request received:', req.method)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.json()
    console.log('Request body type:', body.type)
    
    // Handle Discord verification ping
    if (body.type === 1) {
      console.log('Ping received, responding with pong')
      return new Response(JSON.stringify({ type: 1 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Handle application commands
    if (body.type === 2) {
      const commandName = body.data.name
      console.log('Command:', commandName)

      switch (commandName) {
        case 'create-order':
          return await handleCreateOrder(supabase, body)
        case 'list-orders':
          return await handleListOrders(supabase, body)
        case 'update-order':
          return await handleUpdateOrder(supabase, body)
        default:
          return new Response(JSON.stringify({
            type: 4,
            data: { content: `Unknown command: ${commandName}` }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
      }
    }

    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'Invalid interaction type' }
    }), { 
      status: 400, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'Internal server error' }
    }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleCreateOrder(supabase: any, body: any) {
  const options = body.data.options || []
  const orderName = options.find((opt: any) => opt.name === 'order_name')?.value
  const description = options.find((opt: any) => opt.name === 'description')?.value || ''
  const price = options.find((opt: any) => opt.name === 'price')?.value
  const category = options.find((opt: any) => opt.name === 'category')?.value || 'gfx'

  if (!orderName || !price) {
    return new Response(JSON.stringify({
      type: 4,
      data: { content: '❌ Missing required fields: order_name and price' }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_name: orderName,
        description,
        price: parseFloat(price),
        category,
        status: 'pending'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return new Response(JSON.stringify({
        type: 4,
        data: { content: '❌ Failed to create order. Please try again.' }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      type: 4,
      data: { 
        content: `✅ **Order Created Successfully!**\n\n**Name:** ${orderName}\n**Code:** ${order.order_code || order.id}\n**Price:** $${price}\n**Category:** ${category}\n**Status:** Pending` 
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(JSON.stringify({
      type: 4,
      data: { content: '❌ An unexpected error occurred' }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleListOrders(supabase: any, body: any) {
  const options = body.data.options || []
  const limit = options.find((opt: any) => opt.name === 'limit')?.value || 5
  const status = options.find((opt: any) => opt.name === 'status')?.value

  try {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit))

    if (status) {
      query = query.eq('status', status)
    }

    const { data: orders, error } = await query

    if (error) {
      console.error('Database error:', error)
      return new Response(JSON.stringify({
        type: 4,
        data: { content: '❌ Failed to fetch orders' }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (orders.length === 0) {
      return new Response(JSON.stringify({
        type: 4,
        data: { content: '📋 No orders found' }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const ordersList = orders.map(order => 
      `• **${order.order_name}** - $${order.price} - ${order.status}\n  📋 ID: ${order.id.slice(0, 8)}...`
    ).join('\n')

    return new Response(JSON.stringify({
      type: 4,
      data: { content: `📋 **Recent Orders:**\n\n${ordersList}` }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(JSON.stringify({
      type: 4,
      data: { content: '❌ An unexpected error occurred' }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleUpdateOrder(supabase: any, body: any) {
  const options = body.data.options || []
  const orderId = options.find((opt: any) => opt.name === 'order_id')?.value
  const status = options.find((opt: any) => opt.name === 'status')?.value

  if (!orderId || !status) {
    return new Response(JSON.stringify({
      type: 4,
      data: { content: '❌ Missing required fields: order_id and status' }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const { error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (error) {
      console.error('Database error:', error)
      return new Response(JSON.stringify({
        type: 4,
        data: { content: '❌ Failed to update order. Check the order ID.' }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      type: 4,
      data: { content: `✅ **Order Updated!**\n\nStatus changed to: **${status}**` }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return new Response(JSON.stringify({
      type: 4,
      data: { content: '❌ An unexpected error occurred' }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}