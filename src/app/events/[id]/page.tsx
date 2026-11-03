import type { Metadata } from "next";
import EventDetails from "@/components/events/EventDetails";
import { API_URL } from "@/lib/api";

type Props = { params: Promise<{ id: string }> };

// tab title uses the real event name when the api answers quickly
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${API_URL}/api/events/${id}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { title: "Event not found" };
    const event = (await res.json()) as { title: string; description: string };
    return { title: event.title, description: event.description.slice(0, 155) };
  } catch {
    return { title: "Event details" };
  }
}

export default async function EventDetailsPage({ params }: Props) {
  const { id } = await params;
  return <EventDetails key={id} id={id} />;
}
