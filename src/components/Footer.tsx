import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground/70 py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-lg text-primary-foreground mb-3">
            <Package className="h-5 w-5 text-accent" />
            LogiTrack
          </div>
          <p className="text-sm">Reliable logistics solutions for businesses worldwide. Track, manage, and deliver with confidence.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-primary-foreground mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-primary-foreground transition-colors">Home</Link>
            <Link to="/track" className="hover:text-primary-foreground transition-colors">Track Shipment</Link>
            <Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact Us</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-primary-foreground mb-3">Contact</h4>
          <div className="flex flex-col gap-2 text-sm">
            <p>support@logitrack.com</p>
            <p>+1 (555) 123-4567</p>
            <p>123 Logistics Way, Suite 100</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-6 border-t border-primary-foreground/10 text-center text-sm">
        © {new Date().getFullYear()} LogiTrack. All rights reserved.
      </div>
    </footer>
  );
}
