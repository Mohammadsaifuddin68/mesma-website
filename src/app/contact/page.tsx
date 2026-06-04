"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedSection } from "@/components/AnimatedSection";
import { GlassCard } from "@/components/GlassCard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  company: z.string().min(2, "Company name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Valid phone number is required."),
  businessType: z.string().min(2, "Business type is required."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export default function Contact() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      businessType: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would send an API request (e.g. to Resend)
    console.log(values);
    alert("Thank you for your inquiry! Our team will contact you shortly.");
    form.reset();
  }

  return (
    <div className="min-h-screen mesh-bg selection:bg-purple-200 selection:text-purple-900">
      <Navbar />
      
      {/* HEADER */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold font-heading text-foreground mb-6">Let's <span className="bg-gradient-to-r from-deep-violet via-neon-purple to-soft-purple text-transparent bg-clip-text">Automate</span> Your Voice</h1>
          <p className="text-xl text-muted-foreground">Book a demo or reach out to our enterprise sales team. We'll show you exactly how Mesma can transform your call volume into revenue.</p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <AnimatedSection className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-16">
            
            {/* Form Side */}
            <div className="lg:w-1/2">
              <GlassCard className="p-8 md:p-10 border-purple-200 shadow-xl">
                <h2 className="text-2xl font-bold font-heading mb-6 text-deep-violet">Contact Sales</h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                      <Input placeholder="Jane Doe" className="bg-white/50 border-purple-100 focus-visible:ring-neon-purple h-12" {...form.register("name")} />
                      {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Company</label>
                      <Input placeholder="Acme Corp" className="bg-white/50 border-purple-100 focus-visible:ring-neon-purple h-12" {...form.register("company")} />
                      {form.formState.errors.company && <p className="text-sm text-red-500">{form.formState.errors.company.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Work Email</label>
                      <Input placeholder="jane@acme.com" className="bg-white/50 border-purple-100 focus-visible:ring-neon-purple h-12" {...form.register("email")} />
                      {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">Phone Number</label>
                      <Input placeholder="+00 0000000000" className="bg-white/50 border-purple-100 focus-visible:ring-neon-purple h-12" {...form.register("phone")} />
                      {form.formState.errors.phone && <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Industry / Business Type</label>
                    <Input placeholder="e.g. Healthcare, Real Estate, E-commerce" className="bg-white/50 border-purple-100 focus-visible:ring-neon-purple h-12" {...form.register("businessType")} />
                    {form.formState.errors.businessType && <p className="text-sm text-red-500">{form.formState.errors.businessType.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">How can we help?</label>
                    <Textarea 
                      placeholder="Tell us about your current call volume and what you're looking to automate..." 
                      className="bg-white/50 border-purple-100 focus-visible:ring-neon-purple min-h-[120px] resize-none" 
                      {...form.register("message")} 
                    />
                    {form.formState.errors.message && <p className="text-sm text-red-500">{form.formState.errors.message.message}</p>}
                  </div>

                  <Button type="submit" className="w-full bg-neon-purple hover:bg-deep-violet text-white h-14 text-lg rounded-xl shadow-[0_4px_14px_0_rgba(147,51,234,0.39)] transition-all">
                    Submit Inquiry
                  </Button>
                </form>
              </GlassCard>
            </div>

            {/* Info & Calendar Side */}
            <div className="lg:w-1/2 flex flex-col gap-8">
              
              <div className="bg-white/40 border border-purple-100 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="text-xl font-bold font-heading text-deep-violet mb-6">Global Headquarters</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <MapPin className="text-neon-purple w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Our Location</p>
                      <p className="text-muted-foreground text-sm">22°46′38.6″N 86°10′35.7″E<br/>Jharkhand, India</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Phone className="text-neon-purple w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Sales & Support</p>
                      <p className="text-muted-foreground text-sm">+91 8521069602</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="text-neon-purple w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Email</p>
                      <p className="text-muted-foreground text-sm">enterprise@mesma.co.in</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Google Maps Embed */}
              <div className="rounded-2xl overflow-hidden border border-purple-100 shadow-md h-64">
                <iframe
                  title="Mesma Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://maps.google.com/maps?q=22.77739,86.17658&z=15&output=embed"
                />
              </div>

            </div>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  );
}
