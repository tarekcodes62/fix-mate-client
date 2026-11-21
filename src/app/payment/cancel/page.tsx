import Link from 'next/link';
import { CircleX } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border p-8 text-center shadow-sm">
        <CircleX className="mx-auto mb-4 h-16 w-16 text-destructive" />

        <h1 className="text-2xl font-bold">Payment Cancelled</h1>

        <p className="mt-3 text-muted-foreground">
          Your payment was cancelled. No payment has been charged. You can try
          again whenever you are ready.
        </p>

        <Link
          href="/dashboard/customer/my-bookings"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground"
        >
          Back to My Bookings
        </Link>
      </div>
    </div>
  );
}
