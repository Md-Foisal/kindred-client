import type { Metadata } from "next";
import Link from "next/link";
import ManageEvents from "@/components/events/ManageEvents";
import PageHeader, { onDarkButtonClass } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Manage Events",
};

export default function ManageEventsPage() {
  return (
    <>
      <PageHeader title="Your events" subtitle="Everything you've hosted, in one place. Update the details or remove an event.">
        <Link href="/create-event" className={onDarkButtonClass}>
          Host a new event
        </Link>
      </PageHeader>
      <ManageEvents />
    </>
  );
}
