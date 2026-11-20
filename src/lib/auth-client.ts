import { createAuthClient } from 'better-auth/react';
import { jwtClient } from 'better-auth/client/plugins';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import type { auth } from './auth';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [jwtClient(), inferAdditionalFields<typeof auth>()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
