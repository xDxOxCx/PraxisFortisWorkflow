import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Users, Award } from "lucide-react";
import { Link } from "wouter";

export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta tags would be handled by a head manager in production */}
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-navy">
                Praxis Fortis Consulting
              </h1>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#services" className="text-navy hover:text-emerald-green transition-colors">
                Services
              </a>
              <a href="#about" className="text-navy hover:text-emerald-green transition-colors">
                About
              </a>
              <a href="#contact" className="text-navy hover:text-emerald-green transition-colors">
                Contact
              </a>
              <Button asChild className="bg-emerald-green hover:bg-emerald-green/90 text-white">
                <Link href="/workflow-optimizer">
                  Workflow Tool
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-navy to-slate-blue text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Healthcare Operations Excellence
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-platinum max-w-3xl mx-auto">
              Transform your healthcare operations with expert Lean Six Sigma consulting 
              and AI-powered workflow optimization tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-emerald-green hover:bg-emerald-green/90 text-white px-8 py-4">
                <Link href="/workflow-optimizer">
                  Try Workflow Optimizer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-navy px-8 py-4">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 bg-pearl-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Why Choose Praxis Fortis?
            </h2>
            <p className="text-xl text-silver-gray max-w-2xl mx-auto">
              We combine proven consulting expertise with cutting-edge technology 
              to deliver measurable results for healthcare organizations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-emerald-green" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">AI-Powered Tools</h3>
              <p className="text-silver-gray">
                Access our exclusive workflow optimization tool powered by AI and Lean Six Sigma methodology.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-emerald-green" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Expert Consulting</h3>
              <p className="text-silver-gray">
                15+ years of healthcare operations expertise with proven results across 500+ projects.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-green/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-emerald-green" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Proven Results</h3>
              <p className="text-silver-gray">
                $50M+ in cost savings generated with 95% client satisfaction across all engagements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Optimize Your Workflows?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start with our free AI-powered workflow optimization tool or schedule 
            a consultation with our experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-emerald-green hover:bg-white/90 px-8 py-4">
              <Link href="/workflow-optimizer">
                Access Workflow Tool
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-green px-8 py-4">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Praxis Fortis Consulting</h3>
            <p className="text-platinum mb-4">
              Transforming healthcare operations through expert consulting and innovative technology.
            </p>
            <div className="flex justify-center space-x-8 text-sm">
              <span>(555) 123-4567</span>
              <span>info@praxisfortisconsulting.com</span>
              <span>Austin, TX</span>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20 text-sm text-platinum">
              <p>&copy; 2025 Praxis Fortis Consulting. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}