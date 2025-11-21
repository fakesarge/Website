-- Create table for tracking casino plays
CREATE TABLE public.casino_plays (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_identifier text NOT NULL,
  played_at timestamp with time zone NOT NULL DEFAULT now(),
  won boolean NOT NULL DEFAULT false,
  voucher_code text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.casino_plays ENABLE ROW LEVEL SECURITY;

-- Allow public read and insert
CREATE POLICY "Allow public read access to casino plays"
ON public.casino_plays
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert access to casino plays"
ON public.casino_plays
FOR INSERT
WITH CHECK (true);

-- Create table for voucher codes
CREATE TABLE public.voucher_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  discount_amount numeric NOT NULL,
  is_used boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  used_at timestamp with time zone,
  used_by text
);

-- Enable RLS
ALTER TABLE public.voucher_codes ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Allow public read access to voucher codes"
ON public.voucher_codes
FOR SELECT
USING (true);

-- Allow public update for redeeming
CREATE POLICY "Allow public update access to voucher codes"
ON public.voucher_codes
FOR UPDATE
USING (true);