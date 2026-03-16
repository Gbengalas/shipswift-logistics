import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, DollarSign } from 'lucide-react';

const DELIVERY_SPEEDS = [
  { value: 'standard', label: 'Standard (5-7 days)', multiplier: 1 },
  { value: 'express', label: 'Express (2-3 days)', multiplier: 1.8 },
  { value: 'overnight', label: 'Overnight', multiplier: 3 },
];

const BASE_RATE = 5.0;
const PER_KG_RATE = 2.5;
const DISTANCE_FACTOR = 0.15;

function estimateDistance(origin: string, destination: string): number {
  // Simple hash-based pseudo-distance for demo
  const hash = (s: string) => Array.from(s.toLowerCase()).reduce((a, c) => a + c.charCodeAt(0), 0);
  return Math.abs(hash(origin) - hash(destination)) * 3 + 100;
}

interface PriceResult {
  basePrice: number;
  weightCharge: number;
  distanceCharge: number;
  speedMultiplier: number;
  total: number;
  deliverySpeed: string;
}

interface PriceCalculatorProps {
  onSelectPrice?: (result: PriceResult) => void;
  initialOrigin?: string;
  initialDestination?: string;
  initialWeight?: string;
  compact?: boolean;
}

export default function PriceCalculator({ onSelectPrice, initialOrigin = '', initialDestination = '', initialWeight = '', compact = false }: PriceCalculatorProps) {
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [weight, setWeight] = useState(initialWeight);
  const [speed, setSpeed] = useState('standard');
  const [result, setResult] = useState<PriceResult | null>(null);

  const handleCalculate = () => {
    if (!origin.trim() || !destination.trim() || !weight.trim()) return;
    const w = parseFloat(weight) || 1;
    const dist = estimateDistance(origin, destination);
    const speedObj = DELIVERY_SPEEDS.find(s => s.value === speed)!;
    const basePrice = BASE_RATE;
    const weightCharge = w * PER_KG_RATE;
    const distanceCharge = dist * DISTANCE_FACTOR;
    const total = (basePrice + weightCharge + distanceCharge) * speedObj.multiplier;
    const res: PriceResult = { basePrice, weightCharge, distanceCharge, speedMultiplier: speedObj.multiplier, total, deliverySpeed: speed };
    setResult(res);
    onSelectPrice?.(res);
  };

  return (
    <div className={compact ? 'space-y-3' : 'bg-card border rounded-xl p-6 space-y-4'}>
      {!compact && (
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="h-5 w-5 text-accent" />
          <h3 className="font-display font-semibold text-lg">Price Estimator</h3>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Origin</Label>
          <Input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="e.g. Lagos" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Destination</Label>
          <Input value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. Abuja" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Weight (kg)</Label>
          <Input type="number" min="0.1" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 5" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Delivery Speed</Label>
          <Select value={speed} onValueChange={setSpeed}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {DELIVERY_SPEEDS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button variant="accent" className="w-full" onClick={handleCalculate}>
        <DollarSign className="h-4 w-4 mr-1" /> Estimate Price
      </Button>

      {result && (
        <div className="bg-secondary rounded-lg p-4 mt-2 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">Estimated Cost</span>
            <span className="text-2xl font-display font-bold text-accent">${result.total.toFixed(2)}</span>
          </div>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between"><span>Base fee</span><span>${result.basePrice.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Weight charge</span><span>${result.weightCharge.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Distance charge</span><span>${result.distanceCharge.toFixed(2)}</span></div>
            {result.speedMultiplier > 1 && (
              <div className="flex justify-between"><span>Speed multiplier</span><span>×{result.speedMultiplier}</span></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
