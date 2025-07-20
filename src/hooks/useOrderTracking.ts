import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useRealtimeOrders = () => {
  const queryClient = useQueryClient();

  const subscription = supabase
    .channel('orders_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders'
      },
      () => {
        // Refetch orders when any change occurs
        queryClient.invalidateQueries({ queryKey: ['orders'] });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
};

export const useAffiliateLink = (code: string) => {
  return useQuery({
    queryKey: ['affiliate-link', code],
    queryFn: async () => {
      if (!code) return null;
      
      const { data, error } = await supabase
        .from('affiliates')
        .select('referral_code')
        .eq('referral_code', code)
        .single();

      if (error) throw error;
      
      return {
        link: `${window.location.origin}?ref=${code}`,
        code: data.referral_code
      };
    },
    enabled: !!code,
  });
};

export const useWebhookManagement = () => {
  const queryClient = useQueryClient();

  const addWebhook = useMutation({
    mutationFn: async (webhookUrl: string) => {
      const { data, error } = await supabase
        .from('webhook_notifications')
        .insert({ webhook_url: webhookUrl })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
    },
  });

  const getWebhooks = useQuery({
    queryKey: ['webhooks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return { addWebhook, getWebhooks };
};