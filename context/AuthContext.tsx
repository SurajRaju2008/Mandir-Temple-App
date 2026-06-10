import { Session, User } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Profile } from '@/types';

type ContinueResult = {
  error: string | null;
  needsEmailConfirmation: boolean;
  needsProfile: boolean;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  continueWithEmail: (email: string, password: string) => Promise<ContinueResult>;
  createProfile: (params: { fullName: string; gotra: string }) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    if (!isSupabaseConfigured) return null;

    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    const nextProfile = data ? (data as Profile) : null;
    setProfile(nextProfile);
    return nextProfile;
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const init = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      setSession(currentSession);
      if (currentSession?.user) {
        await loadProfile(currentSession.user.id);
      }
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        await loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const continueWithEmail = async (email: string, password: string): Promise<ContinueResult> => {
    if (!isSupabaseConfigured) {
      return {
        error: 'Supabase is not configured. Add your keys to .env',
        needsEmailConfirmation: false,
        needsProfile: false,
      };
    }

    const normalizedEmail = email.trim();

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (!signInError && signInData.session?.user) {
      setSession(signInData.session);
      const existingProfile = await loadProfile(signInData.session.user.id);
      return {
        error: null,
        needsEmailConfirmation: false,
        needsProfile: !existingProfile,
      };
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
    });

    if (signUpError) {
      return { error: signUpError.message, needsEmailConfirmation: false, needsProfile: false };
    }

    if (signUpData.user?.identities?.length === 0) {
      return {
        error: 'An account with this email already exists. Check your password and try again.',
        needsEmailConfirmation: false,
        needsProfile: false,
      };
    }

    if (signUpData.session?.user) {
      setSession(signUpData.session);
      setProfile(null);
      return {
        error: null,
        needsEmailConfirmation: false,
        needsProfile: true,
      };
    }

    return {
      error: null,
      needsEmailConfirmation: true,
      needsProfile: false,
    };
  };

  const createProfile = async ({
    fullName,
    gotra,
  }: {
    fullName: string;
    gotra: string;
  }) => {
    if (!isSupabaseConfigured) {
      return { error: 'Supabase is not configured. Add your keys to .env' };
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      return { error: 'You must be signed in to create a profile.' };
    }

    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: fullName.trim(),
      gotra: gotra.trim(),
      email: user.email,
    });

    if (error) return { error: error.message };

    await loadProfile(user.id);
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (session?.user) await loadProfile(session.user.id);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      continueWithEmail,
      createProfile,
      signOut,
      refreshProfile,
    }),
    [session, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
