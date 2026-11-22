import PageLoader from '@/components/shared/page-loader';
// import PageSkeleton from '@/components/shared/page-skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex justify-center items-center">
      <PageLoader message="Finding the right services for you..." />
      {/* <PageSkeleton variant="services" /> */}
    </div>
  );
}
