-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_code TEXT UNIQUE NOT NULL DEFAULT 'ORD-' || EXTRACT(EPOCH FROM NOW())::TEXT,
  order_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  service TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create affiliates table
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code TEXT UNIQUE NOT NULL,
  affiliate_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create webhook notifications table
CREATE TABLE public.webhook_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required)
CREATE POLICY "Orders are publicly accessible" ON public.orders FOR ALL USING (true);
CREATE POLICY "Affiliates are publicly accessible" ON public.affiliates FOR ALL USING (true);
CREATE POLICY "Webhooks are publicly accessible" ON public.webhook_notifications FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for orders table
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;