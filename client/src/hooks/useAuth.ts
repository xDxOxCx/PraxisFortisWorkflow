import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !!session,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    user,
    session,
    isLoading: loading || userLoading,
    isAuthenticated: !!session,
  };
}
