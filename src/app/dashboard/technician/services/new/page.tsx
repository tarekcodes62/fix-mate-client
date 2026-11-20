'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';
import { createService } from '@/lib/api/services';

const TechnicianNewServicePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const serviceData = {
      title: String(formData.get('title')),
      category: String(formData.get('category')),
      description: String(formData.get('description')),
      image: String(formData.get('image')),
      basePrice: Number(formData.get('basePrice')),
      estimatedDuration: String(formData.get('estimatedDuration')),
      serviceMode: String(formData.get('serviceMode')),
      serviceArea: String(formData.get('serviceArea')),
    };

    if (
      serviceData.basePrice <= 0 ||
      Number(serviceData.estimatedDuration) <= 0
    ) {
      toast.error('Price and duration must be greater than zero');
      return;
    }

    try {
      setLoading(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error('Authentication required');
      }

      await createService(serviceData, token);

      toast.success('Service created successfully');
      router.push('/dashboard/technician');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create service',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/dashboard/technician"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold">Add New Service</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Provide the details of the service you want to offer.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border bg-card p-5 sm:p-7"
      >
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Service Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. AC Repair Service"
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="e.g. AC, Laptop & PC"
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Describe your service..."
            required
            className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="image" className="text-sm font-medium">
            Service Image URL
          </label>
          <input
            id="image"
            name="image"
            type="url"
            placeholder="https://example.com/image.jpg"
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="basePrice" className="text-sm font-medium">
              Base Price (৳)
            </label>
            <input
              id="basePrice"
              name="basePrice"
              type="number"
              min="1"
              placeholder="1000"
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="estimatedDuration" className="text-sm font-medium">
              Estimated Duration (Hours)
            </label>
            <input
              id="estimatedDuration"
              name="estimatedDuration"
              type="number"
              min="1"
              placeholder="2"
              required
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="serviceMode" className="text-sm font-medium">
            Service Mode
          </label>
          <input
            id="serviceMode"
            name="serviceMode"
            type="text"
            placeholder="e.g. Home Visit"
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="serviceArea" className="text-sm font-medium">
            Service Area
          </label>
          <input
            id="serviceArea"
            name="serviceArea"
            type="text"
            placeholder="e.g. Dhaka"
            required
            className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:border-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Creating Service...' : 'Create Service'}
        </button>
      </form>
    </div>
  );
};

export default TechnicianNewServicePage;
