import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  ChevronDown, 
  Target, 
  TrendingUp, 
  Users, 
  Award, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Lightbulb,
  Shield
} from "lucide-react";
import { Link } from "wouter";

export default function ConsultingHome() {
  const services = [
    {
      title: "Lean Six Sigma Implementation",
      description: "Transform your operations with proven methodologies that eliminate waste and improve quality.",
      icon: Target,
      features: ["Process Optimization", "Quality Improvement", "Waste Reduction", "Cost Savings"]
    },
    {
      title: "Operational Excellence",
      description: "Build sustainable systems that drive consistent performance and continuous improvement.",
      icon: TrendingUp,
      features: ["Performance Metrics", "Standard Operating Procedures", "Training Programs", "Culture Change"]
    },
    {
      title: "Leadership Development",
      description: "Develop strong leaders who can drive organizational change and sustain improvements.",
      icon: Users,
      features: ["Executive Coaching", "Team Building", "Change Management", "Strategic Planning"]
    }
  ];

  const achievements = [
    { metric: "500+", label: "Projects Completed" },
    { metric: "95%", label: "Client Satisfaction" },
    { metric: "$50M+", label: "Cost Savings Generated" },
    { metric: "15+", label: "Years Experience" }
  ];

  const testimonials = [
    {
      quote: "Praxis Fortis transformed our entire operation. We saw 40% improvement in efficiency within 6 months.",
      author: "Sarah Johnson",
      role: "Operations Director, MedTech Solutions"
    },
    {
      quote: "The team's expertise in healthcare operations is unmatched. They delivered results beyond our expectations.",
      author: "Dr. Michael Chen",
      role: "Chief Medical Officer, Regional Health System"
    },
    {
      quote: "Professional, knowledgeable, and results-driven. Praxis Fortis is our go-to consulting partner.",
      author: "Lisa Rodriguez",
      role: "CEO, Specialty Care Group"
    }
  ];

  return (
    <div className="min-h-screen bg-pearl-white">
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
              <Link href="#services" className="text-navy hover:text-emerald-green transition-colors">
                Services
              </Link>
              <Link href="#about" className="text-navy hover:text-emerald-green transition-colors">
                About
              </Link>
              <Link href="#contact" className="text-navy hover:text-emerald-green transition-colors">
                Contact
              </Link>
              
              {/* Client Tools Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="text-navy border-navy hover:bg-emerald-green hover:text-white">
                    Client Tools
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuItem asChild>
                    <Link href="/workflow-optimizer" className="flex items-center cursor-pointer">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      <div>
                        <div className="font-medium">Workflow Optimizer</div>
                        <div className="text-sm text-gray-500">AI-powered workflow analysis tool</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center cursor-pointer opacity-50">
                    <Shield className="mr-2 h-4 w-4" />
                    <div>
                      <div className="font-medium">Compliance Hub</div>
                      <div className="text-sm text-gray-500">Coming Soon</div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center cursor-pointer opacity-50">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    <div>
                      <div className="font-medium">Innovation Center</div>
                      <div className="text-sm text-gray-500">Coming Soon</div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button className="bg-emerald-green hover:bg-emerald-green/90 text-white">
                Get Started
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
              Transform Your Operations with
              <span className="text-emerald-green"> Expert Consulting</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-platinum max-w-3xl mx-auto">
              Praxis Fortis specializes in healthcare operational excellence, helping organizations 
              achieve sustainable improvements through proven methodologies and innovative solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-emerald-green hover:bg-emerald-green/90 text-white px-8 py-3">
                Schedule Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-navy px-8 py-3">
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-emerald-green mb-2">
                  {achievement.metric}
                </div>
                <div className="text-silver-gray text-sm">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-pearl-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              Our Services
            </h2>
            <p className="text-xl text-silver-gray max-w-2xl mx-auto">
              Comprehensive consulting solutions designed to drive operational excellence 
              and sustainable growth in healthcare organizations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-green/10 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-emerald-green" />
                  </div>
                  <CardTitle className="text-navy">{service.title}</CardTitle>
                  <CardDescription className="text-silver-gray">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-green mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-4 border-navy text-navy hover:bg-navy hover:text-white">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Tools Spotlight */}
      <section className="py-20 bg-gradient-to-r from-emerald-green to-emerald-green/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Tools for Our Clients
            </h2>
            <p className="text-xl text-emerald-green/20 max-w-2xl mx-auto">
              Access exclusive digital tools designed to complement our consulting services 
              and empower your team with data-driven insights.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-8 w-8 mr-3" />
                  <Badge variant="secondary" className="bg-white/20">Available Now</Badge>
                </div>
                <CardTitle className="text-white">Workflow Optimizer</CardTitle>
                <CardDescription className="text-emerald-green/80">
                  AI-powered workflow analysis tool that identifies inefficiencies and provides 
                  actionable recommendations using Lean Six Sigma methodology.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Visual workflow builder
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    AI-powered analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    DMAIC methodology reports
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    PDF export capabilities
                  </li>
                </ul>
                <Button asChild className="w-full bg-white text-emerald-green hover:bg-white/90">
                  <Link href="/workflow-optimizer">
                    Access Tool
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 text-white">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 mr-3" />
                  <Badge variant="secondary" className="bg-white/10">Coming Soon</Badge>
                </div>
                <CardTitle className="text-white">Compliance Hub</CardTitle>
                <CardDescription className="text-emerald-green/60">
                  Comprehensive compliance management platform for healthcare regulations 
                  and quality standards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-emerald-green/60 mb-4">
                  Stay tuned for our upcoming compliance management solution.
                </p>
                <Button variant="outline" className="w-full border-white/30 text-white/70" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              What Our Clients Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <blockquote className="text-silver-gray mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-navy">{testimonial.author}</div>
                    <div className="text-sm text-silver-gray">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Operations?
              </h2>
              <p className="text-xl text-platinum mb-8">
                Let's discuss how Praxis Fortis can help your organization achieve 
                operational excellence and sustainable growth.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-emerald-green mr-3" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-emerald-green mr-3" />
                  <span>info@praxisfortisconsulting.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-emerald-green mr-3" />
                  <span>Healthcare Innovation District, Austin, TX</span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-6">Schedule a Consultation</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/60"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/60"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Organization"
                    className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/60"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Tell us about your challenges"
                    rows={4}
                    className="w-full px-4 py-2 rounded bg-white/20 border border-white/30 text-white placeholder-white/60"
                  ></textarea>
                </div>
                <Button className="w-full bg-emerald-green hover:bg-emerald-green/90">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-blue text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Praxis Fortis Consulting</h3>
              <p className="text-platinum text-sm">
                Transforming healthcare operations through expert consulting and innovative solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-platinum">
                <li>Lean Six Sigma</li>
                <li>Operational Excellence</li>
                <li>Leadership Development</li>
                <li>Process Improvement</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Client Tools</h4>
              <ul className="space-y-2 text-sm text-platinum">
                <li>
                  <Link href="/workflow-optimizer" className="hover:text-emerald-green">
                    Workflow Optimizer
                  </Link>
                </li>
                <li className="text-platinum/50">Compliance Hub (Coming Soon)</li>
                <li className="text-platinum/50">Innovation Center (Coming Soon)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-platinum">
                <li>(555) 123-4567</li>
                <li>info@praxisfortisconsulting.com</li>
                <li>Austin, TX</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-platinum">
            <p>&copy; 2025 Praxis Fortis Consulting. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}