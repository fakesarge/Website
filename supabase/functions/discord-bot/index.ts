
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

    const body = await req.json()
    
    // Verify Discord interaction
    if (body.type === 1) {
      return new Response(JSON.stringify({ type: 1 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Handle slash commands
    if (body.type === 2) {
      const { data: commandData } = body
      const commandName = commandData.name

      switch (commandName) {
        case 'create-order':
          return await handleCreateOrder(supabase, body)
        case 'update-order':
          return await handleUpdateOrder(supabase, body)
        case 'create-invoice':
          return await handleCreateInvoice(supabase, body)
        case 'update-invoice':
          return await handleUpdateInvoice(supabase, body)
        case 'list-orders':
          return await handleListOrders(supabase, body)
        case 'list-invoices':
          return await handleListInvoices(supabase, body)
        default:
          return new Response(JSON.stringify({
            type: 4,
            data: { content: 'Unknown command!' }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
      }
    }

    return new Response('Invalid request', { status: 400, headers: corsHeaders })
  } catch (error) {
    console.error('Error:', error)
    return new Response('Internal server error', { status: 500, headers: corsHeaders })
  }
})

async function handleCreateOrder(supabase: any, body: any) {
  const options = body.data.options || []
  const discordUserId = options.find((opt: any) => opt.name === 'user')?.value
  const orderName = options.find((opt: any) => opt.name === 'order_name')?.value
  const description = options.find((opt: any) => opt.name === 'description')?.value || null
  const price = options.find((opt: any) => opt.name === 'price')?.value
  const category = options.find((opt: any) => opt.name === 'category')?.value || 'general'

  if (!discordUserId || !orderName || !price) {
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'Missing required parameters: user, order_name, and price are required!' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Find user by Discord ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('discord_id', discordUserId)
    .single()

  if (!profile) {
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'User not found! They need to sign up first at your website.' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Create order
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: profile.id,
      order_name: orderName,
      description,
      price: parseFloat(price),
      category,
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating order:', error)
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'Failed to create order. Please try again.' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({
    type: 4,
    data: { 
      content: `✅ Order created successfully!\n**Order:** ${orderName}\n**Price:** $${price}\n**Status:** Pending` 
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

async function handleUpdateOrder(supabase: any, body: any) {
  const options = body.data.options || []
  const orderId = options.find((opt: any) => opt.name === 'order_id')?.value
  const status = options.find((opt: any) => opt.name === 'status')?.value
  const deliveryDate = options.find((opt: any) => opt.name === 'delivery_date')?.value

  if (!orderId) {
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'Order ID is required!' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const updateData: any = { updated_at: new Date().toISOString() }
  if (status) updateData.status = status
  if (deliveryDate) updateData.delivery_date = deliveryDate

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)

  if (error) {
    console.error('Error updating order:', error)
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'Failed to update order. Please check the order ID.' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({
    type: 4,
    data: { content: `✅ Order updated successfully!` }
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

async function handleCreateInvoice(supabase: any, body: any) {
  const options = body.data.options || []
  const discordUserId = options.find((opt: any) => opt.name === 'user')?.value
  const orderId = options.find((opt: any) => opt.name === 'order_id')?.value || null
  const amount = options.find((opt: any) => opt.name === 'amount')?.value
  const dueDate = options.find((opt: any) => opt.name === 'due_date')?.value || null

  if (!discordUserId || !amount) {
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'Missing required parameters: user and amount are required!' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Find user by Discord ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('discord_id', discordUserId)
    .single()

  if (!profile) {
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'User not found! They need to sign up first at your website.' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Generate invoice number
  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`

  // Create invoice
  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({
      user_id: profile.id,
      order_id: orderId,
      invoice_number: invoiceNumber,
      amount: parseFloat(amount),
      status: 'unpaid',
      due_date: dueDate
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating invoice:', error)
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'Failed to create invoice. Please try again.' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({
    type: 4,
    data: { 
      content: `✅ Invoice created successfully!\n**Invoice #:** ${invoiceNumber}\n**Amount:** $${amount}\n**Status:** Unpaid` 
    }
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

async function handleUpdateInvoice(supabase: any, body: any) {
  const options = body.data.options || []
  const invoiceId = options.find((opt: any) => opt.name === 'invoice_id')?.value
  const status = options.find((opt: any) => opt.name === 'status')?.value

  if (!invoiceId || !status) {
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'Invoice ID and status are required!' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { error } = await supabase
    .from('invoices')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', invoiceId)

  if (error) {
    console.error('Error updating invoice:', error)
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'Failed to update invoice. Please check the invoice ID.' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({
    type: 4,
    data: { content: `✅ Invoice updated successfully! Status: ${status}` }
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

async function handleListOrders(supabase: any, body: any) {
  const options = body.data.options || []
  const discordUserId = options.find((opt: any) => opt.name === 'user')?.value

  if (!discordUserId) {
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'User Discord ID is required!' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Find user by Discord ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('discord_id', discordUserId)
    .single()

  if (!profile) {
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'User not found!' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching orders:', error)
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'Failed to fetch orders.' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (orders.length === 0) {
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'No orders found for this user.' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const ordersList = orders.map(order => 
    `• **${order.order_name}** - $${order.price} - ${order.status} (ID: ${order.id})`
  ).join('\n')

  return new Response(JSON.stringify({
    type: 4,
    data: { content: `📋 **Recent Orders:**\n${ordersList}` }
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}

async function handleListInvoices(supabase: any, body: any) {
  const options = body.data.options || []
  const discordUserId = options.find((opt: any) => opt.name === 'user')?.value

  if (!discordUserId) {
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'User Discord ID is required!' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Find user by Discord ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('discord_id', discordUserId)
    .single()

  if (!profile) {
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'User not found!' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching invoices:', error)
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'Failed to fetch invoices.' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (invoices.length === 0) {
    return new Response(JSON.stringify({
      type: 4,
      data: { content: 'No invoices found for this user.' }
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const invoicesList = invoices.map(invoice => 
    `• **${invoice.invoice_number}** - $${invoice.amount} - ${invoice.status} (ID: ${invoice.id})`
  ).join('\n')

  return new Response(JSON.stringify({
    type: 4,
    data: { content: `🧾 **Recent Invoices:**\n${invoicesList}` }
  }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
