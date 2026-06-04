import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { GlassCard } from "@/components/GlassCard";
import { CheckCircle2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing | Mesma AI Voice Automation",
  description: "Transparent pricing for Mesma AI Receptionist and voice agents. Simple setup and pay-as-you-go usage.",
};

export default function Pricing() {
  return (
    <div className="min-h-screen mesh-bg selection:bg-purple-200 selection:text-purple-900">
      <Navbar />
      
      {/* HEADER */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-foreground mb-6">Simple, Transparent <span className="bg-gradient-to-r from-deep-violet via-neon-purple to-soft-purple text-transparent bg-clip-text">Pricing</span></h1>
          <p className="text-xl text-muted-foreground">No hidden fees, no complex tiers. Just a flat setup fee and pure usage-based billing.</p>
        </div>
      </section>

      {/* PRICING CARDS */}
      <AnimatedSection className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Setup */}
            <GlassCard className="p-8 border-purple-200 relative overflow-hidden">
              <h2 className="text-2xl font-bold mb-4">Initial Setup & Integration</h2>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-5xl font-black text-deep-violet">$1,000</span>
                <span className="text-muted-foreground font-medium">one-time</span>
              </div>
              <p className="text-muted-foreground mb-8">Comprehensive onboarding, custom model training, and integration into your existing systems by our engineering team.</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-neon-purple mt-0.5 flex-shrink-0" />
                  <span><strong>Full Knowledge Base Sync:</strong> We train the AI on your PDFs, website, and past support tickets.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-neon-purple mt-0.5 flex-shrink-0" />
                  <span><strong>Custom CRM Integration:</strong> Direct API hooks into HubSpot, Salesforce, or your custom backend.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-neon-purple mt-0.5 flex-shrink-0" />
                  <span><strong>Voice Cloning & Selection:</strong> Pick from premium voices or clone an existing representative's voice.</span>
                </li>
              </ul>
              
              <Button size="lg" className="w-full bg-white text-deep-violet border border-purple-200 hover:bg-purple-50">Book Installation</Button>
            </GlassCard>

            {/* Usage */}
            <GlassCard className="p-8 border-neon-purple shadow-[0_0_40px_rgba(147,51,234,0.15)] relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-neon-purple/10 rounded-full blur-xl" />
              <div className="absolute top-0 right-0 bg-neon-purple text-white px-4 py-1 rounded-bl-xl font-bold text-xs uppercase tracking-widest">Pay as you go</div>
              
              <h2 className="text-2xl font-bold mb-4">Monthly Usage Billing</h2>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-5xl font-black text-deep-violet">Usage</span>
                <span className="text-muted-foreground font-medium">based</span>
              </div>
              <p className="text-muted-foreground mb-8">You only pay for the exact minutes your AI spends actively talking to customers. Infinite scaling included.</p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-neon-purple mt-0.5 flex-shrink-0" />
                  <span><strong>Billed per minute:</strong> Exact fractional billing based on active conversation time.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-neon-purple mt-0.5 flex-shrink-0" />
                  <span><strong>Zero concurrent limits:</strong> Handle 1 call or 10,000 calls at the exact same time automatically.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-neon-purple mt-0.5 flex-shrink-0" />
                  <span><strong>Volume discounts:</strong> Automatic rate reductions as your monthly call volume increases.</span>
                </li>
              </ul>
              
              <Button size="lg" className="w-full bg-neon-purple hover:bg-deep-violet text-white shadow-lg shadow-purple-500/20">View Detailed Rates</Button>
            </GlassCard>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
