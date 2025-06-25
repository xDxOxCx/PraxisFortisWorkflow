import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Play, ArrowRight, Star } from "lucide-react";

export default function Landing() {
  const handleGetStarted = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: 'hsl(210, 20%, 98%)'}}>
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-montserrat font-bold" style={{color: 'hsl(215, 25%, 27%)'}}>
                Workflow Optimization Tool
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#pricing" className="px-3 py-2 text-sm font-medium hover:text-emerald-green" style={{color: 'hsl(210, 14%, 53%)'}}>
                Pricing
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

      {/* Hero Section */}
      <section className="py-20" style={{background: 'linear-gradient(to bottom right, hsl(215, 25%, 27%), hsl(208, 100%, 43%))'}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-montserrat font-bold leading-tight mb-6 text-white">
                Your Workflow Hub
              </h1>
              <p className="text-xl text-white/90 mb-8 font-open-sans">
                Create, Analyze & Improve your clinic operations — no Lean training needed. 
                AI-powered workflow optimization for every business!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-emerald-green text-white hover:bg-emerald-green/90 text-lg px-8 py-4"
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 text-lg px-8 py-4"
                  style={{
                    borderColor: 'hsl(158, 58%, 48%)',
                    color: 'hsl(158, 58%, 48%)',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(158, 58%, 48%)';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'hsl(158, 58%, 48%)';
                  }}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-6 text-sm text-white/90">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" style={{color: 'hsl(158, 58%, 48%)'}} />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" style={{color: 'hsl(158, 58%, 48%)'}} />
                  <span>1 workflow free monthly</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Card className="bg-white shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-montserrat font-semibold" style={{color: 'hsl(215, 25%, 27%)'}}>
                      Patient Check-in Workflow
                    </h3>
                    <span className="px-3 py-1 rounded-full text-sm font-medium" style={{
                      backgroundColor: 'hsl(158, 58%, 48%, 0.1)',
                      color: 'hsl(158, 58%, 48%)'
                    }}>
                      Optimized
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: 'hsl(158, 58%, 48%)'}}>
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 text-sm">Patient Arrival</span>
                    </div>
                    <div className="ml-4 border-l-2 border-gray-200 pl-6 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <i className="fas fa-clipboard text-white text-xs"></i>
                        </div>
                        <span className="text-gray-600 text-sm">Digital Check-in</span>
                      </div>
                    </div>
                    <div className="ml-4 border-l-2 border-gray-200 pl-6 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <i className="fas fa-question text-white text-xs"></i>
                        </div>
                        <span className="text-gray-600 text-sm">Insurance Verification</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                        <i className="fas fa-stop text-white text-xs"></i>
                      </div>
                      <span className="text-gray-700 text-sm">Ready for Provider</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Time Saved: <strong style={{color: 'hsl(158, 58%, 48%)'}}>12 minutes</strong></span>
                      <span>Efficiency: <strong style={{color: 'hsl(158, 58%, 48%)'}}>+34%</strong></span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-montserrat font-bold mb-4" style={{color: 'hsl(215, 25%, 27%)'}}>
              Why Practice Managers Choose Our Tool
            </h2>
            <p className="text-xl" style={{color: 'hsl(210, 14%, 53%)'}}>
              Professional workflow optimization without the complexity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-emerald-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-brain text-emerald-green text-xl"></i>
                </div>
                <h3 className="text-lg font-montserrat font-semibold text-deep-navy mb-2">
                  AI-Powered Analysis
                </h3>
                <p className="text-steel-gray">
                  Get instant insights and improvement recommendations using advanced AI trained on healthcare workflows.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-mouse-pointer text-blue-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-montserrat font-semibold text-deep-navy mb-2">
                  Drag & Drop Builder
                </h3>
                <p className="text-steel-gray">
                  Create professional workflow diagrams in minutes with our intuitive drag-and-drop interface.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-chart-line text-amber-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-montserrat font-semibold text-deep-navy mb-2">
                  Measurable Results
                </h3>
                <p className="text-steel-gray">
                  Track time savings and efficiency gains with detailed analytics and professional reports.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16" style={{backgroundColor: 'hsl(210, 20%, 98%)'}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-montserrat font-bold text-deep-navy mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-steel-gray">
              Choose the plan that works best for your practice
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="border border-gray-200">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-montserrat font-bold text-deep-navy mb-2">Free</h3>
                  <div className="text-4xl font-montserrat font-bold text-deep-navy">$0</div>
                  <p className="text-steel-gray">per month</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green" />
                    <span className="text-gray-700">1 workflow per month</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green" />
                    <span className="text-gray-700">AI-powered analysis</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green" />
                    <span className="text-gray-700">Basic visualization</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green" />
                    <span className="text-gray-700">Template library access</span>
                  </li>
                </ul>
                <Button 
                  onClick={handleGetStarted}
                  variant="outline" 
                  className="w-full border-2 border-gray-300 hover:border-emerald-green hover:text-emerald-green"
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-emerald-green relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-emerald-green text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-montserrat font-bold text-deep-navy mb-2">Pro</h3>
                  <div className="text-4xl font-montserrat font-bold text-deep-navy">$49</div>
                  <p className="text-steel-gray">per month</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green" />
                    <span className="text-gray-700">Unlimited workflows</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green" />
                    <span className="text-gray-700">Advanced AI recommendations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green" />
                    <span className="text-gray-700">PDF & DOC exports</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green" />
                    <span className="text-gray-700">Team collaboration</span>
                  </li>
                </ul>
                <Button 
                  onClick={handleGetStarted}
                  className="w-full bg-emerald-green text-white hover:bg-emerald-green/90"
                >
                  Start 14-Day Trial
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border border-gray-200">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-montserrat font-bold text-deep-navy mb-2">Enterprise</h3>
                  <div className="text-4xl font-montserrat font-bold text-deep-navy">Custom</div>
                  <p className="text-steel-gray">pricing</p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green" />
                    <span className="text-gray-700">Multi-clinic management</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green" />
                    <span className="text-gray-700">White-label solution</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green" />
                    <span className="text-gray-700">Custom integrations</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green" />
                    <span className="text-gray-700">Dedicated support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-emerald-green" />
                    <span className="text-gray-700">Advanced analytics</span>
                  </li>
                </ul>
                <Button 
                  variant="outline"
                  className="w-full border-2 border-deep-navy text-deep-navy hover:bg-deep-navy hover:text-white"
                >
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-steel-gray">All plans include a 14-day free trial. No credit card required.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-12" style={{backgroundColor: 'hsl(215, 25%, 27%)'}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-montserrat font-bold mb-4 text-white">Workflow Optimization Tool</h3>
              <p className="text-gray-200 text-sm">
                AI-powered workflow optimization for specialty clinic practice managers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Product</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Templates</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm text-gray-200">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 flex items-center justify-between">
            <p className="text-gray-200 text-sm">© 2024 Workflow Optimization Tool. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-200 hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-200 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
