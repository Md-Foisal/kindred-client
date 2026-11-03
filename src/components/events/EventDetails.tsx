"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { formatTime, isPast } from "@/lib/format";
import type { CommunityEvent } from "@/lib/types";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; event: CommunityEvent }
  | { status: "missing" }
  | { status: "error"; message: string };

function errorText(err: unknown) {
  return err instanceof ApiError ? err.message : "We could not reach the server. Please try again.";
}

const titleClass =
  "font-display text-[clamp(2.25rem,1.4rem+3vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.04em] [font-stretch:80%] text-balance";

function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full py-1 pr-3 text-sm font-medium text-base-content/70 transition hover:text-base-content"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden>
        <path d="m15 18-6-6 6-6" />
      </svg>
      {children}
    </Link>
  );
}

export default function EventDetails({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [count, setCount] = useState(0);
  const [attempt, setAttempt] = useState(0);
  // remember whose join status this is, so a different login never sees stale data
  const [joinInfo, setJoinInfo] = useState<{ email: string; joined: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [hostImgBroken, setHostImgBroken] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api<CommunityEvent>(`/api/events/${id}`)
      .then((event) => {
        if (cancelled) return;
        setState({ status: "ready", event });
        setCount(event.joinedCount ?? 0);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) setState({ status: "missing" });
        else setState({ status: "error", message: errorText(err) });
      });
    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  const event = state.status === "ready" ? state.event : null;
  const email = user?.email;
  const hostEmail = event?.creatorEmail;
  const isHost = Boolean(email && hostEmail && email === hostEmail);

  useEffect(() => {
    if (!email || !hostEmail || email === hostEmail) return;
    let cancelled = false;
    api<{ joined: boolean }>(`/api/events/${id}/join-status`, { auth: true })
      .then((res) => {
        if (!cancelled) setJoinInfo({ email, joined: res.joined });
      })
      .catch(() => {
        if (!cancelled) setJoinInfo({ email, joined: false });
      });
    return () => {
      cancelled = true;
    };
  }, [email, hostEmail, id]);

  const joined = email && joinInfo?.email === email ? joinInfo.joined : null;

  async function handleJoin() {
    if (!user) {
      toast.info("Please log in to join this event");
      router.push(`/login?redirect=/events/${id}`);
      return;
    }
    setBusy(true);
    try {
      await api(`/api/events/${id}/join`, { method: "POST", auth: true });
      setJoinInfo({ email: user.email, joined: true });
      setCount((n) => n + 1);
      toast.success("You're in! The event is now in your Joined Events.");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setJoinInfo({ email: user.email, joined: true });
        toast.info("You already joined this event");
      } else {
        toast.error(errorText(err));
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleLeave() {
    if (!user) return;
    setBusy(true);
    try {
      await api(`/api/events/${id}/join`, { method: "DELETE", auth: true });
      setJoinInfo({ email: user.email, joined: false });
      setCount((n) => Math.max(0, n - 1));
      toast.success("You left the event");
    } catch (err) {
      toast.error(errorText(err));
    } finally {
      setBusy(false);
    }
  }

  if (state.status === "loading") return <EventDetailsSkeleton />;

  if (state.status === "missing") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center md:py-32">
        <p className="display-xl text-base-content/15">404</p>
        <h1 className="section-title mt-6">We couldn&apos;t find that event</h1>
        <p className="section-subtitle mx-auto mt-4">
          The host may have removed it, or the link is missing a character. Have a look at what&apos;s coming up instead.
        </p>
        <Link href="/events" className="btn-kind h-12! text-base! mt-9">
          Browse upcoming events
        </Link>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center md:py-32">
        <h1 className="section-title">This event didn&apos;t load</h1>
        <p className="section-subtitle mx-auto mt-4">{state.message}</p>
        <button type="button" className="btn-kind h-12! text-base! mt-9" onClick={() => setAttempt((n) => n + 1)}>
          Try again
        </button>
      </div>
    );
  }

  const ev = state.event;
  const past = isPast(ev.eventDate);
  const d = new Date(ev.eventDate);

  let action: ReactNode;
  if (isHost) {
    action = (
      <div className="space-y-3">
        <p className="flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 shrink-0" aria-hidden>
            <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.4 6.8 19.1l1-5.8L3.5 9.2l5.9-.9z" />
          </svg>
          You&apos;re hosting this event
        </p>
        <Link href="/manage-events" className="btn-kind-ghost w-full!">
          Manage your events
        </Link>
      </div>
    );
  } else if (past) {
    action = (
      <div className="space-y-3">
        <button type="button" className="btn btn-lg w-full rounded-full" disabled>
          This event has ended
        </button>
        {joined && <p className="text-center text-sm text-base-content/70">You joined this one. Thanks for showing up.</p>}
      </div>
    );
  } else if (isPending || (user && joined === null)) {
    action = (
      <button type="button" className="btn-kind h-12! w-full! text-base! disabled:opacity-60" disabled>
        <span className="loading loading-spinner loading-sm" />
        Checking your spot
      </button>
    );
  } else if (joined) {
    action = (
      <div className="space-y-2">
        <p className="flex items-center justify-center gap-2 rounded-full bg-success/15 px-4 py-3 font-semibold text-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="size-5" aria-hidden>
            <path d="M5 13l4 4L19 7" />
          </svg>
          You&apos;re going
        </p>
        <div className="text-center">
          <button
            type="button"
            className="btn btn-ghost btn-sm rounded-full font-medium text-base-content/60 hover:text-error"
            onClick={handleLeave}
            disabled={busy}
          >
            {busy ? "Leaving..." : "Can't make it? Leave event"}
          </button>
        </div>
      </div>
    );
  } else {
    action = (
      <div className="space-y-3">
        <button type="button" className="btn-kind h-12! w-full! text-base! disabled:opacity-60" onClick={handleJoin} disabled={busy}>
          {busy && <span className="loading loading-spinner loading-sm" />}
          {busy ? "Saving your spot..." : "Join event"}
        </button>
        {!user && <p className="text-center text-sm text-base-content/60">You&apos;ll log in first, then come right back.</p>}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 md:pt-10">
      <BackLink href="/events">All events</BackLink>

      <header className="mt-6 max-w-4xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-secondary/25 px-3 py-1 text-sm font-semibold text-base-content">{ev.eventType}</span>
          {past && (
            <span className="rounded-full bg-base-200 px-3 py-1 text-sm font-medium text-base-content/60">Finished</span>
          )}
        </div>
        <h1 className={`${titleClass} mt-4`}>{ev.title}</h1>
        <p className="mt-4 flex items-start gap-2 text-lg text-base-content/70">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-1 size-5 shrink-0 text-primary" aria-hidden>
            <path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11z" />
            <circle cx="12" cy="10" r="2" />
          </svg>
          {ev.location}
        </p>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-12">
        <figure className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] bg-base-200 lg:col-start-1 lg:row-start-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ev.thumbnail} alt={ev.title} className={`h-full w-full object-cover ${past ? "grayscale-[40%]" : ""}`} />
        </figure>

        {/* the side ticket, sticks while you read on desktop */}
        <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="ticket shadow-[0_30px_80px_-45px_rgb(23_21_61/0.5)] lg:sticky lg:top-24">
            <div className="flex items-center gap-4 p-6">
              <div className="flex w-16 shrink-0 flex-col items-center rounded-2xl bg-base-content py-2 text-base-100">
                <span className="text-xs font-semibold opacity-80">{d.toLocaleDateString("en-US", { month: "short" })}</span>
                <span className="font-display text-3xl font-extrabold leading-none">{d.getDate()}</span>
              </div>
              <div className="min-w-0">
                <p className="font-display text-xl font-bold leading-tight tracking-tight">
                  {d.toLocaleDateString("en-US", { weekday: "long" })}
                </p>
                <p className="text-base-content/65">
                  {d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            <dl className="space-y-4 px-6 pb-6">
              <InfoRow label="Starts at" icon={<path d="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />}>
                {formatTime(ev.eventDate)}, your local time
              </InfoRow>
              <InfoRow
                label="Where"
                icon={<path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />}
              >
                {ev.location}
              </InfoRow>
              <InfoRow
                label="Going"
                icon={<path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" />}
              >
                {count === 0 ? "No one yet, be the first" : `${count} ${count === 1 ? "person has" : "people have"} joined`}
              </InfoRow>
            </dl>

            <div className="ticket-notch space-y-5 p-6">
              {action}
              <div className="flex items-center gap-3 border-t border-base-300 pt-5">
                <span className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sunrise font-display font-bold text-white">
                  {ev.creatorName.charAt(0).toUpperCase()}
                  {ev.creatorImage && !hostImgBroken && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ev.creatorImage}
                      alt=""
                      referrerPolicy="no-referrer"
                      onError={() => setHostImgBroken(true)}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                </span>
                <div className="min-w-0 text-sm leading-tight">
                  <p className="text-base-content/60">Hosted by</p>
                  <p className="truncate text-base font-semibold">{ev.creatorName}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section className="lg:col-start-1 lg:row-start-2">
          <h2 className="font-display text-2xl font-bold tracking-tight">About this event</h2>
          <p className="mt-4 max-w-[68ch] whitespace-pre-line text-lg leading-[1.75] text-base-content/85">{ev.description}</p>
        </section>
      </div>
    </div>
  );
}

function InfoRow({ label, icon, children }: { label: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden>
          {icon}
        </svg>
      </span>
      <div className="min-w-0 text-sm leading-snug">
        <dt className="text-base-content/60">{label}</dt>
        <dd className="mt-0.5 text-base font-medium break-words">{children}</dd>
      </div>
    </div>
  );
}

export function EventDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-8 md:pt-10">
      <div className="skeleton h-6 w-24 rounded-full" />
      <div className="mt-6 max-w-4xl space-y-4">
        <div className="skeleton h-7 w-28 rounded-full" />
        <div className="skeleton h-14 w-4/5" />
        <div className="skeleton h-6 w-1/3" />
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-12">
        <div className="space-y-8">
          <div className="skeleton aspect-[16/10] w-full rounded-[2rem]" />
          <div className="space-y-3">
            <div className="skeleton h-7 w-48" />
            <div className="skeleton h-4 w-full max-w-[68ch]" />
            <div className="skeleton h-4 w-full max-w-[68ch]" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
        <div className="ticket self-start">
          <div className="flex items-center gap-4 p-6">
            <div className="skeleton h-16 w-16 shrink-0 rounded-2xl" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-5 w-28" />
              <div className="skeleton h-4 w-36" />
            </div>
          </div>
          <div className="space-y-4 px-6 pb-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="skeleton size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-3 w-16" />
                  <div className="skeleton h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
          <div className="ticket-notch p-6">
            <div className="skeleton h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
