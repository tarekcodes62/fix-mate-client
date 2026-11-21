export type Booking = {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: string;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: string;
  finalAmount: number;
  paymentStatus: string;
  createdAt: string;
};

export type CreateBookingData = {
  serviceId: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
};

// create bookings api
export const createBooking = async (data: CreateBookingData, token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/bookings`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create booking');
  }

  return result;
};

// Get customer's own bookings
export const getMyBookings = async (token: string): Promise<Booking[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/my-bookings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }

  const result = await response.json();

  return result.data as Booking[];
};

// cancel booking
export const cancelBooking = async (bookingId: string, token: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/cancel`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to cancel booking');
  }

  return result;
};

// Get technician's own bookings
export const getTechnicianBookings = async (
  token: string,
): Promise<Booking[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/technician-requests`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch technician bookings');
  }

  return result.data as Booking[];
};

// Update booking status
export const updateBookingStatus = async (
  bookingId: string,
  status: string,
  token: string,
  finalAmount?: number,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(
        status === 'completed' ? { status, finalAmount } : { status },
      ),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update booking status');
  }

  return result;
};

// Create Stripe Checkout Session
export const createCheckoutSession = async (
  bookingId: string,
  token: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-checkout-session`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookingId }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to create checkout session');
  }

  return result.checkoutUrl as string;
};
