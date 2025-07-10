
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';

const DashboardHeader = () => {
  const { signOut } = useAuth();
  const { data: profile } = useProfile();

  return (
    <header className="border-b border-white/10 bg-[#1B1B1B]/40 backdrop-blur-xl mt-20">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {profile?.username?.charAt(0)?.toUpperCase() || 
                   profile?.discord_username?.charAt(0)?.toUpperCase() || 
                   profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {profile?.username || profile?.discord_username || profile?.full_name || 'User'}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="glass"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
