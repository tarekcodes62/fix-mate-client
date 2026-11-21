'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { authClient, useSession } from '@/lib/auth-client';
import { createBooking } from '@/lib/api/bookings';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type RepairRequestDialogProps = {
  serviceId: string;
  basePrice: number;
};

const RepairRequestDialog = ({
  serviceId,
  basePrice,
}: RepairRequestDialogProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerPhone: '',
    address: '',
    preferredDate: '',
    problemDescription: '',
  });

  const userRole = (session?.user as { role?: string } | undefined)?.role;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session) {
      router.push(`/sign-in?callbackURL=${pathname}`);
      return;
    }

    if (userRole !== 'customer') {
      toast.error('Only customers can book a service');
      return;
    }

    if (formData.problemDescription.trim().length < 20) {
      toast.error('Problem description must be at least 20 characters');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error('Failed to get authentication token');
      }

      await createBooking(
        {
          serviceId,
          ...formData,
        },
        data.token,
      );

      toast.success('Booking request submitted successfully');

      setFormData({
        customerPhone: '',
        address: '',
        preferredDate: '',
        problemDescription: '',
      });

      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to submit booking request',
      );
    } finally {
      setLoading(false);
    }
  };

  if (session && userRole !== 'customer') {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          Book This Service
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Request a Repair Service</DialogTitle>
          <DialogDescription>
            Provide your details to submit a booking request.
          </DialogDescription>
        </DialogHeader>

        {/* Starting Price */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/20 dark:bg-blue-500/10">
          <p className="text-sm text-muted-foreground">Starting Price</p>
          <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${basePrice.toFixed(2)} USD
          </p>
        </div>

        <form onSubmit={handleBooking} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Phone Number</Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.customerPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="Enter your full address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredDate">Preferred Date</Label>
            <Input
              id="preferredDate"
              name="preferredDate"
              type="date"
              min={new Date().toLocaleDateString('en-CA')}
              value={formData.preferredDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="problemDescription">Problem Description</Label>
            <Textarea
              id="problemDescription"
              name="problemDescription"
              placeholder="Describe your appliance problem..."
              value={formData.problemDescription}
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RepairRequestDialog;
