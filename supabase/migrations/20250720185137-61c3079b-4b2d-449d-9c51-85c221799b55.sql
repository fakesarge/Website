-- Create invoices table for Discord bot functionality
CREATE TABLE public.invoices (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  order_id uuid REFERENCES public.orders(id),
  invoice_number text NOT NULL UNIQUE,
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'unpaid',
  due_date timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for Discord bot)
CREATE POLICY "Public can manage invoices" 
ON public.invoices 
FOR ALL
USING (true);

-- Add discord_id column to profiles for Discord bot linking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS discord_id text UNIQUE;