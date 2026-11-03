"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";
import { EVENT_TYPES, type CommunityEvent } from "@/lib/types";
import EventCard from "./EventCard";
import { EventGridSkeleton } from "./EventCardSkeleton";

type Result = { key: string; events: CommunityEvent[]; error: string | null };

function buildHref(pathname: string, current: string, changes: Record<string, string>) {
  const params = new URLSearchParams(current);
  for (const [k, v] of Object.entries(changes)) {
    if (v) params.set(k, v);
    else params.delete(k);
  }
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

const chipBase =
  "inline-flex h-10 shrink-0 items-center rounded-full border px-4 text-sm font-medium whitespace-nowrap transition";
const chipOn = "border-base-content bg-base-content text-base-100";
const chipOff = "border-base-300 bg-base-100 text-base-content/75 hover:border-base-content/40 hover:text-base-content";

export function FilterPanelSkeleton() {
  return (
    <div className="relative z-10 -mt-14 rounded-[1.75rem] border border-base-300 bg-base-100 p-3 shadow-[0_30px_80px_-40px_rgb(23_21_61/0.45)] sm:p-4">
      <div className="skeleton h-14 w-full rounded-full" />
      <div className="mt-3 flex gap-2 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-28 shrink-0 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export default function EventsBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  const search = (searchParams.get("search") ?? "").trim();
  const rawType = searchParams.get("type") ?? "";
  const type = (EVENT_TYPES as readonly string[]).includes(rawType) ? rawType : "";

  const [text, setText] = useState(search);
  const [syncedSearch, setSyncedSearch] = useState(search);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  // url changed from outside (back button etc), keep the box in sync
  if (search !== syncedSearch) {
    setSyncedSearch(search);
    if (text.trim() !== search) setText(search);
  }

  // wait a little after typing so we don't call the api on every key
  useEffect(() => {
    const value = text.trim();
    if (value === search) return;
    const timer = setTimeout(() => {
      router.replace(buildHref(pathname, query, { search: value }), { scroll: false });
    }, 400);
    return () => clearTimeout(timer);
  }, [text, search, query, pathname, router]);

  const key = `${search}|${type}|${attempt}`;
  const loading = result?.key !== key;

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (type) params.set("type", type);
    const qs = params.toString();

    api<CommunityEvent[]>(`/api/events${qs ? `?${qs}` : ""}`)
      .then((events) => {
        if (!cancelled) setResult({ key, events, error: null });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message =
          err instanceof ApiError ? err.message : "We could not reach the server. Check your connection and try again.";
        setResult({ key, events: [], error: message });
      });

    return () => {
      cancelled = true;
    };
  }, [key, search, type]);

  function changeType(value: string) {
    router.replace(buildHref(pathname, query, { type: value }), { scroll: false });
  }

  function clearFilters() {
    setText("");
    router.replace(pathname, { scroll: false });
  }

  const hasFilters = Boolean(search || type || text.trim());
  const events = result?.events ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24">
      <div
        role="search"
        className="relative z-10 -mt-14 rounded-[1.75rem] border border-base-300 bg-base-100 p-3 shadow-[0_30px_80px_-40px_rgb(23_21_61/0.45)] sm:p-4"
      >
        <div className="flex items-center gap-2">
          <label className="input h-14 w-full flex-1 gap-3 rounded-full border-base-300 bg-base-200/60 px-5 text-base transition duration-200 focus-within:border-primary focus-within:bg-base-100 focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_18%,transparent)] focus-within:outline-none">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 shrink-0 opacity-50" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              type="search"
              placeholder="Search by title or location, like “cleanup” or “Mirpur”"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label="Search events by title or location"
              className="grow focus:outline-none focus-visible:outline-none"
            />
          </label>
          {hasFilters && (
            <button type="button" className="btn-kind-ghost h-14! shrink-0" onClick={clearFilters}>
              Clear
            </button>
          )}
        </div>

        <div
          role="group"
          aria-label="Filter by cause"
          className="-mx-3 mt-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:-mx-4 sm:px-4 lg:flex-wrap lg:overflow-visible"
        >
          <button
            type="button"
            aria-pressed={!type}
            className={`${chipBase} ${!type ? chipOn : chipOff}`}
            onClick={() => changeType("")}
          >
            All causes
          </button>
          {EVENT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={type === t}
              className={`${chipBase} ${type === t ? chipOn : chipOff}`}
              // tapping the active chip again goes back to all
              onClick={() => changeType(type === t ? "" : t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        {loading ? (
          <>
            <div className="skeleton mb-6 h-5 w-48" />
            <EventGridSkeleton />
          </>
        ) : result?.error ? (
          <div className="mx-auto max-w-lg rounded-[1.75rem] border border-error/30 bg-error/5 px-8 py-12 text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight">We couldn&apos;t load events</h2>
            <p className="mt-2 text-base-content/70">{result.error}</p>
            <button type="button" className="btn-kind mt-6" onClick={() => setAttempt((n) => n + 1)}>
              Try again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-[1.75rem] border border-dashed border-base-300 bg-base-200/50 px-8 py-14 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-base-100 text-primary shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-7" aria-hidden>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M16 3v4M8 3v4M3 10h18M10 15h4" />
              </svg>
            </span>
            {hasFilters ? (
              <>
                <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">Nothing matches that yet</h2>
                <p className="mt-2 text-base-content/70">
                  Try a shorter word, check the spelling, or look across all causes.
                </p>
                <button type="button" className="btn-kind-ghost mt-6" onClick={clearFilters}>
                  Clear filters
                </button>
              </>
            ) : (
              <>
                <h2 className="mt-5 font-display text-2xl font-bold tracking-tight">No upcoming events yet</h2>
                <p className="mt-2 text-base-content/70">The calendar is open. Be the first to bring your neighbours together.</p>
                <Link href="/create-event" className="btn-kind mt-6">
                  Host an event
                </Link>
              </>
            )}
          </div>
        ) : (
          <>
            <p className="mb-6 text-base-content/70" aria-live="polite">
              <span className="font-semibold text-base-content">
                {events.length} upcoming {events.length === 1 ? "event" : "events"}
              </span>
              {type && ` in ${type}`}
              {search && ` matching “${search}”`}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
