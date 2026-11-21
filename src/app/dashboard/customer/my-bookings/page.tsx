'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';
import {
  cancelBooking,
  createCheckoutSession,
  getMyBookings,
  type Booking,
} from '@/lib/api/bookings';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

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

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);

      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error('Authentication token not found');
      }

      await cancelBooking(bookingId, tokenData.token);

      setBookings(prev =>
        prev.map(booking =>
          booking._id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking,
        ),
      );

      toast.success('Booking cancelled successfully');
    } catch (error) {
      console.error('Cancel booking error:', error);

      toast.error(
        error instanceof Error ? error.message : 'Failed to cancel booking',
      );
    } finally {
      setCancellingId(null);
    }
  };

  const handlePayment = async (bookingId: string) => {
    try {
      setPayingId(bookingId);

      const { data: tokenData, error } = await authClient.token();

      if (error || !tokenData?.token) {
        throw new Error('Authentication token not found');
      }

      const checkoutUrl = await createCheckoutSession(
        bookingId,
        tokenData.token,
      );

      window.open(checkoutUrl, '_self');
    } catch (error) {
      console.error('Payment error:', error);

      toast.error(
        error instanceof Error ? error.message : 'Failed to start payment',
      );

      setPayingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'requested':
        return 'bg-yellow-500/10 text-yellow-600';
      case 'accepted':
        return 'bg-blue-500/10 text-blue-600';
      case 'in-progress':
        return 'bg-purple-500/10 text-purple-600';
      case 'completed':
        return 'bg-green-500/10 text-green-600';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-500/10 text-red-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold sm:text-3xl">My Bookings</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          View and manage all your repair service bookings.
        </p>
      </section>

      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-5">
        <div className="rounded-lg bg-blue-600/10 p-3 text-blue-600">
          <ClipboardList size={24} />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Total Bookings</p>

          <h2 className="text-2xl font-bold">
            {loading ? '...' : bookings.length}
          </h2>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-semibold">All Bookings</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your repair service request history
          </p>
        </div>

        {loading ? (
          <div className="space-y-4 p-5">
            {[1, 2, 3].map(item => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
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
          <div className="divide-y divide-border">
            {bookings.map(booking => (
              <div
                key={booking._id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {booking.serviceImage && (
                      <Image
                        src={booking.serviceImage}
                        alt={booking.serviceTitle}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold">{booking.serviceTitle}</h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Technician: {booking.technicianName}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Preferred Date: {booking.preferredDate}
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      ${booking.finalAmount.toFixed(2)} USD
                    </p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(booking.status)}`}
                  >
                    {booking.status.replace('-', ' ')}
                  </span>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Payment: {booking.paymentStatus}
                  </p>

                  {booking.status === 'completed' &&
                    booking.paymentStatus === 'unpaid' && (
                      <div>
                        <Button
                          size="sm"
                          className="mt-3"
                          disabled={payingId === booking._id}
                          onClick={() => handlePayment(booking._id)}
                        >
                          {payingId === booking._id
                            ? 'Redirecting...'
                            : 'Pay Now'}
                        </Button>
                      </div>
                    )}

                  {booking.status === 'requested' && (
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-3"
                          disabled={cancellingId === booking._id}
                        >
                          Cancel Booking
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>

                          <AlertDialogDescription>
                            Are you sure you want to cancel this booking? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Booking</AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() => handleCancelBooking(booking._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, Cancel Booking
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyBookingsPage;
