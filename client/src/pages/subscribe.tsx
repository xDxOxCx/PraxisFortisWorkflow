import { useState, useEffect } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import { CheckCircle, CreditCard, Shield, Clock } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/settings?success=true`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 border border-gray-200 rounded-lg">
        <PaymentElement />
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-emerald-green text-white hover:bg-emerald-green/90 py-3"
        size="lg"
      >
        {isProcessing ? "Processing..." : "Subscribe to Pro - $49/month"}
      </Button>
      
      <div className="flex items-center justify-center space-x-4 text-xs text-steel-gray">
        <div className="flex items-center space-x-1">
          <Shield className="w-3 h-3" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Cancel Anytime</span>
        </div>
      </div>
    </form>
  );
};

export default function Subscribe() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please sign in to subscribe.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Create subscription when component mounts
  useEffect(() => {
    if (isAuthenticated && user) {
      createSubscription();
    }
  }, [isAuthenticated, user]);

  const createSubscription = async () => {
    try {
      const response = await apiRequest("POST", "/api/get-or-create-subscription");
      const data = await response.json();
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else {
        // User might already be subscribed
        toast({
          title: "Already Subscribed",
          description: "You already have an active subscription.",
        });
        window.location.href = "/settings";
      }
    } catch (error) {
      if (isUnauthorizedError(error as Error)) {
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
      
      toast({
        title: "Subscription Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingSubscription(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  if (loadingSubscription || !clientSecret) {
    return (
      <div className="min-h-screen bg-soft-white">
        <Navbar />
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-green border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-steel-gray">Setting up your subscription...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-montserrat font-bold text-deep-navy mb-2">
            Upgrade to Pro
          </h2>
          <p className="text-steel-gray">
            Unlock unlimited workflows and advanced features
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Details */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-montserrat font-bold text-deep-navy mb-2">Pro Plan</h3>
                  <div className="text-4xl font-montserrat font-bold text-deep-navy mb-2">$49</div>
                  <p className="text-steel-gray">per month, billed monthly</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-montserrat font-semibold text-deep-navy">What's included:</h4>
                  
                  <ul className="space-y-3">
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-green" />
                      <span className="text-gray-700">Unlimited workflow creation and analysis</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-green" />
                      <span className="text-gray-700">Advanced AI recommendations and insights</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-green" />
                      <span className="text-gray-700">PDF and DOC export capabilities</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-green" />
                      <span className="text-gray-700">Priority email and chat support</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-green" />
                      <span className="text-gray-700">Team collaboration features</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-green" />
                      <span className="text-gray-700">Advanced analytics and reporting</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-green" />
                      <span className="text-gray-700">Custom workflow templates</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">14-Day Free Trial</h5>
                  <p className="text-blue-700 text-sm">
                    Try Pro risk-free for 14 days. Cancel anytime during the trial period and you won't be charged.
                  </p>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2">Flexible Billing</h5>
                  <p className="text-gray-700 text-sm">
                    Cancel or change your plan anytime. No long-term contracts or hidden fees.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-montserrat font-semibold text-deep-navy mb-6">
                  Payment Information
                </h3>
                
                <Elements 
                  stripe={stripePromise} 
                  options={{ 
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#2E7D32',
                        colorBackground: '#ffffff',
                        colorText: '#0B1F3A',
                        colorDanger: '#df1b41',
                        fontFamily: 'Open Sans, system-ui, sans-serif',
                        spacingUnit: '4px',
                        borderRadius: '8px',
                      },
                    },
                  }}
                >
                  <SubscribeForm />
                </Elements>
              </CardContent>
            </Card>

            <div className="mt-6 text-center text-sm text-steel-gray">
              <p>
                By subscribing, you agree to our{" "}
                <a href="#" className="text-emerald-green hover:underline">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-emerald-green hover:underline">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h3 className="text-xl font-montserrat font-bold text-deep-navy text-center mb-6">
            Frequently Asked Questions
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-deep-navy mb-2">Can I cancel anytime?</h4>
                <p className="text-steel-gray text-sm">
                  Yes, you can cancel your subscription at any time. You'll continue to have access to Pro features until the end of your billing period.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-deep-navy mb-2">What happens to my free workflows?</h4>
                <p className="text-steel-gray text-sm">
                  All your existing workflows are preserved. With Pro, you'll have unlimited access to create and analyze new workflows.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-deep-navy mb-2">Is my payment information secure?</h4>
                <p className="text-steel-gray text-sm">
                  Yes, we use Stripe for secure payment processing. Your payment information is encrypted and never stored on our servers.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h4 className="font-semibold text-deep-navy mb-2">Do you offer refunds?</h4>
                <p className="text-steel-gray text-sm">
                  We offer a 14-day free trial, so you can test all Pro features before being charged. Contact support for special circumstances.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
