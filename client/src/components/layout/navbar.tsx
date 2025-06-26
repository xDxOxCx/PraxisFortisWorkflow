import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Link } from "wouter";

export default function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth();
  const [location, setLocation] = useLocation();

  const handleAuth = () => {
    if (isAuthenticated) {
      signOut();
    } else {
      // Redirect to auth page
      setLocation('/auth');
    }
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const handleUpgrade = () => {
    window.location.href = "/subscribe";
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-white shadow-sleek border-b border-light-silver/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <Link href="/" className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-navy font-semibold' 
                  : 'text-muted-foreground hover:text-navy'
              }`}>
                Dashboard
              </Link>
              <Link href="/workflow-builder" className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/workflow-builder') || location.startsWith('/workflow-builder')
                  ? 'text-navy font-semibold' 
                  : 'text-muted-foreground hover:text-navy'
              }`}>
                New Workflow
              </Link>
              <Link href="/templates" className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/templates') 
                  ? 'text-navy font-semibold' 
                  : 'text-muted-foreground hover:text-navy'
              }`}>
                Templates
              </Link>
              <Link href="/settings" className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/settings') 
                  ? 'text-navy font-semibold' 
                  : 'text-muted-foreground hover:text-navy'
              }`}>
                Settings
              </Link>
            </div>

            {/* Trial counter on left side */}
            {user?.subscriptionStatus === 'free' && (
              <div className="ml-6 pl-6 border-l border-gray-300">
                <div className="text-sm text-muted-foreground">
                  <span className="text-navy font-medium">Free Trial:</span>
                  <span className="ml-2 text-emerald-green font-semibold">
                    {user.totalWorkflows || 0}/1 workflows used
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Centered logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/">
              <h1 className="text-xl font-bold cursor-pointer text-navy hover:text-emerald-green transition-colors">
                Workflow Optimization Tool
              </h1>
            </Link>
          </div>

          {/* Right side - user menu and upgrade */}
          <div className="flex items-center space-x-4">
            {user?.subscriptionStatus === 'free' && (
              <Button 
                onClick={handleUpgrade}
                className="bg-emerald-green text-white hover:bg-emerald-green/90"
                size="sm"
              >
                Upgrade to Pro
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback className="bg-navy text-white">
                      {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-navy">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem 
                  onClick={async () => {
                    const { supabase } = await import('@/lib/supabaseClient');
                    await supabase.auth.signOut();
                  }}
                  className="text-red-600 cursor-pointer"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}