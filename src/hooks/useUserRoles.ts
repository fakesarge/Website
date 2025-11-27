import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'moderator' | 'user' | 'vip';

export const useUserRoles = (userId?: string) => {
  // TEMPORARY: force your user ID
  const adminUserId = 'd176c57d-e0eb-4da7-b1df-7a65eaa4723e'; // <-- replace with your Supabase user ID

  return useQuery({
    queryKey: ['user-roles', adminUserId],
    queryFn: async () => {
      if (!adminUserId) return [];

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', adminUserId);

      if (error) throw error;
      return data.map(r => r.role as AppRole);
    },
    enabled: !!adminUserId,
  });
};

