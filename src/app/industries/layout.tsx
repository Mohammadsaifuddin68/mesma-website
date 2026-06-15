import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industries We Serve | AI Communication Solutions | Mesma Technologies",
  description: "Discover how Mesma helps healthcare, real estate, education, hospitality, professional services, and e-commerce businesses automate communication with AI-powered voice solutions.",
  openGraph: {
    title: "Industries We Serve | AI Communication Solutions | Mesma Technologies",
    description: "Discover how Mesma helps healthcare, real estate, education, hospitality, professional services, and e-commerce businesses automate communication with AI-powered voice solutions.",
    type: "website",
  },
};

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
