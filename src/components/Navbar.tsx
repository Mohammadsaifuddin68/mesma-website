"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";

const products = [
  { name: "AI Receptionist", href: "/solutions/ai-receptionist" },
  { name: "AI Customer Support", href: "/solutions/customer-support" },
  { name: "Appointment Booking", href: "/solutions/appointment-booking" },
  { name: "Lead Qualification", href: "/solutions/lead-qualification" },
  { name: "Outbound Automation", href: "/solutions/outbound-automation" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/20">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" className="h-14 w-auto drop-shadow-md">
            <defs>
              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="50%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#7E22CE" />
              </linearGradient>
            </defs>
            <text x="250" y="125" fontFamily="'Space Grotesk', sans-serif" fontSize="80" fontWeight="900" fill="url(#purpleGradient)" textAnchor="middle" letterSpacing="12">
              MESMA
            </text>
            <g stroke="url(#purpleGradient)" strokeWidth="4" strokeLinecap="round" transform="translate(170, 150)">
              <line x1="0" y1="0" x2="0" y2="-10" />
              <line x1="15" y1="0" x2="15" y2="-20" />
              <line x1="30" y1="0" x2="30" y2="-35" />
              <line x1="45" y1="0" x2="45" y2="-15" />
              <line x1="60" y1="0" x2="60" y2="-25" />
              <line x1="75" y1="0" x2="75" y2="-40" />
              <line x1="90" y1="0" x2="90" y2="-20" />
              <line x1="105" y1="0" x2="105" y2="-30" />
              <line x1="120" y1="0" x2="120" y2="-10" />
              <line x1="135" y1="0" x2="135" y2="-25" />
              <line x1="150" y1="0" x2="150" y2="-5" />
            </g>
          </svg>
        </Link>

        <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
          {/* Products Dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-1 hover:text-neon-purple transition-colors font-medium">
              Products <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 glass-panel border border-purple-100 rounded-2xl shadow-xl py-2 z-50">
                {products.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="block px-5 py-2.5 text-sm font-medium hover:text-neon-purple hover:bg-purple-50/50 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="#industries" className="hover:text-neon-purple transition-colors">Industries</Link>
          <Link href="#pricing" className="hover:text-neon-purple transition-colors">Pricing</Link>
          <Link href="/about" className="hover:text-neon-purple transition-colors">About</Link>
          <Link href="/contact" className="hover:text-neon-purple transition-colors">Contact</Link>
        </nav>

        <div className="flex gap-4 items-center">
          <Link href="/contact">
            <Button variant="ghost" className="hidden sm:flex hover:bg-purple-100 hover:text-purple-900 rounded-full">Book Demo</Button>
          </Link>
          <Link href="/contact">
            <Button className="bg-neon-purple hover:bg-deep-violet text-white rounded-full px-6 shadow-[0_4px_14px_0_rgba(147,51,234,0.39)] hover:shadow-[0_6px_20px_rgba(147,51,234,0.23)] hover:-translate-y-0.5 transition-all duration-200">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
