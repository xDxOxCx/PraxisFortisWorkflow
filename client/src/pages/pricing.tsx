import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/navbar";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function Pricing() {
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = "/";
    } else {
      window.location.href = "/api/login";
    }
  };

  const handleUpgrade = () => {
    if (isAuthenticated) {
      window.location.href = "/subscribe";
    } else {
      window.location.href = "/api/login";
    }
  };

  const handleContactSales = () => {
    // In a real app, this would open a contact form or redirect to sales
    window.open("mailto:sales@praxisfortis.com?subject=Enterprise Plan Inquiry", "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && <Navbar />}
      
      {/* Header */}
      {!isAuthenticated && (
        <nav className="bg-white shadow-sm border-b border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-montserrat font-bold text-slate-blue">
                  Praxis Fortis
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="text-muted-foreground hover:text-emerald-green px-3 py-2 text-sm font-medium">
                  Home
                </a>
                <Button 
                  onClick={handleGetStarted}
                  className="bg-emerald-green text-white hover:bg-emerald-green/90"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-montserrat font-bold text-slate-blue mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that works best for your practice
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Free Plan */}
          <Card className="border border">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-montserrat font-bold text-slate-blue mb-2">Free</h3>
                <div className="text-4xl font-montserrat font-bold text-slate-blue">$0</div>
                <p className="text-muted-foreground">per month</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">1 workflow per month</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">AI-powered analysis</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">Basic visualization</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">Template library access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">Email support</span>
                </li>
              </ul>
              <Button 
                onClick={handleGetStarted}
                variant="outline" 
                className="w-full border-2 border hover:border-emerald-green hover:text-emerald-green"
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-emerald-green relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-emerald-green text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-montserrat font-bold text-slate-blue mb-2">Pro</h3>
                <div className="text-4xl font-montserrat font-bold text-slate-blue">$49</div>
                <p className="text-muted-foreground">per month</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">Unlimited workflows</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">Advanced AI recommendations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">PDF & DOC exports</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">Priority support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">Team collaboration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">Advanced analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">Custom templates</span>
                </li>
              </ul>
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-emerald-green text-white hover:bg-emerald-green/90"
              >
                Start 14-Day Trial
              </Button>
            </CardContent>
          </Card>

          {/* Enterprise Plan */}
          <Card className="border border">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-montserrat font-bold text-slate-blue mb-2">Enterprise</h3>
                <div className="text-4xl font-montserrat font-bold text-slate-blue">Custom</div>
                <p className="text-muted-foreground">pricing</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">Multi-clinic management</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">White-label solution</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">Custom integrations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">Dedicated support</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">Advanced analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">API access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-green" />
                  <span className="text-slate-blue">Custom reporting</span>
                </li>
              </ul>
              <Button 
                onClick={handleContactSales}
                variant="outline"
                className="w-full border-2 border-slate-blue text-slate-blue hover:bg-slate-blue hover:text-primary-foreground"
              >
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">All plans include a 14-day free trial. No credit card required.</p>
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h3 className="text-2xl font-montserrat font-bold text-slate-blue text-center mb-8">
            Feature Comparison
          </h3>
          
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 font-montserrat font-semibold text-slate-blue">Feature</th>
                      <th className="text-center py-4 font-montserrat font-semibold text-slate-blue">Free</th>
                      <th className="text-center py-4 font-montserrat font-semibold text-slate-blue">Pro</th>
                      <th className="text-center py-4 font-montserrat font-semibold text-slate-blue">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="py-4 text-muted-foreground">Monthly Workflows</td>
                      <td className="text-center py-4">1</td>
                      <td className="text-center py-4">Unlimited</td>
                      <td className="text-center py-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 text-muted-foreground">AI Analysis</td>
                      <td className="text-center py-4"><CheckCircle className="w-4 h-4 text-emerald-green mx-auto" /></td>
                      <td className="text-center py-4"><CheckCircle className="w-4 h-4 text-emerald-green mx-auto" /></td>
                      <td className="text-center py-4"><CheckCircle className="w-4 h-4 text-emerald-green mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 text-muted-foreground">PDF Export</td>
                      <td className="text-center py-4">-</td>
                      <td className="text-center py-4"><CheckCircle className="w-4 h-4 text-emerald-green mx-auto" /></td>
                      <td className="text-center py-4"><CheckCircle className="w-4 h-4 text-emerald-green mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 text-muted-foreground">Priority Support</td>
                      <td className="text-center py-4">-</td>
                      <td className="text-center py-4"><CheckCircle className="w-4 h-4 text-emerald-green mx-auto" /></td>
                      <td className="text-center py-4"><CheckCircle className="w-4 h-4 text-emerald-green mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 text-muted-foreground">Team Collaboration</td>
                      <td className="text-center py-4">-</td>
                      <td className="text-center py-4"><CheckCircle className="w-4 h-4 text-emerald-green mx-auto" /></td>
                      <td className="text-center py-4"><CheckCircle className="w-4 h-4 text-emerald-green mx-auto" /></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 text-muted-foreground">Custom Integrations</td>
                      <td className="text-center py-4">-</td>
                      <td className="text-center py-4">-</td>
                      <td className="text-center py-4"><CheckCircle className="w-4 h-4 text-emerald-green mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-4 text-muted-foreground">White-label Solution</td>
                      <td className="text-center py-4">-</td>
                      <td className="text-center py-4">-</td>
                      <td className="text-center py-4"><CheckCircle className="w-4 h-4 text-emerald-green mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-montserrat font-bold text-slate-blue text-center mb-8">
            Frequently Asked Questions
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-montserrat font-semibold text-slate-blue mb-2">
                  Can I change my plan anytime?
                </h4>
                <p className="text-muted-foreground text-sm">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-montserrat font-semibold text-slate-blue mb-2">
                  What happens to my data if I cancel?
                </h4>
                <p className="text-muted-foreground text-sm">
                  Your workflow data is retained for 30 days after cancellation, giving you time to export or reactivate your account.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-montserrat font-semibold text-slate-blue mb-2">
                  Is there a setup fee?
                </h4>
                <p className="text-muted-foreground text-sm">
                  No setup fees for any plan. You only pay the monthly subscription fee, and you can start with our free tier.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h4 className="font-montserrat font-semibold text-slate-blue mb-2">
                  Do you offer training or onboarding?
                </h4>
                <p className="text-muted-foreground text-sm">
                  Pro and Enterprise plans include onboarding support. We also provide extensive documentation and video tutorials.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
