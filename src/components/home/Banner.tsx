import Link from "next/link";
import Constellation from "./Constellation";
import HeroSearch from "./HeroSearch";
import NextUp from "./NextUp";

export default function Banner() {
  return (
    <section className="grain relative isolate overflow-hidden bg-night text-white">
      {/* sunrise glow, sits under the dots */}
      <div
        aria-hidden
        className="absolute -right-40 top-1/2 -z-10 size-[46rem] -translate-y-1/2 rounded-full opacity-60 blur-[120px]"
        style={{ background: "radial-gradient(circle, #d63af9 0%, #5b3df5 45%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-56 left-1/4 -z-10 size-[30rem] rounded-full opacity-40 blur-[110px]"
        style={{ background: "radial-gradient(circle, #ffb547 0%, transparent 70%)" }}
      />
      <div className="absolute inset-0 -z-10">
        <Constellation />
      </div>

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-14 px-4 py-20 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <h1 className="display-xl animate-rise">
            Find your people.
            <br />
            <span className="text-sunrise">Do some good.</span>
          </h1>
          <p className="mt-7 max-w-xl animate-rise text-lg text-white/75 [animation-delay:120ms]">
            Cleanups, tree plantings, food drives and winter clothes collections happen near you every week. Kindred
            shows you where, and gets you there with one click.
          </p>
          <div className="mt-9 animate-rise [animation-delay:240ms]">
            <HeroSearch />
          </div>
          <p className="mt-5 animate-rise text-sm text-white/60 [animation-delay:320ms]">
            Organising something?{" "}
            <Link href="/create-event" className="font-semibold text-white underline decoration-secondary decoration-2 underline-offset-4 hover:text-secondary">
              Host an event
            </Link>
          </p>
        </div>

        <div className="flex animate-rise justify-center [animation-delay:400ms] lg:justify-end">
          <NextUp />
        </div>
      </div>
    </section>
  );
}
