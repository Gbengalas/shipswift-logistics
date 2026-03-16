import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import PriceCalculator from './PriceCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PACKAGE_TYPES = ['Documents', 'Parcel', 'Fragile', 'Perishable', 'Heavy Cargo', 'Electronics'];
const DELIVERY_SPEEDS = ['standard', 'express', 'overnight'];

interface BookingFormProps {
  userId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function BookingForm({ userId, onSuccess, onClose }: BookingFormProps) {
  const [form, setForm] = useState({
    origin: '', destination: '', recipient_name: '', recipient_phone: '',
    weight: '', description: '', package_type: '', delivery_speed: 'standard',
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'estimate' | 'book'>('estimate');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.origin || !form.destination) {
      toast.error('Origin and destination are required');
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('shipments').insert({
      customer_id: userId,
      origin: form.origin,
      destination: form.destination,
      recipient_name: form.recipient_name || null,
      recipient_phone: form.recipient_phone || null,
      weight: form.weight || null,
      description: form.description || null,
      package_type: form.package_type || null,
      delivery_speed: form.delivery_speed,
    });
    if (error) {
      toast.error('Failed to create shipment');
    } else {
      toast.success('Shipment booked successfully! A tracking number has been generated.');
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  return (
    <Tabs value={step} onValueChange={v => setStep(v as 'estimate' | 'book')} className="mt-2">
      <TabsList className="w-full">
        <TabsTrigger value="estimate" className="flex-1">1. Estimate Price</TabsTrigger>
        <TabsTrigger value="book" className="flex-1">2. Book Shipment</TabsTrigger>
      </TabsList>

      <TabsContent value="estimate" className="mt-4">
        <PriceCalculator
          compact
          initialOrigin={form.origin}
          initialDestination={form.destination}
          initialWeight={form.weight}
          onSelectPrice={(result) => {
            setEstimatedPrice(result.total);
            update('delivery_speed', result.deliverySpeed);
          }}
        />
        {estimatedPrice !== null && (
          <Button variant="accent" className="w-full mt-4" onClick={() => setStep('book')}>
            Continue to Book — Est. ${estimatedPrice.toFixed(2)}
          </Button>
        )}
      </TabsContent>

      <TabsContent value="book" className="mt-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Origin *</Label><Input value={form.origin} onChange={e => update('origin', e.target.value)} required /></div>
            <div><Label className="text-xs">Destination *</Label><Input value={form.destination} onChange={e => update('destination', e.target.value)} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Recipient Name</Label><Input value={form.recipient_name} onChange={e => update('recipient_name', e.target.value)} /></div>
            <div><Label className="text-xs">Recipient Phone</Label><Input value={form.recipient_phone} onChange={e => update('recipient_phone', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Weight (kg)</Label><Input type="number" min="0.1" step="0.1" value={form.weight} onChange={e => update('weight', e.target.value)} /></div>
            <div>
              <Label className="text-xs">Package Type</Label>
              <Select value={form.package_type} onValueChange={v => update('package_type', v)}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>{PACKAGE_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Delivery Speed</Label>
              <Select value={form.delivery_speed} onValueChange={v => update('delivery_speed', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DELIVERY_SPEEDS.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label className="text-xs">Description</Label><Input value={form.description} onChange={e => update('description', e.target.value)} /></div>
          </div>

          {estimatedPrice !== null && (
            <div className="bg-accent/10 rounded-lg p-3 text-center">
              <span className="text-sm text-muted-foreground">Estimated:</span>
              <span className="ml-2 font-display font-bold text-accent text-lg">${estimatedPrice.toFixed(2)}</span>
            </div>
          )}

          <Button type="submit" variant="accent" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Book Shipment'}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}
