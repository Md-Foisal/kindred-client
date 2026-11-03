import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
};

function FormSkeleton() {
  return (
    <div className="space-y-5">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-12 w-full" />
        </div>
      ))}
      <div className="skeleton h-12 w-full rounded-full" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="It's free. Host drives, join events and meet neighbours who care about the same things you do."
      line="Most good things start with one person saying yes."
      caption="Make an account in a minute, then join your first event or host one of your own."
    >
      <Suspense fallback={<FormSkeleton />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
