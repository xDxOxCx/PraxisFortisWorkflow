import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import AuthCallback from "./pages/auth-callback";
import Auth from "./pages/auth";
import ResetPassword from "./pages/reset-password";
import NotFound from "./pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import ConsultingHome from "@/pages/consulting-home";
import WorkflowBuilder from "@/pages/workflow-builder-working";
import AnalysisResults from "@/pages/analysis-results-new";
import Templates from "@/pages/templates";
import Settings from "@/pages/settings";
import Pricing from "@/pages/pricing";
import Subscribe from "@/pages/subscribe";
import AppLayout from "./components/layout/app-layout";


function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/consulting" component={ConsultingHome} />
      <Route path="/workflow-optimizer" component={Landing} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/auth" component={Auth} />
      <Route path="/reset-password" component={ResetPassword} />

      {/* Conditional home route */}
      <Route path="/" component={isAuthenticated ? Home : Landing} />

      {/* Protected routes */}
      {isAuthenticated && (
        <>
          <Route path="/workflow-builder" component={WorkflowBuilder} />
          <Route path="/workflow-builder/:id" component={WorkflowBuilder} />
          <Route path="/analysis-results" component={AnalysisResults} />
          <Route path="/templates" component={Templates} />
          <Route path="/settings" component={Settings} />
          <Route path="/subscribe" component={Subscribe} />
        </>
      )}

      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes - always accessible */}
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/auth" component={Auth} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/pricing" component={Pricing} />

      {/* Conditional routes based on auth status */}
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route component={NotFound} />
        </>
      ) : (
        <>
          <AppLayout>
            <Route path="/" component={Home} />
            <Route path="/workflow-builder" component={WorkflowBuilder} />
            <Route path="/workflow-builder/:id" component={WorkflowBuilder} />
            <Route path="/analysis-results" component={AnalysisResults} />
            <Route path="/templates" component={Templates} />
            <Route path="/settings" component={Settings} />
            <Route path="/subscribe" component={Subscribe} />
          </AppLayout>
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

export default App;