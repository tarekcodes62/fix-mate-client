'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import {
  AdminService,
  getAllServices,
  updateServiceApproval,
} from '@/lib/api/admin';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ManageServicesPage = () => {
  const { data: session } = authClient.useSession();

  const [services, setServices] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Reject confirmation state
  const [selectedService, setSelectedService] = useState<AdminService | null>(
    null,
  );

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const tokenResult = await authClient.token();

        if (!tokenResult.data?.token) {
          throw new Error('Failed to get token');
        }

        const data = await getAllServices(tokenResult.data.token);
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchServices();
    }
  }, [session]);

  const handleApproval = async (
    id: string,
    approvalStatus: 'approved' | 'rejected',
  ) => {
    try {
      setUpdatingId(id);

      const tokenResult = await authClient.token();

      if (!tokenResult.data?.token) {
        throw new Error('Failed to get token');
      }

      await updateServiceApproval(id, approvalStatus, tokenResult.data.token);

      setServices(prevServices =>
        prevServices.map(service =>
          service._id === id ? { ...service, approvalStatus } : service,
        ),
      );

      toast.success(`Service ${approvalStatus} successfully`);

      return true;
    } catch (error) {
      console.error('Failed to update service:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update service',
      );

      return false;
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReject = async () => {
    if (!selectedService) return;

    const success = await handleApproval(selectedService._id, 'rejected');

    if (success) {
      setSelectedService(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold">Manage Services</h1>
        <p className="text-muted-foreground">
          Review and manage services submitted by technicians.
        </p>
      </div>

      {/* Services Table */}
      <div className="overflow-hidden rounded-xl border bg-card">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No services found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Technician</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {services.map(service => (
                <TableRow key={service._id}>
                  <TableCell className="font-medium">{service.title}</TableCell>

                  <TableCell>{service.category}</TableCell>

                  <TableCell>
                    <div>
                      <p>{service.technicianName || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.technicianEmail}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>${service.basePrice}</TableCell>

                  <TableCell>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        service.approvalStatus === 'approved'
                          ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                          : service.approvalStatus === 'rejected'
                            ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                      }`}
                    >
                      {service.approvalStatus}
                    </span>
                  </TableCell>

                  <TableCell>
                    {service.approvalStatus === 'pending' ? (
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          disabled={updatingId === service._id}
                          onClick={() =>
                            handleApproval(service._id, 'approved')
                          }
                        >
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={updatingId === service._id}
                          onClick={() => setSelectedService(service)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No action
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Reject Confirmation Modal */}
      <AlertDialog
        open={!!selectedService}
        onOpenChange={open => {
          if (!open && !updatingId) {
            setSelectedService(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Service?</AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to reject{' '}
              <span className="font-semibold text-foreground">
                {selectedService?.title}
              </span>
              ? This action will update the service approval status to rejected.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!updatingId}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={event => {
                event.preventDefault();
                handleReject();
              }}
              disabled={!!updatingId}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {updatingId === selectedService?._id
                ? 'Rejecting...'
                : 'Yes, Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageServicesPage;
