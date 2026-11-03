import Link from "next/link";

// two people, overlapping. the left one is the sunrise, the right one is you.
export function LogoMark({ className = "size-8", mono = false }: { className?: string; mono?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <defs>
        <linearGradient id="kindred-mark" x1="2" y1="6" x2="22" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5b3df5" />
          <stop offset="0.55" stopColor="#d63af9" />
          <stop offset="1" stopColor="#ffb547" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="16" r="9" fill={mono ? "currentColor" : "url(#kindred-mark)"} />
      <circle cx="20.5" cy="16" r="8.25" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="16.25" cy="16" r="1.9" fill="currentColor" />
    </svg>
  );
}

export default function Logo() {
  return (
    <Link href="/" className="group flex items-center gap-2.5 rounded-full" aria-label="Kindred home">
      <LogoMark className="size-8 transition-transform duration-500 group-hover:rotate-[-8deg]" />
      <span className="font-display text-[1.6rem] font-bold leading-none tracking-[-0.04em] [font-stretch:85%]">
        Kindred
      </span>
    </Link>
  );
}
