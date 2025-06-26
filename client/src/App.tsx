import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
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


function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      <Route path="/auth/callback" component={AuthCallback} />
            <Route path="/auth" component={AuthForm} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route component={NotFound} />
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/pricing" component={Pricing} />
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
        </>
      )}

    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;