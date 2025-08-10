-- Drop and recreate all triggers to ensure they work properly
DROP TRIGGER IF EXISTS notify_order_changes_trigger ON orders;
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
DROP TRIGGER IF EXISTS update_affiliate_stats_trigger ON orders;

-- Create the order notification trigger
CREATE TRIGGER notify_order_changes_trigger
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_order_changes();

-- Create the updated_at trigger for orders
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create the affiliate stats update trigger
CREATE TRIGGER update_affiliate_stats_trigger
  AFTER INSERT OR UPDATE OF price, referral_code OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_affiliate_stats();

-- Verify triggers are created
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing,
  action_orientation
FROM information_schema.triggers 
WHERE event_object_schema = 'public' 
AND event_object_table = 'orders';