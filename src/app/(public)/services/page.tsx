import { getServices } from '@/lib/api/services';
import ServicesPage from '@/components/services/services-page';

type PageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
    serviceMode?: string;
    sort?: string;
  }>;
};

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  const services = await getServices({
    search: params.search,
    category: params.category,
    serviceMode: params.serviceMode,
    sort: params.sort || 'newest',
  });

  return <ServicesPage services={services} />;
};

export default Page;
