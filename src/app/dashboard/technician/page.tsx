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
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold">Technician Overview</h1>
        <p className="text-muted-foreground">
          Manage your service requests and services.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(stat => (
          <div key={stat.title} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{stat.title}</p>

            <h2 className="mt-2 text-3xl font-bold">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Recent Booking Requests */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Recent Booking Requests</h2>
          <p className="text-sm text-muted-foreground">
            Latest booking requests from your customers.
          </p>
        </div>

        <div className="rounded-xl border bg-card">
          {bookings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No booking requests found.
            </div>
          ) : (
            <div className="divide-y">
              {bookings.slice(0, 5).map(booking => (
                <div
                  key={booking._id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{booking.serviceTitle}</h3>

                    <p className="text-sm text-muted-foreground">
                      Customer: {booking.customerName}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Date: {booking.preferredDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold">
                      ${booking.finalAmount.toFixed(2)} USD
                    </span>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium capitalize text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* My Services */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">My Services</h2>
          <p className="text-sm text-muted-foreground">
            Services you are currently offering.
          </p>
        </div>

        <div className="rounded-xl border bg-card">
          {services.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              You haven&apos;t added any services yet.
            </div>
          ) : (
            <div className="divide-y">
              {services.slice(0, 5).map(service => (
                <div
                  key={service._id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium">{service.title}</h3>

                    <p className="text-sm text-muted-foreground">
                      {service.category}
                    </p>

                    <p className="text-sm font-medium">
                      ${service.basePrice.toFixed(2)} USD
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium capitalize ${
                      service.approvalStatus === 'approved'
                        ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                    }`}
                  >
                    {service.approvalStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianPage;
