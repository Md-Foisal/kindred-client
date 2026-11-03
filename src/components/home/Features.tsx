import Link from "next/link";
import type { ReactNode } from "react";

interface Step {
  title: string;
  text: string;
  // a tiny piece of the real ui, so each step shows what you will actually see
  peek: ReactNode;
}

const icon = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const peekBase = "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium";
const peekClass = `${peekBase} border-base-300 bg-base-100 text-base-content/80`;

const steps: Step[] = [
  {
    title: "Find",
    text: "Search by place or name, then narrow it down to the kind of help you want to give, from cleanups to health camps.",
    peek: (
      <span className={peekClass}>
        <svg {...icon} className="size-4 text-base-content/50">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        Plantation, this weekend
      </span>
    ),
  },
  {
    title: "Join",
    text: "Like what you see? Press Join and your spot is saved. No forms to fill in, no phone calls to make.",
    peek: (
      <span className={`${peekBase} border-base-content bg-base-content text-base-100`}>
        <svg {...icon} className="size-4">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
        You are going
      </span>
    ),
  },
  {
    title: "Show up",
    text: "The date, time and meeting point live on the event page. Bring gloves, bring a friend, or just bring yourself.",
    peek: (
      <span className={peekClass}>
        <svg {...icon} className="size-4 text-base-content/50">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
        Sat, 9:00 AM at the north gate
      </span>
    ),
  },
  {
    title: "Look back",
    text: "Everything you joined sits in one list, soonest first, so you always know what is next and what you have done.",
    peek: (
      <span className={peekClass}>
        <svg {...icon} className="size-4 text-base-content/50">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        12 events joined
      </span>
    ),
  },
];

const organiserPoints = [
  {
    title: "Post it in a couple of minutes",
    text: "A title, the cause, where, when and a cover photo. It goes live the moment you save.",
  },
  {
    title: "Change it when plans change",
    text: "Move the date, fix the address or take it down. Only you can edit what you posted.",
  },
  {
    title: "Know who is coming",
    text: "Every event you run shows a live count of people who joined, so you bring enough bags.",
  },
];

export default function Features() {
  return (
    <section className="bg-base-200 py-20 md:py-28" aria-labelledby="how-it-works">
      <div className="mx-auto max-w-7xl px-4">
        <div className="max-w-2xl">
          <h2 id="how-it-works" className="section-title">
            How it works
          </h2>
          <p className="section-subtitle mt-4">
            Four steps from scrolling to showing up. It works on any screen, in light or dark mode, whichever is
            kinder to your eyes before a 7 AM cleanup.
          </p>
        </div>

        {/* the rail: vertical on phones, a horizontal line on desktop */}
        <ol className="relative mt-14 grid gap-12 md:mt-20 lg:grid-cols-4 lg:gap-8">
          <span
            aria-hidden
            className="absolute bottom-4 left-[1.375rem] top-4 w-px bg-base-300 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[1.375rem] lg:h-px lg:w-auto lg:bg-gradient-to-r lg:from-base-content/25 lg:via-base-300 lg:to-transparent"
          />
          {steps.map((s, i) => (
            <li key={s.title} className="relative grid grid-cols-[2.75rem_1fr] gap-x-5 lg:flex lg:flex-col">
              <span className="relative z-10 grid size-11 place-items-center rounded-full border border-base-content/20 bg-base-200 font-display text-lg font-bold tabular-nums">
                {i + 1}
              </span>
              <div className="lg:mt-8 lg:pr-6">
                <h3 className="font-display text-3xl font-bold tracking-[-0.035em] [font-stretch:85%]">{s.title}</h3>
                <p className="mt-3 text-base-content/70">{s.text}</p>
                <div className="mt-6" aria-hidden>
                  {s.peek}
                </div>
              </div>
            </li>
          ))}
        </ol>

        {/* organisers get their own panel, always dark so it reads as a different mode */}
        <div
          data-theme="kindred-dark"
          className="grain relative isolate mt-24 overflow-hidden rounded-[2rem] border border-white/10 bg-night text-white md:mt-32"
        >
          <div
            aria-hidden
            className="absolute -right-32 -top-40 -z-10 size-[34rem] rounded-full opacity-45 blur-[110px]"
            style={{ background: "radial-gradient(circle, #5b3df5 0%, #d63af9 40%, transparent 70%)" }}
          />
          <div className="grid grid-cols-1 gap-12 p-6 sm:p-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:p-14">
            <div className="flex flex-col">
              <h2 className="section-title">Host an event without the admin</h2>
              <p className="section-subtitle mt-4">
                Organising a cleanup should not mean a spreadsheet, a group chat and a clipboard. Post it once and
                Kindred keeps everyone in the loop.
              </p>

              <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
                {organiserPoints.map((p) => (
                  <li key={p.title} className="py-5">
                    <h3 className="font-display text-lg font-bold tracking-tight">{p.title}</h3>
                    <p className="mt-1 text-[0.95rem] text-white/65">{p.text}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-10">
                <Link href="/create-event" className="btn-kind">
                  Create an event
                </Link>
                <Link href="/manage-events" className="btn-kind-ghost">
                  Manage your events
                </Link>
              </div>
            </div>

            <FormPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

// a made up create event form, pure html and css, nothing here is clickable
function FormPreview() {
  const field = "flex h-11 min-w-0 items-center overflow-hidden whitespace-nowrap rounded-[0.875rem] border border-base-300 bg-base-100 px-3.5 text-[0.9rem]";
  const label = "mb-1.5 block text-xs font-semibold text-base-content/60";

  return (
    <div className="relative flex flex-col justify-center sm:pb-12 lg:pb-0" aria-hidden>
      <div
        data-theme="kindred"
        className="relative rounded-[1.5rem] border border-white/10 bg-base-100 p-5 text-base-content shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)] sm:p-7 lg:rotate-[1.25deg]"
      >
        <div className="flex items-center justify-between border-b border-base-300 pb-4">
          <p className="font-display text-xl font-bold tracking-tight">New event</p>
          <span className="flex items-center gap-1.5 text-xs text-base-content/55">
            <span className="size-1.5 rounded-full bg-success" />
            Draft saved
          </span>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <span className={label}>Title</span>
            <div className={`${field} border-primary ring-4 ring-primary/15`}>
              Saturday riverbank cleanup
              <span className="ml-0.5 h-4 w-px animate-pulse bg-base-content" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className={label}>Cause</span>
              <div className={`${field} justify-between`}>
                Cleanup
                <svg {...icon} className="size-4 text-base-content/40">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
            <div>
              <span className={label}>Date</span>
              <div className={field}>Sat, 9:00 AM</div>
            </div>
          </div>
          <div>
            <span className={label}>Location</span>
            <div className={field}>North gate, Dhanmondi Lake</div>
          </div>
          <div>
            <span className={label}>Cover photo</span>
            <div className="flex h-16 items-center gap-3 rounded-[0.875rem] border border-dashed border-base-300 bg-base-200 px-3">
              <span className="grid size-10 place-items-center rounded-lg bg-base-300 text-base-content/50">
                <svg {...icon} className="size-5">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <circle cx="9" cy="10" r="2" />
                  <path d="M21 16l-5-5-9 9" />
                </svg>
              </span>
              <span className="text-sm text-base-content/60">riverbank.jpg</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end">
          <span className="btn-kind btn-sm pointer-events-none">Publish event</span>
        </div>
      </div>

      {/* the manage view, peeking out from under the form */}
      <div
        data-theme="kindred"
        className="relative z-10 -mt-4 mx-2 flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-3 pr-4 text-base-content shadow-[0_30px_60px_-25px_rgb(0_0_0/0.55)] sm:absolute sm:-bottom-2 sm:-left-4 sm:mt-0 sm:ml-0 sm:w-80 lg:-bottom-8 lg:-left-8 lg:-rotate-[1.5deg]"
      >
        <div className="flex -space-x-2">
          {["#5b3df5", "#d63af9", "#ffb547"].map((c, i) => (
            <span
              key={c}
              className="grid size-8 place-items-center rounded-full border-2 border-base-100 text-[0.65rem] font-bold text-white"
              style={{ background: c }}
            >
              {["AM", "JO", "LK"][i]}
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold">24 people are coming</p>
          <p className="truncate text-xs text-base-content/55">Saturday riverbank cleanup</p>
        </div>
        <span className="hidden size-8 shrink-0 place-items-center rounded-full bg-base-200 text-base-content/60 min-[400px]:grid">
          <svg {...icon} className="size-4">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
          </svg>
        </span>
      </div>
    </div>
  );
}
