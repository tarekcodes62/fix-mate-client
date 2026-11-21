'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  getMyServices,
  deleteService,
  toggleServiceAvailability,
  Service,
} from '@/lib/api/services';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import {
  Pencil,
  Trash2,
  Loader2,
  MapPin,
  Clock,
  Plus,
  Wrench,
} from 'lucide-react';

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
  const [togglingId, setTogglingId] = useState<string | null>(null);

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

  const handleAvailabilityToggle = async (service: Service) => {
    try {
      setTogglingId(service._id);

      const { data } = await authClient.token();

      if (!data?.token) {
        toast.error('Please login again');
        return;
      }

      const newAvailability = !service.isAvailable;

      await toggleServiceAvailability(service._id, newAvailability, data.token);

      setServices(prev =>
        prev.map(item =>
          item._id === service._id
            ? { ...item, isAvailable: newAvailability }
            : item,
        ),
      );

      toast.success(
        `Service ${newAvailability ? 'available' : 'unavailable'} successfully`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update availability',
      );
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="overflow-hidden rounded-2xl border bg-card">
          <div className="space-y-4 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="h-14 w-14 animate-pulse rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage, update and control your service listings.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Wrench className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Services</p>
            <p className="text-lg font-bold leading-tight">{services.length}</p>
          </div>
        </div>
      </div>

      {/* Services Table */}
      {services.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-6 py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Wrench className="h-6 w-6" />
          </div>

          <h3 className="text-lg font-semibold">No services yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            You haven&apos;t added any services yet. Create your first service
            to start receiving booking requests.
          </p>

          <Link
            href="/dashboard/technician/services/add"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add New Service
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
          {/* Table Top */}
          <div className="flex flex-col gap-1 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold">Service Listings</h2>
              <p className="text-sm text-muted-foreground">
                Your services and their current status
              </p>
            </div>

            <p className="text-xs text-muted-foreground">
              {services.length} {services.length === 1 ? 'service' : 'services'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="min-w-[250px] py-4 pl-5">
                    Service
                  </TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead className="pr-5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {services.map(service => (
                  <TableRow
                    key={service._id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    {/* Service Info */}
                    <TableCell className="py-4 pl-5">
                      <div className="flex min-w-[230px] items-center gap-3">
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-muted">
                          <Image
                            width={56}
                            height={56}
                            src={service.image}
                            alt={service.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[200px] truncate text-sm font-semibold">
                            {service.title}
                          </p>

                          {service.serviceArea && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                {service.serviceArea}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      <span className="inline-flex rounded-lg bg-muted px-2.5 py-1 text-xs font-medium">
                        {service.category}
                      </span>
                    </TableCell>

                    {/* Price */}
                    <TableCell>
                      <div className="font-semibold">
                        ${service.basePrice.toFixed(2)} USD
                      </div>
                    </TableCell>

                    {/* Duration */}
                    <TableCell>
                      <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {service.estimatedDuration}
                      </span>
                    </TableCell>

                    {/* Mode */}
                    <TableCell>
                      <span className="text-sm capitalize">
                        {service.serviceMode}
                      </span>
                    </TableCell>

                    {/* Approval Status */}
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                          service.approvalStatus === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : service.approvalStatus === 'rejected'
                              ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {service.approvalStatus}
                      </span>
                    </TableCell>

                    {/* Availability Toggle */}
                    <TableCell>
                      <div className="flex min-w-[145px] items-center gap-2.5">
                        <button
                          type="button"
                          role="switch"
                          aria-checked={service.isAvailable}
                          aria-label={`Make ${service.title} ${
                            service.isAvailable ? 'unavailable' : 'available'
                          }`}
                          disabled={togglingId === service._id}
                          onClick={() => handleAvailabilityToggle(service)}
                          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                            service.isAvailable
                              ? 'bg-emerald-500'
                              : 'bg-muted-foreground/40'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                              service.isAvailable
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>

                        <span
                          className={`text-xs font-medium ${
                            service.isAvailable
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-muted-foreground'
                          }`}
                        >
                          {togglingId === service._id
                            ? 'Updating'
                            : service.isAvailable
                              ? 'Active'
                              : 'Inactive'}
                        </span>

                        {togglingId === service._id && (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="pr-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/dashboard/technician/services/edit/${service._id}`}
                          title="Edit service"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger>
                            <button
                              type="button"
                              title="Delete service"
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-background text-muted-foreground transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
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

          {/* Footer */}
          <div className="border-t bg-muted/20 px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Manage your listing status using the availability switch.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
