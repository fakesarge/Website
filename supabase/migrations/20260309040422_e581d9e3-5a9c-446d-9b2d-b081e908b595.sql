-- Create order_messages table for chat
CREATE TABLE public.order_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL,
  sender_avatar_url TEXT,
  message TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_images table
CREATE TABLE public.order_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_images ENABLE ROW LEVEL SECURITY;

-- RLS for order_messages: admins can do everything, users can read/insert on their own orders
CREATE POLICY "Admins can manage all messages"
  ON public.order_messages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Users can read messages on own orders"
  ON public.order_messages FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN profiles p ON p.discord_id = o.discord_id
      WHERE o.id = order_id AND p.id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages on own orders"
  ON public.order_messages FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN profiles p ON p.discord_id = o.discord_id
      WHERE o.id = order_id AND p.id = auth.uid()
    )
  );

-- RLS for order_images: same pattern
CREATE POLICY "Admins can manage all images"
  ON public.order_images FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Users can read images on own orders"
  ON public.order_images FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN profiles p ON p.discord_id = o.discord_id
      WHERE o.id = order_id AND p.id = auth.uid()
    )
  );

CREATE POLICY "Users can insert images on own orders"
  ON public.order_images FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders o
      JOIN profiles p ON p.discord_id = o.discord_id
      WHERE o.id = order_id AND p.id = auth.uid()
    )
  );

-- Create storage bucket for order images
INSERT INTO storage.buckets (id, name, public) VALUES ('order-images', 'order-images', true);

-- Storage policies
CREATE POLICY "Anyone can view order images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'order-images');

CREATE POLICY "Authenticated users can upload order images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'order-images');

CREATE POLICY "Admins can delete order images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'order-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));