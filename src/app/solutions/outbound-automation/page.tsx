import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Megaphone, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Outbound Call Automation | Mesma",
  description: "Scale follow-ups, reminders, surveys, and outreach campaigns with AI-powered outbound calling.",
};

export default function OutboundAutomation() {
  return (
    <div className="min-h-screen mesh-bg selection:bg-purple-200 selection:text-purple-900">
      <Navbar />
      {/* HERO SECTION */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-foreground mb-6">Automated Outbound Calls That <span className="bg-gradient-to-r from-deep-violet via-neon-purple to-soft-purple text-transparent bg-clip-text">Drive Revenue</span></h1>
          <p className="text-xl text-muted-foreground mb-10">Run intelligent voice campaigns for follow-ups, reminders, feedback, and sales outreach at scale.</p>
          <Link href="/contact">
            <Button size="lg" className="bg-neon-purple hover:bg-deep-violet text-white rounded-full px-10 h-14 text-lg shadow-[0_4px_14px_0_rgba(147,51,234,0.39)] hover:-translate-y-0.5 transition-all">
              Launch Campaigns
            </Button>
          </Link>
        </div>
      </section>

      {/* PROBLEM & SOLUTION */}
      <AnimatedSection className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <GlassCard className="p-8 border-red-100/50 bg-red-50/20">
              <h2 className="text-2xl font-bold text-red-900 mb-6">The Problem</h2>
              <p className="text-muted-foreground mb-4">Businesses struggle with:</p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-400" /> Manual follow-ups</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-400" /> Missed reminders</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-400" /> Low engagement rates</li>
                <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-red-400" /> Expensive call teams</li>
              </ul>
            </GlassCard>

            <GlassCard className="p-8 border-neon-purple shadow-[0_0_30px_rgba(147,51,234,0.1)]">
              <h2 className="text-2xl font-bold text-deep-violet mb-6">The Solution</h2>
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Megaphone className="w-8 h-8 text-neon-purple" />
              </div>
              <p className="text-lg text-foreground font-medium leading-relaxed">
                AI runs outbound calling campaigns automatically with natural conversations that engage customers at scale.
              </p>
            </GlassCard>
          </div>
        </div>
      </AnimatedSection>

      {/* FEATURES */}
      <AnimatedSection className="py-20 px-4 bg-white/40">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading text-foreground">Key Features</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              'Automated follow-up calls',
              'Payment reminders',
              'Customer surveys',
              'Renewal notifications',
              'Campaign scheduling'
            ].map((feature, i) => (
              <GlassCard key={i} className="p-6 flex items-start gap-4 hover:border-neon-purple transition-colors">
                <CheckCircle2 className="w-6 h-6 text-neon-purple shrink-0 mt-1" />
                <h3 className="font-bold text-lg">{feature}</h3>
              </GlassCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* HOW IT WORKS & USE CASES */}
      <AnimatedSection className="py-20 px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold font-heading mb-8">How It Works</h2>
            <div className="space-y-8">
              {[
                { num: "01", title: "We Onboard Your Contact List", desc: "Share your contact database with our team and we securely import it—ready for your first AI-powered campaign." },
                { num: "02", title: "We Design Your Campaign Strategy", desc: "Our team sets the goal, scripts the AI's conversation flow, and schedules your outreach for maximum engagement." },
                { num: "03", title: "Your AI Runs the Campaign at Scale", desc: "Sit back while your AI makes hundreds of natural, personalized calls—logging outcomes and syncing results in real time." },
              ].map((step) => (
                <div key={step.num} className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center font-bold text-neon-purple text-lg shrink-0 shadow-sm">{step.num}</div>
                  <div>
                    <p className="text-lg font-bold text-foreground mb-1">{step.title}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold font-heading mb-8">Perfect For</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Finance companies', 'E-commerce', 'Subscription businesses', 'Healthcare providers'].map((useCase, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-sm border border-purple-100 p-4 rounded-xl flex items-center gap-3">
                  <ArrowRight className="w-4 h-4 text-neon-purple" />
                  <span className="font-semibold text-foreground">{useCase}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* BENEFITS */}
      <AnimatedSection className="py-20 px-4 bg-purple-50/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold font-heading mb-12">The Mesma Advantage</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              "Increase customer retention",
              "Improve payment recovery",
              "Boost engagement",
              "Scale outreach easily"
            ].map((benefit, i) => (
              <GlassCard key={i} className="p-6 bg-white/80">
                <p className="font-bold text-lg text-deep-violet">{benefit}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* FINAL CTA */}
      <AnimatedSection className="py-24 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-deep-violet to-neon-purple rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-8">Scale Your Outreach Without Hiring Call Teams</h2>
            <Link href="/contact">
              <Button size="lg" className="bg-white text-deep-violet hover:bg-gray-100 rounded-full px-10 h-14 text-lg font-semibold">
                Launch Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
