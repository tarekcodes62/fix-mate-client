import Link from 'next/link';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
import { getFeaturedServices } from '@/lib/api/services';

const FeaturedServices = async () => {
  const services = await getFeaturedServices();

  return (
    <section className="bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
              REPAIR SERVICES
            </p>

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Featured Services
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Find the right repair service for your device from our trusted
              technicians.
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:gap-3 dark:text-blue-400"
          >
            View All Services
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Services Grid */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(service => (
              <div
                key={service._id}
                className="overflow-hidden rounded-xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Service Image */}
                <div className="relative h-52 overflow-hidden bg-muted">
                  <Image
                    height={200}
                    width={200}
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
                    {service.category}
                  </span>
                </div>

                {/* Service Content */}
                <div className="p-5">
                  <h3 className="line-clamp-1 text-lg font-semibold">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Technician: {service.technicianName}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={14} />
                      {service.estimatedDuration}
                    </span>

                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} />
                      {service.serviceMode}
                    </span>
                  </div>

                  {/* Price & Details */}
                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Starting from
                      </p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        ৳{service.basePrice}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      Details
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card px-6 py-16 text-center">
            <h3 className="text-lg font-semibold">No Featured Services Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              New repair services will appear here soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedServices;
