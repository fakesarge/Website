import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QueueOrder {
  id: string;
  order_code: string;
  order_name: string;
  customer_name: string | null;
  service: string;
  category: string;
  description: string | null;
  status: string;
  price: number;
  created_at: string;
  updated_at: string;
}

// Public, safe-columns-only queue (no customer_email, discord_id, referral_code)
export const useOrders = () => {
  return useQuery<QueueOrder[]>({
    queryKey: ['orders-public-queue'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('orders_public_queue')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders queue:', error);
        return [];
      }
      return (data as QueueOrder[]) || [];
    },
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useRealtimeOrders = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orders-public-queue'] });
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
      queryClient.invalidateQueries({ queryKey: ['orders-public-queue'] });
    },
  });
};
