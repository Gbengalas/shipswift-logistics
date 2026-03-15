import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Package, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
          <Package className="h-6 w-6 text-accent" />
          LogiTrack
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">Home</Link>
          <Link to="/track" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">Track</Link>
          <Link to="/contact" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">Contact</Link>
          {user && (
            <Link to="/dashboard" className="text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors">Dashboard</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">Admin</Link>
          )}
          {user ? (
            <Button variant="accent" size="sm" onClick={handleSignOut}>Sign Out</Button>
          ) : (
            <Link to="/auth">
              <Button variant="accent" size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-primary border-t border-sidebar-border animate-slide-in">
          <div className="flex flex-col gap-2 p-4">
            <Link to="/" onClick={() => setMobileOpen(false)} className="py-2 text-primary-foreground/80 hover:text-primary-foreground">Home</Link>
            <Link to="/track" onClick={() => setMobileOpen(false)} className="py-2 text-primary-foreground/80 hover:text-primary-foreground">Track</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="py-2 text-primary-foreground/80 hover:text-primary-foreground">Contact</Link>
            {user && <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="py-2 text-primary-foreground/80 hover:text-primary-foreground">Dashboard</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="py-2 text-accent">Admin</Link>}
            {user ? (
              <Button variant="accent" size="sm" onClick={() => { handleSignOut(); setMobileOpen(false); }}>Sign Out</Button>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)}>
                <Button variant="accent" size="sm" className="w-full">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
