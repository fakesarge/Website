-- Fix function security issues by adding search_path
CREATE OR REPLACE FUNCTION public.notify_order_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Call the edge function for webhook notifications
  PERFORM
    net.http_post(
      url := 'https://aqpjgfvsxxlwgcapxres.supabase.co/functions/v1/order-webhook-notifier',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.service_role_key', true) || '"}'::jsonb,
      body := jsonb_build_object(
        'type', TG_OP,
        'record', row_to_json(NEW),
        'old_record', row_to_json(OLD)
      )
    );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$function$;

-- Fix the other function security issue
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Create the missing triggers for webhook notifications
DROP TRIGGER IF EXISTS notify_order_changes_trigger ON orders;
CREATE TRIGGER notify_order_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_order_changes();

-- Add trigger for updated_at on orders
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for updated_at on affiliates  
DROP TRIGGER IF EXISTS update_affiliates_updated_at ON affiliates;
CREATE TRIGGER update_affiliates_updated_at
  BEFORE UPDATE ON affiliates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fix affiliate table structure by adding missing updated_at column
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();