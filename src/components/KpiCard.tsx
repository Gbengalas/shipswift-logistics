import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'default' | 'accent' | 'success' | 'destructive';
}

const variantStyles = {
  default: 'border-border',
  accent: 'border-accent/30 bg-accent/5',
  success: 'border-success/30 bg-success/5',
  destructive: 'border-destructive/30 bg-destructive/5',
};

export default function KpiCard({ title, value, icon: Icon, variant = 'default' }: KpiCardProps) {
  return (
    <div className={`bg-card rounded-lg border p-5 animate-fade-in ${variantStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-body">{title}</p>
          <p className="text-2xl font-display font-bold mt-1">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center">
          <Icon className="h-6 w-6 text-accent" />
        </div>
      </div>
    </div>
  );
}
