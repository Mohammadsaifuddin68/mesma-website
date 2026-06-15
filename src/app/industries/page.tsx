"use client";

import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import Link from "next/link";
import { 
  Stethoscope, 
  Building2, 
  GraduationCap, 
  UtensilsCrossed, 
  Briefcase, 
  ShoppingCart,
  PhoneMissed,
  Clock,
  HeartHandshake,
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

const industries = [
  {
    icon: <Stethoscope className="w-8 h-8 text-neon-purple" />,
    name: "Healthcare & Clinics",
    slug: "healthcare",
    description: "Healthcare providers receive a constant flow of appointment requests, patient inquiries, and follow-up calls. Managing these interactions efficiently is critical for patient satisfaction.",
    benefits: [
      "24/7 appointment scheduling",
      "Patient inquiry handling",
      "Appointment reminders",
      "Follow-up call automation",
      "Call routing and escalation"
    ],
    idealFor: "Medical Clinics, Dental Clinics, Hospitals, Diagnostic Centers, Wellness Centers"
  },
  {
    icon: <Building2 className="w-8 h-8 text-neon-purple" />,
    name: "Real Estate",
    slug: "real-estate",
    description: "Real estate businesses depend on responding quickly to inquiries. Delayed responses often result in lost opportunities and missed sales.",
    benefits: [
      "Instant lead qualification",
      "Property inquiry handling",
      "Appointment scheduling",
      "Follow-up call automation",
      "Buyer and tenant engagement"
    ],
    idealFor: "Real Estate Agencies, Property Developers, Commercial Brokers, Property Management"
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-neon-purple" />,
    name: "Education",
    slug: "education",
    description: "Educational institutions manage a large volume of inquiries from students, parents, and applicants. AI automation helps ensure every inquiry receives a prompt response.",
    benefits: [
      "Admission inquiry handling",
      "Student support automation",
      "Parent communication",
      "Appointment scheduling",
      "Information request management"
    ],
    idealFor: "Schools, Colleges, Universities, Training Institutes, Educational Organizations"
  },
  {
    icon: <UtensilsCrossed className="w-8 h-8 text-neon-purple" />,
    name: "Hospitality",
    slug: "hospitality",
    description: "Guest experience begins long before check-in. Fast, reliable communication can significantly improve customer satisfaction and booking rates.",
    benefits: [
      "Reservation assistance",
      "Guest inquiry handling",
      "Booking confirmations",
      "Customer support automation",
      "Follow-up communication"
    ],
    idealFor: "Hotels, Resorts, Vacation Rentals, Hospitality Groups"
  },
  {
    icon: <Briefcase className="w-8 h-8 text-neon-purple" />,
    name: "Professional Services",
    slug: "professional-services",
    description: "Professional service firms need to maintain responsive communication while focusing on delivering high-value services to clients.",
    benefits: [
      "Client inquiry management",
      "Appointment scheduling",
      "Lead qualification",
      "Customer support automation",
      "Follow-up communication"
    ],
    idealFor: "Consulting Firms, Accounting Firms, Legal Practices, Business Service Providers"
  },
  {
    icon: <ShoppingCart className="w-8 h-8 text-neon-purple" />,
    name: "E-Commerce & Retail",
    slug: "ecommerce",
    description: "Customers expect immediate answers regarding products, orders, and support requests. AI-powered communication ensures no customer inquiry goes unanswered.",
    benefits: [
      "Customer support automation",
      "Order status inquiries",
      "Product information assistance",
      "Lead qualification",
      "Outbound customer engagement"
    ],
    idealFor: "Online Stores, Retail Brands, E-Commerce Businesses, Direct-to-Consumer Companies"
  }
];

const features = [
  {
    icon: <PhoneMissed className="w-6 h-6 text-purple-400" />,
    title: "Never Miss a Customer Opportunity",
    description: "Ensure every call and inquiry is handled professionally, even outside business hours."
  },
  {
    icon: <Clock className="w-6 h-6 text-purple-400" />,
    title: "Available 24/7",
    description: "Provide customers with immediate assistance anytime they need support."
  },
  {
    icon: <HeartHandshake className="w-6 h-6 text-purple-400" />,
    title: "Improve Customer Experience",
    description: "Deliver fast, consistent, and professional interactions across every communication channel."
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-purple-400" />,
    title: "Scale Without Increasing Headcount",
    description: "Handle growing communication volumes efficiently without expanding operational costs."
  },
  {
    icon: <CheckCircle2 className="w-6 h-6 text-purple-400" />,
    title: "Intelligent Lead Qualification",
    description: "Identify and prioritize high-intent prospects automatically."
  }
];

export default function IndustriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-white border-b border-purple-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.1),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold mb-6 shadow-sm border border-purple-200">
              Industries We Serve
            </span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              AI-Powered Communication Solutions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-500">Every Industry</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-8">
              Every industry faces unique communication challenges. From missed calls and appointment scheduling to customer inquiries and lead management, businesses lose valuable opportunities when communication isn&apos;t handled efficiently.
            </p>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
              Mesma helps organizations automate inbound and outbound conversations using AI-powered voice agents that answer calls, qualify leads, schedule appointments, and provide customer support 24/7.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-24 relative z-10 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {industries.map((industry, idx) => (
              <AnimatedSection key={industry.slug} delay={idx * 0.1}>
                <div className="group h-full bg-white rounded-3xl p-8 md:p-10 border border-slate-200 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transform group-hover:scale-110 transition-all duration-500 pointer-events-none">
                    {industry.icon}
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 border border-purple-100 group-hover:bg-purple-100 transition-colors">
                    {industry.icon}
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">{industry.name}</h2>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    {industry.description}
                  </p>
                  
                  <div className="mt-auto">
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">How Mesma Helps</h3>
                    <ul className="space-y-3 mb-8">
                      {industry.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600">
                          <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                      <p className="text-sm">
                        <strong className="text-slate-900">Ideal For:</strong> <span className="text-slate-600">{industry.idealFor}</span>
                      </p>
                    </div>

                    <Link href={`/industries/${industry.slug}`} className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition-colors group/btn">
                      Learn More <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Mesma */}
      <section className="py-24 bg-white border-y border-purple-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Why Businesses Choose Mesma</h2>
            <p className="text-lg text-slate-600">
              Our AI voice solutions are designed to deliver measurable results across any industry by fundamentally upgrading how you handle communication.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, idx) => (
              <AnimatedSection key={idx} delay={idx * 0.1} className={idx === 3 ? "lg:col-start-2" : idx === 4 ? "lg:col-start-3" : ""}>
                <div className="bg-[#0B1120] rounded-2xl p-8 border border-slate-800 hover:border-purple-500/50 transition-colors shadow-lg h-full flex flex-col relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/30">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-[#0B1120]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.15),transparent_70%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 md:p-16 shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Transform Business Communication?</h2>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              Whether you&apos;re managing a clinic, real estate agency, educational institution, hotel, or growing business, Mesma can help automate conversations, improve customer experiences, and capture more opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/contact" className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all transform hover:-translate-y-1 w-full sm:w-auto text-center">
                Request a Demo
              </Link>
              <Link href="/contact" className="px-8 py-4 rounded-xl bg-white/10 text-white font-bold text-lg hover:bg-white/20 transition-all border border-white/20 w-full sm:w-auto text-center">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
