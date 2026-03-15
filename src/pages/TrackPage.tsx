import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ShipmentTimeline from '@/components/ShipmentTimeline';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Package } from 'lucide-react';
import { toast } from 'sonner';

interface ShipmentData {
  tracking_number: string;
  origin: string;
  destination: string;
  status: string;
  recipient_name: string | null;
  estimated_delivery: string | null;
  created_at: string;
  updated_at: string;
}

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<ShipmentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;
    setLoading(true);
    setSearched(true);

    const { data, error } = await supabase
      .from('shipments')
      .select('tracking_number, origin, destination, status, recipient_name, estimated_delivery, created_at, updated_at')
      .eq('tracking_number', trackingNumber.trim().toUpperCase())
      .maybeSingle();

    if (error) {
      toast.error('Error searching for shipment');
    }
    setShipment(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero tracking input */}
      <section className="bg-primary text-primary-foreground py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-display font-extrabold mb-4">Track Your Shipment</h1>
          <p className="text-primary-foreground/70 mb-8 max-w-lg mx-auto">
            Enter your tracking number to get real-time status updates on your delivery.
          </p>
          <form onSubmit={handleTrack} className="max-w-xl mx-auto flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                placeholder="e.g. LT-A1B2C3D4"
                className="pl-10 h-12 bg-card text-foreground border-none text-base"
              />
            </div>
            <Button type="submit" variant="accent" size="lg" disabled={loading}>
              {loading ? 'Searching...' : 'Track'}
            </Button>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {searched && !shipment && !loading && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-display font-semibold mb-2">No Shipment Found</h2>
              <p className="text-muted-foreground">Please check your tracking number and try again.</p>
            </div>
          )}

          {shipment && (
            <div className="bg-card border rounded-lg p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Tracking Number</p>
                  <p className="font-display font-bold text-lg">{shipment.tracking_number}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  shipment.status === 'delivered' ? 'bg-success/10 text-success' :
                  shipment.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                  'bg-accent/10 text-accent'
                }`}>
                  {shipment.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                <div>
                  <p className="text-muted-foreground">Origin</p>
                  <p className="font-medium">{shipment.origin}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Destination</p>
                  <p className="font-medium">{shipment.destination}</p>
                </div>
                {shipment.recipient_name && (
                  <div>
                    <p className="text-muted-foreground">Recipient</p>
                    <p className="font-medium">{shipment.recipient_name}</p>
                  </div>
                )}
                {shipment.estimated_delivery && (
                  <div>
                    <p className="text-muted-foreground">Est. Delivery</p>
                    <p className="font-medium">{new Date(shipment.estimated_delivery).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <h3 className="font-display font-semibold mb-4">Shipment Progress</h3>
              <ShipmentTimeline currentStatus={shipment.status} />
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
