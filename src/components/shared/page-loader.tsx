import { Wrench } from 'lucide-react';

type PageLoaderProps = {
  message?: string;
};

export default function PageLoader({
  message = 'Preparing FixMate...',
}: PageLoaderProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center bg-background px-4">
      <div className="relative mb-7 flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-2xl bg-blue-600/10" />

        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          <Wrench size={30} className="animate-pulse" />
        </div>

        <div className="absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full border-2 border-background bg-blue-500" />
      </div>

      <h2 className="text-xl font-bold tracking-tight">
        Fix<span className="text-blue-600">Mate</span>
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">{message}</p>

      <div className="mt-6 h-1.5 w-40 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-blue-600" />
      </div>
    </div>
  );
}
