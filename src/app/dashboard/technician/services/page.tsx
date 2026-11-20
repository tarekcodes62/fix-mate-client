'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { getMyServices, deleteService, Service } from '@/lib/api/services';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

  const handleDelete = async (id: string) => {
    try {
      const { data } = await authClient.token();

      if (!data?.token) {
        toast.error('Please login again');
        return;
      }

      await deleteService(id, data.token);

      setServices(prev => prev.filter(service => service._id !== id));

      toast.success('Service deleted successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete service',
      );
    }
  };

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
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {services.map(service => (
                  <TableRow key={service._id}>
                    <TableCell>
                      <div className="flex min-w-45 items-center gap-3">
                        <Image
                          width={48}
                          height={48}
                          src={service.image}
                          alt={service.title}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                        <div>
                          <p className="font-medium">{service.title}</p>
                          {service.serviceArea && (
                            <p className="text-xs text-muted-foreground">
                              {service.serviceArea}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{service.category}</TableCell>

                    <TableCell className="font-medium">
                      ৳{service.basePrice}
                    </TableCell>

                    <TableCell>{service.estimatedDuration}</TableCell>

                    <TableCell>{service.serviceMode}</TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          service.approvalStatus === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : service.approvalStatus === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {service.approvalStatus}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          service.isAvailable
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {service.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/dashboard/technician/services/edit/${service._id}`}
                          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Edit
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger>
                            <button
                              type="button"
                              className="rounded-md border border-red-500 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete this service?
                              </AlertDialogTitle>

                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;
                                {service.title}&quot;? This action cannot be
                                undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>

                              <AlertDialogAction
                                onClick={() => handleDelete(service._id)}
                                className="bg-red-600 text-white hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
