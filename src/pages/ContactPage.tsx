import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().email('Invalid email').max(255),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, 'Message is required').max(2000),
});

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    const { error } = await supabase.from('contact_messages').insert(result.data);
    if (error) {
      toast.error('Failed to send message. Please try again.');
    } else {
      navigate('/thank-you');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-lg">
          <h1 className="text-3xl font-display font-bold text-center mb-2">Contact Us</h1>
          <p className="text-muted-foreground text-center mb-8">Have a question? We're here to help.</p>
          <form onSubmit={handleSubmit} className="bg-card border rounded-lg p-6 space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
            </div>
            <Button type="submit" variant="accent" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
