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
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-xl font-montserrat font-bold cursor-pointer text-navy hover:text-emerald transition-colors">
                  Workflow Optimization Tool
                </h1>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-8">
                <Link href="/" className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-slate-blue' 
                    : 'text-muted-foreground hover:text-emerald-green'
                }`}>
                  Dashboard
                </Link>
                <Link href="/workflow-builder" className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/workflow-builder') || location.startsWith('/workflow-builder')
                    ? 'text-slate-blue' 
                    : 'text-silver-gray hover:text-emerald-green'
                }`}>
                  New Workflow
                </Link>
                <Link href="/templates" className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/templates') 
                    ? 'text-slate-blue' 
                    : 'text-muted-foreground hover:text-emerald-green'
                }`}>
                  Templates
                </Link>
                <Link href="/settings" className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/settings') 
                    ? 'text-slate-blue' 
                    : 'text-muted-foreground hover:text-emerald-green'
                }`}>
                  Settings
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 lg:space-x-6">
            {user?.subscriptionStatus === 'free' && (
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="text-xs lg:text-sm text-muted-foreground whitespace-nowrap">
                  <span className="font-medium text-navy">Free Trial</span>
                  <span className="mx-1 lg:mx-2">•</span>
                  <span className="text-emerald-green font-medium">
                    {user.totalWorkflows || 0}/1 trial
                  </span>
                </div>
                <Button 
                  onClick={handleUpgrade}
                  className="bg-emerald-green text-white hover:bg-emerald-green/90 whitespace-nowrap text-xs lg:text-sm"
                  size="sm"
                >
                  Upgrade
                </Button>
              </div>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback className="bg-steel-gray text-primary-foreground">
                      {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-slate-blue">
                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setLocation('/settings')} className="cursor-pointer">
                  Settings
                </DropdownMenuItem>
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