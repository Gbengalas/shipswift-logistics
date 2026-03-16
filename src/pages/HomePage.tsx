import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Truck, MapPin, Shield, Clock, BarChart3 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SERVICES = [
  { icon: Truck, title: 'Express Delivery', desc: 'Next-day and same-day shipping for urgent cargo across the country.' },
  { icon: MapPin, title: 'Real-Time Tracking', desc: 'Track every shipment from pickup to delivery with live status updates.' },
  { icon: Shield, title: 'Secure Handling', desc: 'Insured freight and careful handling for fragile and high-value goods.' },
  { icon: Clock, title: 'On-Time Guarantee', desc: '99.2% on-time delivery rate backed by our performance commitment.' },
  { icon: Package, title: 'Warehousing', desc: 'Flexible storage solutions with climate-controlled facilities.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Full visibility into your logistics operations with powerful analytics.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold mb-6 tracking-tight">
            Logistics That <span className="text-accent">Move</span> Your Business
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10">
            End-to-end supply chain management with real-time tracking, smart routing, and guaranteed delivery times.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/track">
              <Button variant="hero" size="lg" className="min-w-[200px]">
                Track a Shipment
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="min-w-[200px] border-primary-foreground/30 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-4">Our Services</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Comprehensive logistics solutions designed for reliability and speed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => (
              <div key={service.title} className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 animate-fade-in">
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-accent-foreground mb-4">Ready to Ship?</h2>
          <p className="text-accent-foreground/80 mb-8 max-w-lg mx-auto">
            Create an account and start managing your shipments in minutes.
          </p>
          <Link to="/auth">
            <Button variant="default" size="lg" className="min-w-[200px]">
              Create Account
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
