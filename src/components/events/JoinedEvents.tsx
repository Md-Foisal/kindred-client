"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatDate, formatTime, isPast } from "@/lib/format";
import type { JoinedRow } from "@/lib/types";

type Loaded = { key: string; rows: JoinedRow[]; error: string | null };

export default function JoinedEvents() {
  const { data: session, isPending } = useSession();
  const email = session?.user?.email;

  const [attempt, setAttempt] = useState(0);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const key = `${email}|${attempt}`;

  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    api<JoinedRow[]>("/api/joined", { auth: true })
      .then((rows) => {
        if (!cancelled) setLoaded({ key, rows, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof ApiError ? err.message : "We could not reach the server.";
        setLoaded({ key, rows: [], error: message });
      });
    return () => {
      cancelled = true;
    };
  }, [email, key]);

  let content;
  if (isPending || (email && loaded?.key !== key)) {
    content = <JoinedEventsSkeleton />;
  } else if (!email) {
    content = (
      <div className="mx-auto max-w-lg rounded-[1.75rem] border border-base-300 bg-base-200/50 px-8 py-14 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight">Your session has ended</h2>
        <p className="mt-2 text-base-content/70">Log in again to see the events you joined.</p>
        <Link href="/login?redirect=/joined-events" className="btn-kind mt-6">
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
  } else if (!loaded || loaded.rows.length === 0) {
    content = (
      <div className="mx-auto max-w-lg rounded-[1.75rem] border border-dashed border-base-300 bg-base-200/50 px-8 py-14 text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight">No tickets yet</h2>
        <p className="mt-2 text-base-content/70">
          Find something happening near you and save your spot in one click. It&apos;ll show up here.
        </p>
        <Link href="/events" className="btn-kind mt-6">
          Browse upcoming events
        </Link>
      </div>
    );
  } else {
    // server already sorts by event date, keep that order inside each group
    const upcoming = loaded.rows.filter((r) => !isPast(r.event.eventDate));
    const finished = loaded.rows.filter((r) => isPast(r.event.eventDate));
    content = (
      <div className="space-y-14">
        {upcoming.length > 0 ? (
          <Group title="Coming up" count={upcoming.length}>
            {upcoming.map((row) => (
              <TicketRow key={row.joinId} row={row} past={false} />
            ))}
          </Group>
        ) : (
          <div className="flex flex-col items-start justify-between gap-4 rounded-[1.75rem] border border-dashed border-base-300 bg-base-200/50 p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight">Nothing coming up</h2>
              <p className="mt-1 text-base-content/70">Everything you joined has wrapped up. Find your next one.</p>
            </div>
            <Link href="/events" className="btn-kind shrink-0">
              Browse upcoming events
            </Link>
          </div>
        )}
        {finished.length > 0 && (
          <Group title="Finished" count={finished.length}>
            {finished.map((row) => (
              <TicketRow key={row.joinId} row={row} past />
            ))}
          </Group>
        )}
      </div>
    );
  }

  return <div className="mx-auto max-w-5xl px-4 pb-24 pt-10 md:pt-14">{content}</div>;
}

function Group({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-5 flex items-baseline gap-3 font-display text-2xl font-bold tracking-tight">
        {title}
        <span className="font-sans text-base font-medium text-base-content/50">{count}</span>
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

// a wide ticket: photo, details, then a torn-off stub with the date
function TicketRow({ row, past }: { row: JoinedRow; past: boolean }) {
  const { event, joinedAt } = row;
  const d = new Date(event.eventDate);
  const month = d.toLocaleDateString("en-US", { month: "short" });
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });

  return (
    <article className={`ticket group flex flex-col sm:flex-row ${past ? "bg-base-200/40" : ""}`}>
      <figure className="relative aspect-[16/9] shrink-0 overflow-hidden bg-base-200 sm:aspect-auto sm:w-52">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail}
          alt={event.title}
          loading="lazy"
          className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${past ? "grayscale opacity-70" : ""}`}
        />
      </figure>

      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${past ? "bg-base-300/60 text-base-content/60" : "bg-secondary/25"}`}>
            {event.eventType}
          </span>
          {past ? (
            <span className="text-xs font-medium text-base-content/50">Finished</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success">
              <span className="size-1.5 rounded-full bg-success" aria-hidden />
              You&apos;re going
            </span>
          )}
        </div>
        <h3 className={`mt-3 line-clamp-2 font-display text-xl font-bold leading-tight tracking-tight ${past ? "text-base-content/70" : ""}`}>
          {event.title}
        </h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-base-content/65">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`size-4 shrink-0 ${past ? "" : "text-primary"}`} aria-hidden>
            <path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11z" />
            <circle cx="12" cy="10" r="2" />
          </svg>
          <span className="truncate">{event.location}</span>
        </p>
        <p className="mt-auto pt-4 text-xs text-base-content/50">Joined on {formatDate(joinedAt)}</p>
      </div>

      {/* mobile: tear line runs across, desktop: it runs down */}
      <div className="ticket-notch sm:hidden" aria-hidden />
      <div className="relative hidden w-0 border-l-2 border-dashed border-base-300 sm:block" aria-hidden>
        <span className="absolute -left-[12px] -top-[12px] size-[22px] rounded-full border border-base-300 bg-base-200" />
        <span className="absolute -bottom-[12px] -left-[12px] size-[22px] rounded-full border border-base-300 bg-base-200" />
      </div>

      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:w-44 sm:shrink-0 sm:flex-col sm:justify-center sm:px-5 sm:py-6 sm:text-center">
        <div className="flex items-center gap-3 sm:flex-col sm:gap-1">
          <div
            className={`flex w-14 flex-col items-center rounded-2xl py-1.5 ${
              past ? "bg-base-200 text-base-content/60" : "bg-base-content text-base-100"
            }`}
          >
            <span className="text-xs font-semibold opacity-80">{month}</span>
            <span className="font-display text-2xl font-extrabold leading-none">{d.getDate()}</span>
          </div>
          <div className="text-sm leading-tight sm:mt-2">
            <p className="font-semibold">{weekday}</p>
            <p className="text-base-content/60">{formatTime(event.eventDate)}</p>
          </div>
        </div>
        <Link
          href={`/events/${event._id}`}
          className={`${past ? "btn-kind-ghost" : "btn-kind"} btn-sm sm:mt-3`}
          aria-label={`View event: ${event.title}`}
        >
          View event
        </Link>
      </div>
    </article>
  );
}

export function JoinedEventsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="skeleton mb-5 h-7 w-40" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="ticket flex flex-col sm:flex-row">
          <div className="skeleton aspect-[16/9] rounded-none sm:aspect-auto sm:h-auto sm:w-52" />
          <div className="flex-1 space-y-3 p-5 sm:p-6">
            <div className="skeleton h-6 w-24 rounded-full" />
            <div className="skeleton h-6 w-4/5" />
            <div className="skeleton h-4 w-1/2" />
            <div className="skeleton h-3 w-28" />
          </div>
          <div className="flex items-center justify-between gap-3 border-t-2 border-dashed border-base-300 p-5 sm:w-44 sm:flex-col sm:justify-center sm:border-l-2 sm:border-t-0">
            <div className="skeleton h-14 w-14 rounded-2xl" />
            <div className="skeleton h-8 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
