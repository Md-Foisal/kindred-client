import type { Metadata } from "next";
import { Suspense } from "react";
import ProfileView, { ProfileSkeleton } from "@/components/auth/ProfileView";

export const metadata: Metadata = {
  title: "My Profile",
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileView />
    </Suspense>
  );
}
