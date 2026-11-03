import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

function FormSkeleton() {
  return (
    <div className="space-y-5">
      {[0, 1].map((i) => (
        <div key={i} className="space-y-2">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-12 w-full" />
        </div>
      ))}
      <div className="skeleton h-12 w-full rounded-full" />
      <div className="grid grid-cols-2 gap-3 pt-10">
        <div className="skeleton h-12 rounded-full" />
        <div className="skeleton h-12 rounded-full" />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to join events, keep track of your tickets and host drives in your area."
      line="Good things happen when neighbours show up."
      caption="Every week, people near you clean beaches, plant trees and run food drives. Kindred helps you find them."
    >
      <Suspense fallback={<FormSkeleton />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
