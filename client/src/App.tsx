import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { AuthGuard } from '@/components/auth/auth-guard';
import { AppLayout } from '@/components/layout/app-layout';

// Pages
import Landing from '@/pages/landing';
import Auth from '@/pages/auth';
import Home from '@/pages/home';
import WorkflowBuilder from '@/pages/workflow-builder';
import Templates from '@/pages/templates';
import AnalysisResults from '@/pages/analysis-results';
import Pricing from '@/pages/pricing';
import Subscribe from '@/pages/subscribe';
import Settings from '@/pages/settings';
import NotFound from '@/pages/not-found';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-pearl-white">
        <Switch>
          {/* Public routes */}
          <Route path="/" component={Landing} />
          <Route path="/auth" component={Auth} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/subscribe" component={Subscribe} />

          {/* Protected routes wrapped in AppLayout */}
          <Route path="/dashboard">
            <AuthGuard>
              <AppLayout>
                <Home />
              </AppLayout>
            </AuthGuard>
          </Route>

          <Route path="/workflow-builder">
            <AuthGuard>
              <AppLayout>
                <WorkflowBuilder />
              </AppLayout>
            </AuthGuard>
          </Route>

          <Route path="/templates">
            <AuthGuard>
              <AppLayout>
                <Templates />
              </AppLayout>
            </AuthGuard>
          </Route>

          <Route path="/analysis-results">
            <AuthGuard>
              <AppLayout>
                <AnalysisResults />
              </AppLayout>
            </AuthGuard>
          </Route>

          <Route path="/settings">
            <AuthGuard>
              <AppLayout>
                <Settings />
              </AppLayout>
            </AuthGuard>
          </Route>

          {/* 404 route */}
          <Route component={NotFound} />
        </Switch>

        <Toaster />
      </div>
    </Router>
  );
}

export default App;