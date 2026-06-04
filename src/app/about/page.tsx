import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { GlassCard } from "@/components/GlassCard";
import { Lightbulb, Rocket, Users, Target } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen mesh-bg selection:bg-purple-200 selection:text-purple-900">
      <Navbar />
      
      {/* HEADER */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-foreground mb-6">Pioneering the Future of <span className="bg-gradient-to-r from-deep-violet via-neon-purple to-soft-purple text-transparent bg-clip-text">Voice Intelligence</span></h1>
          <p className="text-xl text-muted-foreground">We are not a software reseller. We are not a call center. We are an AI automation company engineering the next generation of business communication.</p>
        </div>
      </section>

      {/* MISSION & VISION */}
      <AnimatedSection className="py-16 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
          <GlassCard className="p-10 border-neon-purple/20">
            <Target className="w-10 h-10 text-neon-purple mb-6" />
            <h2 className="text-2xl font-bold font-heading mb-4 text-deep-violet">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              To eliminate the bottleneck of human communication capacity. We empower businesses to answer every call, capture every lead, and support every customer instantly—without compromising on the quality of interaction.
            </p>
          </GlassCard>
          
          <GlassCard className="p-10 border-soft-purple/20">
            <Lightbulb className="w-10 h-10 text-neon-purple mb-6" />
            <h2 className="text-2xl font-bold font-heading mb-4 text-deep-violet">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed">
              A world where businesses scale infinitely. Where customer service is proactive, immediate, and perfectly consistent. We envision an enterprise landscape where AI handles the routine, freeing humans to handle the extraordinary.
            </p>
          </GlassCard>
        </div>
      </AnimatedSection>

      {/* CORE VALUES */}
      <AnimatedSection className="py-24 px-4 bg-purple-50/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-heading mb-4">Driven by Innovation</h2>
            <p className="text-muted-foreground">The principles that guide our engineering and design.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-purple-100">
              <Rocket className="w-8 h-8 text-neon-purple mb-4" />
              <h3 className="text-xl font-bold mb-2">Relentless Iteration</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">We push the boundaries of LLM capabilities daily. Good enough is never good enough when it comes to voice latency and intelligence.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-purple-100">
              <Users className="w-8 h-8 text-neon-purple mb-4" />
              <h3 className="text-xl font-bold mb-2">Human-Centric AI</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">Technology should feel invisible. Our agents are designed to be indistinguishable from a highly trained human representative.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-purple-100">
              <Target className="w-8 h-8 text-neon-purple mb-4" />
              <h3 className="text-xl font-bold mb-2">Enterprise Reliability</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">When you replace a call center, uptime is everything. Our infrastructure is built for 99.99% availability and massive scale.</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
