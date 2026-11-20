'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Booking, getTechnicianBookings } from '@/lib/api/bookings';
import { getMyServices, Service } from '@/lib/api/services';

const TechnicianPage = () => {
  const { data: session } = authClient.useSession();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const tokenResult = await authClient.token();

        if (!tokenResult.data?.token) {
          throw new Error('Failed to get token');
        }

        const token = tokenResult.data.token;

        const [bookingData, serviceData] = await Promise.all([
          getTechnicianBookings(token),
          getMyServices(token),
        ]);

        setBookings(bookingData);
        setServices(serviceData);
      } catch (error) {
        console.error('Failed to fetch technician overview:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchOverviewData();
    }
  }, [session]);

  if (loading) {
    return <div className="p-6">Loading overview...</div>;
  }

  const stats = [
    {
      title: 'Total Requests',
      value: bookings.length,
    },
    {
      title: 'Pending Requests',
      value: bookings.filter(b => b.status === 'requested').length,
    },
    {
      title: 'Accepted',
      value: bookings.filter(b => b.status === 'accepted').length,
    },
    {
      title: 'In Progress',
      value: bookings.filter(b => b.status === 'in-progress').length,
    },
    {
      title: 'Completed',
      value: bookings.filter(b => b.status === 'completed').length,
    },
    {
      title: 'My Services',
      value: services.length,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Technician Overview</h1>
        <p className="text-muted-foreground">
          Manage your service requests and services.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(stat => (
          <div key={stat.title} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{stat.title}</p>

            <h2 className="mt-2 text-3xl font-bold">{stat.value}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicianPage;
