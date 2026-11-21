import { getServiceById } from '@/lib/api/services';
import RepairRequestDialog from '@/components/services/repair-request-dialog';
import Link from 'next/link';
import { ArrowLeft, Clock, MapPin, UserRound } from 'lucide-react';
import Image from 'next/image';

type Props = {
  params: Promise<{ id: string }>;
};

const ServiceDetailsPage = async ({ params }: Props) => {
  const { id } = await params;

  let service;

  try {
    service = await getServiceById(id);
  } catch {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-background px-4 text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Service Not Found</h1>

          <p className="mt-2 text-muted-foreground">
            This service is unavailable or could not be found.
          </p>

          <Link
            href="/services"
            className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/services"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Services
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Service Image */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <Image
              width={200}
              height={200}
              src={service.image}
              alt={service.title}
              className="h-full min-h-75 max-h-130 w-full object-cover"
            />
          </div>

          {/* Service Information */}
          <div className="flex flex-col">
            <span className="w-fit rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              {service.category}
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {service.title}
            </h1>

            <p className="mt-4 leading-7 text-muted-foreground">
              {service.description}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-4">
                <Clock className="text-blue-600 dark:text-blue-400" size={20} />
                <p className="mt-3 text-sm text-muted-foreground">Duration</p>
                <p className="mt-1 font-semibold">
                  {service.estimatedDuration}
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <MapPin
                  className="text-blue-600 dark:text-blue-400"
                  size={20}
                />
                <p className="mt-3 text-sm text-muted-foreground">
                  Service Mode
                </p>
                <p className="mt-1 font-semibold">{service.serviceMode}</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <UserRound
                  className="text-blue-600 dark:text-blue-400"
                  size={20}
                />
                <p className="mt-3 text-sm text-muted-foreground">Technician</p>
                <p className="mt-1 font-semibold">{service.technicianName}</p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <MapPin
                  className="text-blue-600 dark:text-blue-400"
                  size={20}
                />
                <p className="mt-3 text-sm text-muted-foreground">
                  Service Area
                </p>
                <p className="mt-1 font-semibold">
                  {service.serviceArea || 'Not specified'}
                </p>
              </div>
            </div>

            {/* Price and Booking */}
            <div className="mt-8 rounded-xl border border-border bg-card p-5">
              <p className="text-sm text-muted-foreground">Starting Price</p>

              <p className="mt-1 text-3xl font-bold text-blue-600 dark:text-blue-400">
                ${service.basePrice.toFixed(2)} USD
              </p>

              <RepairRequestDialog
                serviceId={service._id}
                basePrice={service.basePrice}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ServiceDetailsPage;
