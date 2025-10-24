import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/core/config/supabase';
import type { Session, User } from '@supabase/supabase-js';
import { dataProvider } from './dataProvider';
import { Tables } from '../types/database.types';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    full_name: string,
    phone: string
  ) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;

  // Utility functions for user metadata
  getUserFullName: () => string | null;
  getEmail: () => string | null;
  getUserPhone: () => string | null;
  getUserRole: () => string | null;
  isAdmin: () => boolean;
  isProfilValidated: () => boolean;
  userProfile: Tables<'profiles'> | null;

  // Profile management
  refetchUserProfile: () => Promise<void>;
};

const AuthContextObject = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<Tables<'profiles'> | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setError(error.message);
          console.error('Auth initialization error:', error);
        } else {
          setSession(data.session);
          setUser(data.session?.user ?? null);

          // Fetch user profile if user exists
          if (data.session?.user) {
            await fetchUserProfile(data.session.user.id);
          }

          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown auth error');
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Fetch user profile when user signs in
      if (session?.user && event === 'SIGNED_IN') {
        await fetchUserProfile(session.user.id);
      } else if (!session) {
        setUserProfile(null);
      }

      setLoading(false);

      // Clear errors on successful auth state changes
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setError(null);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Subscribe aux changements du profil courant pour forcer la déconnexion si le compte est verrouillé
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`profile-updates-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        async (payload) => {
          const newRow = payload.new as Tables<'profiles'>;
          // Si le compte est verrouillé, on déconnecte immédiatement
          if (newRow?.account_locked) {
            await supabase.auth.signOut();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const response = await dataProvider.getOne('profiles', userId);
      if (response.success) {
        setUserProfile(response.data);
        // Fallback immédiat: si le compte est verrouillé, se déconnecter
        if (response.data?.account_locked) {
          await supabase.auth.signOut();
        }
      } else {
        console.error('Failed to fetch user profile:', response.error);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
        return { error };
      }
      setError(null);
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign out failed');
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return { error };
      }

      // Fetch user profile to check validation and role
      const profileResponse = await dataProvider.getOne('profiles', data.user.id);

      if (!profileResponse.success) {
        await supabase.auth.signOut();
        const profileError = new Error('Failed to load user profile. Please contact support.');
        setError(profileError.message);
        return { error: profileError };
      }

      const profile = profileResponse.data;

      // Check if profile exists
      if (!profile) {
        await supabase.auth.signOut();
        const profileError = new Error('User profile not found. Please contact support.');
        setError(profileError.message);
        return { error: profileError };
      }

      // Check if user has admin role
      if (profile.role !== 'admin') {
        await supabase.auth.signOut();
        const adminError = new Error('Access denied. Admin privileges required.');
        setError(adminError.message);
        return { error: adminError };
      }

      // Check if profile is validated
      if (!profile.profile_validated) {
        await supabase.auth.signOut();
        const validationError = new Error(
          'Your admin account is pending validation. Please contact your administrator.'
        );
        setError(validationError.message);
        return { error: validationError };
      }

      // All checks passed - store profile
      setUserProfile(profile);
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign in failed');
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, full_name: string, phone: string) => {
    try {
      setLoading(true);
      setError(null);

      // Sign up the user with metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            phone,
            role: 'admin', // All signups are admin for this panel
          },
        },
      });

      if (error) {
        setError(error.message);
        return { error };
      }

      // If user is created but needs email confirmation
      if (data.user && !data.session) {
        setError('Please check your email to confirm your account');
        return { error: new Error('Email confirmation required') };
      }

      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Sign up failed');
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      // Spécifier explicitement la redirection vers la page reset password
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
        return { error };
      }
      return { error: null };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Password reset failed');
      setError(error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Utility functions for accessing user metadata
  const getUserFullName = () => userProfile?.full_name || user?.user_metadata?.full_name || null;
  const getEmail = () => user?.email || null;
  const getUserPhone = () => userProfile?.phone || user?.user_metadata?.phone || null;
  const getUserRole = () => userProfile?.role || user?.user_metadata?.role || null;
  const isAdmin = () => getUserRole() === 'admin';
  const isProfilValidated = () => userProfile?.profile_validated === true;

  // Fonction pour recharger le profil utilisateur
  const refetchUserProfile = async () => {
    if (user?.id) {
      await fetchUserProfile(user.id);
    }
  };

  return (
    <AuthContextObject.Provider
      value={{
        user,
        session,
        loading,
        error,
        signOut,
        signIn,
        signUp,
        resetPassword,
        getUserFullName,
        getEmail,
        getUserPhone,
        getUserRole,
        isAdmin,
        isProfilValidated,
        userProfile,
        refetchUserProfile,
      }}
    >
      {children}
    </AuthContextObject.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContextObject);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
