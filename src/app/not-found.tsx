import Link from 'next/link';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg text-center">
        {/* Illustration */}
        <div className="relative mx-auto mb-8 flex h-56 w-56 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/5" />
          <div className="absolute inset-5 rounded-full border-2 border-dashed border-primary/20" />

          <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl border bg-card shadow-xl">
            <Search className="h-16 w-16 text-primary" />
            <span className="absolute -right-3 -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive text-lg font-bold text-white shadow-lg">
              ?
            </span>
          </div>

          <span className="absolute bottom-7 left-5 h-3 w-3 rounded-full bg-primary/40" />
          <span className="absolute right-7 top-8 h-4 w-4 rounded-full bg-primary/30" />
        </div>

        {/* Content */}
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-primary">
          Error 404
        </p>

        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Oops! Page Not Found
        </h1>

        <p className="mx-auto mb-8 max-w-md text-sm leading-7 text-muted-foreground sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Let&apos;s get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Services
          </Link>
        </div>

        <p className="mt-12 text-xs text-muted-foreground">
          © {new Date().getFullYear()} FixMate. All rights reserved.
        </p>
      </div>
    </main>
  );
}
