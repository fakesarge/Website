import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Order {
  id: string;
  order_code: string;
  order_name: string;
  customer_name: string;
  customer_email: string;
  service: string;
  category: string;
  description: string;
  price: number;
  status: string;
  discord_id: string;
  referral_code: string | null;
  created_at: string;
  updated_at: string;
}

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      // Check if user is authenticated first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return [];
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return [];
      }
      
      return data || [];
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
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
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Real-time order change:', payload);
          
          // Webhook notifications are handled server-side only
          
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

// Removed affiliate and webhook functionality from frontend