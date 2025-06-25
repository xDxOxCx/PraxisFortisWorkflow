import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabaseClient';
import { apiRequest } from '@/lib/queryClient';

export default function AuthCallback() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth error:', error);
          setLocation('/');
          return;
        }

        if (data.session) {
          // Send user data to backend
          await apiRequest('POST', '/api/auth/callback', {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.session.user,
          });
          
          setLocation('/');
        } else {
          setLocation('/');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setLocation('/');
      }
    };

    handleAuthCallback();
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
}