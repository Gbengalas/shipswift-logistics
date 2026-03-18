import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Truck, MapPin, Shield, Clock, BarChart3, Zap, Headphones, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedCounter from '@/components/AnimatedCounter';
import Testimonials from '@/components/Testimonials';
import heroBg1 from '@/assets/hero-logistics.jpg';
import heroBg2 from '@/assets/hero-warehouse.jpg';
import heroBg3 from '@/assets/hero-fleet.jpg';
import heroBg4 from '@/assets/hero-shipping.jpg';

const HERO_SLIDES = [
  { bg: heroBg1, title: 'Logistics That', highlight: 'Move', rest: 'Your Business', sub: 'End-to-end supply chain management with real-time tracking, smart routing, and guaranteed delivery times.' },
  { bg: heroBg2, title: 'Warehousing &', highlight: 'Distribution', rest: 'Excellence', sub: 'State-of-the-art facilities with climate control and automated inventory management.' },
  { bg: heroBg3, title: 'A Fleet Built for', highlight: 'Speed', rest: '& Scale', sub: 'Hundreds of vehicles ready to deliver your cargo anywhere, anytime.' },
  { bg: heroBg4, title: 'Global', highlight: 'Shipping', rest: 'Solutions', sub: 'Sea, air, and land freight services connecting you to markets worldwide.' },
];

const FEATURES = [
  { icon: Zap, title: 'Fast Delivery', desc: 'Same-day and next-day delivery options for urgent shipments across the nation.' },
  { icon: Shield, title: 'Secure Shipping', desc: 'Fully insured cargo with tamper-proof packaging and chain-of-custody tracking.' },
  { icon: MapPin, title: 'Real-Time Tracking', desc: 'Live GPS updates from pickup to delivery — know exactly where your package is.' },
  { icon: Headphones, title: '24/7 Support', desc: 'Round-the-clock customer support via phone, email, and live chat.' },
];

const SERVICES = [
  { icon: Truck, title: 'Express Delivery', desc: 'Next-day and same-day shipping for urgent cargo across the country.' },
  { icon: MapPin, title: 'Real-Time Tracking', desc: 'Track every shipment from pickup to delivery with live status updates.' },
  { icon: Shield, title: 'Secure Handling', desc: 'Insured freight and careful handling for fragile and high-value goods.' },
  { icon: Clock, title: 'On-Time Guarantee', desc: '99.2% on-time delivery rate backed by our performance commitment.' },
  { icon: Package, title: 'Warehousing', desc: 'Flexible storage solutions with climate-controlled facilities.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Full visibility into your logistics operations with powerful analytics.' },
];

const STATS = [
  { value: 15000, suffix: '+', label: 'Deliveries Completed' },
  { value: 2500, suffix: '+', label: 'Happy Clients' },
  { value: 350, suffix: '+', label: 'Vehicles in Fleet' },
  { value: 99, suffix: '%', label: 'On-Time Rate' },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length), []);
  const prevSlide = useCallback(() => setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Carousel */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden">
        {HERO_SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.bg})`, opacity: i === currentSlide ? 1 : 0 }}
          >
            <div className="absolute inset-0 bg-primary/80" />
          </div>
        ))}

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 text-center">
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 flex flex-col items-center justify-center px-4 transition-all duration-500 ${
                  i === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                }`}
              >
                <h1 className="text-4xl md:text-6xl font-display font-extrabold mb-6 tracking-tight text-primary-foreground">
                  {slide.title} <span className="text-accent">{slide.highlight}</span> {slide.rest}
                </h1>
                <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10">
                  {slide.sub}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/track">
                    <Button variant="hero" size="lg" className="min-w-[200px]">Track a Shipment</Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="outline" size="lg" className="min-w-[200px] border-primary-foreground/30 text-primary-foreground">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/20 backdrop-blur-sm text-primary-foreground flex items-center justify-center hover:bg-card/40 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/20 backdrop-blur-sm text-primary-foreground flex items-center justify-center hover:bg-card/40 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'bg-accent w-8' : 'bg-primary-foreground/40 w-2 hover:bg-primary-foreground/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-4">Why Choose LogiTrack?</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Industry-leading logistics features designed for modern businesses.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-card border rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in group"
              >
                <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                  <f.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Counters */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-display font-extrabold text-accent mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-primary-foreground/70 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
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
              <div
                key={service.title}
                className="bg-card border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in group"
              >
                <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <service.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* CTA */}
      <section className="py-20 bg-accent">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-accent-foreground mb-4">Ready to Ship?</h2>
          <p className="text-accent-foreground/80 mb-10 max-w-lg mx-auto">
            Create an account and start managing your shipments in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/track">
              <Button variant="default" size="lg" className="min-w-[200px]">Track Shipment</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="min-w-[200px] border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10">
                Book Shipment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
