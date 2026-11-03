"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import EventCard from "@/components/events/EventCard";
import { EventGridSkeleton } from "@/components/events/EventCardSkeleton";
import { api } from "@/lib/api";
import type { CommunityEvent } from "@/lib/types";

type Status = "loading" | "error" | "ready";

export default function RecentEvents() {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    api<CommunityEvent[]>("/api/events/recent")
      .then((data) => {
        if (ignore) return;
        setEvents(data);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (ignore) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
        setStatus("error");
      });
    // stop state updates if the user leaves the page early
    return () => {
      ignore = true;
    };
  }, [attempt]);

  const retry = () => {
    setStatus("loading");
    setAttempt((n) => n + 1);
  };

  return (
    <section className="bg-base-100 py-20 md:py-28" aria-labelledby="happening-soon">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-14 md:flex-row md:items-end">
          <div>
            <h2 id="happening-soon" className="section-title">
              Happening soon
            </h2>
            <p className="section-subtitle mt-4">
              The next drives, cleanups and camps on the calendar. Pick one that fits your week, press Join, and turn
              up with a pair of gloves.
            </p>
          </div>
          <Link href="/events" className="btn-kind-ghost shrink-0">
            See all events
          </Link>
        </div>

        {status === "loading" && <EventGridSkeleton count={6} />}

        {status === "error" && (
          <div className="flex flex-col items-start gap-5 rounded-box border border-base-300 bg-base-200 p-8 sm:flex-row sm:items-center sm:justify-between md:p-10">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-error/10 text-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5" aria-hidden>
                  <path d="M12 8v5M12 16.5v.01" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </span>
              <div>
                <p className="font-display text-xl font-bold tracking-tight">We could not load events right now.</p>
                <p className="mt-1 text-sm text-base-content/65">{error}</p>
              </div>
            </div>
            <button type="button" onClick={retry} className="btn-kind-ghost btn-sm">
              Try again
            </button>
          </div>
        )}

        {status === "ready" && events.length === 0 && (
          <div className="grid items-center gap-8 rounded-box border border-dashed border-base-300 bg-base-200 p-8 md:grid-cols-[1fr_auto] md:p-12">
            <div>
              <h3 className="font-display text-2xl font-bold tracking-tight [font-stretch:85%]">The calendar is empty, for now</h3>
              <p className="mt-2 max-w-lg text-base-content/70">
                Be the first to bring your neighbours together. A street cleanup or a food drive is a great place to
                start, and it only takes a couple of minutes to post.
              </p>
            </div>
            <Link href="/create-event" className="btn-kind justify-self-start">
              Host an event
            </Link>
          </div>
        )}

        {status === "ready" && events.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
