import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen mesh-bg selection:bg-purple-200 selection:text-purple-900">
      <Navbar />

      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl font-bold font-heading text-foreground mb-4">
            Privacy <span className="bg-gradient-to-r from-deep-violet via-neon-purple to-soft-purple text-transparent bg-clip-text">Policy</span>
          </h1>
          <p className="text-muted-foreground mb-12">Last Updated: June 2026</p>

          <div className="prose prose-lg max-w-none space-y-10 text-foreground">

            <div className="bg-white/60 backdrop-blur-sm border border-purple-100 rounded-2xl p-8">
              <p className="text-muted-foreground leading-relaxed">
                Mesma Technologies ("Mesma", "we", "our", or "us") provides AI-powered communication automation services, including AI Receptionist, AI Customer Support, Appointment Booking, Lead Qualification, and Outbound Automation. This Privacy Policy explains how we handle information when you use our website and services.
              </p>
            </div>

            {[
              {
                title: "1. Information We Collect",
                sections: [
                  {
                    subtitle: "1.1 Information You Provide",
                    content: "We may collect the following information when you use Mesma: Name, email address, and phone number; Business name and company details; Call instructions, scripts, FAQs, and knowledge base content; Appointment schedules and booking preferences; Any data you submit while configuring AI automation."
                  },
                  {
                    subtitle: "1.2 Information Collected Through Service Usage",
                    content: "When you use Mesma services, we may collect limited operational data necessary to provide core functionality, such as: Call connection details (e.g., time, duration, routing status); AI-handled conversation records and transcripts; Service configuration and automation settings; System interaction data required for service delivery and improvement. This data is used strictly for enabling AI Receptionist, Customer Support, Appointment Booking, and Outbound Automation features."
                  },
                  {
                    subtitle: "1.3 Customer End-User Data",
                    content: "If you use Mesma for your business, you are responsible for ensuring your customers are informed that their interactions may be handled by AI systems. Mesma processes end-user data solely on your behalf and according to your instructions."
                  }
                ]
              }
            ].map((section) => (
              <div key={section.title} className="bg-white/60 backdrop-blur-sm border border-purple-100 rounded-2xl p-8 space-y-6">
                <h2 className="text-2xl font-bold font-heading text-deep-violet">{section.title}</h2>
                {section.sections.map((sub) => (
                  <div key={sub.subtitle}>
                    <h3 className="text-lg font-semibold mb-2">{sub.subtitle}</h3>
                    <p className="text-muted-foreground leading-relaxed">{sub.content}</p>
                  </div>
                ))}
              </div>
            ))}

            {[
              {
                title: "2. How We Use Information",
                body: "We use collected information to: provide AI voice automation services; enable inbound and outbound call handling; improve AI accuracy and conversational quality; support appointment scheduling and CRM workflows; provide customer support and service assistance; maintain platform security and reliability."
              },
              {
                title: "3. Data Sharing",
                body: "We do not sell personal data. We may share limited information only when necessary with: telephony and communication infrastructure providers; cloud hosting and storage providers; payment processing services; analytics tools used to improve service performance. All third-party providers are required to maintain strict confidentiality and data protection standards."
              },
              {
                title: "4. Data Security",
                body: "We take appropriate measures to protect your information, including: secure cloud infrastructure; encrypted data transmission where applicable; role-based access controls; segregated customer environments; regular monitoring and system safeguards. However, no system can guarantee absolute security."
              },
              {
                title: "5. Data Retention",
                body: "We retain information only for as long as necessary to provide services, maintain business operations, comply with legal obligations, and resolve disputes. You may request deletion of your data at any time, subject to legal or operational requirements."
              },
              {
                title: "6. Your Rights",
                body: "Depending on your location, you may have rights to: access your stored information; request corrections or updates; request deletion of your data; export your data; withdraw consent where applicable."
              },
              {
                title: "7. Cookies",
                body: "We may use cookies and similar technologies to improve website performance, remember user preferences, and analyze website usage patterns. You may disable cookies through your browser settings."
              },
              {
                title: "8. AI-Powered Services",
                body: "Mesma uses artificial intelligence to handle voice conversations, respond to customer inquiries, qualify leads automatically, schedule and manage appointments, and execute outbound communication workflows. AI outputs are generated dynamically and may require human review depending on your configuration."
              },
              {
                title: "9. International Data Processing",
                body: "Your information may be processed in secure data centers located outside your country of residence. We ensure appropriate safeguards for all data transfers."
              },
              {
                title: "10. Changes to This Policy",
                body: "We may update this Privacy Policy periodically. Updates will be posted on this page with a revised \"Last Updated\" date."
              },
              {
                title: "11. Contact Us",
                body: "Email: support@mesma.co.in — Website: https://mesma.co.in"
              }
            ].map((item) => (
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
