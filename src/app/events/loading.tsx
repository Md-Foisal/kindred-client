import { EventGridSkeleton } from "@/components/events/EventCardSkeleton";
import { FilterPanelSkeleton } from "@/components/events/EventsBrowser";
import PageHeader from "@/components/ui/PageHeader";

export default function Loading() {
  return (
    <>
      <PageHeader
        overlap
        title="Upcoming events"
        subtitle="Cleanups, plantings, blood drives and more. Find something happening near you and lend a hand."
      />
      <div className="mx-auto max-w-7xl px-4 pb-24">
        <FilterPanelSkeleton />
        <div className="mt-10">
          <div className="skeleton mb-6 h-5 w-48" />
          <EventGridSkeleton />
        </div>
      </div>
    </>
  );
}
