'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wrench, UserRound, BriefcaseBusiness } from 'lucide-react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Role = 'customer' | 'technician';

const SignUpPage = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('customer');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain an uppercase letter';
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain a lowercase letter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });

      if (error) {
        toast.error(error.message || 'Failed to create account');
        return;
      }

      toast.success('Account created successfully!');

      router.push(
        role === 'technician' ? '/dashboard/technician' : '/dashboard/customer',
      );
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/dashboard/customer',
      });
    } catch {
      toast.error('Google sign up failed');
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-background px-4 py-12 text-foreground">
      <Card className="w-full max-w-md rounded-2xl border-border bg-card p-2 shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Wrench size={28} />
          </div>

          <CardTitle className="text-2xl font-bold">
            Create your FixMate account
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Join FixMate and get your devices repaired by trusted technicians.
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                placeholder="Enter your full name"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  setErrors(prev => ({ ...prev, name: '' }));
                }}
                className="bg-background focus-visible:border-blue-500 focus-visible:ring-blue-500"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: '' }));
                }}
                className="bg-background focus-visible:border-blue-500 focus-visible:ring-blue-500"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: '' }));
                }}
                className="bg-background focus-visible:border-blue-500 focus-visible:ring-blue-500"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 6 characters, including uppercase and lowercase letters.
              </p>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Choose Account Type</label>

              <div className="grid grid-cols-2 gap-3">
                {/* Customer */}
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`rounded-lg border p-4 text-center transition-all ${
                    role === 'customer'
                      ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600/20 dark:bg-blue-950/30'
                      : 'border-border bg-background hover:border-blue-500/50 hover:bg-muted'
                  }`}
                >
                  <UserRound
                    className={`mx-auto mb-2 h-5 w-5 ${
                      role === 'customer'
                        ? 'text-blue-600'
                        : 'text-muted-foreground'
                    }`}
                  />
                  <span className="text-sm font-medium">Customer</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Book repair services
                  </p>
                </button>

                {/* Technician */}
                <button
                  type="button"
                  onClick={() => setRole('technician')}
                  className={`rounded-lg border p-4 text-center transition-all ${
                    role === 'technician'
                      ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600/20 dark:bg-blue-950/30'
                      : 'border-border bg-background hover:border-blue-500/50 hover:bg-muted'
                  }`}
                >
                  <BriefcaseBusiness
                    className={`mx-auto mb-2 h-5 w-5 ${
                      role === 'technician'
                        ? 'text-blue-600'
                        : 'text-muted-foreground'
                    }`}
                  />
                  <span className="text-sm font-medium">Technician</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Provide repair services
                  </p>
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 font-semibold text-white hover:bg-blue-700"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google Signup */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-border bg-background hover:bg-muted"
            onClick={handleGoogleSignUp}
          >
            <svg viewBox="0 0 48 48" className="mr-2 h-5 w-5">
              <path
                fill="#4285F4"
                d="M24 9.5c3.54 0 6.7 1.22 9.19 3.6l6.86-6.86C35.87 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8 6.22C12.44 13.39 17.78 9.5 24 9.5Z"
                transform="translate(0 5)"
              />
              <path
                fill="#34A853"
                d="M46.98 24.55c0-1.57-.15-3.08-.42-4.55H24v9.02h12.93c-.58 3-2.28 5.54-4.84 7.24l7.78 6.04c4.54-4.18 7.11-10.32 7.11-17.75Z"
              />
              <path
                fill="#FBBC05"
                d="M10.56 28.44a14.5 14.5 0 0 1 0-8.88l-8-6.22a24 24 0 0 0 0 26.32l8-6.22Z"
                transform="translate(0 5)"
              />
              <path
                fill="#EA4335"
                d="M24 48c6.47 0 11.87-2.13 15.83-5.7l-7.78-6.04c-2.16 1.45-4.92 2.3-8.05 2.3-6.22 0-11.56-3.89-13.44-9.94l-8 6.22C6.51 42.62 14.62 48 24 48Z"
              />
            </svg>
            Continue with Google
          </Button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/sign-in"
              className="font-semibold text-blue-600 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignUpPage;
