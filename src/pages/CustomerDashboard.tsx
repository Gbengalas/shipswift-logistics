import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import KpiCard from '@/components/KpiCard';
import ShipmentTimeline from '@/components/ShipmentTimeline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Shipment {
  id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  status: string;
  recipient_name: string | null;
  estimated_delivery: string | null;
  created_at: string;
}

export default function CustomerDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    origin: '', destination: '', recipient_name: '', recipient_phone: '', weight: '', description: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    if (user) {
      fetchShipments();
      // Real-time subscription
      const channel = supabase
        .channel('customer-shipments')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'shipments',
          filter: `customer_id=eq.${user.id}`,
        }, (payload) => {
          if (payload.eventType === 'UPDATE') {
            setShipments(prev => prev.map(s => s.id === (payload.new as Shipment).id ? payload.new as Shipment : s));
            toast.info(`Shipment ${(payload.new as any).tracking_number} status: ${(payload.new as any).status.replace(/_/g, ' ')}`);
          } else if (payload.eventType === 'INSERT') {
            setShipments(prev => [payload.new as Shipment, ...prev]);
          }
        })
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [user, authLoading]);

  const fetchShipments = async () => {
    const { data } = await supabase
      .from('shipments')
      .select('id, tracking_number, origin, destination, status, recipient_name, estimated_delivery, created_at')
      .eq('customer_id', user!.id)
      .order('created_at', { ascending: false });
    setShipments(data || []);
    setLoading(false);
  };

  const handleBookShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.origin || !bookingForm.destination) {
      toast.error('Origin and destination are required');
      return;
    }
    setBookingLoading(true);
    const { error } = await supabase.from('shipments').insert({
      customer_id: user!.id,
      origin: bookingForm.origin,
      destination: bookingForm.destination,
      recipient_name: bookingForm.recipient_name || null,
      recipient_phone: bookingForm.recipient_phone || null,
      weight: bookingForm.weight || null,
      description: bookingForm.description || null,
    });
    if (error) {
      toast.error('Failed to create shipment');
    } else {
      toast.success('Shipment booked successfully!');
      setBookingForm({ origin: '', destination: '', recipient_name: '', recipient_phone: '', weight: '', description: '' });
      setBookingOpen(false);
      fetchShipments();
    }
    setBookingLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const active = shipments.filter(s => !['delivered', 'cancelled'].includes(s.status)).length;
  const delivered = shipments.filter(s => s.status === 'delivered').length;
  const pending = shipments.filter(s => s.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-display font-bold">My Shipments</h1>
            <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
              <DialogTrigger asChild>
                <Button variant="accent">Book Shipment</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Book a New Shipment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleBookShipment} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Origin *</Label><Input value={bookingForm.origin} onChange={e => setBookingForm({ ...bookingForm, origin: e.target.value })} required /></div>
                    <div><Label>Destination *</Label><Input value={bookingForm.destination} onChange={e => setBookingForm({ ...bookingForm, destination: e.target.value })} required /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Recipient Name</Label><Input value={bookingForm.recipient_name} onChange={e => setBookingForm({ ...bookingForm, recipient_name: e.target.value })} /></div>
                    <div><Label>Recipient Phone</Label><Input value={bookingForm.recipient_phone} onChange={e => setBookingForm({ ...bookingForm, recipient_phone: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Weight</Label><Input value={bookingForm.weight} onChange={e => setBookingForm({ ...bookingForm, weight: e.target.value })} /></div>
                    <div><Label>Description</Label><Input value={bookingForm.description} onChange={e => setBookingForm({ ...bookingForm, description: e.target.value })} /></div>
                  </div>
                  <Button type="submit" variant="accent" className="w-full" disabled={bookingLoading}>
                    {bookingLoading ? 'Creating...' : 'Book Shipment'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <KpiCard title="Active Shipments" value={active} icon={Truck} variant="accent" />
            <KpiCard title="Delivered" value={delivered} icon={CheckCircle2} variant="success" />
            <KpiCard title="Pending" value={pending} icon={Clock} />
          </div>

          {/* Shipments list */}
          {shipments.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-display font-semibold mb-2">No Shipments Yet</h2>
              <p className="text-muted-foreground mb-4">Book your first shipment to get started.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block bg-card border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-3 font-display font-semibold">Tracking #</th>
                      <th className="text-left p-3 font-display font-semibold">Origin</th>
                      <th className="text-left p-3 font-display font-semibold">Destination</th>
                      <th className="text-left p-3 font-display font-semibold">Status</th>
                      <th className="text-left p-3 font-display font-semibold">Date</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map(s => (
                      <tr key={s.id} className="border-t hover:bg-secondary/50 transition-colors">
                        <td className="p-3 font-mono font-medium">{s.tracking_number}</td>
                        <td className="p-3">{s.origin}</td>
                        <td className="p-3">{s.destination}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            s.status === 'delivered' ? 'bg-success/10 text-success' :
                            s.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                            'bg-accent/10 text-accent'
                          }`}>
                            {s.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</td>
                        <td className="p-3">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedShipment(s)}>Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {shipments.map(s => (
                  <div key={s.id} className="bg-card border rounded-lg p-4" onClick={() => setSelectedShipment(s)}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-medium text-sm">{s.tracking_number}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        s.status === 'delivered' ? 'bg-success/10 text-success' :
                        s.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                        'bg-accent/10 text-accent'
                      }`}>
                        {s.status.replace(/_/g, ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{s.origin} → {s.destination}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Detail dialog */}
          <Dialog open={!!selectedShipment} onOpenChange={() => setSelectedShipment(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Shipment Details</DialogTitle>
              </DialogHeader>
              {selectedShipment && (
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><p className="text-muted-foreground">Tracking #</p><p className="font-mono font-medium">{selectedShipment.tracking_number}</p></div>
                    <div><p className="text-muted-foreground">Status</p><p className="font-medium capitalize">{selectedShipment.status.replace(/_/g, ' ')}</p></div>
                    <div><p className="text-muted-foreground">Origin</p><p className="font-medium">{selectedShipment.origin}</p></div>
                    <div><p className="text-muted-foreground">Destination</p><p className="font-medium">{selectedShipment.destination}</p></div>
                  </div>
                  <ShipmentTimeline currentStatus={selectedShipment.status} />
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Footer />
    </div>
  );
}
