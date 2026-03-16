import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import KpiCard from '@/components/KpiCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Package, Truck, Users, Car, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Shipment {
  id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  status: string;
  customer_id: string | null;
  driver_id: string | null;
  vehicle_id: string | null;
  created_at: string;
  weight: string | null;
  recipient_name: string | null;
}

interface Driver {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  license_number: string | null;
  status: string;
}

interface Vehicle {
  id: string;
  plate_number: string;
  type: string;
  capacity: string | null;
  status: string;
}

const STATUS_OPTIONS = ['pending', 'processing', 'in_transit', 'arrived_at_hub', 'out_for_delivery', 'delivered'];
const PIE_COLORS = ['hsl(24,95%,53%)', 'hsl(217,33%,17%)', 'hsl(160,84%,39%)', 'hsl(215,16%,47%)', 'hsl(0,84%,60%)', 'hsl(210,20%,80%)'];

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Driver form
  const [driverDialogOpen, setDriverDialogOpen] = useState(false);
  const [driverForm, setDriverForm] = useState({ name: '', phone: '', email: '', license_number: '' });

  // Vehicle form
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
  const [vehicleForm, setVehicleForm] = useState({ plate_number: '', type: '', capacity: '' });

  // Status update
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
      return;
    }
    if (user && isAdmin) {
      fetchAll();
      // Real-time
      const channel = supabase
        .channel('admin-shipments')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'shipments' }, () => {
          fetchShipments();
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [user, isAdmin, authLoading]);

  const fetchAll = async () => {
    await Promise.all([fetchShipments(), fetchDrivers(), fetchVehicles()]);
    setLoading(false);
  };

  const fetchShipments = async () => {
    const { data } = await supabase.from('shipments').select('*').order('created_at', { ascending: false });
    setShipments((data as Shipment[]) || []);
  };

  const fetchDrivers = async () => {
    const { data } = await supabase.from('drivers').select('*').order('name');
    setDrivers((data as Driver[]) || []);
  };

  const fetchVehicles = async () => {
    const { data } = await supabase.from('vehicles').select('*').order('plate_number');
    setVehicles((data as Vehicle[]) || []);
  };

  const handleUpdateStatus = async () => {
    if (!selectedShipment || !newStatus) return;
    const updateData: any = { status: newStatus };
    if (newStatus === 'delivered') updateData.delivered_at = new Date().toISOString();
    const { error } = await supabase.from('shipments').update(updateData).eq('id', selectedShipment.id);
    if (error) toast.error('Failed to update status');
    else { toast.success('Status updated'); setStatusDialogOpen(false); fetchShipments(); }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('drivers').insert(driverForm);
    if (error) toast.error('Failed to add driver');
    else { toast.success('Driver added'); setDriverDialogOpen(false); setDriverForm({ name: '', phone: '', email: '', license_number: '' }); fetchDrivers(); }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('vehicles').insert(vehicleForm);
    if (error) toast.error('Failed to add vehicle');
    else { toast.success('Vehicle added'); setVehicleDialogOpen(false); setVehicleForm({ plate_number: '', type: '', capacity: '' }); fetchVehicles(); }
  };

  const handleAssign = async (shipmentId: string, field: 'driver_id' | 'vehicle_id', value: string) => {
    const { error } = await supabase.from('shipments').update({ [field]: value }).eq('id', shipmentId);
    if (error) toast.error('Failed to assign');
    else { toast.success('Assigned successfully'); fetchShipments(); }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex flex-col"><Navbar /><div className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div></div>;
  }

  const statusCounts = STATUS_OPTIONS.map(s => ({ name: s.replace(/_/g, ' '), value: shipments.filter(sh => sh.status === s).length }));
  const active = shipments.filter(s => !['delivered', 'cancelled'].includes(s.status)).length;
  const delayed = 0; // Could be computed from estimated_delivery
  const delivered = shipments.filter(s => s.status === 'delivered').length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-display font-bold mb-6">Admin Dashboard</h1>

          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KpiCard title="Total Shipments" value={shipments.length} icon={Package} />
            <KpiCard title="Active" value={active} icon={Truck} variant="accent" />
            <KpiCard title="Delivered" value={delivered} icon={CheckCircle2} variant="success" />
            <KpiCard title="Drivers" value={drivers.length} icon={Users} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-card border rounded-lg p-5">
              <h3 className="font-display font-semibold mb-4">Shipments by Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusCounts}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(24,95%,53%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card border rounded-lg p-5">
              <h3 className="font-display font-semibold mb-4">Status Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusCounts.filter(s => s.value > 0)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {statusCounts.filter(s => s.value > 0).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Tabs defaultValue="shipments" className="space-y-4">
            <TabsList>
              <TabsTrigger value="shipments">Shipments</TabsTrigger>
              <TabsTrigger value="drivers">Drivers</TabsTrigger>
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            </TabsList>

            {/* Shipments tab */}
            <TabsContent value="shipments">
              <div className="bg-card border rounded-lg overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-3 font-display font-semibold">Tracking #</th>
                      <th className="text-left p-3 font-display font-semibold">Route</th>
                      <th className="text-left p-3 font-display font-semibold">Status</th>
                      <th className="text-left p-3 font-display font-semibold">Driver</th>
                      <th className="text-left p-3 font-display font-semibold">Vehicle</th>
                      <th className="p-3 font-display font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipments.map(s => (
                      <tr key={s.id} className="border-t hover:bg-secondary/50 transition-colors">
                        <td className="p-3 font-mono font-medium">{s.tracking_number}</td>
                        <td className="p-3">{s.origin} → {s.destination}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            s.status === 'delivered' ? 'bg-success/10 text-success' :
                            s.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                            'bg-accent/10 text-accent'
                          }`}>{s.status.replace(/_/g, ' ').toUpperCase()}</span>
                        </td>
                        <td className="p-3">
                          <Select value={s.driver_id || ''} onValueChange={v => handleAssign(s.id, 'driver_id', v)}>
                            <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Assign" /></SelectTrigger>
                            <SelectContent>{drivers.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <Select value={s.vehicle_id || ''} onValueChange={v => handleAssign(s.id, 'vehicle_id', v)}>
                            <SelectTrigger className="h-8 w-32"><SelectValue placeholder="Assign" /></SelectTrigger>
                            <SelectContent>{vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.plate_number}</SelectItem>)}</SelectContent>
                          </Select>
                        </td>
                        <td className="p-3 text-center">
                          <Button variant="accent" size="sm" onClick={() => { setSelectedShipment(s); setNewStatus(s.status); setStatusDialogOpen(true); }}>
                            Update
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {shipments.length === 0 && <p className="text-center text-muted-foreground py-8">No shipments yet.</p>}
              </div>
            </TabsContent>

            {/* Drivers tab */}
            <TabsContent value="drivers">
              <div className="flex justify-end mb-4">
                <Dialog open={driverDialogOpen} onOpenChange={setDriverDialogOpen}>
                  <DialogTrigger asChild><Button variant="accent">Add Driver</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add Driver</DialogTitle></DialogHeader>
                    <form onSubmit={handleAddDriver} className="space-y-4 mt-4">
                      <div><Label>Name *</Label><Input value={driverForm.name} onChange={e => setDriverForm({ ...driverForm, name: e.target.value })} required /></div>
                      <div><Label>Phone</Label><Input value={driverForm.phone} onChange={e => setDriverForm({ ...driverForm, phone: e.target.value })} /></div>
                      <div><Label>Email</Label><Input value={driverForm.email} onChange={e => setDriverForm({ ...driverForm, email: e.target.value })} /></div>
                      <div><Label>License #</Label><Input value={driverForm.license_number} onChange={e => setDriverForm({ ...driverForm, license_number: e.target.value })} /></div>
                      <Button type="submit" variant="accent" className="w-full">Add Driver</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="bg-card border rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-3 font-display font-semibold">Name</th>
                      <th className="text-left p-3 font-display font-semibold">Phone</th>
                      <th className="text-left p-3 font-display font-semibold">Email</th>
                      <th className="text-left p-3 font-display font-semibold">License</th>
                      <th className="text-left p-3 font-display font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map(d => (
                      <tr key={d.id} className="border-t hover:bg-secondary/50 transition-colors">
                        <td className="p-3 font-medium">{d.name}</td>
                        <td className="p-3">{d.phone || '-'}</td>
                        <td className="p-3">{d.email || '-'}</td>
                        <td className="p-3 font-mono">{d.license_number || '-'}</td>
                        <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-semibold ${
                          d.status === 'available' ? 'bg-success/10 text-success' : d.status === 'on_trip' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                        }`}>{d.status.replace(/_/g, ' ').toUpperCase()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {drivers.length === 0 && <p className="text-center text-muted-foreground py-8">No drivers yet.</p>}
              </div>
            </TabsContent>

            {/* Vehicles tab */}
            <TabsContent value="vehicles">
              <div className="flex justify-end mb-4">
                <Dialog open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
                  <DialogTrigger asChild><Button variant="accent">Add Vehicle</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add Vehicle</DialogTitle></DialogHeader>
                    <form onSubmit={handleAddVehicle} className="space-y-4 mt-4">
                      <div><Label>Plate Number *</Label><Input value={vehicleForm.plate_number} onChange={e => setVehicleForm({ ...vehicleForm, plate_number: e.target.value })} required /></div>
                      <div><Label>Type *</Label><Input value={vehicleForm.type} onChange={e => setVehicleForm({ ...vehicleForm, type: e.target.value })} placeholder="e.g. Van, Truck" required /></div>
                      <div><Label>Capacity</Label><Input value={vehicleForm.capacity} onChange={e => setVehicleForm({ ...vehicleForm, capacity: e.target.value })} placeholder="e.g. 5 tons" /></div>
                      <Button type="submit" variant="accent" className="w-full">Add Vehicle</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="bg-card border rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left p-3 font-display font-semibold">Plate #</th>
                      <th className="text-left p-3 font-display font-semibold">Type</th>
                      <th className="text-left p-3 font-display font-semibold">Capacity</th>
                      <th className="text-left p-3 font-display font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map(v => (
                      <tr key={v.id} className="border-t hover:bg-secondary/50 transition-colors">
                        <td className="p-3 font-mono font-medium">{v.plate_number}</td>
                        <td className="p-3">{v.type}</td>
                        <td className="p-3">{v.capacity || '-'}</td>
                        <td className="p-3"><span className={`px-2 py-1 rounded text-xs font-semibold ${
                          v.status === 'available' ? 'bg-success/10 text-success' : v.status === 'in_use' ? 'bg-accent/10 text-accent' : 'bg-destructive/10 text-destructive'
                        }`}>{v.status.replace(/_/g, ' ').toUpperCase()}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {vehicles.length === 0 && <p className="text-center text-muted-foreground py-8">No vehicles yet.</p>}
              </div>
            </TabsContent>
          </Tabs>

          {/* Status update dialog */}
          <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
            <DialogContent>
              <DialogHeader><DialogTitle>Update Shipment Status</DialogTitle></DialogHeader>
              {selectedShipment && (
                <div className="space-y-4 mt-4">
                  <p className="text-sm text-muted-foreground">Tracking: <span className="font-mono font-medium text-foreground">{selectedShipment.tracking_number}</span></p>
                  <div>
                    <Label>New Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="accent" className="w-full" onClick={handleUpdateStatus}>Update Status</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
