import type { Metadata } from "next";
import { Suspense } from "react";
import { EventGridSkeleton } from "@/components/events/EventCardSkeleton";
import EventsBrowser, { FilterPanelSkeleton } from "@/components/events/EventsBrowser";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Upcoming Events",
  description: "Browse upcoming community service events and find one to join near you.",
};

export default function EventsPage() {
  return (
    <>
      <PageHeader
        overlap
        title="Upcoming events"
        subtitle="Cleanups, plantings, blood drives and more. Find something happening near you and lend a hand."
      />
      {/* useSearchParams needs a suspense boundary */}
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 pb-24">
            <FilterPanelSkeleton />
            <div className="mt-10">
              <div className="skeleton mb-6 h-5 w-48" />
              <EventGridSkeleton />
            </div>
          </div>
        }
      >
        <EventsBrowser />
      </Suspense>
    </>
  );
}
