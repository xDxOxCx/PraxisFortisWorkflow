import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const response = await fetch('/api/auth/user', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          return null; // Not authenticated
        }
        throw new Error(`Failed to fetch user: ${response.status}`);
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  const signOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        refetch(); // Refetch to update auth state
        window.location.href = '/'; // Redirect to landing page
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    refetch,
  };
}