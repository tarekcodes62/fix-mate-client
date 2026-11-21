import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-10 w-10 text-destructive" />
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-destructive">
          Error 403
        </p>

        <h1 className="mb-3 text-3xl font-bold">Access Denied</h1>

        <p className="mb-8 text-muted-foreground">
          Sorry, you don&apos;t have permission to access this page. Please
          contact the administrator if you think this is a mistake.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <ArrowLeft className="h-4 w-4" />
            My Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
