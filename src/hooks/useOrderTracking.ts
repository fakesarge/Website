import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useOrderTracking = (orderCode: string) => {
  return useQuery({
    queryKey: ['order', orderCode],
    queryFn: async () => {
      if (!orderCode) return null;
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`order_code.eq.${orderCode},id.eq.${orderCode}`)
        .maybeSingle();
      
      if (error || !data) {
        console.error('Error fetching order:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!orderCode,
  });
};

export const useAffiliateLink = (affiliateCode: string) => {
  return useQuery({
    queryKey: ['affiliate', affiliateCode],
    queryFn: async () => {
      if (!affiliateCode) return null;
      
      const { data, error } = await supabase
        .from('affiliates')
        .select('*')
        .eq('referral_code', affiliateCode)
        .single();
      
      if (error) {
        console.error('Error fetching affiliate:', error);
        return null;
      }
      
      return {
        ...data,
        link: `https://74hrs.com/orders?ref=${affiliateCode}`
      };
    },
    enabled: !!affiliateCode,
  });
};

export const useClaimAffiliate = (orderCode: string, affiliateCode: string) => {
  return useQuery({
    queryKey: ['claim', orderCode, affiliateCode],
    queryFn: async () => {
      if (!orderCode || !affiliateCode) return null;
      
      // First get the order and affiliate IDs
      const orderResponse = await supabase
        .from('orders')
        .select('id, price')
        .or(`order_code.eq.${orderCode},id.eq.${orderCode}`)
        .maybeSingle();
      
      if (orderResponse.error) {
        console.error('Error fetching order:', orderResponse.error);
        return { success: false, message: 'Order not found' };
      }
      
      const affiliateResponse = await supabase
        .from('affiliates')
        .select('id, commission_rate')
        .eq('referral_code', affiliateCode)
        .single();
        
      if (affiliateResponse.error) {
        console.error('Error fetching affiliate:', affiliateResponse.error);
        return { success: false, message: 'Affiliate not found' };
      }
      
      const orderId = orderResponse.data.id;
      const affiliateId = affiliateResponse.data.id;
      const price = orderResponse.data.price;
      const commissionRate = affiliateResponse.data.commission_rate || 10;
      const commissionAmount = (price * commissionRate) / 100;
      
      // Check if claim already exists
      const existingClaimResponse = await supabase
        .from('affiliate_claims')
        .select('*')
        .eq('order_id', orderId)
        .eq('affiliate_id', affiliateId);
      
      if (existingClaimResponse.data && existingClaimResponse.data.length > 0) {
        return { 
          success: true, 
          message: 'This order has already been claimed',
          existing: true,
          claim: existingClaimResponse.data[0]
        };
      }
      
      // Create new claim
      const claimResponse = await supabase
        .from('affiliate_claims')
        .insert([
          { 
            order_id: orderId, 
            affiliate_id: affiliateId,
            commission_amount: commissionAmount
          }
        ]);
      
      if (claimResponse.error) {
        console.error('Error creating claim:', claimResponse.error);
        return { success: false, message: 'Failed to create claim' };
      }
      
      return { 
        success: true, 
        message: 'Claim created successfully',
        amount: commissionAmount 
      };
    },
    enabled: false, // This will be triggered manually
  });
};