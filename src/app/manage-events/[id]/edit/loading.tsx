import { EventFormSkeleton } from "@/components/events/EventForm";
import PageHeader from "@/components/ui/PageHeader";

export default function Loading() {
  return (
    <>
      <PageHeader title="Update your event" subtitle="Change anything that's out of date. People who joined will see the new details." />
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 md:pt-10">
        <div className="skeleton mb-8 h-6 w-24 rounded-full" />
        <EventFormSkeleton />
      </div>
    </>
  );
}
