-- Enable realtime for orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Create webhook notifications table to store Discord webhook URLs
CREATE TABLE public.webhook_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_url text NOT NULL,
  webhook_type text NOT NULL DEFAULT 'discord',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.webhook_notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for webhook management (public for now since no auth)
CREATE POLICY "Public can manage webhooks" 
ON public.webhook_notifications 
FOR ALL
USING (true);

-- Create function to send Discord webhook
CREATE OR REPLACE FUNCTION public.send_discord_webhook(
  webhook_url text,
  message_content text,
  embed_title text DEFAULT NULL,
  embed_description text DEFAULT NULL,
  embed_color integer DEFAULT 5814783
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- This will be called by the edge function
  -- Just a placeholder for now
  NULL;
END;
$$;

-- Create function to handle order changes
CREATE OR REPLACE FUNCTION public.handle_order_webhook()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  webhook_record record;
  message_content text;
  embed_title text;
  embed_description text;
  order_data jsonb;
BEGIN
  -- Get the order data (NEW for INSERT/UPDATE, OLD for DELETE)
  IF TG_OP = 'DELETE' THEN
    order_data := to_jsonb(OLD);
  ELSE
    order_data := to_jsonb(NEW);
  END IF;

  -- Create message based on operation
  IF TG_OP = 'INSERT' THEN
    embed_title := '🆕 New Order Created';
    embed_description := format(
      '**Order:** %s\n**Price:** $%s\n**Category:** %s\n**Status:** %s\n**Code:** %s',
      order_data->>'order_name',
      order_data->>'price',
      order_data->>'category',
      order_data->>'status',
      COALESCE(order_data->>'order_code', order_data->>'id')
    );
    message_content := format('New order: %s ($%s)', order_data->>'order_name', order_data->>'price');
  ELSIF TG_OP = 'UPDATE' THEN
    embed_title := '📝 Order Updated';
    embed_description := format(
      '**Order:** %s\n**Price:** $%s\n**Category:** %s\n**Status:** %s\n**Code:** %s',
      order_data->>'order_name',
      order_data->>'price',
      order_data->>'category',
      order_data->>'status',
      COALESCE(order_data->>'order_code', order_data->>'id')
    );
    message_content := format('Order updated: %s - Status: %s', order_data->>'order_name', order_data->>'status');
  ELSIF TG_OP = 'DELETE' THEN
    embed_title := '🗑️ Order Deleted';
    embed_description := format(
      '**Order:** %s\n**Price:** $%s\n**Code:** %s',
      order_data->>'order_name',
      order_data->>'price',
      COALESCE(order_data->>'order_code', order_data->>'id')
    );
    message_content := format('Order deleted: %s', order_data->>'order_name');
  END IF;

  -- Send to all active Discord webhooks
  FOR webhook_record IN 
    SELECT webhook_url FROM public.webhook_notifications 
    WHERE webhook_type = 'discord' AND is_active = true
  LOOP
    -- Call edge function to send webhook (we'll implement this)
    PERFORM net.http_post(
      url := 'https://dzbpjvtrfnjzyzfhlmad.supabase.co/functions/v1/discord-webhook',
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := jsonb_build_object(
        'webhook_url', webhook_record.webhook_url,
        'message_content', message_content,
        'embed_title', embed_title,
        'embed_description', embed_description,
        'embed_color', 5814783
      )
    );
  END LOOP;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Create triggers for order changes
CREATE TRIGGER order_webhook_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_order_webhook();

-- Add some default webhook URLs (you can change these)
INSERT INTO public.webhook_notifications (webhook_url, webhook_type) VALUES
('https://discord.com/api/webhooks/placeholder', 'discord');

-- Improve affiliate system - add click tracking
CREATE TABLE public.affiliate_clicks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id uuid REFERENCES public.affiliates(id),
  ip_address text,
  user_agent text,
  referrer text,
  clicked_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Public can track clicks" 
ON public.affiliate_clicks 
FOR INSERT
WITH CHECK (true);

-- Add affiliate link generation function
CREATE OR REPLACE FUNCTION public.generate_affiliate_link(affiliate_code text, base_url text DEFAULT 'https://yoursite.com')
RETURNS text
LANGUAGE sql
STABLE
AS $$
  SELECT base_url || '?ref=' || affiliate_code;
$$;