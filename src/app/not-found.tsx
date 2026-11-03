import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
};

// any link that does not match a page lands here, same look as the missing event page
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center md:py-32">
      <p className="display-xl text-base-content/15">404</p>
      <h1 className="section-title mt-6">This page wandered off</h1>
      <p className="section-subtitle mx-auto mt-4">
        The link may be old or missing a character. The good news: there is plenty happening in your community right now.
      </p>
      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/events" className="btn-kind h-12! text-base!">
          Browse upcoming events
        </Link>
        <Link href="/" className="btn-kind-ghost h-12! text-base!">
          Back to home
        </Link>
      </div>
    </div>
  );
}
