"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import type { EventInput } from "@/lib/types";
import EventForm, { EventFormSkeleton } from "./EventForm";

export default function CreateEvent() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(input: EventInput) {
    setSubmitting(true);
    try {
      await api("/api/events", {
        method: "POST",
        auth: true,
        body: { ...input, eventDate: new Date(input.eventDate).toISOString() },
      });
      toast.success("Event created! It's live on the upcoming list.");
      router.push("/events");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not create the event. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 md:pt-14">
      {isPending ? (
        <EventFormSkeleton />
      ) : !session?.user ? (
        <div className="mx-auto max-w-lg rounded-[1.75rem] border border-base-300 bg-base-200/50 px-8 py-14 text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight">Your session has ended</h2>
          <p className="mt-2 text-base-content/70">Log in again to create an event. Nothing has been posted yet.</p>
          <Link href="/login?redirect=/create-event" className="btn-kind mt-6">
            Log in
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-6 text-base-content/70">
            Posting as <span className="font-semibold text-base-content">{session.user.name}</span>. Your name and photo show
            as the host.
          </p>
          <EventForm submitLabel="Publish event" submitting={submitting} onSubmit={handleCreate} />
        </>
      )}
    </div>
  );
}
