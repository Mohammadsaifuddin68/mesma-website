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
  title: "Mesma Technologies | AI Voice Automation",
  description: "AI voice agents that answer calls, qualify leads, support customers, and automate conversations 24/7.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">{children}</body>
    </html>
  );
}
