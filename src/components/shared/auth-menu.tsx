'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, UserRound } from 'lucide-react';

import { authClient } from '@/lib/auth-client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type User = {
  name: string;
  email: string;
  image?: string | null;
  role?: string;
};

type Props = {
  user: User | null;
};

const AuthMenu = ({ user }: Props) => {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
    router.refresh();
  };

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/sign-in"
          className="rounded-md px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Sign In
        </Link>

        <Link
          href="/sign-up"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const dashboardLink =
    user.role === 'admin'
      ? '/dashboard/admin'
      : user.role === 'technician'
        ? '/dashboard/technician'
        : '/dashboard/customer';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-full p-1 hover:bg-muted">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.image || ''} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <span className="hidden max-w-28 truncate text-sm sm:block">
          {user.name}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p>{user.name}</p>
          <p className="font-normal text-muted-foreground">{user.email}</p>
          <p className="mt-1 text-xs capitalize text-emerald-600">
            {user.role || 'customer'}
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href={dashboardLink} className="flex w-full items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link href="/dashboard/profile" className="flex w-full items-center">
            <UserRound className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-500 focus:text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthMenu;
