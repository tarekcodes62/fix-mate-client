export type Service = {
  _id: string;
  title: string;
  category: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea?: string;
  technicianName: string;
  createdAt: string;
  approvalStatus: string;
  isAvailable: boolean;
};

export const getFeaturedServices = async (): Promise<Service[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/services`,
    {
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }

  const result = await response.json();

  return (result.data as Service[])
    .filter(
      service => service.approvalStatus === 'approved' && service.isAvailable,
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);
};
