export type Profile = {
  name: string;
  email: string;
  image?: string;
  role: string;
  phone?: string;
  area?: string;
  bio?: string;
};

// get my profile
export const getMyProfile = async (token: string): Promise<Profile> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  const result = await response.json();

  return result.user as Profile;
};

// update my profile
export const updateMyProfile = async (
  data: Partial<Pick<Profile, 'name' | 'phone' | 'area' | 'bio' | 'image'>>,
  token: string,
) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to update profile');
  }

  return result;
};

// upload profile photo to ImgBB
export const uploadProfilePhoto = async (file: File): Promise<string> => {
  const formData = new FormData();

  formData.append('image', file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    {
      method: 'POST',
      body: formData,
    },
  );

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error('Failed to upload profile photo');
  }

  return result.data.url;
};
