const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Get admin dashboard statistics
export const getAdminStats = async (token: string) => {
  const response = await fetch(`${API_URL}/api/admin/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch admin statistics');
  }

  return result.stats;
};
