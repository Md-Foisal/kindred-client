"use client";

import Link from "next/link";
import { LogoMark } from "@/components/layout/Logo";
import { EVENT_TYPES } from "@/lib/types";

// one slow line of causes, each one opens the events page filtered to it
export default function CauseMarquee() {
  const row = (copy: number) => (
    <ul className="flex shrink-0 items-center" aria-hidden={copy > 0 || undefined}>
      {EVENT_TYPES.map((cause) => (
        <li key={cause} className="flex items-center">
          <Link
            href={`/events?type=${encodeURIComponent(cause)}`}
            tabIndex={copy > 0 ? -1 : undefined}
            className="scroll-mx-4 rounded-full px-6 font-display text-2xl font-semibold tracking-[-0.03em] text-base-content/75 transition-colors [font-stretch:82%] hover:text-base-content md:px-9 md:text-[2rem]"
          >
            {cause}
          </Link>
          <LogoMark mono className="size-5 shrink-0 text-base-content/20" />
        </li>
      ))}
    </ul>
  );

  return (
    <nav aria-label="Browse by cause" className="border-b border-base-300 bg-base-100">
      {/* while tabbing the line stands still and scrolls to the focused cause */}
      <div
        onFocus={(e) => e.target.scrollIntoView({ block: "nearest", inline: "nearest" })}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.scrollLeft = 0;
        }}
        className="group relative flex overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] focus-within:[mask-image:none] md:py-8"
      >
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:animate-none">
          {row(0)}
          {row(1)}
        </div>
      </div>
    </nav>
  );
}
