import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Mesma Technologies",
  description: "Read the Mesma Technologies Terms of Service.",
};

export default function TermsOfService() {
  const sections = [
    {
      title: "1. Service Overview",
      body: "Mesma provides AI-powered communication automation tools including: AI Receptionist; AI Customer Support Automation; Appointment Booking Systems; Lead Qualification Systems; Outbound Call Automation. These services may integrate with third-party communication and business tools."
    },
    {
      title: "2. Eligibility",
      body: "You must be at least 18 years old, have authority to represent your business, and comply with applicable laws in your jurisdiction."
    },
    {
      title: "3. Account Responsibility",
      body: "You are responsible for: maintaining confidentiality of your account; ensuring accuracy of your business information; all activities performed under your account; proper configuration of AI behavior and workflows."
    },
    {
      title: "4. Acceptable Use",
      body: "You agree not to use Mesma for: illegal or fraudulent activities; spam or unauthorized mass communication; harassment, abuse, or harmful behavior; impersonation of individuals or organizations; activities violating telecom or communication laws; unauthorized data collection or misuse. We may suspend or terminate accounts that violate these rules."
    },
    {
      title: "5. AI System Limitations",
      body: "Mesma AI systems are designed to assist business communication but outputs may not always be fully accurate. AI responses should be reviewed where necessary, and performance may vary based on configuration and data provided. You remain responsible for monitoring system outputs in your business operations."
    },
    {
      title: "6. Telecommunication Compliance",
      body: "You are responsible for ensuring compliance with all applicable laws regarding call recordings, customer consent requirements, outbound calling regulations, and data usage in your jurisdiction. Mesma provides tools but does not assume legal responsibility for your usage."
    },
    {
      title: "7. Subscriptions and Payments",
      body: "Services may be billed monthly or annually. Payments are non-refundable unless explicitly stated. Failure to pay may result in service suspension. Pricing may change with prior notice."
    },
    {
      title: "8. Data Ownership",
      body: "You retain full ownership of your business data, customer interaction data, and uploaded content and configurations. Mesma retains ownership of the platform, infrastructure, and underlying AI systems."
    },
    {
      title: "9. Service Availability",
      body: "We aim to provide reliable service but do not guarantee uninterrupted availability. Downtime may occur due to maintenance or updates, infrastructure issues, or third-party service disruptions."
    },
    {
      title: "10. Termination",
      body: "We reserve the right to suspend or terminate access if these Terms are violated, fraudulent or abusive activity is detected, or payment obligations are not met. You may cancel your subscription at any time."
    },
    {
      title: "11. Limitation of Liability",
      body: "Mesma is not liable for business losses or lost revenue, errors in AI-generated outputs, third-party service failures, or decisions made based on system outputs."
    },
    {
      title: "12. Indemnification",
      body: "You agree to indemnify Mesma against claims resulting from misuse of the platform, violation of laws or regulations, and disputes arising from your business operations."
    },
    {
      title: "13. Modifications",
      body: "We may update these Terms from time to time. Continued use of Mesma constitutes acceptance of updates."
    },
    {
      title: "14. Governing Law",
      body: "These Terms shall be governed by applicable laws of your operating jurisdiction."
    },
    {
      title: "15. Contact Information",
      body: "Email: support@mesma.co.in"
    }
  ];

  return (
    <div className="min-h-screen mesh-bg selection:bg-purple-200 selection:text-purple-900">
      <Navbar />

      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold font-heading text-foreground mb-4">
            Terms of <span className="bg-gradient-to-r from-deep-violet via-neon-purple to-soft-purple text-transparent bg-clip-text">Service</span>
          </h1>
          <p className="text-muted-foreground mb-12">Last Updated: June 2026</p>

          <div className="space-y-6">

            <div className="bg-white/60 backdrop-blur-sm border border-purple-100 rounded-2xl p-8">
              <p className="text-muted-foreground leading-relaxed">
                These Terms govern your use of Mesma Technologies services. By accessing or using Mesma, you agree to these Terms.
              </p>
            </div>

            {sections.map((item) => (
              <div key={item.title} className="bg-white/60 backdrop-blur-sm border border-purple-100 rounded-2xl p-8">
                <h2 className="text-2xl font-bold font-heading text-deep-violet mb-4">{item.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
