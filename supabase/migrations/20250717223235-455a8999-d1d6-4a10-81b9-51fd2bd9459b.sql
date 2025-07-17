-- Add timestamps to orders table
ALTER TABLE IF EXISTS public.orders
ADD COLUMN IF NOT EXISTS order_code TEXT,
ALTER COLUMN status SET DEFAULT 'pending',
ALTER COLUMN status SET NOT NULL;

-- Create function and trigger to automatically generate order code on insert
CREATE OR REPLACE FUNCTION public.generate_order_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_code := 'ORD-74HRS-' || SUBSTRING(MD5(NEW.id::TEXT), 1, 5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new orders
DROP TRIGGER IF EXISTS set_order_code ON public.orders;
CREATE TRIGGER set_order_code
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.generate_order_code();

-- Create affiliates_orders table to track affiliate referrals
CREATE TABLE IF NOT EXISTS public.affiliate_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  claimed BOOLEAN DEFAULT false,
  commission_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(order_id, affiliate_id)
);

-- Enable RLS on affiliate_claims
ALTER TABLE public.affiliate_claims ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for affiliate_claims
CREATE POLICY "Affiliates can view their own claims"
ON public.affiliate_claims
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.affiliates
    WHERE affiliates.id = affiliate_claims.affiliate_id
    AND affiliates.user_id = auth.uid()
  )
);

CREATE POLICY "Affiliates can insert their claims"
ON public.affiliate_claims
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.affiliates
    WHERE affiliates.id = affiliate_claims.affiliate_id
    AND affiliates.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all affiliate claims"
ON public.affiliate_claims
FOR ALL
USING (is_admin(auth.uid()));

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating updated_at on affiliate_claims
CREATE TRIGGER update_affiliate_claims_timestamp
BEFORE UPDATE ON public.affiliate_claims
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();