import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Mesma Technologies",
  description: "Get in touch with Mesma Technologies for a live demo or to learn more about our AI voice automation solutions.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
