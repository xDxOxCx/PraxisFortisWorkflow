import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import { 
  Plus, 
  ChartGantt,
  Calendar,
  Clock,
  TrendingUp,
  UserCheck,
  FileText,
  PillBottle,
  CalendarCheck,
  Info,
  Edit
} from "lucide-react";

interface UserStats {
  totalWorkflows: number;
  monthlyWorkflows: number;
  timeSaved: number;
  efficiency: number;
  subscriptionStatus: string;
}

interface Workflow {
  id: number;
  name: string;
  description: string;
  status: string;
  updatedAt: string;
  timeSaved: number;
  efficiencyGain: number;
}

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export default function Home() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
    retry: false,
  });

  const { data: workflows = [], isLoading: workflowsLoading } = useQuery<Workflow[]>({
    queryKey: ["/api/workflows"],
    retry: false,
  });

  const { data: templates = [], isLoading: templatesLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
    retry: false,
  });

  const handleCreateWorkflow = () => {
    navigate("/workflow-builder");
  };

  const handleUpgrade = () => {
    navigate("/subscribe");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed': return 'bg-emerald-100 text-emerald-700';
      case 'exported': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTemplateIcon = (icon: string, category: string) => {
    switch (category) {
      case 'check-in': return <UserCheck className="w-4 h-4" />;
      case 'insurance': return <FileText className="w-4 h-4" />;
      case 'prescription': return <PillBottle className="w-4 h-4" />;
      case 'scheduling': return <CalendarCheck className="w-4 h-4" />;
      default: return <ChartGantt className="w-4 h-4" />;
    }
  };

  if (isLoading || !isAuthenticated) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-soft-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-montserrat font-bold text-deep-navy mb-2">Dashboard</h2>
          <p className="text-steel-gray">Manage your workflows and track optimization progress</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-steel-gray">Total Workflows</p>
                  <p className="text-2xl font-bold text-deep-navy">
                    {statsLoading ? "..." : stats?.totalWorkflows || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ChartGantt className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-steel-gray">This Month</p>
                  <p className="text-2xl font-bold text-deep-navy">
                    {statsLoading ? "..." : stats?.monthlyWorkflows || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-steel-gray">Time Saved</p>
                  <p className="text-2xl font-bold text-emerald-green">
                    {statsLoading ? "..." : `${stats?.timeSaved || 0} min`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-steel-gray">Efficiency Gain</p>
                  <p className="text-2xl font-bold text-emerald-green">
                    {statsLoading ? "..." : `${stats?.efficiency || 0}%`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Workflows */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-montserrat font-semibold text-deep-navy">Your Workflows</h3>
                  <Button 
                    onClick={handleCreateWorkflow}
                    className="bg-emerald-green text-white hover:bg-emerald-green/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Workflow
                  </Button>
                </div>

                {workflowsLoading ? (
                  <div className="text-center py-8">Loading workflows...</div>
                ) : workflows.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ChartGantt className="w-8 h-8 text-gray-400" />
                    </div>
                    <h4 className="text-lg font-montserrat font-semibold text-gray-900 mb-2">No workflows yet</h4>
                    <p className="text-steel-gray mb-6">Create your first workflow to start optimizing your clinic operations.</p>
                    <Button 
                      onClick={handleCreateWorkflow}
                      className="bg-emerald-green text-white hover:bg-emerald-green/90"
                    >
                      Create First Workflow
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workflows.map((workflow) => (
                      <div 
                        key={workflow.id} 
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/workflow-builder/${workflow.id}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <ChartGantt className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-deep-navy">{workflow.name}</h4>
                            <p className="text-sm text-steel-gray">Modified {formatDate(workflow.updatedAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(workflow.status)}`}>
                            {workflow.status === 'analyzed' ? 'Optimized' : workflow.status}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `/workflow-builder/${workflow.id}`;
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Templates Library */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-montserrat font-semibold text-deep-navy">Quick Start Templates</h3>
                  <p className="text-sm text-steel-gray mt-1">Common clinic workflows to get started</p>
                </div>

                {templatesLoading ? (
                  <div className="text-center py-4">Loading templates...</div>
                ) : (
                  <div className="space-y-4">
                    {templates.slice(0, 4).map((template) => (
                      <div 
                        key={template.id} 
                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/workflow-builder?template=${template.id}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                            {getTemplateIcon(template.icon, template.category)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-deep-navy text-sm">{template.name}</h4>
                            <p className="text-xs text-steel-gray mt-1">{template.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Usage Tracker */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-montserrat font-semibold text-deep-navy mb-4">Monthly Usage</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-steel-gray">Workflows Created</span>
                  <span className="text-sm font-medium text-deep-navy">
                    {stats?.monthlyWorkflows || 0} / {stats?.subscriptionStatus === 'free' ? '1' : '∞'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-emerald-green h-2 rounded-full" 
                    style={{ 
                      width: stats?.subscriptionStatus === 'free' 
                        ? `${Math.min(((stats?.monthlyWorkflows || 0) / 1) * 100, 100)}%`
                        : '100%'
                    }}
                  ></div>
                </div>
                
                {stats?.subscriptionStatus === 'free' && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <Info className="w-4 h-4 inline mr-2" />
                      Upgrade to Pro for unlimited workflows and advanced features.
                    </p>
                    <Button 
                      onClick={handleUpgrade}
                      className="bg-emerald-green text-white hover:bg-emerald-green/90 text-sm mt-2"
                    >
                      Upgrade Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
