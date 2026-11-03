"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatTime, isPast } from "@/lib/format";
import type { CommunityEvent } from "@/lib/types";

type Loaded = { key: string; events: CommunityEvent[]; error: string | null };

function StatusBadge({ date }: { date: string }) {
  return isPast(date) ? (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-base-200 px-3 py-1 text-xs font-semibold text-base-content/60">
      <span className="size-1.5 rounded-full bg-base-content/40" aria-hidden />
      Finished
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-success/12 px-3 py-1 text-xs font-semibold text-success">
      <span className="size-1.5 rounded-full bg-success" aria-hidden />
      Upcoming
    </span>
  );
}

function DateCell({ date }: { date: string }) {
  const d = new Date(date);
  return (
    <div className="flex items-center gap-3">
      <div className="flex w-11 shrink-0 flex-col items-center rounded-xl bg-base-200 py-1">
        <span className="text-[0.65rem] font-semibold text-base-content/60">{d.toLocaleDateString("en-US", { month: "short" })}</span>
        <span className="font-display text-lg font-extrabold leading-none">{d.getDate()}</span>
      </div>
      <div className="text-sm leading-tight">
        <p className="font-medium">{d.toLocaleDateString("en-US", { weekday: "long" })}</p>
        <p className="text-base-content/60">{formatTime(date)}</p>
      </div>
    </div>
  );
}

const deleteBtn = "btn btn-soft btn-error h-10 rounded-full px-4 text-xs";

export default function ManageEvents() {
  const { data: session, isPending } = useSession();
  const email = session?.user?.email;

  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [target, setTarget] = useState<CommunityEvent | null>(null);
  const [deleting, setDeleting] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const key = `${email}|${attempt}`;

  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    api<CommunityEvent[]>("/api/events/mine", { auth: true })
      .then((events) => {
        if (!cancelled) setLoaded({ key, events, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof ApiError ? err.message : "We could not reach the server.";
        setLoaded({ key, events: [], error: message });
      });
    return () => {
      cancelled = true;
    };
  }, [email, key]);

  function askDelete(event: CommunityEvent) {
    setTarget(event);
    dialogRef.current?.showModal();
  }

  async function confirmDelete() {
    if (!target) return;
    setDeleting(true);
    try {
      await api(`/api/events/${target._id}`, { method: "DELETE", auth: true });
      setLoaded((prev) => prev && { ...prev, events: prev.events.filter((e) => e._id !== target._id) });
      toast.success(`"${target.title}" was deleted`);
      dialogRef.current?.close();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Could not delete the event. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  let content;
  if (isPending || (email && loaded?.key !== key)) {
    content = <ManageEventsSkeleton />;
  } else if (!email) {
    content = (
      <div className="mx-auto max-w-lg rounded-[1.75rem] border border-base-300 bg-base-200/50 px-8 py-14 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight">Your session has ended</h2>
        <p className="mt-2 text-base-content/70">Log in again to manage your events.</p>
        <Link href="/login?redirect=/manage-events" className="btn-kind mt-6">
          Log in
        </Link>
      </div>
    );
  } else if (loaded?.error) {
    content = (
      <div className="mx-auto max-w-lg rounded-[1.75rem] border border-error/30 bg-error/5 px-8 py-12 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight">We couldn&apos;t load your events</h2>
        <p className="mt-2 text-base-content/70">{loaded.error}</p>
        <button type="button" className="btn-kind mt-6" onClick={() => setAttempt((n) => n + 1)}>
          Try again
        </button>
      </div>
    );
  } else if (!loaded || loaded.events.length === 0) {
    content = (
      <div className="mx-auto max-w-lg rounded-[1.75rem] border border-dashed border-base-300 bg-base-200/50 px-8 py-14 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight">You haven&apos;t hosted anything yet</h2>
        <p className="mt-2 text-base-content/70">
          Start small. A street cleanup or a food drive with five friends is a great first event.
        </p>
        <Link href="/create-event" className="btn-kind mt-6">
          Host your first event
        </Link>
      </div>
    );
  } else {
    const events = loaded.events;
    const upcoming = events.filter((e) => !isPast(e.eventDate)).length;
    content = (
      <>
        <p className="mb-6 text-base-content/70">
          <span className="font-semibold text-base-content">
            {events.length} {events.length === 1 ? "event" : "events"}
          </span>
          {upcoming > 0 ? `, ${upcoming} still to come` : ", all finished"}
        </p>

        {/* desktop table */}
        <div className="hidden overflow-hidden rounded-[1.75rem] border border-base-300 bg-base-100 md:block">
          <table className="table">
            <thead>
              <tr className="border-base-300 bg-base-200/60 text-sm font-medium text-base-content/60">
                <th className="py-4 pl-6 font-medium">Event</th>
                <th className="font-medium">Date</th>
                <th className="font-medium">Location</th>
                <th className="font-medium">Status</th>
                <th className="pr-6 text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev._id} className="border-base-300 transition hover:bg-base-200/40">
                  <td className="py-4 pl-6">
                    <div className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ev.thumbnail} alt="" className="h-14 w-20 shrink-0 rounded-xl bg-base-200 object-cover" />
                      <div className="min-w-0">
                        <Link
                          href={`/events/${ev._id}`}
                          className="line-clamp-1 font-display text-base font-bold tracking-tight hover:text-primary"
                        >
                          {ev.title}
                        </Link>
                        <span className="text-sm text-base-content/60">{ev.eventType}</span>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap">
                    <DateCell date={ev.eventDate} />
                  </td>
                  <td className="max-w-52 text-sm text-base-content/75">
                    <span className="line-clamp-2">{ev.location}</span>
                  </td>
                  <td>
                    <StatusBadge date={ev.eventDate} />
                  </td>
                  <td className="pr-6">
                    <div className="flex justify-end gap-2">
                      <Link href={`/manage-events/${ev._id}/edit`} className="btn-kind-ghost btn-sm px-4" aria-label={`Update ${ev.title}`}>
                        Update
                      </Link>
                      <button type="button" className={deleteBtn} onClick={() => askDelete(ev)} aria-label={`Delete ${ev.title}`}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile cards */}
        <div className="grid gap-4 md:hidden">
          {events.map((ev) => (
            <article key={ev._id} className="ticket">
              <div className="flex gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ev.thumbnail} alt="" className="size-20 shrink-0 rounded-xl bg-base-200 object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm text-base-content/60">{ev.eventType}</span>
                    <StatusBadge date={ev.eventDate} />
                  </div>
                  <Link href={`/events/${ev._id}`} className="mt-1 line-clamp-2 font-display text-lg font-bold leading-snug tracking-tight">
                    {ev.title}
                  </Link>
                  <p className="mt-1 truncate text-sm text-base-content/60">{ev.location}</p>
                </div>
              </div>
              <div className="ticket-notch flex items-center justify-between gap-3 px-4 py-4">
                <DateCell date={ev.eventDate} />
                <div className="flex gap-2">
                  <Link href={`/manage-events/${ev._id}/edit`} className="btn-kind-ghost btn-sm px-4" aria-label={`Update ${ev.title}`}>
                    Update
                  </Link>
                  <button type="button" className={deleteBtn} onClick={() => askDelete(ev)} aria-label={`Delete ${ev.title}`}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-10 md:pt-14">
      {content}

      <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box rounded-[1.75rem] border border-base-300 p-7 sm:p-8">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-error/12 text-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-6" aria-hidden>
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
            </svg>
          </span>
          <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">Delete this event?</h3>
          <p className="mt-2 text-base-content/75">
            <span className="font-semibold text-base-content">{target?.title}</span> will be removed for good, and everyone who
            joined will lose their spot. This can&apos;t be undone.
          </p>
          <div className="modal-action mt-7 flex-col-reverse gap-2 sm:flex-row">
            <form method="dialog" className="w-full sm:w-auto">
              <button className="btn-kind-ghost w-full! sm:w-auto!" disabled={deleting}>
                Keep event
              </button>
            </form>
            <button type="button" className="btn btn-error w-full rounded-full px-6 sm:w-auto" onClick={confirmDelete} disabled={deleting}>
              {deleting && <span className="loading loading-spinner loading-sm" />}
              {deleting ? "Deleting..." : "Delete event"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close">close</button>
        </form>
      </dialog>
    </div>
  );
}

export function ManageEventsSkeleton() {
  return (
    <div>
      <div className="skeleton mb-6 h-5 w-56" />
      <div className="overflow-hidden rounded-[1.75rem] border border-base-300">
        <div className="hidden h-12 bg-base-200/60 md:block" />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 border-t border-base-300 p-4 first:border-t-0 md:px-6 md:first:border-t">
            <div className="skeleton h-14 w-20 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-3 w-1/4" />
            </div>
            <div className="skeleton hidden h-10 w-28 md:block" />
            <div className="skeleton hidden h-6 w-24 rounded-full md:block" />
            <div className="skeleton hidden h-8 w-40 rounded-full md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
