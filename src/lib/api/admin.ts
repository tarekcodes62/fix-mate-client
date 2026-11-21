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

export type AdminService = {
  _id: string;
  title: string;
  category: string;
  basePrice: number;
  approvalStatus: string;
  technicianName: string;
  technicianEmail: string;
  createdAt: string;
};

// Get all services
export const getAllServices = async (
  token: string,
  approvalStatus?: string,
) => {
  const query = approvalStatus ? `?approvalStatus=${approvalStatus}` : '';

  const response = await fetch(`${API_URL}/api/admin/services${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch services');
  }

  return result.services;
};

// Update service approval
export const updateServiceApproval = async (
  id: string,
  approvalStatus: 'approved' | 'rejected',
  token: string,
) => {
  const response = await fetch(`${API_URL}/api/admin/services/${id}/approval`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ approvalStatus }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update service approval');
  }

  return result;
};
