import Link from "next/link";
import { Mail, Phone, Globe } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-purple-100 bg-white/50 backdrop-blur-md pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1">
            <Link href="/" className="text-2xl font-bold font-heading text-deep-violet tracking-widest mb-4 block">
              MESMA
            </Link>
            <p className="text-muted-foreground mb-6 font-sans">
              Premium AI voice automation for modern enterprises. Never miss a call, always capture the lead.
            </p>
            <div className="flex gap-4 text-purple-600">
              <Link href="#" className="hover:text-neon-purple transition-colors">
                <Globe className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Solutions</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/solutions/ai-receptionist" className="hover:text-neon-purple transition-colors">AI Receptionist</Link></li>
              <li><Link href="/solutions/customer-support" className="hover:text-neon-purple transition-colors">Customer Support</Link></li>
              <li><Link href="/solutions/appointment-booking" className="hover:text-neon-purple transition-colors">Appointment Booking</Link></li>
              <li><Link href="/solutions/lead-qualification" className="hover:text-neon-purple transition-colors">Lead Qualification</Link></li>
              <li><Link href="/solutions/outbound-automation" className="hover:text-neon-purple transition-colors">Outbound Automation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-neon-purple transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-neon-purple transition-colors">Careers</Link></li>
              <li><Link href="/blogs" className="hover:text-neon-purple transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-neon-purple transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-neon-purple mt-0.5 shrink-0" />
                <span>22°46′38.6″N 86°10′35.7″E<br/>Jharkhand, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neon-purple" />
                <a href="mailto:hello@mesma.co.in" className="hover:text-neon-purple transition-colors">hello@mesma.co.in</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neon-purple" />
                <a href="tel:+918521069602" className="hover:text-neon-purple transition-colors">+91 8521069602</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-purple-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Mesma Technologies. All rights reserved. Owned by Mohammad Saifuddin.</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-neon-purple transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-neon-purple transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
