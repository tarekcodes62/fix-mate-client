'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { getMyServices, Service } from '@/lib/api/services';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await authClient.token();

        if (!data?.token) {
          toast.error('Please login again');
          return;
        }

        const result = await getMyServices(data.token);
        setServices(result);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to load services',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Services</h1>
        <p className="text-muted-foreground">Manage your services</p>
      </div>

      {services.length === 0 ? (
        <div className="rounded-xl border p-8 text-center">
          <p className="text-muted-foreground">
            You haven&apos;t added any services yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(service => (
            <div
              key={service._id}
              className="overflow-hidden rounded-xl border"
            >
              <Image
                width={200}
                height={200}
                src={service.image}
                alt={service.title}
                className="h-48 w-full object-cover"
              />

              <div className="space-y-3 p-4">
                <h2 className="text-lg font-semibold">{service.title}</h2>

                <p className="text-sm text-muted-foreground">
                  {service.category}
                </p>

                <p className="line-clamp-2 text-sm">{service.description}</p>

                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Price:</span> ৳
                    {service.basePrice}
                  </p>

                  <p>
                    <span className="font-medium">Duration:</span>{' '}
                    {service.estimatedDuration}
                  </p>

                  <p>
                    <span className="font-medium">Mode:</span>{' '}
                    {service.serviceMode}
                  </p>

                  {service.serviceArea && (
                    <p>
                      <span className="font-medium">Area:</span>{' '}
                      {service.serviceArea}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {service.approvalStatus}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      service.isAvailable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {service.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                  <Link
                    href={`/dashboard/technician/services/edit/${service._id}`}
                    className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Edit Service
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
