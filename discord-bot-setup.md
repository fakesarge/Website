
# Discord Bot Setup Instructions

## 1. Create Discord Application
1. Go to https://discord.com/developers/applications
2. Click "New Application" and give it a name (e.g., "74hrs Management Bot")
3. Go to the "Bot" section and click "Add Bot"
4. Copy the Bot Token (you'll need this later)

## 2. Set up Slash Commands
Go to your Discord application settings and register these slash commands:

### Command: create-order
```json
{
  "name": "create-order",
  "description": "Create a new order for a user",
  "options": [
    {
      "name": "user",
      "description": "Discord User ID",
      "type": 3,
      "required": true
    },
    {
      "name": "order_name",
      "description": "Name of the order",
      "type": 3,
      "required": true
    },
    {
      "name": "price",
      "description": "Price in USD",
      "type": 10,
      "required": true
    },
    {
      "name": "description",
      "description": "Order description",
      "type": 3,
      "required": false
    },
    {
      "name": "category",
      "description": "Order category",
      "type": 3,
      "required": false
    }
  ]
}
```

### Command: update-order
```json
{
  "name": "update-order",
  "description": "Update an existing order",
  "options": [
    {
      "name": "order_id",
      "description": "Order UUID",
      "type": 3,
      "required": true
    },
    {
      "name": "status",
      "description": "New status",
      "type": 3,
      "required": false,
      "choices": [
        {"name": "pending", "value": "pending"},
        {"name": "in_progress", "value": "in_progress"},
        {"name": "completed", "value": "completed"},
        {"name": "cancelled", "value": "cancelled"}
      ]
    },
    {
      "name": "delivery_date",
      "description": "Delivery date (YYYY-MM-DD)",
      "type": 3,
      "required": false
    }
  ]
}
```

### Command: create-invoice
```json
{
  "name": "create-invoice",
  "description": "Create a new invoice for a user",
  "options": [
    {
      "name": "user",
      "description": "Discord User ID",
      "type": 3,
      "required": true
    },
    {
      "name": "amount",
      "description": "Invoice amount in USD",
      "type": 10,
      "required": true
    },
    {
      "name": "order_id",
      "description": "Related order UUID (optional)",
      "type": 3,
      "required": false
    },
    {
      "name": "due_date",
      "description": "Due date (YYYY-MM-DD)",
      "type": 3,
      "required": false
    }
  ]
}
```

### Command: update-invoice
```json
{
  "name": "update-invoice",
  "description": "Update an invoice status",
  "options": [
    {
      "name": "invoice_id",
      "description": "Invoice UUID",
      "type": 3,
      "required": true
    },
    {
      "name": "status",
      "description": "New status",
      "type": 3,
      "required": true,
      "choices": [
        {"name": "unpaid", "value": "unpaid"},
        {"name": "paid", "value": "paid"},
        {"name": "overdue", "value": "overdue"},
        {"name": "cancelled", "value": "cancelled"}
      ]
    }
  ]
}
```

### Command: list-orders
```json
{
  "name": "list-orders",
  "description": "List recent orders for a user",
  "options": [
    {
      "name": "user",
      "description": "Discord User ID",
      "type": 3,
      "required": true
    }
  ]
}
```

### Command: list-invoices
```json
{
  "name": "list-invoices",
  "description": "List recent invoices for a user",
  "options": [
    {
      "name": "user",
      "description": "Discord User ID",
      "type": 3,
      "required": true
    }
  ]
}
```

## 3. Configure Discord Bot
1. In your Discord application settings, go to "General Information"
2. Set the "Interactions Endpoint URL" to: `https://dzbpjvtrfnjzyzfhlmad.supabase.co/functions/v1/discord-bot`
3. Go to "OAuth2" → "URL Generator"
4. Select scopes: `bot` and `applications.commands`
5. Select bot permissions: `Send Messages`, `Use Slash Commands`
6. Use the generated URL to invite the bot to your server

## 4. Usage Examples
- `/create-order user:123456789 order_name:"Logo Design" price:99.99 description:"Custom logo design"`
- `/update-order order_id:uuid-here status:completed`
- `/create-invoice user:123456789 amount:150.00 due_date:2024-12-31`
- `/update-invoice invoice_id:uuid-here status:paid`
- `/list-orders user:123456789`
- `/list-invoices user:123456789`

## Notes
- Users must sign up on your website first before you can create orders/invoices for them
- Use Discord User IDs (right-click user → Copy ID with Developer Mode enabled)
- The bot uses the Supabase service role to bypass RLS policies
