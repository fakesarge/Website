import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Settings = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  const handleDisconnectDiscord = async () => {
    if (!confirm('Are you sure you want to disconnect your Discord account? This will sign you out.')) {
      return;
    }

    setDisconnecting(true);
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast.success('Discord disconnected successfully');
      window.location.href = '/';
    } catch (error) {
      console.error('Error disconnecting Discord:', error);
      toast.error('Failed to disconnect Discord');
    } finally {
      setDisconnecting(false);
    }
  };

  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    document.documentElement.classList.toggle('dark', checked);
    toast.success(`${checked ? 'Dark' : 'Light'} mode enabled`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        <div className="max-w-2xl space-y-6">
          {/* User Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your Supabase user metadata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-mono text-sm">{user.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Discord Username</p>
                <p>{profile?.username || 'Not connected'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Discord ID</p>
                <p className="font-mono text-sm">{profile?.discord_id || 'Not connected'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Created</p>
                <p>{new Date(user.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Sign In</p>
                <p>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Theme Toggle */}
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize how the app looks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex flex-col gap-1">
                  <span>Dark Mode</span>
                  <span className="font-normal text-sm text-muted-foreground">
                    Toggle between light and dark theme
                  </span>
                </Label>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Discord Connection */}
          <Card>
            <CardHeader>
              <CardTitle>Discord Connection</CardTitle>
              <CardDescription>Manage your Discord integration</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={handleDisconnectDiscord}
                disabled={disconnecting}
              >
                {disconnecting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Disconnect Discord
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This will sign you out and remove your Discord connection
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
