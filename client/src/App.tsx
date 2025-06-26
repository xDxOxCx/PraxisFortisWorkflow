import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import AuthCallback from "./pages/auth-callback";
import AuthForm from "./components/auth/auth-form";
import ResetPassword from "./pages/reset-password";
import NotFound from "./pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import WorkflowBuilder from "@/pages/workflow-builder-fixed";
import Templates from "@/pages/templates";
import Settings from "@/pages/settings";
import Pricing from "@/pages/pricing";
import Subscribe from "@/pages/subscribe";
import AppLayout from "./components/layout/app-layout";


function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/auth" component={AuthForm} />
      <Route path="/reset-password" component={ResetPassword} />

      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/pricing" component={Pricing} />
          <Route component={NotFound} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/workflow-builder" component={WorkflowBuilder} />
          <Route path="/workflow-builder/:id" component={WorkflowBuilder} />
          <Route path="/templates" component={Templates} />
          <Route path="/settings" component={Settings} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/subscribe" component={Subscribe} />
          <Route component={NotFound} />
        </>
      )}
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
      <Route path="/auth" component={AuthForm} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/pricing" component={Pricing} />

      {/* Conditional routes based on auth status */}
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route component={NotFound} />
        </>
      ) : (
        <AppLayout>
          <Route path="/" component={Home} />
          <Route path="/workflow-builder" component={WorkflowBuilder} />
          <Route path="/workflow-builder/:id" component={WorkflowBuilder} />
          <Route path="/templates" component={Templates} />
          <Route path="/settings" component={Settings} />
          <Route path="/subscribe" component={Subscribe} />
          <Route component={NotFound} />
        </AppLayout>
      )}
    </Switch>
  );
}

export default App;