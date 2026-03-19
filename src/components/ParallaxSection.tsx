import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import parallaxBg from '@/assets/logistics-parallax-bg.jpg';

export default function ParallaxSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      ref={ref}
      className="relative min-h-[500px] flex items-center justify-center overflow-hidden"
    >
      {/* Parallax background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${parallaxBg})` }}
      />
      <div className="absolute inset-0 bg-primary/85" />

      <div
        className="relative z-10 text-center px-4 py-20 max-w-3xl mx-auto"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <h2 className="text-3xl md:text-5xl font-display font-extrabold text-primary-foreground mb-6 leading-tight">
          Moving Millions of Packages <span className="text-accent">Every Day</span>
        </h2>
        <p className="text-primary-foreground/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          With a nationwide network and cutting-edge technology, we deliver speed, safety, and reliability at scale.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/track">
            <Button variant="hero" size="lg" className="min-w-[200px]">
              Track a Shipment
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="hero" size="lg" className="min-w-[200px]">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
