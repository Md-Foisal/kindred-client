import Link from "next/link";
import { ManageEventsSkeleton } from "@/components/events/ManageEvents";
import PageHeader, { onDarkButtonClass } from "@/components/ui/PageHeader";

export default function Loading() {
  return (
    <>
      <PageHeader title="Your events" subtitle="Everything you've hosted, in one place. Update the details or remove an event.">
        <Link href="/create-event" className={onDarkButtonClass}>
          Host a new event
        </Link>
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 md:pt-14">
        <ManageEventsSkeleton />
      </div>
    </>
  );
}
