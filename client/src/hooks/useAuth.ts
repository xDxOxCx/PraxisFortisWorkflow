
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useAuth() {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { data: user, isLoading: userLoading, refetch: refetchUser } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      if (!session?.access_token) {
        return null;
      }
      
      const response = await fetch('/api/auth/user', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // User not found in database, but session exists - this is expected for new users
          return null;
        }
        throw new Error(`Failed to fetch user: ${response.status}`);
      }
      
      return response.json();
    },
    enabled: !!session?.access_token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      setSession(session);
      setIsLoading(false);

      // If user just signed in, call auth callback
      if (event === 'SIGNED_IN' && session && !user) {
        try {
          const response = await fetch('/api/auth/callback', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            // Refetch user data after successful callback
            refetchUser();
          } else {
            console.error('Auth callback failed:', await response.text());
          }
        } catch (error) {
          console.error('Error calling auth callback:', error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [user, refetchUser]);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        return { data: null, error };
      }
      
      if (data.user && !data.user.email_confirmed_at) {
        return { 
          data, 
          error: null,
          message: 'Please check your email and click the confirmation link to complete registration.'
        };
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Sign up failed:', err);
      return { data: null, error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        return { data: null, error };
      }
      
      return { data, error: null };
    } catch (err) {
      console.error('Sign in failed:', err);
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { data, error };
  };

  return {
    user: user || null,
    session,
    isLoading: isLoading || (userLoading && !!session),
    isAuthenticated: !!session?.user && !!user,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
}
