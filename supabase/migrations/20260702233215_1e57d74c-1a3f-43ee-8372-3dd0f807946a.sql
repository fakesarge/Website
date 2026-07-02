
-- =============================
-- BOOKINGS
-- =============================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_code TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  discord_handle TEXT,
  service TEXT NOT NULL,
  category TEXT,
  addons JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  estimated_price_min NUMERIC(10,2) DEFAULT 0,
  estimated_price_max NUMERIC(10,2) DEFAULT 0,
  booking_date DATE NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('website','discord')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','discord_claimed','cancelled','completed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Anyone can create a booking (contact form)
CREATE POLICY "Anyone can create a booking"
ON public.bookings FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Anyone can read booking rows (public queue-style; ticket_code acts as claim key on the client)
CREATE POLICY "Bookings are readable"
ON public.bookings FOR SELECT TO anon, authenticated
USING (true);

-- Admins can update/delete
CREATE POLICY "Admins update bookings"
ON public.bookings FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete bookings"
ON public.bookings FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER bookings_set_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX bookings_booking_date_idx ON public.bookings(booking_date);
CREATE INDEX bookings_ticket_code_idx ON public.bookings(ticket_code);

-- =============================
-- BOOKING MESSAGES
-- =============================
CREATE TABLE public.booking_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('customer','admin')),
  sender_name TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.booking_messages TO anon, authenticated;
GRANT ALL ON public.booking_messages TO service_role;

ALTER TABLE public.booking_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read booking messages"
ON public.booking_messages FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can insert booking messages"
ON public.booking_messages FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins manage booking messages"
ON public.booking_messages FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX booking_messages_booking_id_idx ON public.booking_messages(booking_id);

-- =============================
-- CALENDAR DAYS
-- =============================
CREATE TABLE public.calendar_days (
  date DATE PRIMARY KEY,
  max_slots INT NOT NULL DEFAULT 3,
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  note TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.calendar_days TO anon, authenticated;
GRANT ALL ON public.calendar_days TO service_role;

ALTER TABLE public.calendar_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read calendar"
ON public.calendar_days FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins write calendar"
ON public.calendar_days FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER calendar_days_set_updated_at
BEFORE UPDATE ON public.calendar_days
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================
-- PORTFOLIO ITEMS (GFX / VFX)
-- =============================
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('gfx','vfx')),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_url TEXT NOT NULL,
  media_url TEXT,
  attributes JSONB DEFAULT '{}'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.portfolio_items TO anon, authenticated;
GRANT ALL ON public.portfolio_items TO service_role;

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone reads portfolio"
ON public.portfolio_items FOR SELECT TO anon, authenticated
USING (true);

CREATE POLICY "Admins manage portfolio"
ON public.portfolio_items FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER portfolio_items_set_updated_at
BEFORE UPDATE ON public.portfolio_items
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX portfolio_items_kind_idx ON public.portfolio_items(kind);
