
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
          window.location.href = "/auth";
          return;
        }

        if (data.session) {
          toast({
            title: "Success",
            description: "Email verified successfully!",
          });
          window.location.href = "/";
        } else {
          window.location.href = "/auth";
        }
      } catch (error: any) {
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
