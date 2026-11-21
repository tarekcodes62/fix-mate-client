'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyPayment } from '@/lib/api/bookings';
import { authClient } from '@/lib/auth-client';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        if (!sessionId) {
          throw new Error('Session ID not found');
        }

        const { data } = await authClient.token();

        if (!data?.token) {
          throw new Error('Authentication token not found');
        }

        await verifyPayment(sessionId, data.token);

        setSuccess(true);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Payment verification failed',
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p>Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border p-8 text-center shadow-sm">
        {success ? (
          <>
            <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />

            <h1 className="text-2xl font-bold">Payment Successful!</h1>

            <p className="mt-3 text-muted-foreground">
              Your payment has been completed successfully.
            </p>

            <Link
              href="/dashboard/customer/my-bookings"
              className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground"
            >
              Back to My Bookings
            </Link>
          </>
        ) : (
          <>
            <XCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />

            <h1 className="text-2xl font-bold">Payment Verification Failed</h1>

            <p className="mt-3 text-muted-foreground">{error}</p>

            <Link
              href="/dashboard/my-bookings"
              className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-primary-foreground"
            >
              Back to My Bookings
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
