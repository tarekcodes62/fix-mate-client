'use client';

import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { getAdminStats } from '@/lib/api/admin';

type AdminStats = {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
};

const AdminPage = () => {
  const { data: session } = authClient.useSession();

  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalTechnicians: 0,
    pendingServices: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const tokenResult = await authClient.token();

        if (!tokenResult.data?.token) {
          throw new Error('Failed to get token');
        }

        const data = await getAdminStats(tokenResult.data.token);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchAdminStats();
    }
  }, [session]);

  const statItems = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
    },
    {
      title: 'Total Technicians',
      value: stats.totalTechnicians,
    },
    {
      title: 'Pending Services',
      value: stats.pendingServices,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="text-muted-foreground">
          Monitor users, technicians and pending services.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statItems.map(stat => (
          <div key={stat.title} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{stat.title}</p>

            {loading ? (
              <div className="mt-3 h-9 w-20 animate-pulse rounded bg-muted" />
            ) : (
              <h2 className="mt-2 text-3xl font-bold">{stat.value}</h2>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
