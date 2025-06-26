
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the auth callback from email confirmation
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
          window.location.href = "/auth";
          return;
        }

        if (data.session && data.session.user) {
          console.log('Session found, creating user in database');
          
          // Call auth callback to create user in database
          try {
            const response = await fetch('/api/auth/callback', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${data.session.access_token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (response.ok) {
              toast({
                title: "Success",
                description: "Email verified successfully!",
              });
              window.location.href = "/";
            } else {
              const errorData = await response.json();
              console.error('Auth callback failed:', errorData);
              toast({
                title: "Error",
                description: "Failed to complete authentication",
                variant: "destructive",
              });
              window.location.href = "/auth";
            }
          } catch (callbackError) {
            console.error('Callback request failed:', callbackError);
            toast({
              title: "Error",
              description: "Failed to complete authentication",
              variant: "destructive",
            });
            window.location.href = "/auth";
          }
        } else {
          console.log('No session found, redirecting to auth');
          window.location.href = "/auth";
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        toast({
          title: "Error",
          description: "Something went wrong during authentication",
          variant: "destructive",
        });
        window.location.href = "/auth";
      }
    };

    handleAuthCallback();
  }, [toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Verifying your account...</h2>
        <p className="text-muted-foreground">Please wait while we verify your email.</p>
      </div>
    </div>
  );
}
