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

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      // Check admin: owner discord ID OR has admin role
      const isAdmin = profile?.discord_id === OWNER_DISCORD_ID || profile?.is_admin === true;

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
