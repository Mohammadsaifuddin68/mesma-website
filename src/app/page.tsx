import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedSection } from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { PhoneCall, Headset, Calendar, ShieldCheck, Megaphone, GitMerge, CheckCircle2, Play, Activity } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Receptionist & Voice Automation Solutions | Mesma Technologies",
  description: "Automate inbound calls, customer support, appointment booking, lead qualification, and outbound communication with AI-powered voice agents from Mesma.",
};

export default function Home() {
  return (
    <div className="min-h-screen mesh-bg selection:bg-purple-200 selection:text-purple-900 overflow-hidden">
      <Navbar />
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 px-4 flex flex-col items-center justify-center min-h-[90vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/60 pointer-events-none z-0" />
        <div className="container mx-auto relative z-10 flex flex-col items-center">
          
          <div className="relative w-64 h-64 mb-12 flex items-center justify-center">
            <div className="absolute inset-0 bg-neon-purple rounded-full blur-[100px] opacity-40 animate-pulse" />
            <div className="absolute inset-10 bg-lavender rounded-full blur-[60px] opacity-50" />
            <div className="w-32 h-32 bg-gradient-to-br from-soft-purple to-deep-violet rounded-full shadow-[0_0_80px_rgba(147,51,234,0.8)] animate-bounce" style={{ animationDuration: '4s' }}>
              <div className="w-full h-full rounded-full border border-white/30 backdrop-blur-sm flex items-center justify-center">
                <Activity className="text-white w-12 h-12 opacity-80" />
              </div>
            </div>
            
            <div className="absolute w-full h-full animate-spin" style={{ animationDuration: '20s', animationTimingFunction: 'linear' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold text-deep-violet shadow-lg border border-purple-100 whitespace-nowrap">
                AI Receptionist
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-semibold text-deep-violet shadow-lg border border-purple-100 whitespace-nowrap rotate-180">
                Lead Qualification
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-heading text-center mb-6 tracking-tight text-foreground max-w-5xl">
            Never Miss a <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-deep-violet via-neon-purple to-soft-purple text-transparent bg-clip-text pb-2">Customer Call</span> Again
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground text-center max-w-3xl mb-12 font-sans">
            AI voice agents that answer calls, qualify leads, support customers, and automate conversations 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto px-4">
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto bg-neon-purple hover:bg-deep-violet text-white rounded-full px-8 h-14 text-lg shadow-[0_4px_14px_0_rgba(147,51,234,0.39)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.23)] hover:-translate-y-0.5 transition-all duration-200">
                Get Started
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="w-full sm:w-auto rounded-full px-8 h-14 text-lg bg-purple-100 hover:bg-purple-200 text-deep-violet font-semibold transition-colors shadow-sm">
                Book Live Demo
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-24 w-full max-w-4xl px-4">
            <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-2xl">
              <span className="text-4xl font-bold text-deep-violet mb-2">50,000+</span>
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Calls Automated</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-2xl">
              <span className="text-4xl font-bold text-deep-violet mb-2">99.9%</span>
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Availability</span>
            </div>
            <div className="flex flex-col items-center justify-center p-6 glass-panel rounded-2xl">
              <span className="text-4xl font-bold text-deep-violet mb-2">24/7</span>
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Response Time</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <AnimatedSection className="py-16 border-y border-purple-100/50 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">Trusted by Modern Businesses</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale">
            <div className="text-2xl font-heading font-bold">MESMA</div>
            <div className="text-2xl font-heading font-bold">MESMA</div>
            <div className="text-2xl font-heading font-bold">MESMA</div>
            <div className="text-2xl font-heading font-bold">MESMA</div>
            <div className="text-2xl font-heading font-bold hidden md:block">MESMA</div>
          </div>
        </div>
      </AnimatedSection>

      {/* SOLUTIONS SECTION */}
      <AnimatedSection id="solutions" className="py-24 px-4 container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-6">Automate Every Conversation</h2>
          <p className="text-xl text-muted-foreground">From inbound inquiries to outbound campaigns, our AI voice agents handle it all with human-like precision.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GlassCard>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <PhoneCall className="text-neon-purple w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Receptionist</h3>
            <p className="text-muted-foreground leading-relaxed">Answers calls instantly, greets customers professionally, and handles basic inquiries without putting anyone on hold.</p>
          </GlassCard>
          
          <GlassCard>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Headset className="text-neon-purple w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Customer Support</h3>
            <p className="text-muted-foreground leading-relaxed">Resolves repetitive support tickets, answers FAQs, and provides order updates autonomously.</p>
          </GlassCard>

          <GlassCard>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="text-neon-purple w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Appointment Booking</h3>
            <p className="text-muted-foreground leading-relaxed">Integrates with your calendar to book, reschedule, or cancel appointments directly over the phone.</p>
          </GlassCard>

          <GlassCard>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="text-neon-purple w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Lead Qualification</h3>
            <p className="text-muted-foreground leading-relaxed">Asks qualifying questions, captures prospect information, and pushes data to your CRM automatically.</p>
          </GlassCard>

          <GlassCard>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <Megaphone className="text-neon-purple w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Outbound Campaigns</h3>
            <p className="text-muted-foreground leading-relaxed">Automates follow-ups, appointment reminders, survey collections, and renewal notices at scale.</p>
          </GlassCard>

          <GlassCard>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <GitMerge className="text-neon-purple w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Intelligent Routing</h3>
            <p className="text-muted-foreground leading-relaxed">Understands customer intent and routes complex issues seamlessly to the right human department.</p>
          </GlassCard>
        </div>
      </AnimatedSection>



      {/* BENEFITS SECTION */}
      <AnimatedSection className="py-24 px-4 container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-6">Scale Effortlessly, <br/>Zero Headcount Added</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Transform your communication infrastructure with AI that never sleeps, never takes a break, and always delivers a perfect brand experience.
            </p>
            <ul className="space-y-4">
              {[
                "Reduce missed calls to absolute zero",
                "Improve customer satisfaction scores",
                "Lower operational and support costs by up to 70%",
                "Scale call volume instantly during peak hours",
                "Increase lead conversions with immediate responses"
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-neon-purple" />
                  </div>
                  <span className="font-medium text-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link href="/contact">
              <Button className="mt-10 bg-neon-purple hover:bg-deep-violet text-white rounded-full px-8 h-12">
                See the Impact
              </Button>
            </Link>
          </div>
          <div className="lg:w-1/2 w-full">
            <div className="glass-panel rounded-3xl p-4 shadow-2xl relative">
              {/* Fake Dashboard Mockup */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Calls Answered Today</div>
                      <div className="text-4xl font-bold text-deep-violet">1,284</div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">+24% vs yesterday</div>
                  </div>
                  <div className="space-y-4">
                    {[100, 75, 45, 90, 60].map((width, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-12 text-xs text-gray-400">1{i}:00</div>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-neon-purple rounded-full" style={{ width: `${width}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Floating Element */}
              <div className="absolute -bottom-6 -left-6 glass-panel p-4 rounded-xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="text-green-600 w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Meeting Booked</div>
                  <div className="text-xs text-muted-foreground">Just now by AI Agent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* AI DEMO SECTION */}
      <AnimatedSection className="py-24 px-4 bg-deep-violet text-white">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-heading mb-6">Hear the Future</h2>
            <p className="text-xl text-purple-200">Our agents sound indistinguishable from humans, complete with natural pauses and conversational intelligence.</p>
          </div>
          
          <div className="max-w-2xl mx-auto glass-panel border-white/20 bg-white/5 rounded-3xl p-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center">C</div>
                <div className="bg-white/10 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                  <p className="text-white/90">Hi, I need to schedule an appointment for next Tuesday.</p>
                </div>
              </div>
              
              <div className="flex gap-4 flex-row-reverse">
                <div className="w-10 h-10 rounded-full bg-neon-purple flex-shrink-0 flex items-center justify-center font-bold">M</div>
                <div className="bg-neon-purple rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                  <p className="text-white">I can certainly help you with that. I have availability at 10:00 AM or 2:30 PM next Tuesday. Which works best for you?</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button size="icon" className="rounded-full bg-white text-deep-violet hover:bg-gray-100">
                  <Play className="w-4 h-4 ml-1" />
                </Button>
                <div className="text-sm font-medium">Listen to recording</div>
              </div>
              <div className="flex gap-1">
                {/* Simulated Audio Wave */}
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="w-1 bg-white/40 rounded-full animate-pulse" style={{ height: `${Math.random() * 20 + 8}px`, animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* PRICING SECTION */}
      <AnimatedSection id="pricing" className="py-24 px-4 container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-6">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground">No hidden fees, no complex tiers. Just a one-time setup and pay-as-you-go usage.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Installation */}
          <GlassCard className="flex flex-col h-full border-purple-100">
            <h3 className="text-2xl font-bold mb-2">Setup & Installation</h3>
            <p className="text-muted-foreground mb-6 text-sm">One-time fee to custom-build, train, and integrate your AI agent.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">$1,000</span><span className="text-muted-foreground"> one-time</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-neon-purple" /> Full Knowledge Base Integration</li>
              <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-neon-purple" /> Custom CRM Connections</li>
              <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-neon-purple" /> Call Routing Configuration</li>
              <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-neon-purple" /> Voice Fine-tuning</li>
            </ul>
            <Link href="/contact">
              <Button className="w-full bg-white text-deep-violet border border-purple-200 hover:bg-purple-50">Book Installation</Button>
            </Link>
          </GlassCard>

          {/* Usage */}
          <GlassCard className="flex flex-col h-full border-neon-purple shadow-[0_0_30px_rgba(147,51,234,0.15)] relative scale-105 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-neon-purple text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-b-lg whitespace-nowrap">Pay as you go</div>
            <h3 className="text-2xl font-bold mb-2 mt-4">Usage Billing</h3>
            <p className="text-muted-foreground mb-6 text-sm">You only pay for the minutes your AI spends actively talking to customers.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold">Usage Based</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-neon-purple" /> Billed per conversation minute</li>
              <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-neon-purple" /> Automatic volume scaling</li>
              <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-neon-purple" /> Real-time dashboard analytics</li>
              <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-neon-purple" /> Volume discounts available</li>
            </ul>
            <Link href="/contact">
              <Button className="w-full bg-neon-purple text-white hover:bg-deep-violet">View Rates</Button>
            </Link>
          </GlassCard>
        </div>
      </AnimatedSection>

      {/* FAQ SECTION */}
      <AnimatedSection className="py-24 px-4 container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-6">Frequently Asked Questions</h2>
        </div>
        
        <Accordion className="w-full">
          <AccordionItem value="item-1" className="border-purple-100 mb-4 bg-white/50 backdrop-blur-sm rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold hover:text-neon-purple text-left">How does AI Receptionist work?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Our AI connects to your phone system via SIP forwarding or a provided dedicated number. When a customer calls, the AI answers instantly, uses speech-to-text to understand the intent, processes the query against your knowledge base, and replies with human-like text-to-speech.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-purple-100 mb-4 bg-white/50 backdrop-blur-sm rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold hover:text-neon-purple text-left">Can it transfer calls to human agents?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Yes. If a caller requests a human, or if the AI encounters a scenario outside its training parameters, it smoothly transfers the call to the appropriate department along with a transcript of the conversation so far.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-purple-100 mb-4 bg-white/50 backdrop-blur-sm rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold hover:text-neon-purple text-left">Can it book appointments directly into my calendar?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Absolutely. Mesma integrates directly with Google Calendar, Outlook, Calendly, and custom CRMs to check live availability and schedule meetings autonomously.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="border-purple-100 mb-4 bg-white/50 backdrop-blur-sm rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold hover:text-neon-purple text-left">Does it support multiple languages?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Yes, our AI currently supports over 30 languages with native accents, allowing you to provide global support effortlessly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5" className="border-purple-100 mb-4 bg-white/50 backdrop-blur-sm rounded-lg px-4">
            <AccordionTrigger className="text-lg font-semibold hover:text-neon-purple text-left">How long does setup take?</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              Basic receptionists can be configured and launched in under an hour. Complex enterprise workflows with custom CRM integrations typically take 1-2 weeks for full deployment and testing.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </AnimatedSection>

      {/* FINAL CTA */}
      <AnimatedSection className="py-24 px-4 border-t border-purple-100">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-deep-violet to-neon-purple rounded-3xl p-12 md:p-20 text-center text-white shadow-[0_20px_50px_rgba(147,51,234,0.3)]">
            <h2 className="text-4xl md:text-6xl font-bold font-heading mb-8">Ready to Automate Every Customer Conversation?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-white text-deep-violet hover:bg-gray-100 rounded-full px-10 h-14 text-lg font-semibold">
                  Get Started
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" className="rounded-full px-10 h-14 text-lg bg-purple-900 hover:bg-purple-950 text-white font-semibold border-none shadow-lg shadow-purple-900/20">
                  Book Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
