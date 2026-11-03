import type { Metadata } from "next";
import EditEvent from "@/components/events/EditEvent";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Update Event",
};

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <PageHeader title="Update your event" subtitle="Change anything that's out of date. People who joined will see the new details." />
      <EditEvent key={id} id={id} />
    </>
  );
}
