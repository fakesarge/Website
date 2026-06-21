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
  vip: boolean | null;
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

  const fetchProfile = useCallback(async (currentUser: User) => {
    const userId = currentUser.id;
    if (profileFetchedForRef.current === userId) return;
    profileFetchedForRef.current = userId;
    
    console.log('[Auth] Fetching profile for:', userId);
    console.log('[Auth] User metadata:', JSON.stringify(currentUser.user_metadata));
    
    try {
      // Try by discord_id first
      const discordId = currentUser.user_metadata?.provider_id;
      let data = null;
      
      if (discordId) {
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('discord_id', discordId)
          .maybeSingle();
        data = result.data;
      }
      
      // Fallback to user id
      if (!data) {
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
        data = result.data;
      }

      if (!data) {
        console.log('[Auth] No profile found, will be created by edge function');
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
          // Defer Supabase calls so the auth callback returns immediately.
          setTimeout(async () => {
            if (!mounted) return;
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
              const { error } = await supabase.functions.invoke('update-profile-ip', {
                body: {},
                headers: { Authorization: `Bearer ${currentSession.access_token}` },
              });
              if (error) {
                console.warn('[Auth] Profile sync failed:', error);
              } else {
                console.log('[Auth] Profile sync complete');
              }
            }
            await fetchProfile(currentSession.user);
            if (mounted) {
              setLoading(false);
              console.log('[Auth] Ready with profile');
            }
          }, 0);
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
