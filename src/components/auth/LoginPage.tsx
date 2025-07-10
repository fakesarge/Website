
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const LoginPage = () => {
  const { user, loading, signInWithDiscord } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <main className="flex items-center justify-center p-4 pt-24">
        <Card className="w-full max-w-md glass border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Welcome to 74hrs</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in with Discord to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={signInWithDiscord}
              className="w-full button-gradient"
              size="lg"
            >
              Continue with Discord
            </Button>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
