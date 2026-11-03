import type { ReactNode } from "react";
import Constellation from "@/components/home/Constellation";

interface AuthShellProps {
  title: string;
  subtitle: string;
  // short line on the dark panel
  line: string;
  caption: string;
  children: ReactNode;
}

// tall rounded field, red when wrong, violet ring while typing
export function authInputClass(error?: string) {
  return `input h-12 w-full bg-base-100 px-4 text-base ${error ? "input-error" : "focus-within:outline-primary"}`;
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-error">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 shrink-0" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
      {children}
    </p>
  );
}

export function FieldLabel({ htmlFor, children, extra }: { htmlFor: string; children: ReactNode; extra?: ReactNode }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {children}
      </label>
      {extra}
    </div>
  );
}

export function PasswordToggle({ shown, onToggle }: { shown: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="btn btn-ghost btn-circle btn-sm -mr-2 text-base-content/60 hover:text-base-content"
      onClick={onToggle}
      aria-label={shown ? "Hide password" : "Show password"}
      aria-pressed={shown}
    >
      {shown ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5" aria-hidden>
          <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A9.8 9.8 0 0 1 12 4c5 0 9 4.5 10 8a12.6 12.6 0 0 1-3.2 4.8M6.1 6.1C3.9 7.6 2.5 9.8 2 12c1 3.5 5 8 10 8a9.7 9.7 0 0 0 5.9-2.1" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5" aria-hidden>
          <path d="M2 12c1-3.5 5-8 10-8s9 4.5 10 8c-1 3.5-5 8-10 8S3 15.5 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )}
    </button>
  );
}

// form on the left, a dark panel with the moving dots on the right (desktop only)
export default function AuthShell({ title, subtitle, line, caption, children }: AuthShellProps) {
  return (
    <section className="mx-auto grid max-w-[96rem] lg:min-h-[calc(100svh-4rem)] lg:grid-cols-2">
      <div className="flex items-center justify-center px-4 py-12 sm:px-8 md:py-16">
        <div className="w-full max-w-[27rem]">
          <h1 className="font-display text-[clamp(2.4rem,1.8rem+2vw,3.4rem)] font-extrabold leading-[0.98] tracking-[-0.04em] [font-stretch:80%]">
            {title}
          </h1>
          <p className="mt-3 text-base-content/70 text-pretty">{subtitle}</p>
          <div className="mt-9">{children}</div>
        </div>
      </div>

      <div className="hidden p-3 lg:block">
        <div className="sticky top-[4.75rem] h-[calc(100svh-5.5rem)] min-h-[34rem]">
          <div className="grain relative isolate h-full overflow-hidden rounded-[2rem] border border-white/10 bg-night text-white">
            <div
              aria-hidden
              className="absolute -right-40 -top-24 -z-10 size-[40rem] rounded-full opacity-60 blur-[120px]"
              style={{ background: "radial-gradient(circle, #d63af9 0%, #5b3df5 45%, transparent 70%)" }}
            />
            <div
              aria-hidden
              className="absolute -bottom-56 -left-20 -z-10 size-[28rem] rounded-full opacity-40 blur-[110px]"
              style={{ background: "radial-gradient(circle, #ffb547 0%, transparent 70%)" }}
            />
            <div className="absolute inset-0 -z-10">
              <Constellation />
            </div>

            <div className="pointer-events-none flex h-full flex-col justify-end p-12 xl:p-16">
              <p className="max-w-xl font-display text-[clamp(2.4rem,1rem+2.6vw,3.9rem)] font-extrabold leading-[0.96] tracking-[-0.045em] [font-stretch:78%] text-balance">
                {line}
              </p>
              <p className="mt-5 max-w-md text-lg text-white/70 text-pretty">{caption}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
