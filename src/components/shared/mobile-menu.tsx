'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LayoutDashboard, LogOut, Menu, Wrench } from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type User = {
  name: string;
  email: string;
  image?: string | null;
  role?: string;
};

type Props = {
  user: User | null;
};

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'About', href: '/about' },
];

const MobileMenu = ({ user }: Props) => {
  const [open, setOpen] = useState(false);

  const dashboardLink =
    user?.role === 'admin'
      ? '/dashboard/admin'
      : user?.role === 'technician'
        ? '/dashboard/technician'
        : '/dashboard/customer';

  const closeMenu = () => setOpen(false);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="flex h-9 w-9 items-center justify-center rounded-md border hover:bg-muted md:hidden">
        <Menu className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent side="right" className="w-70">
        <div className="flex flex-col gap-6 pt-6">
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Wrench className="h-5 w-5" />
            </span>

            <span className="text-xl font-bold">
              Fix<span className="text-emerald-600">Mate</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="border-t pt-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="px-3">
                  <p className="font-medium">{user.name}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                  <p className="mt-1 text-xs capitalize text-emerald-600">
                    {user.role || 'customer'}
                  </p>
                </div>

                <Link
                  href={dashboardLink}
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm text-red-500 hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/sign-in"
                  onClick={closeMenu}
                  className="rounded-md border px-4 py-2 text-center text-sm font-medium hover:bg-muted"
                >
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenu}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
