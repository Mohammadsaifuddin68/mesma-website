import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Voice Solutions by Industry | Mesma Technologies",
  description: "Discover how Mesma AI Receptionist and voice agents automate communications for Healthcare, Real Estate, Education, Hospitality, and more.",
};

export default function IndustriesPage() {
  return (
    <div className="min-h-screen pt-32 px-4 container mx-auto">
      <h1 className="text-4xl font-bold mb-6">Industries We Serve</h1>
      <p className="text-xl text-muted-foreground">Tailored AI voice automation solutions for your specific business needs.</p>
    </div>
  );
}
