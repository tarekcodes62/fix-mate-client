'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { updateService, Service, getMyServiceById } from '@/lib/api/services';
import { toast } from 'sonner';

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await authClient.token();

        if (!data?.token) {
          toast.error('Please login again');
          return;
        }

        const result = await getMyServiceById(id, data.token);
        setService(result);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Failed to load service',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (!service) return;

    setSaving(true);

    try {
      const { data } = await authClient.token();

      if (!data?.token) {
        toast.error('Please login again');
        return;
      }

      const updatedData = {
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
        !updatedData.title ||
        !updatedData.category ||
        !updatedData.description ||
        !updatedData.image
      ) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (
        updatedData.basePrice <= 0 ||
        Number(updatedData.estimatedDuration) <= 0
      ) {
        toast.error('Price and duration must be greater than zero');
        return;
      }

      await updateService(id, updatedData, data.token);

      toast.success('Service updated. Waiting for approval.');
      router.push('/dashboard/technician/services');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update service',
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-muted-foreground">Loading service...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-6 text-center">
        <p>Service not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Service</h1>
        <p className="text-muted-foreground">Update your service information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border p-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Service Title</label>
          <input
            name="title"
            defaultValue={service.title}
            required
            className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <input
            name="category"
            defaultValue={service.category}
            required
            className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            name="description"
            defaultValue={service.description}
            required
            rows={4}
            className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Image URL</label>
          <input
            name="image"
            type="url"
            defaultValue={service.image}
            required
            className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Base Price ($)</label>
            <input
              name="basePrice"
              type="number"
              min="1"
              defaultValue={service.basePrice}
              required
              className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Duration</label>
            <input
              name="estimatedDuration"
              type="number"
              min="1"
              defaultValue={service.estimatedDuration}
              required
              className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Service Mode</label>
          <input
            name="serviceMode"
            defaultValue={service.serviceMode}
            required
            className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Service Area</label>
          <input
            name="serviceArea"
            defaultValue={service.serviceArea || ''}
            className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push('/my-services')}
            className="rounded-md border px-5 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
