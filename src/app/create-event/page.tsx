import type { Metadata } from "next";
import CreateEvent from "@/components/events/CreateEvent";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Create Event",
};

export default function CreateEventPage() {
  return (
    <>
      <PageHeader
        title="Host an event"
        subtitle="Tell people what you're planning, where and when. Once it's posted, anyone nearby can find it and join."
      />
      <CreateEvent />
    </>
  );
}
