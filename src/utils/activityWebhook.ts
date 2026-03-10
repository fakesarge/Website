import { supabase } from '@/integrations/supabase/client';

export const sendActivityWebhook = async (
  eventType: string,
  data: Record<string, any>
) => {
  try {
    await supabase.functions.invoke('discord-activity', {
      body: { event_type: eventType, data },
    });
  } catch (e) {
    console.warn('[webhook] Failed to send activity webhook:', e);
  }
};
