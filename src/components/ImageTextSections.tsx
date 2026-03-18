import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import truckImg from '@/assets/logistics-truck-highway.jpg';
import warehouseImg from '@/assets/logistics-warehouse-interior.jpg';
import lastMileImg from '@/assets/logistics-last-mile.jpg';

const SECTIONS = [
  {
    img: truckImg,
    title: 'Nationwide Freight Network',
    desc: 'Our fleet of modern trucks covers every major route, ensuring your cargo reaches its destination on time — every time.',
    cta: { label: 'Explore Services', to: '/auth' },
    reverse: false,
  },
  {
    img: warehouseImg,
    title: 'Smart Warehousing',
    desc: 'Climate-controlled facilities with automated inventory management keep your goods safe and accessible around the clock.',
    cta: { label: 'Learn More', to: '/auth' },
    reverse: true,
  },
  {
    img: lastMileImg,
    title: 'Last-Mile Excellence',
    desc: 'From our hub to your customer\'s door — fast, friendly, and fully tracked. Delivering smiles, one package at a time.',
    cta: { label: 'Start Shipping', to: '/auth' },
    reverse: false,
  },
];

function SplitSection({ img, title, desc, cta, reverse, index }: typeof SECTIONS[0] & { index: number }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section ref={ref} className="py-0">
      <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} min-h-[480px]`}>
        {/* Image */}
        <div
          className="w-full lg:w-1/2 min-h-[320px] lg:min-h-0 overflow-hidden relative"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(1.05)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover absolute inset-0"
            loading="lazy"
          />
        </div>

        {/* Text */}
        <div
          className="w-full lg:w-1/2 flex items-center bg-background"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : `translateX(${reverse ? '-40px' : '40px'})`,
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          }}
        >
          <div className="px-8 md:px-16 lg:px-20 py-16 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">{desc}</p>
            <Link to={cta.to}>
              <Button variant="accent" size="lg">{cta.label}</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ImageTextSections() {
  return (
    <>
      {SECTIONS.map((section, i) => (
        <SplitSection key={section.title} {...section} index={i} />
      ))}
    </>
  );
}
