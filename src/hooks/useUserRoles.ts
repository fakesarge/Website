import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'moderator' | 'user' | 'vip';

export const useUserRoles = (userId?: string) => {
  return useQuery({
    queryKey: ['user-roles', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_roles' as any)
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }
      
      return (data as any[]).map(r => r.role as AppRole);
    },
    enabled: !!userId,
    staleTime: 60000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
  });
};
