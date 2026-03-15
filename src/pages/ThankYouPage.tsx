import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold mb-2">Thank You!</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Your message has been sent successfully. Our team will get back to you within 24 hours.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/"><Button variant="default">Back to Home</Button></Link>
            <Link to="/track"><Button variant="accent">Track a Shipment</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
