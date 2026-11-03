import Link from "next/link";
import { formatTime } from "@/lib/format";
import type { CommunityEvent } from "@/lib/types";

// every event looks like a ticket: photo on top, a tear line, then the when and where
export default function EventCard({ event }: { event: CommunityEvent }) {
  const d = new Date(event.eventDate);

  return (
    <article className="ticket group flex h-full flex-col transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_color-mix(in_oklab,var(--color-primary)_60%,transparent)]">
      <figure className="relative aspect-[16/10] overflow-hidden bg-base-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-base-100/90 px-3 py-1 text-xs font-semibold text-base-content backdrop-blur">
          {event.eventType}
        </span>
      </figure>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 min-h-[3.3rem] font-display text-xl font-bold leading-tight tracking-tight">
          {event.title}
        </h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-base-content/70">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 shrink-0 text-primary">
            <path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11z" />
            <circle cx="12" cy="10" r="2" />
          </svg>
          <span className="truncate">{event.location}</span>
        </p>
      </div>

      <div className="ticket-notch mt-auto flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex w-12 flex-col items-center rounded-xl bg-base-200 py-1">
            <span className="text-[0.7rem] font-semibold text-base-content/60">
              {d.toLocaleDateString("en-US", { month: "short" })}
            </span>
            <span className="font-display text-xl font-extrabold leading-none">{d.getDate()}</span>
          </div>
          <div className="text-sm leading-tight">
            <p className="font-semibold">{d.toLocaleDateString("en-US", { weekday: "long" })}</p>
            <p className="text-base-content/60">{formatTime(event.eventDate)}</p>
          </div>
        </div>
        <Link href={`/events/${event._id}`} className="btn-kind btn-sm" aria-label={`View event: ${event.title}`}>
          View Event
        </Link>
      </div>
    </article>
  );
}
