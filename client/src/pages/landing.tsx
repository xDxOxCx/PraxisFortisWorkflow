import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Workflow, TrendingUp, Users, Clock, Shield } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-pearl-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Workflow className="h-8 w-8 text-navy" />
              <span className="text-xl font-bold text-navy">Workflow Optimizer</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/pricing">
                <Button variant="ghost" className="text-navy">Pricing</Button>
              </Link>
              <Link href="/auth">
                <Button className="bg-navy hover:bg-navy/90">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-navy mb-6">
            Optimize Your Healthcare Workflows with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your medical practice operations, reduce inefficiencies, and improve patient experience with intelligent workflow analysis.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth">
              <Button size="lg" className="bg-navy hover:bg-navy/90">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-navy text-navy">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy mb-4">
              Everything You Need to Optimize Your Practice
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform helps healthcare professionals identify bottlenecks, reduce waste, and implement proven improvement methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-sleek">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-emerald mb-4" />
                <CardTitle className="text-navy">AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get intelligent insights into your workflows with advanced AI analysis that identifies inefficiencies and suggests improvements.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sleek">
              <CardHeader>
                <Users className="h-12 w-12 text-emerald mb-4" />
                <CardTitle className="text-navy">Visual Workflow Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create and visualize your workflows with our intuitive drag-and-drop interface designed specifically for healthcare processes.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sleek">
              <CardHeader>
                <Clock className="h-12 w-12 text-emerald mb-4" />
                <CardTitle className="text-navy">Time & Cost Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Reduce patient wait times, optimize staff productivity, and cut operational costs with data-driven workflow improvements.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sleek">
              <CardHeader>
                <Shield className="h-12 w-12 text-emerald mb-4" />
                <CardTitle className="text-navy">Proven Methodologies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Apply Lean Six Sigma principles with guided implementations that are proven to work in healthcare environments.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sleek">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-emerald mb-4" />
                <CardTitle className="text-navy">Ready-Made Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Start quickly with pre-built workflow templates for common healthcare processes like patient check-in and billing.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sleek">
              <CardHeader>
                <Workflow className="h-12 w-12 text-emerald mb-4" />
                <CardTitle className="text-navy">PDF Export</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Export your workflow analyses and improvement plans as professional PDF reports to share with your team.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-pearl-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600">Choose the plan that fits your practice size and needs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="shadow-sleek">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-navy">Free</CardTitle>
                <div className="text-4xl font-bold text-navy">$0</div>
                <CardDescription>Perfect for trying out the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald mr-2" />
                    <span>1 free trial workflow</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald mr-2" />
                    <span>AI-powered analysis</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald mr-2" />
                    <span>Basic templates</span>
                  </div>
                </div>
                <Link href="/auth">
                  <Button className="w-full bg-navy hover:bg-navy/90">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Starter Plan */}
            <Card className="shadow-sleek border-emerald border-2 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-emerald text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-navy">Starter</CardTitle>
                <div className="text-4xl font-bold text-navy">$19</div>
                <CardDescription>per month - Great for small practices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald mr-2" />
                    <span>10 workflows per month</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald mr-2" />
                    <span>PDF exports</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald mr-2" />
                    <span>All templates</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald mr-2" />
                    <span>Priority email support</span>
                  </div>
                </div>
                <Link href="/subscribe?plan=starter">
                  <Button className="w-full bg-emerald hover:bg-emerald/90">Choose Starter</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="shadow-sleek">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-navy">Pro</CardTitle>
                <div className="text-4xl font-bold text-navy">$49</div>
                <CardDescription>per month - For growing practices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald mr-2" />
                    <span>Unlimited workflows</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald mr-2" />
                    <span>Advanced AI analysis</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald mr-2" />
                    <span>Custom templates</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald mr-2" />
                    <span>Priority support</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-emerald mr-2" />
                    <span>Team collaboration</span>
                  </div>
                </div>
                <Link href="/subscribe?plan=pro">
                  <Button className="w-full bg-navy hover:bg-navy/90">Choose Pro</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-navy mb-4">
            Ready to Transform Your Healthcare Workflows?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join healthcare professionals who are already saving time and improving patient care.
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-emerald hover:bg-emerald/90">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Workflow className="h-6 w-6" />
            <span className="text-lg font-semibold">Workflow Optimizer</span>
          </div>
          <p className="text-gray-300">
            Streamlining healthcare workflows with intelligent automation.
          </p>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              © 2024 Workflow Optimizer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}