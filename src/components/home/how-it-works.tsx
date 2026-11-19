import { Search, ClipboardList, Wrench, CreditCard } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Find a Service',
    description:
      'Browse repair services and find the right technician for your device.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Send a Request',
    description:
      'Choose your preferred service and submit a repair booking request.',
    icon: ClipboardList,
  },
  {
    number: '03',
    title: 'Technician Fixes It',
    description:
      'Our technician takes care of your device with professional expertise.',
    icon: Wrench,
  },
  {
    number: '04',
    title: 'Pay After Completion',
    description: 'Once your repair is completed, pay securely for the service.',
    icon: CreditCard,
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="bg-muted/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Heading */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
            SIMPLE PROCESS
          </p>

          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            How FixMate Works
          </h2>

          <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
            Getting your device repaired is easier than ever. Follow four simple
            steps to get started.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(step => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-lg"
              >
                {/* Number */}
                <span className="text-sm font-bold tracking-wider text-blue-600 dark:text-blue-400">
                  STEP {step.number}
                </span>

                {/* Icon */}
                <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-500/10 dark:text-blue-400">
                  <Icon size={26} strokeWidth={1.8} />
                </div>

                {/* Content */}
                <h3 className="mt-5 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
