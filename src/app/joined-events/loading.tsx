import { JoinedEventsSkeleton } from "@/components/events/JoinedEvents";
import PageHeader from "@/components/ui/PageHeader";

export default function Loading() {
  return (
    <>
      <PageHeader title="Your tickets" subtitle="Everything you've signed up for, soonest first. Thanks for showing up for your community." />
      <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 md:pt-14">
        <JoinedEventsSkeleton />
      </div>
    </>
  );
}
