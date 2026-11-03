import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  // same extra user field as in auth.ts, so the profile page can read and save it
  plugins: [inferAdditionalFields({ user: { coverImage: { type: "string", required: false } } })],
});

export const { useSession, signIn, signUp, signOut } = authClient;
