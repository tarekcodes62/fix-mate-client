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

// Get all users
export const getAllUsers = async (token: string) => {
  const response = await fetch(`${API_URL}/api/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch users');
  }

  return result.users;
};

// Update user role
export const updateUserRole = async (
  id: string,
  role: string,
  token: string,
) => {
  const response = await fetch(`${API_URL}/api/admin/users/${id}/role`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update user role');
  }

  return result;
};
