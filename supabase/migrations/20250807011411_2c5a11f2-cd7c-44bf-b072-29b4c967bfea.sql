-- First, let's add some default webhook configurations
INSERT INTO webhook_notifications (webhook_url, is_active) VALUES 
('https://discord.com/api/webhooks/placeholder', true)
ON CONFLICT DO NOTHING;

-- Create the trigger function for order notifications
CREATE OR REPLACE FUNCTION notify_order_changes()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for orders table
DROP TRIGGER IF EXISTS on_order_created ON orders;
DROP TRIGGER IF EXISTS on_order_updated ON orders;
DROP TRIGGER IF EXISTS on_order_deleted ON orders;

CREATE TRIGGER on_order_created
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_order_changes();

CREATE TRIGGER on_order_updated
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_order_changes();

CREATE TRIGGER on_order_deleted
  AFTER DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_order_changes();

-- Fix affiliates table structure if needed
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS total_commission numeric DEFAULT 0;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS total_referrals integer DEFAULT 0;
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create unique constraint on email if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'affiliates_email_key') THEN
    ALTER TABLE affiliates ADD CONSTRAINT affiliates_email_key UNIQUE (email);
  END IF;
END $$;