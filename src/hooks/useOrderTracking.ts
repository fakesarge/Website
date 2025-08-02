import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
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

  useEffect(() => {
    const subscription = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Real-time order change:', payload);
          
          // Trigger webhook notification
          if (payload.eventType !== 'UPDATE' || 
              (payload.old && payload.new && payload.old.status !== payload.new.status)) {
            supabase.functions.invoke('order-webhook-notifier', {
              body: {
                type: payload.eventType,
                record: payload.new,
                old_record: payload.old
              }
            }).catch(console.error);
          }
          
          // Refetch orders when any change occurs
          queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient]);
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: {
      order_name: string;
      customer_email: string;
      customer_name: string;
      service: string;
      category: string;
      price: number;
      description?: string;
    }) => {
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
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

export const useCreateAffiliate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (affiliateData: {
      referral_code: string;
      affiliate_name: string;
    }) => {
      const { data, error } = await supabase
        .from('affiliates')
        .insert(affiliateData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
    },
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