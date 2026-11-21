'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import type { Service } from '@/lib/api/services';
import Image from 'next/image';

type ServicesPageProps = {
  services: Service[];
};

const categories = [
  'Smartphone',
  'Laptop & PC',
  'AC',
  'Refrigerator',
  'TV',
  'Washing Machine',
  'Electrical',
];

const ServicesPage = ({ services }: ServicesPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const serviceMode = searchParams.get('serviceMode') || '';
  const sort = searchParams.get('sort') || 'newest';

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/services?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/services');
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
            FIND YOUR TECHNICIAN
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Explore Repair Services
          </h1>

          <p className="mt-3 max-w-2xl text-muted-foreground">
            Find the right professional to fix your devices and home appliances.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-8 rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <form
              onSubmit={e => {
                e.preventDefault();
                updateQuery(
                  'search',
                  (
                    e.currentTarget.elements.namedItem(
                      'search',
                    ) as HTMLInputElement
                  ).value.trim(),
                );
              }}
              className="relative flex flex-1"
            >
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                key={search}
                name="search"
                defaultValue={search}
                placeholder="Search repair services..."
                className="h-11 w-full rounded-lg border border-border bg-background pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <button
                type="submit"
                className="ml-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Search
              </button>
            </form>

            {/* Category */}
            <select
              value={category}
              onChange={e => updateQuery('category', e.target.value)}
              className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-blue-500 lg:w-48"
            >
              <option value="">All Categories</option>
              {categories.map(item => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Service Mode */}
            <select
              value={serviceMode}
              onChange={e => updateQuery('serviceMode', e.target.value)}
              className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-blue-500 lg:w-44"
            >
              <option value="">All Service Modes</option>
              <option value="On-site">On-site</option>
              <option value="Remote">Remote</option>
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => updateQuery('sort', e.target.value)}
              className="h-11 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-blue-500 lg:w-44"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Filter Info */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <SlidersHorizontal size={16} />
              {services.length} services found
            </p>

            {(search || category || serviceMode || sort !== 'newest') && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Service Cards */}
        {services.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(service => (
              <div
                key={service._id}
                className="overflow-hidden rounded-xl border border-border bg-card transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-52 overflow-hidden bg-muted">
                  <Image
                    width={200}
                    height={200}
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    {service.category}
                  </span>

                  <h2 className="mt-3 line-clamp-1 text-lg font-semibold">
                    {service.title}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    Technician: {service.technicianName}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Mode: {service.serviceMode}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Starting at
                      </p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        ${service.basePrice.toFixed(2)} USD
                      </p>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Details
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card px-6 py-16 text-center">
            <h2 className="text-lg font-semibold">No Services Found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search or filters.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default ServicesPage;
