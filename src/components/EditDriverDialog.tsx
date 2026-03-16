import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Driver {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  license_number: string | null;
  status: string;
}

interface EditDriverDialogProps {
  driver: Driver | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

const DRIVER_STATUSES = ['available', 'on_trip', 'off_duty'];

export default function EditDriverDialog({ driver, open, onOpenChange, onUpdated }: EditDriverDialogProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', license_number: '', status: 'available' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (driver) {
      setForm({
        name: driver.name,
        phone: driver.phone || '',
        email: driver.email || '',
        license_number: driver.license_number || '',
        status: driver.status,
      });
    }
  }, [driver]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!driver) return;
    setLoading(true);
    const { error } = await supabase.from('drivers').update({
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
      license_number: form.license_number || null,
      status: form.status,
    }).eq('id', driver.id);
    if (error) toast.error('Failed to update driver');
    else { toast.success('Driver updated'); onUpdated(); onOpenChange(false); }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Edit Driver</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          <div><Label className="text-xs">Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label className="text-xs">Email</Label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">License #</Label><Input value={form.license_number} onChange={e => setForm({ ...form, license_number: e.target.value })} /></div>
            <div>
              <Label className="text-xs">Status</Label>
              <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DRIVER_STATUSES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, ' ').toUpperCase()}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" variant="accent" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
