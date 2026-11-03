import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  // optional actions on the right, e.g. a "new event" button
  children?: ReactNode;
  // extra room at the bottom when a panel floats over the band
  overlap?: boolean;
}

export const pageTitleClass =
  "font-display text-[clamp(2.4rem,1.5rem+3.2vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.045em] [font-stretch:78%] text-balance";

// white pill for actions that sit on the dark band
export const onDarkButtonClass =
  "btn rounded-full border-0 bg-white px-6 font-semibold tracking-tight text-ink hover:bg-secondary";

export default function PageHeader({ title, subtitle, children, overlap = false }: PageHeaderProps) {
  return (
    <section className="grain relative isolate overflow-hidden border-b border-white/10 bg-night text-white">
      <div
        aria-hidden
        className="absolute -right-32 -top-48 -z-10 size-[34rem] rounded-full opacity-55 blur-[110px]"
        style={{ background: "radial-gradient(circle, #d63af9 0%, #5b3df5 45%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-64 right-1/3 -z-10 size-[24rem] rounded-full opacity-30 blur-[100px]"
        style={{ background: "radial-gradient(circle, #ffb547 0%, transparent 70%)" }}
      />

      <div className={`mx-auto max-w-7xl px-4 pt-14 md:pt-20 ${overlap ? "pb-24 md:pb-28" : "pb-14 md:pb-20"}`}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <h1 className={pageTitleClass}>{title}</h1>
            {subtitle && <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70 text-pretty">{subtitle}</p>}
          </div>
          {children && <div className="flex shrink-0 flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}
