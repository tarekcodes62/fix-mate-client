import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export async function proxy(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { pathname } = new URL(request.url);

  if (!session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  const role = session.user.role;

  // Profile access for all logged-in users
  if (pathname === '/dashboard/profile') {
    return NextResponse.next();
  }

  // Dashboard root redirect
  if (pathname === '/dashboard') {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }

    if (role === 'technician') {
      return NextResponse.redirect(
        new URL('/dashboard/technician', request.url),
      );
    }

    if (role === 'customer') {
      return NextResponse.redirect(new URL('/dashboard/customer', request.url));
    }

    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Admin access
  if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Technician access
  if (pathname.startsWith('/dashboard/technician') && role !== 'technician') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // Customer access
  if (pathname.startsWith('/dashboard/customer') && role !== 'customer') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
