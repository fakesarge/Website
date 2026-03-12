import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import AmbientBackground from '@/components/AmbientBackground';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import CustomerDashboard from '@/components/dashboard/CustomerDashboard';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OWNER_DISCORD_ID = '1201255976683196426';

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ['dashboard-auth'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      console.log('[Dashboard] Session user:', session.user.id);
      console.log('[Dashboard] User metadata:', session.user.user_metadata);

      // Look up profile by discord_id (provider_id from metadata)
      const discordId = session.user.user_metadata?.provider_id;
      
      let profile = null;
      
      if (discordId) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('discord_id', discordId)
          .maybeSingle();
        profile = data;
        console.log('[Dashboard] Profile by discord_id:', profile);
      }
      
      // Fallback: query by user id
      if (!profile) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        profile = data;
        console.log('[Dashboard] Profile by id (fallback):', profile);
      }

      // Check admin: owner discord ID OR is_admin flag
      const isAdmin = profile?.discord_id === OWNER_DISCORD_ID || profile?.is_admin === true;

      console.log('[Dashboard] isAdmin:', isAdmin, 'discord_id:', profile?.discord_id);

      return { user: session.user, profile, isAdmin };
    },
    staleTime: 60_000,
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authData?.user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <AmbientBackground />
      {authData.isAdmin ? (
        <AdminDashboard profile={authData.profile} onSignOut={handleSignOut} />
      ) : (
        <CustomerDashboard profile={authData.profile} user={authData.user} onSignOut={handleSignOut} />
      )}
    </div>
  );
};

export default Dashboard;
