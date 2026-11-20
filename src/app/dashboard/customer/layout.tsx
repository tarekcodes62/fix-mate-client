'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarDays, UserRound, Wrench } from 'lucide-react';

const menuItems = [
  {
    label: 'Overview',
    href: '/dashboard/customer',
    icon: LayoutDashboard,
  },
  {
    label: 'My Bookings',
    href: '/dashboard/customer/bookings',
    icon: CalendarDays,
  },
  {
    label: 'Update Profile',
    href: '/dashboard/profile',
    icon: UserRound,
  },
];

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full border-b border-border bg-card p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
          <Link
            href="/"
            className="mb-6 flex items-center gap-2 text-xl font-bold"
          >
            <span className="rounded-lg bg-blue-600 p-2 text-white">
              <Wrench size={20} />
            </span>
            <span>
              Fix<span className="text-blue-600">Mate</span>
            </span>
          </Link>

          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Customer Menu
          </p>

          <nav className="flex flex-wrap gap-2 md:flex-col">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="min-w-0 flex-1">
          <header className="flex h-16 items-center justify-between border-b border-border bg-card px-5 sm:px-8">
            <div>
              <h2 className="font-semibold">Customer Dashboard</h2>
              <p className="text-xs text-muted-foreground">
                Manage your repair bookings
              </p>
            </div>

            <Link
              href="/"
              className="text-sm font-medium text-blue-600 transition hover:text-blue-700"
            >
              Back to Home
            </Link>
          </header>

          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
