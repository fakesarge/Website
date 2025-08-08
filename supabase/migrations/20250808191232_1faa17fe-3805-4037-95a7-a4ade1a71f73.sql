-- Fix the webhook function to handle proper JSON parsing
CREATE OR REPLACE FUNCTION public.notify_order_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  payload jsonb;
BEGIN
  -- Build the payload more carefully
  IF TG_OP = 'DELETE' THEN
    payload := jsonb_build_object(
      'type', TG_OP,
      'old_record', to_jsonb(OLD)
    );
  ELSIF TG_OP = 'UPDATE' THEN  
    payload := jsonb_build_object(
      'type', TG_OP,
      'record', to_jsonb(NEW),
      'old_record', to_jsonb(OLD)
    );
  ELSE -- INSERT
    payload := jsonb_build_object(
      'type', TG_OP,
      'record', to_jsonb(NEW)
    );
  END IF;

  -- Call the edge function for webhook notifications
  PERFORM
    net.http_post(
      url := 'https://aqpjgfvsxxlwgcapxres.supabase.co/functions/v1/order-webhook-notifier',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.service_role_key', true) || '"}'::jsonb,
      body := payload
    );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$function$;

-- Add referral tracking to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS referral_code text;
CREATE INDEX IF NOT EXISTS idx_orders_referral_code ON orders(referral_code);

-- Create a view for affiliate order tracking
CREATE OR REPLACE VIEW affiliate_order_stats AS
SELECT 
  a.id as affiliate_id,
  a.email,
  a.affiliate_name,
  a.referral_code,
  COUNT(o.id) as total_orders,
  COALESCE(SUM(o.price), 0) as total_sales,
  COALESCE(SUM(o.price * 0.10), 0) as total_commission
FROM affiliates a
LEFT JOIN orders o ON o.referral_code = a.referral_code
GROUP BY a.id, a.email, a.affiliate_name, a.referral_code;