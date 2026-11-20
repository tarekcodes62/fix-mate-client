import { Wrench, Users, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Wrench,
    title: 'Reliable Repair Services',
    description:
      'Find repair services for your smartphones, laptops, home appliances, and other devices.',
  },
  {
    icon: Users,
    title: 'Connecting Customers & Technicians',
    description:
      'FixMate connects customers with skilled technicians to make repair services easier to access.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Service Experience',
    description:
      'Our platform helps customers find available services and manage their repair requests conveniently.',
  },
];

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="bg-blue-600 px-4 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
            <Wrench size={28} />
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">About FixMate</h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-blue-50 sm:text-base">
            Your trusted platform for smart device and home appliance repair
            services. We connect customers with skilled technicians to make
            repairs simple and convenient.
          </p>
        </div>
      </section>

      {/* About Us */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Who We Are</h2>

            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-blue-600" />

            <p className="mt-6 leading-8 text-muted-foreground">
              FixMate is a smart device and home appliance repair service
              platform designed to simplify the repair process. Whether you need
              help with a smartphone, laptop, refrigerator, television, or other
              appliances, FixMate helps you find the right repair service in one
              place.
            </p>

            <p className="mt-4 leading-8 text-muted-foreground">
              We bring customers and technicians together through a simple
              platform where customers can explore services, request repairs,
              and track their bookings while technicians can manage their
              services and repair jobs.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-muted/40 px-4 py-14">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-10">
          <h2 className="text-2xl font-bold sm:text-3xl">Our Mission</h2>

          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-blue-600" />

          <p className="mt-6 text-base leading-8 text-muted-foreground">
            Our mission is to make device and home appliance repair services
            accessible, convenient, and reliable for everyone. We aim to create
            a seamless experience for customers seeking repairs and technicians
            providing professional services.
          </p>
        </div>
      </section>

      {/* Why FixMate */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Why FixMate?</h2>

            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Making repair services easier for everyone.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(feature => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-blue-600/50"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-semibold">{feature.title}</h3>

                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
