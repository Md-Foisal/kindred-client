import { EventFormSkeleton } from "@/components/events/EventForm";
import PageHeader from "@/components/ui/PageHeader";

export default function Loading() {
  return (
    <>
      <PageHeader
        title="Host an event"
        subtitle="Tell people what you're planning, where and when. Once it's posted, anyone nearby can find it and join."
      />
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 md:pt-14">
        <div className="skeleton mb-6 h-5 w-72 max-w-full" />
        <EventFormSkeleton />
      </div>
    </>
  );
}
