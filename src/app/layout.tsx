import type { Metadata } from "next";
import { Inter, Space_Grotesk, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mesma.co.in'),
  title: {
    default: "AI Receptionist & Voice Automation Solutions | Mesma Technologies",
    template: "%s | Mesma Technologies"
  },
  icons: {
    icon: { url: "/favicon.png", type: "image/png" },
    apple: "/favicon.png",
  },
  description: "Automate inbound calls, customer support, appointment booking, lead qualification, and outbound communication with AI-powered voice agents from Mesma.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mesma.co.in",
    siteName: "Mesma Technologies",
    title: "AI Receptionist & Voice Automation Solutions | Mesma Technologies",
    description: "Automate inbound calls, customer support, appointment booking, lead qualification, and outbound communication with AI-powered voice agents from Mesma.",
    images: [
      {
        url: "https://mesma.co.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mesma Technologies Open Graph Image",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Receptionist & Voice Automation Solutions | Mesma Technologies",
    description: "Automate inbound calls, customer support, appointment booking, lead qualification, and outbound communication with AI-powered voice agents from Mesma.",
    images: ["https://mesma.co.in/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://mesma.co.in/#organization",
        "name": "Mesma Technologies",
        "url": "https://mesma.co.in",
        "logo": "https://mesma.co.in/logo.png",
        "additionalType": "Technology Company"
      },
      {
        "@type": "WebSite",
        "@id": "https://mesma.co.in/#website",
        "url": "https://mesma.co.in",
        "name": "Mesma Technologies",
        "publisher": {
          "@id": "https://mesma.co.in/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://mesma.co.in/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${sora.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">{children}</body>
    </html>
  );
}
