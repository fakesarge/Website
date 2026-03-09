import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  discord_id: string | null;
  discord_username: string | null;
  discord_avatar_url: string | null;
  is_admin: boolean | null;
  created_at: string;
  updated_at: string;
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
  const initializedRef = useRef(false);

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    console.log('[Auth] Fetching profile for:', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('[Auth] Profile fetch error:', error);
        return null;
      }
      console.log('[Auth] Profile fetched:', data?.discord_id, data?.discord_username);
      return data;
    } catch (error) {
      console.error('[Auth] Profile fetch exception:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let mounted = true;

    const initialize = async () => {
      console.log('[Auth] Initializing...');
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('[Auth] Session:', currentSession ? 'exists' : 'none', currentSession?.user?.id);
        
        if (!mounted) return;

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          const profileData = await fetchProfile(currentSession.user.id);
          if (mounted) {
            setProfile(profileData);
            console.log('[Auth] Init complete. Profile:', profileData?.discord_id);
          }
        } else {
          setSession(null);
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('[Auth] Init error:', err);
      } finally {
        if (mounted) {
          setLoading(false);
          console.log('[Auth] Loading set to false');
        }
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!mounted) return;
        console.log('[Auth] Auth state changed:', event);

        // Only handle actual changes, not initial session
        if (event === 'INITIAL_SESSION') return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          // Fetch profile without blocking
          fetchProfile(newSession.user.id).then((profileData) => {
            if (mounted) setProfile(profileData);
          });
        } else {
          setProfile(null);
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
    return { error: null };
  };

  console.log('[Auth] Render - loading:', loading, 'user:', !!user, 'profile:', profile?.discord_id);

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
