'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  getMyProfile,
  updateMyProfile,
  uploadProfilePhoto,
  type Profile,
} from '@/lib/api/profile';
import { toast } from 'sonner';
import {
  ArrowLeft,
  ArrowUpRight,
  Camera,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import Image from 'next/image';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: '',
    bio: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authClient.token();
        const token = data?.token;

        if (!token) throw new Error('Authentication token not found');

        const result = await getMyProfile(token);

        setProfile(result);

        setFormData({
          name: result.name || '',
          phone: result.phone || '',
          area: result.area || '',
          bio: result.bio || '',
        });
      } catch (error) {
        console.error(error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setUpdating(true);

      const { data } = await authClient.token();
      const token = data?.token;

      if (!token) throw new Error('Authentication token not found');

      let image = profile?.image || '';

      if (photo) {
        image = await uploadProfilePhoto(photo);
      }

      const result = await updateMyProfile(
        {
          ...formData,
          ...(photo ? { image } : {}),
        },
        token,
      );

      const updatedProfile = result.user as Profile;

      setProfile(updatedProfile);
      setPhoto(null);
      setPreview('');

      setFormData({
        name: updatedProfile.name || '',
        phone: updatedProfile.phone || '',
        area: updatedProfile.area || '',
        bio: updatedProfile.bio || '',
      });

      window.dispatchEvent(
        new CustomEvent('fixmate:profile-updated', {
          detail: updatedProfile,
        }),
      );

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update profile',
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <UserRound className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Unable to load your profile.</p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  const inputClass =
    'w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15';

  return (
    <div className="mx-auto w-full max-w-5xl space-y-7 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Profile Settings
          </h1>

          <p className="text-sm text-muted-foreground sm:text-base">
            Manage your personal information and keep your profile up to date.
          </p>
        </div>
      </div>

      {/* Profile card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
          <h2 className="font-semibold">Personal Information</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your profile details across FixMate.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Photo section */}
          <div className="flex flex-col gap-5 border-b border-border p-6 sm:flex-row sm:items-center sm:p-8">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
              {preview || profile.image ? (
                <Image
                  width={200}
                  height={200}
                  src={preview || profile.image || '/default-avatar.png'}
                  alt="Profile photo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-10 w-10 text-muted-foreground" />
              )}

              <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground">
                <Camera className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">
                Upload a profile photo to personalize your account.
              </p>

              <label
                htmlFor="profilePhoto"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium transition hover:bg-muted"
              >
                <Camera className="h-4 w-4" />
                Change Photo
              </label>

              <input
                id="profilePhoto"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

              {photo && (
                <p className="text-xs text-primary">Selected: {photo.name}</p>
              )}
            </div>
          </div>

          {/* Form fields */}
          <div className="space-y-6 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="email"
                    value={profile.email}
                    readOnly
                    className={`${inputClass} cursor-not-allowed bg-muted/50 pl-10 text-muted-foreground`}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed.
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              {/* Area */}
              <div className="space-y-2">
                <label htmlFor="area" className="text-sm font-medium">
                  Area
                </label>

                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <input
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="Your area or location"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                About Me
              </label>

              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={5}
                placeholder="Write a little about yourself..."
                className={`${inputClass} resize-none`}
              />

              <p className="text-xs text-muted-foreground">
                Share a short introduction about yourself.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/20 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition hover:text-primary"
            >
              Cancel and return home
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="submit"
              disabled={updating}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              {updating ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
