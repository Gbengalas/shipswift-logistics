import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Supply Chain Manager, TechCorp',
    text: 'LogiTrack transformed our shipping operations. Real-time tracking and on-time delivery have improved our customer satisfaction by 40%.',
    rating: 5,
  },
  {
    name: 'James Rodriguez',
    role: 'CEO, FastRetail',
    text: 'The analytics dashboard gives us incredible visibility. We reduced delivery delays by 60% within three months of switching to LogiTrack.',
    rating: 5,
  },
  {
    name: 'Amina Hassan',
    role: 'Operations Director, GreenGoods',
    text: 'Secure handling and insurance options give us peace of mind when shipping fragile items. Highly recommend their warehousing solutions.',
    rating: 4,
  },
  {
    name: 'David Park',
    role: 'Logistics Coordinator, BuildRight',
    text: 'The booking system is incredibly intuitive. We went from hours of manual coordination to a streamlined process in minutes.',
    rating: 5,
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    const timer = setInterval(() => setActive(prev => (prev + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section ref={ref} className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
          What Our Clients Say
        </h2>
        <p className="text-muted-foreground text-center mb-16 max-w-xl mx-auto">
          Trusted by hundreds of businesses for reliable logistics solutions.
        </p>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`bg-card border rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-500 relative ${
                i === active ? 'ring-2 ring-accent/30 shadow-lg' : ''
              }`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                transitionDelay: `${i * 100}ms`,
                transitionProperty: 'opacity, transform, box-shadow',
                transitionDuration: '0.6s',
              }}
              onClick={() => setActive(i)}
            >
              <Quote className="h-8 w-8 text-accent/20 absolute top-6 right-6" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={`h-4 w-4 ${s < t.rating ? 'text-accent fill-accent' : 'text-muted-foreground/20'}`} />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6 text-sm">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-display font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
