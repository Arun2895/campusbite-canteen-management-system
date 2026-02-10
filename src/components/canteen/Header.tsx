import { ShoppingCart, User, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ProfileMenu } from './ProfileMenu';

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const { itemCount } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <header className="sticky top-0 z-40 glass border-b" role="banner">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-smooth hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Utensils className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-xl font-semibold">
            Campus<span className="text-primary">Bites</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Main navigation">
          <div className="relative" ref={ref}>
            {user ? (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="User profile"
                onClick={() => setOpen((s) => !s)}
              >
                <User className="h-5 w-5" aria-hidden="true" />
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="icon" aria-label="Sign in">
                  <User className="h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
            )}

            {open && <ProfileMenu onClose={() => setOpen(false)} />}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onCartClick}
            aria-label={`Shopping cart with ${itemCount} items`}
          >
            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
            {itemCount > 0 && (
              <Badge 
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-scale-in"
                aria-hidden="true"
              >
                {itemCount}
              </Badge>
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}
