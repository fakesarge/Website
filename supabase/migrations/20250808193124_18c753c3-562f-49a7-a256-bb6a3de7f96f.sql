-- Fix the security definer view by removing it and using proper queries instead
DROP VIEW IF EXISTS affiliate_order_stats;

-- Update affiliates table to properly track commission and referrals
CREATE OR REPLACE FUNCTION update_affiliate_stats()
RETURNS trigger AS $$
BEGIN
  -- Update affiliate stats when orders with referral codes are inserted/updated/deleted
  IF TG_OP = 'INSERT' AND NEW.referral_code IS NOT NULL THEN
    UPDATE affiliates 
    SET 
      total_referrals = (
        SELECT COUNT(*) FROM orders WHERE referral_code = NEW.referral_code
      ),
      total_commission = (
        SELECT COALESCE(SUM(price * 0.10), 0) FROM orders WHERE referral_code = NEW.referral_code
      )
    WHERE referral_code = NEW.referral_code;
  ELSIF TG_OP = 'UPDATE' AND (OLD.referral_code IS DISTINCT FROM NEW.referral_code OR OLD.price IS DISTINCT FROM NEW.price) THEN
    -- Update stats for old referral code if changed
    IF OLD.referral_code IS NOT NULL THEN
      UPDATE affiliates 
      SET 
        total_referrals = (
          SELECT COUNT(*) FROM orders WHERE referral_code = OLD.referral_code
        ),
        total_commission = (
          SELECT COALESCE(SUM(price * 0.10), 0) FROM orders WHERE referral_code = OLD.referral_code
        )
      WHERE referral_code = OLD.referral_code;
    END IF;
    
    -- Update stats for new referral code
    IF NEW.referral_code IS NOT NULL THEN
      UPDATE affiliates 
      SET 
        total_referrals = (
          SELECT COUNT(*) FROM orders WHERE referral_code = NEW.referral_code
        ),
        total_commission = (
          SELECT COALESCE(SUM(price * 0.10), 0) FROM orders WHERE referral_code = NEW.referral_code
        )
      WHERE referral_code = NEW.referral_code;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.referral_code IS NOT NULL THEN
    UPDATE affiliates 
    SET 
      total_referrals = (
        SELECT COUNT(*) FROM orders WHERE referral_code = OLD.referral_code
      ),
      total_commission = (
        SELECT COALESCE(SUM(price * 0.10), 0) FROM orders WHERE referral_code = OLD.referral_code
      )
    WHERE referral_code = OLD.referral_code;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to update affiliate stats
DROP TRIGGER IF EXISTS update_affiliate_stats_trigger ON orders;
CREATE TRIGGER update_affiliate_stats_trigger
  AFTER INSERT OR UPDATE OR DELETE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_affiliate_stats();