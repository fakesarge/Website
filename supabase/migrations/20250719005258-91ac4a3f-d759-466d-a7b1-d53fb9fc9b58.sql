-- Drop the problematic trigger and function with CASCADE to remove dependencies
DROP FUNCTION IF EXISTS public.update_queue_positions() CASCADE;