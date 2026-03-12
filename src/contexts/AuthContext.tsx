import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  discord_id: string | null;
  username: string | null;
  avatar_url: string | null;
  email: string | null;
  is_admin: boolean | null;
  signup_ip: string | null;
  created_at: string;
  last_login: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signInWithDiscord: () => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const profileFetchedForRef = useRef<string | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    if (profileFetchedForRef.current === userId) return;
    profileFetchedForRef.current = userId;
    
    console.log('[Auth] Fetching profile for:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('[Auth] Profile fetch error:', JSON.stringify(error));
        setProfile(null);
        profileFetchedForRef.current = null;
      } else {
        console.log('[Auth] Profile fetched OK:', data?.discord_id, data?.username);
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('[Auth] Profile fetch exception:', error);
      setProfile(null);
      profileFetchedForRef.current = null;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    console.log('[Auth] Setting up auth listener...');

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;
        
        console.log('[Auth] onAuthStateChange:', event, 'user:', currentSession?.user?.id ?? 'none');
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          setTimeout(async () => {
            if (!mounted) return;
            await fetchProfile(currentSession.user.id);
            if (mounted) {
              setLoading(false);
              console.log('[Auth] Ready with profile');
            }
          }, 0);
          
          if (event === 'SIGNED_IN') {
            supabase.functions.invoke('update-profile-ip').catch(() => {});
          }
        } else {
          setProfile(null);
          profileFetchedForRef.current = null;
          setLoading(false);
          console.log('[Auth] No session, loading done');
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signInWithDiscord = async () => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: { redirectTo: redirectUrl },
    });
    if (error) {
      console.error('Error signing in with Discord:', error);
      return { error };
    }
    return { error: null };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      return { error };
    }
    setProfile(null);
    setUser(null);
    setSession(null);
    profileFetchedForRef.current = null;
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signInWithDiscord,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
