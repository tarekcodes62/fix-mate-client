import Link from 'next/link';
import {
  Smartphone,
  Laptop,
  AirVent,
  Refrigerator,
  Tv,
  WashingMachine,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  BadgeCheck,
  Clock3,
  Headset,
} from 'lucide-react';

const categories = [
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Laptop & PC', icon: Laptop },
  { name: 'AC', icon: AirVent },
  { name: 'Refrigerator', icon: Refrigerator },
  { name: 'TV', icon: Tv },
  { name: 'Washing Machine', icon: WashingMachine },
  { name: 'Electrical', icon: Zap },
];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: 'Trusted Technicians',
    description: 'Find experienced technicians for your repair needs.',
  },
  {
    icon: BadgeCheck,
    title: 'Reliable Service',
    description: 'Quality-focused repair services for your devices.',
  },
  {
    icon: Clock3,
    title: 'Easy Booking',
    description: 'Request a repair through a simple booking process.',
  },
  {
    icon: Headset,
    title: 'Customer Support',
    description: 'Get support throughout your repair experience.',
  },
];

const PopularCategories = () => {
  return (
    <section className="bg-background px-4 py-16 text-foreground sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
            FIND YOUR REPAIR
          </p>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Popular Repair Categories
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Whatever needs fixing, find the right service for your device and
            home appliances.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map(category => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/services?category=${encodeURIComponent(category.name)}`}
                className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:shadow-md sm:p-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-500/10 dark:text-blue-400">
                    <Icon size={21} />
                  </div>

                  <span className="truncate text-sm font-semibold sm:text-base">
                    {category.name}
                  </span>
                </div>

                <ArrowUpRight
                  size={17}
                  className="shrink-0 text-muted-foreground transition group-hover:text-blue-600 dark:group-hover:text-blue-400"
                />
              </Link>
            );
          })}
        </div>

        {/* Why Choose FixMate */}
        <div className="mt-20">
          <div className="mb-8 text-center">
            <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
              WHY FIXMATE
            </p>

            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Why Choose FixMate?
            </h2>

            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Repairing your devices shouldn’t be complicated.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map(point => {
              const Icon = point.icon;

              return (
                <div
                  key={point.title}
                  className="rounded-xl border border-border bg-card p-6 text-center transition hover:shadow-md"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-4 font-semibold">{point.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;
