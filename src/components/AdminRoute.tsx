import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { isOwner } from '@/config/admin';
import { Loader2 } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, profile, loading } = useAuth();

  console.log('[AdminRoute] loading:', loading, 'user:', !!user, 'profile:', profile?.discord_id, 'isOwner:', isOwner(profile?.discord_id));

  // Only show loading while initial auth is resolving
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isOwner(profile?.discord_id)) {
    console.log('[AdminRoute] Access denied. discord_id:', profile?.discord_id, 'expected:', '1201255976683196426');
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
