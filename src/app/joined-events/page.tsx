import type { Metadata } from "next";
import JoinedEvents from "@/components/events/JoinedEvents";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Joined Events",
};

export default function JoinedEventsPage() {
  return (
    <>
      <PageHeader title="Your tickets" subtitle="Everything you've signed up for, soonest first. Thanks for showing up for your community." />
      <JoinedEvents />
    </>
  );
}
