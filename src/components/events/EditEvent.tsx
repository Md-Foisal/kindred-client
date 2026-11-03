"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { isPast, toLocalInput } from "@/lib/format";
import type { CommunityEvent, EventInput } from "@/lib/types";
import EventForm, { EventFormSkeleton } from "./EventForm";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; event: CommunityEvent }
  | { status: "missing" }
  | { status: "error"; message: string };

function Notice({ title, text }: { title: string; text: string }) {
  return (
    <div className="mx-auto max-w-lg rounded-[1.75rem] border border-base-300 bg-base-200/50 px-8 py-14 text-center">
      <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 text-base-content/70">{text}</p>
      <Link href="/manage-events" className="btn-kind mt-6">
        Back to my events
      </Link>
    </div>
  );
}

export default function EditEvent({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api<CommunityEvent>(`/api/events/${id}`)
      .then((event) => {
        if (!cancelled) setState({ status: "ready", event });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) setState({ status: "missing" });
        else setState({ status: "error", message: err instanceof ApiError ? err.message : "We could not reach the server." });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleUpdate(input: EventInput) {
    setSubmitting(true);
    try {
      await api(`/api/events/${id}`, {
        method: "PATCH",
        auth: true,
        body: { ...input, eventDate: new Date(input.eventDate).toISOString() },
      });
      toast.success("Event updated");
      router.push("/manage-events");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not save your changes. Please try again.");
      setSubmitting(false);
    }
  }

  let content;
  if (isPending || state.status === "loading") {
    content = <EventFormSkeleton />;
  } else if (!user) {
    content = (
      <div className="mx-auto max-w-lg rounded-[1.75rem] border border-base-300 bg-base-200/50 px-8 py-14 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight">Your session has ended</h2>
        <p className="mt-2 text-base-content/70">Log in again to edit this event. Your saved details are safe.</p>
        <Link href={`/login?redirect=/manage-events/${id}/edit`} className="btn-kind mt-6">
          Log in
        </Link>
      </div>
    );
  } else if (state.status === "missing") {
    content = <Notice title="We couldn't find that event" text="It may have been deleted already, or the link is incomplete." />;
  } else if (state.status === "error") {
    content = <Notice title="Could not load this event" text={state.message} />;
  } else if (state.event.creatorEmail !== user.email) {
    content = <Notice title="You can only edit your own events" text="This one belongs to another host. You can still view and join it from its event page." />;
  } else {
    const ev = state.event;
    const initial: EventInput = {
      title: ev.title,
      description: ev.description,
      eventType: ev.eventType,
      thumbnail: ev.thumbnail,
      location: ev.location,
      eventDate: toLocalInput(ev.eventDate),
    };
    content = (
      <>
        {isPast(ev.eventDate) && (
          <div role="alert" className="mb-6 flex items-start gap-3 rounded-2xl border border-warning/40 bg-warning/10 px-5 py-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 size-5 shrink-0 text-warning" aria-hidden>
              <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            </svg>
            <span>This event already happened. Pick a new date in the future to put it back on the upcoming list.</span>
          </div>
        )}
        <EventForm initial={initial} submitLabel="Save changes" submitting={submitting} onSubmit={handleUpdate} />
      </>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 md:pt-10">
      <Link
        href="/manage-events"
        className="mb-8 inline-flex items-center gap-1.5 rounded-full py-1 pr-3 text-sm font-medium text-base-content/70 transition hover:text-base-content"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden>
          <path d="m15 18-6-6 6-6" />
        </svg>
        My events
      </Link>
      {content}
    </div>
  );
}
