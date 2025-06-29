
import React from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  Plus, 
  FileText, 
  Settings, 
  LogOut,
  Workflow
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/user');
      if (!response.ok) throw new Error('Not authenticated');
      return response.json();
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      navigate('/');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/workflow-builder', label: 'New Workflow', icon: Plus },
    { href: '/templates', label: 'Templates', icon: FileText },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) => location === href;

  return (
    <div className="min-h-screen bg-pearl-white">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <Workflow className="h-8 w-8 text-navy" />
            <h1 className="text-2xl font-bold text-navy">Workflow Optimizer</h1>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActive(item.href) 
                          ? 'bg-navy text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            {/* Trial Status */}
            {stats && user && (
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {user.user.subscriptionStatus === 'free' ? 'Free Trial' : 'Subscription'}
                </div>
                <div className="text-xs text-gray-600">
                  {user.user.subscriptionStatus === 'free' ? (
                    <>
                      {stats.trialWorkflowsRemaining}/1 trial workflow remaining
                      <Link href="/pricing">
                        <Button size="sm" className="w-full mt-2 bg-emerald hover:bg-emerald/90">
                          Upgrade
                        </Button>
                      </Link>
                    </>
                  ) : (
                    `${stats.monthlyWorkflows} workflows this month`
                  )}
                </div>
              </div>
            )}

            {/* User Section */}
            {user && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar>
                    <AvatarFallback className="bg-navy text-white">
                      {user.user.firstName?.[0]}{user.user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.user.firstName} {user.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="w-full justify-start text-gray-700 hover:bg-gray-100"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
                </Button>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
