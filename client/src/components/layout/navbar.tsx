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
    <>
      {/* Top header bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-navy hover:text-emerald-green transition-colors">
            Workflow Optimization Tool
          </h1>
        </Link>
        
        {/* User menu in top right */}
        <div className="absolute right-6 top-4">
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
      </header>

      {/* Left sidebar */}
      <nav className="fixed left-0 top-16 bottom-0 w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Navigation Links */}
          <div className="space-y-2">
            <Link href="/" className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive('/') 
                ? 'bg-navy text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}>
              Dashboard
            </Link>
            <Link href="/workflow-builder" className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive('/workflow-builder') || location.startsWith('/workflow-builder')
                ? 'bg-navy text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}>
              New Workflow
            </Link>
            <Link href="/templates" className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive('/templates') 
                ? 'bg-navy text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}>
              Templates
            </Link>
            <Link href="/settings" className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              isActive('/settings') 
                ? 'bg-navy text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}>
              Settings
            </Link>
          </div>

          {/* Trial Status */}
          {user?.subscriptionStatus === 'free' && (
            <div className="border-t border-gray-200 pt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-navy mb-2">Free Trial</h3>
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-medium text-emerald-green">
                    {user.totalWorkflows || 0}/1 workflows used
                  </span>
                </p>
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-emerald-green text-white hover:bg-emerald-green/90"
                  size="sm"
                >
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}