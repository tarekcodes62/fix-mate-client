import Link from 'next/link';
import { Wrench } from 'lucide-react';

import { getCurrentUser } from '@/lib/auth/session';

import AuthMenu from './auth-menu';
import MobileMenu from './mobile-menu';
import ThemeToggle from './theme-toggle';

const Navbar = async () => {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Wrench className="h-5 w-5" />
          </div>

          <span className="text-xl font-bold">
            Fix<span className="text-blue-600">Mate</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            Home
          </Link>

          <Link
            href="/services"
            className="rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            Services
          </Link>

          <Link
            href="/#how-it-works"
            className="rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            How It Works
          </Link>

          <Link
            href="/about"
            className="rounded-md px-3 py-2 text-sm hover:bg-muted"
          >
            About
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <div className="hidden md:block">
            <AuthMenu user={user} />
          </div>

          <MobileMenu user={user} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
