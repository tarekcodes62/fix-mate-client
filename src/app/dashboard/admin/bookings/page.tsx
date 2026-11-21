'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';
import { AdminBooking, getAllBookings } from '@/lib/api/admin';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const bookingStatuses = [
  'requested',
  'accepted',
  'rejected',
  'in-progress',
  'completed',
  'cancelled',
];

export default function AdminBookingsPage() {
  const { data: session } = authClient.useSession();

  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      if (!session) return;

      try {
        setLoading(true);

        const tokenResult = await authClient.token();
        const token = tokenResult.data?.token;

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const data = await getAllBookings(token, status, paymentStatus);

        setBookings(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to load bookings',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [session, status, paymentStatus]);

  const getStatusClass = (value: string) => {
    switch (value) {
      case 'completed':
      case 'accepted':
      case 'paid':
        return 'bg-green-100 text-green-700';

      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-700';

      case 'in-progress':
        return 'bg-blue-100 text-blue-700';

      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <p className="text-sm text-muted-foreground">
          View and monitor all customer bookings.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="space-y-2">
          <label className="text-sm font-medium">Booking Status</label>

          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm sm:w-52"
          >
            <option value="">All Statuses</option>

            {bookingStatuses.map(item => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Status</label>

          <select
            value={paymentStatus}
            onChange={e => setPaymentStatus(e.target.value)}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm sm:w-52"
          >
            <option value="">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Preferred Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Loading bookings...
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map(booking => (
                <TableRow key={booking._id}>
                  <TableCell className="font-medium">
                    {booking.serviceTitle}
                    <p className="text-xs text-muted-foreground">
                      {booking.category}
                    </p>
                  </TableCell>

                  <TableCell>
                    <p>{booking.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.customerEmail}
                    </p>
                  </TableCell>

                  <TableCell>
                    <p>{booking.technicianName}</p>
                    <p className="text-xs text-muted-foreground">
                      {booking.technicianEmail}
                    </p>
                  </TableCell>

                  <TableCell>{booking.preferredDate}</TableCell>

                  <TableCell>${booking.finalAmount}</TableCell>

                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(
                        booking.paymentStatus,
                      )}`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClass(
                        booking.status,
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
