import { ClipboardList, Truck, MapPin, PackageCheck } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const STEPS = [
  { icon: ClipboardList, title: 'Book', desc: 'Place your shipment order online in seconds.' },
  { icon: Truck, title: 'Pickup', desc: 'We collect your package from your doorstep.' },
  { icon: MapPin, title: 'Track', desc: 'Follow your shipment in real-time on the map.' },
  { icon: PackageCheck, title: 'Delivered', desc: 'Package arrives safely at the destination.' },
];

export default function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
          How It Works
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
          Shipping made simple in four easy steps.
        </p>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-0.5 bg-border" />

          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center transition-all duration-700"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <div className="relative z-10 h-28 w-28 rounded-full bg-accent/10 border-4 border-background shadow-lg flex items-center justify-center mb-6 group hover:bg-accent/20 transition-colors">
                <step.icon className="h-10 w-10 text-accent" />
                <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center shadow">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm max-w-[200px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
