type PageSkeletonProps = {
  variant?: 'services' | 'dashboard';
};

export default function PageSkeleton({
  variant = 'services',
}: PageSkeletonProps) {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse px-6 py-10">
      {/* Page Heading */}
      <div className="mb-8 space-y-3">
        <div className="h-8 w-48 rounded-lg bg-muted" />
        <div className="h-4 w-72 max-w-full rounded-md bg-muted" />
      </div>

      {variant === 'services' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="h-48 w-full bg-muted" />
              <div className="space-y-4 p-5">
                <div className="h-5 w-3/4 rounded-md bg-muted" />
                <div className="h-4 w-1/2 rounded-md bg-muted" />
                <div className="h-4 w-full rounded-md bg-muted" />
                <div className="h-10 w-full rounded-lg bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="space-y-4 rounded-2xl border border-border bg-card p-5"
              >
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-8 w-20 rounded bg-muted" />
                <div className="h-3 w-32 rounded bg-muted" />
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-6 h-5 w-40 rounded bg-muted" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                  </div>
                  <div className="h-7 w-20 rounded-md bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
