import { CheckCircle2, Circle, Package, Truck, MapPin, Clock } from 'lucide-react';

const STATUSES = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'in_transit', label: 'In Transit', icon: Truck },
  { key: 'arrived_at_hub', label: 'Arrived at Hub', icon: MapPin },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

interface ShipmentTimelineProps {
  currentStatus: string;
}

export default function ShipmentTimeline({ currentStatus }: ShipmentTimelineProps) {
  const currentIndex = STATUSES.findIndex(s => s.key === currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  return (
    <div className="flex flex-col gap-0">
      {STATUSES.map((status, index) => {
        const isCompleted = !isCancelled && index <= currentIndex;
        const isCurrent = !isCancelled && index === currentIndex;
        const Icon = status.icon;

        return (
          <div key={status.key} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                isCompleted 
                  ? isCurrent ? 'bg-accent text-accent-foreground animate-pulse-orange' : 'bg-success text-success-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {isCompleted && !isCurrent ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              {index < STATUSES.length - 1 && (
                <div className={`w-0.5 h-12 ${isCompleted && index < currentIndex ? 'bg-success' : 'bg-border'}`} />
              )}
            </div>
            <div className="pt-2">
              <p className={`font-display font-semibold text-sm ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                {status.label}
              </p>
            </div>
          </div>
        );
      })}
      {isCancelled && (
        <div className="flex items-start gap-4 mt-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-destructive text-destructive-foreground">
            <Circle className="h-5 w-5" />
          </div>
          <div className="pt-2">
            <p className="font-display font-semibold text-sm text-destructive">Cancelled</p>
          </div>
        </div>
      )}
    </div>
  );
}
