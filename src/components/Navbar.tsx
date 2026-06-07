"use client";

import Link from "next/link";
import Image from "next/image";
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
          <Image
            src="/logo.png"
            alt="Mesma Technologies"
            width={160}
            height={64}
            className="h-14 w-auto drop-shadow-md object-contain"
            priority
          />
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
