import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

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

  useEffect(() => {
    const timer = setInterval(() => setActive(prev => (prev + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-display font-bold text-center mb-4">What Our Clients Say</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Trusted by hundreds of businesses for reliable logistics solutions.
        </p>

        <div className="max-w-2xl mx-auto relative overflow-hidden" style={{ minHeight: 220 }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                i === active ? 'opacity-100 translate-x-0' : i < active ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'
              }`}
            >
              <div className="bg-card border rounded-xl p-8 shadow-sm text-center">
                <div className="flex justify-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className={`h-5 w-5 ${s < t.rating ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} />
                  ))}
                </div>
                <p className="text-foreground italic mb-6 leading-relaxed">"{t.text}"</p>
                <p className="font-display font-semibold">{t.name}</p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i === active ? 'bg-accent w-8' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
