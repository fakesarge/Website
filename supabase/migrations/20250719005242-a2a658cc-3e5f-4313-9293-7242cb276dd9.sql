-- Drop the problematic trigger and function that's causing infinite recursion
DROP TRIGGER IF EXISTS update_orders_queue_trigger ON public.orders;
DROP FUNCTION IF EXISTS public.update_queue_positions();