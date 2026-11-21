'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  getTechnicianBookings,
  updateBookingStatus,
  type Booking,
} from '@/lib/api/bookings';
import { ClipboardList, Phone, MapPin, CalendarDays } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function TechnicianRequestsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [finalAmount, setFinalAmount] = useState('');
  const [completing, setCompleting] = useState(false);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const tokenData = await authClient.token();

        if (!tokenData.data?.token) return;

        const data = await getTechnicianBookings(tokenData.data.token);

        setBookings(data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchBookings();
    }
  }, [session?.user]);

  const handleStatusUpdate = async (
    bookingId: string,
    status: string,
    amount?: number,
  ) => {
    try {
      const tokenData = await authClient.token();
      const token = tokenData.data?.token;

      if (!token) {
        toast.error('Authentication failed');
        return;
      }

      await updateBookingStatus(bookingId, status, token, amount);

      setBookings(prev =>
        prev.map(booking =>
          booking._id === bookingId
            ? {
                ...booking,
                status: status as Booking['status'],
                ...(amount !== undefined && { finalAmount: amount }),
              }
            : booking,
        ),
      );

      toast.success('Booking status updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Something went wrong',
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {loading && (
        <div className="grid gap-5">
          {[1, 2, 3].map(item => (
            <div
              key={item}
              className="animate-pulse rounded-xl border p-5 space-y-4"
            >
              <div className="h-5 w-40 rounded bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
              <div className="h-10 w-28 rounded bg-muted" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <ClipboardList className="h-8 w-8 text-muted-foreground" />
          </div>

          <h3 className="text-lg font-semibold">No Repair Requests Yet</h3>

          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            When customers book your services, their repair requests will appear
            here.
          </p>
        </div>
      )}

      {/* Booking Requests */}
      {!loading && bookings.length > 0 && (
        <div className="space-y-5">
          {bookings.map(booking => (
            <div
              key={booking._id}
              className="overflow-hidden rounded-xl border bg-card"
            >
              {/* Card Header */}
              <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {booking.serviceTitle}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {booking.category}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    booking.status === 'requested'
                      ? 'bg-amber-100 text-amber-700'
                      : booking.status === 'accepted'
                        ? 'bg-blue-100 text-blue-700'
                        : booking.status === 'in-progress'
                          ? 'bg-purple-100 text-purple-700'
                          : booking.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {booking.status.replace('-', ' ')}
                </span>
              </div>

              {/* Card Body */}
              <div className="grid gap-5 p-5 md:grid-cols-[180px_1fr]">
                {/* Service Image */}
                <div className="overflow-hidden rounded-lg">
                  <Image
                    width={200}
                    height={200}
                    src={booking.serviceImage}
                    alt={booking.serviceTitle}
                    className="h-44 w-full object-cover md:h-full"
                  />
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  {/* Customer */}
                  <div>
                    <h3 className="font-semibold">{booking.customerName}</h3>

                    <a
                      href={`tel:${booking.customerPhone}`}
                      className="mt-1 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Phone className="h-4 w-4" />
                      {booking.customerPhone}
                    </a>
                  </div>

                  {/* Date & Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Preferred Date
                      </p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                        {new Date(booking.preferredDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Base Price
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        ${booking.basePrice.toFixed(2)} USD
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Customer Address
                    </p>
                    <p className="mt-1 flex items-start gap-2 text-sm">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      {booking.address}
                    </p>
                  </div>

                  {/* Problem Description */}
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                      Problem Description
                    </p>
                    <p className="text-sm leading-relaxed">
                      {booking.problemDescription}
                    </p>
                  </div>

                  {/* Actions */}
                  {booking.status === 'requested' && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button
                        onClick={() =>
                          handleStatusUpdate(booking._id, 'accepted')
                        }
                      >
                        Accept Request
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() =>
                          handleStatusUpdate(booking._id, 'rejected')
                        }
                      >
                        Reject
                      </Button>
                    </div>
                  )}

                  {booking.status === 'accepted' && (
                    <div className="pt-2">
                      <Button
                        onClick={() =>
                          handleStatusUpdate(booking._id, 'in-progress')
                        }
                      >
                        Start Repair
                      </Button>
                    </div>
                  )}

                  {/* Complete Repair */}
                  {booking.status === 'in-progress' && (
                    <div className="pt-2">
                      <Button
                        onClick={() => {
                          setSelectedBookingId(booking._id);
                          setFinalAmount('');
                        }}
                      >
                        Complete Repair
                      </Button>
                    </div>
                  )}

                  {/* Final Amount Dialog */}
                  <Dialog
                    open={selectedBookingId === booking._id}
                    onOpenChange={open => {
                      if (!open) {
                        setSelectedBookingId(null);
                        setFinalAmount('');
                      }
                    }}
                  >
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Complete Repair</DialogTitle>
                        <DialogDescription>
                          Enter the final amount for this repair before
                          completing the booking.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Final Amount ($)
                        </label>

                        <Input
                          type="number"
                          min="1"
                          placeholder="Enter final amount"
                          value={finalAmount}
                          onChange={e => setFinalAmount(e.target.value)}
                        />
                      </div>

                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedBookingId(null);
                            setFinalAmount('');
                          }}
                          disabled={completing}
                        >
                          Cancel
                        </Button>

                        <Button
                          disabled={
                            !finalAmount ||
                            Number(finalAmount) <= 0 ||
                            completing
                          }
                          onClick={async () => {
                            if (
                              !selectedBookingId ||
                              Number(finalAmount) <= 0
                            ) {
                              return;
                            }

                            setCompleting(true);

                            await handleStatusUpdate(
                              selectedBookingId,
                              'completed',
                              Number(finalAmount),
                            );

                            setCompleting(false);
                            setSelectedBookingId(null);
                            setFinalAmount('');
                          }}
                        >
                          {completing ? 'Completing...' : 'Confirm Completion'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
