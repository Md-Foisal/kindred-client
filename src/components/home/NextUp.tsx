"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatTime } from "@/lib/format";
import type { CommunityEvent } from "@/lib/types";

// the soonest real event, so the hero always shows something happening
export default function NextUp() {
  const [event, setEvent] = useState<CommunityEvent | null | undefined>(undefined);

  useEffect(() => {
    let ignore = false;
    api<CommunityEvent[]>("/api/events/recent")
      .then((list) => !ignore && setEvent(list[0] ?? null))
      .catch(() => !ignore && setEvent(null));
    return () => {
      ignore = true;
    };
  }, []);

  if (event === undefined) {
    return <div className="h-[300px] w-full max-w-sm animate-pulse rounded-[1.75rem] bg-white/10" />;
  }

  if (!event) {
    return (
      <div className="w-full max-w-sm rounded-[1.75rem] border border-white/15 bg-white/10 p-6 text-white backdrop-blur-xl">
        <p className="font-display text-2xl font-bold tracking-tight">The calendar is open.</p>
        <p className="mt-2 text-white/70">No events are planned yet. Be the first to host one in your area.</p>
        <Link href="/create-event" className="btn mt-5 rounded-full border-0 bg-white text-ink hover:bg-secondary">
          Host an event
        </Link>
      </div>
    );
  }

  const d = new Date(event.eventDate);
  return (
    <Link
      href={`/events/${event._id}`}
      className="group block w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 text-white backdrop-blur-xl transition hover:border-white/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.thumbnail} alt={event.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-night/70 px-3 py-1 text-xs font-semibold backdrop-blur">
          Next up
        </span>
      </div>
      <div className="flex gap-4 p-5">
        <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-white text-ink">
          <span className="text-xs font-semibold">{d.toLocaleDateString("en-US", { month: "short" })}</span>
          <span className="font-display text-2xl font-extrabold leading-none">{d.getDate()}</span>
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-bold leading-snug tracking-tight">{event.title}</p>
          <p className="mt-1 truncate text-sm text-white/70">
            {event.location}, {formatTime(event.eventDate)}
          </p>
        </div>
      </div>
    </Link>
  );
}
