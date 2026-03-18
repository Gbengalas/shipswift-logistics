import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function CtaSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 bg-accent">
      <div
        className="container mx-auto px-4 text-center"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-accent-foreground mb-6">
          Ready to Ship Smarter?
        </h2>
        <p className="text-accent-foreground/80 mb-12 max-w-lg mx-auto text-lg leading-relaxed">
          Join thousands of businesses that trust LogiTrack for fast, secure, and reliable logistics.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth">
            <Button variant="default" size="lg" className="min-w-[220px] text-base font-bold shadow-lg gap-2">
              Get Started Free <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/track">
            <Button variant="outline" size="lg" className="min-w-[220px] border-accent-foreground/30 text-accent-foreground hover:bg-accent-foreground/10 text-base">
              Track Shipment
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
