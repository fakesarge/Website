import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export const useCreateAffiliate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { email: string; affiliate_name: string }) => {
      const { data: affiliate, error } = await supabase
        .from('affiliates')
        .insert({
          email: data.email,
          affiliate_name: data.affiliate_name,
          referral_code: `REF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        })
        .select()
        .single();

      if (error) throw error;
      return affiliate;
    },
    onSuccess: (data, variables) => {
      // Invalidate both the affiliates list and the specific affiliate query
      queryClient.invalidateQueries({ queryKey: ['affiliates'] });
      queryClient.invalidateQueries({ queryKey: ['affiliate', variables.email] });
      queryClient.setQueryData(['affiliate', variables.email], data);
      toast({
        title: "Success",
        description: "Affiliate account created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create affiliate account",
        variant: "destructive",
      });
    },
  });
};

export const useAffiliateByEmail = (email: string) => {
  return useQuery({
    queryKey: ['affiliate', email],
    queryFn: async () => {
      if (!email) return null;
      
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!email,
    staleTime: 0, // Always refetch to ensure fresh data
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useAffiliateOrders = (email: string) => {
  return useQuery({
    queryKey: ['affiliate-orders', email],
    queryFn: async () => {
      if (!email) return [];
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!email,
  });
};