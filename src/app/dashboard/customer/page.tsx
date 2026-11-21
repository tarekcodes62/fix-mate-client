'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  ClipboardList,
  ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';
import { Booking, getMyBookings } from '@/lib/api/bookings';

export default function CustomerDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch customer bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data: tokenData, error } = await authClient.token();

        if (error || !tokenData?.token) {
          throw new Error('Authentication token not found');
        }

        const data = await getMyBookings(tokenData.token);

        setBookings(data);
      } catch (error) {
        console.error('Fetch bookings error:', error);
        toast.error(
          error instanceof Error ? error.message : 'Failed to fetch bookings',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Calculate booking statistics
  const totalBookings = bookings.length;

  const requestedBookings = bookings.filter(
    booking => booking.status === 'requested',
  ).length;

  const activeBookings = bookings.filter(
    booking =>
      booking.status === 'accepted' || booking.status === 'in-progress',
  ).length;

  const completedBookings = bookings.filter(
    booking => booking.status === 'completed',
  ).length;

  const overviewCards = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: ClipboardList,
      description: 'All your repair bookings',
    },
    {
      title: 'Requested Bookings',
      value: requestedBookings,
      icon: Clock3,
      description: 'Waiting for technician response',
    },
    {
      title: 'Active Bookings',
      value: activeBookings,
      icon: CalendarDays,
      description: 'Currently in progress',
    },
    {
      title: 'Completed Bookings',
      value: completedBookings,
      icon: CheckCircle2,
      description: 'Successfully completed',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <h1 className="text-2xl font-bold sm:text-3xl">
          Welcome to Your Dashboard!
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Track your repair requests and manage your bookings from here.
        </p>
      </section>

      {/* Overview Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map(item => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </p>

                <div className="rounded-lg bg-blue-600/10 p-2.5 text-blue-600">
                  <Icon size={21} />
                </div>
              </div>

              <h2 className="mt-4 text-3xl font-bold">
                {loading ? '...' : item.value}
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                {item.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Recent Bookings */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
          <div>
            <h2 className="text-lg font-semibold">Recent Bookings</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Your latest repair service requests
            </p>
          </div>

          <Link
            href="/dashboard/customer/my-bookings"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4 p-5">
            {[1, 2, 3].map(item => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
            <div className="mb-4 rounded-full bg-blue-600/10 p-4 text-blue-600">
              <CalendarDays size={30} />
            </div>

            <h3 className="font-semibold">No Bookings Yet</h3>

            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              You have not requested any repair services yet. Explore our
              services and book your first repair.
            </p>

            <Link
              href="/services"
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          /* Booking List */
          <div className="divide-y divide-border">
            {bookings.slice(0, 5).map(booking => (
              <div
                key={booking._id}
                className="flex flex-wrap items-center justify-between gap-4 p-5"
              >
                <div>
                  <h3 className="font-semibold">{booking.serviceTitle}</h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Preferred Date: {booking.preferredDate}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Technician: {booking.technicianName}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-600/10 px-3 py-1 text-xs font-medium capitalize text-blue-600">
                    {booking.status}
                  </span>

                  <span className="text-sm font-semibold">
                    ${booking.finalAmount.toFixed(2)} USD
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
