import Link from "next/link";
import Logo from "./Logo";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Upcoming Events" },
  { href: "/create-event", label: "Create Event" },
];

const socials = [
  {
    label: "Md Foisal on Facebook",
    href: "https://www.facebook.com/foisal7475",
    path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z",
  },
  {
    // the new x logo, not the old bird
    label: "Kindred on X",
    href: "https://x.com",
    path: "M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64z",
  },
  {
    label: "Md Foisal on LinkedIn",
    href: "https://www.linkedin.com/in/md-foisal-395848142/",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z",
  },
  {
    label: "Kindred on YouTube",
    href: "https://youtube.com",
    path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z",
  },
];

const linkClass = "text-white/65 transition-colors hover:text-white";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-night text-white">
      <div className="mx-auto max-w-7xl px-4 pt-16 md:pt-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-12">
          <div className="col-span-2 md:col-span-6 lg:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm font-display text-2xl font-semibold leading-snug tracking-tight text-white/90 [font-stretch:85%]">
              Helping neighbours everywhere find each other, and do a little good together.
            </p>
            <ul className="mt-8 flex gap-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid size-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-white hover:bg-white hover:text-night"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[1.05rem]" aria-hidden>
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Explore" className="md:col-span-3 lg:col-start-8 lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">Explore</h3>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-white">Support</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <a href="mailto:mffoisal8@gmail.com" className={linkClass}>
                  mffoisal8@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+8801828660354" className={linkClass}>
                  +880 1828-660354
                </a>
              </li>
              <li className="text-white/65">Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:justify-between">
          <p>&copy; {year} Kindred. All rights reserved.</p>
          <p>Made with care for communities everywhere.</p>
        </div>
      </div>

      {/* the signature: a giant outlined wordmark that runs off the bottom edge */}
      <div aria-hidden className="pointer-events-none mx-auto mt-10 -mb-[3.5%] max-w-7xl select-none px-4">
        <svg viewBox="0 0 1000 270" className="block w-full overflow-visible">
          <defs>
            <linearGradient id="footer-mark" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b74ff" />
              <stop offset="0.55" stopColor="#e36bff" />
              <stop offset="1" stopColor="#ffc266" />
            </linearGradient>
            <linearGradient id="footer-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.25" stopColor="#fff" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="footer-mask">
              <rect width="1000" height="270" fill="url(#footer-fade)" />
            </mask>
          </defs>
          <text
            x="500"
            y="262"
            textAnchor="middle"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="none"
            stroke="url(#footer-mark)"
            strokeOpacity="0.5"
            strokeWidth="1.4"
            mask="url(#footer-mask)"
            className="font-display"
            style={{ fontSize: 350, fontWeight: 800, fontStretch: "75%", letterSpacing: "-0.04em" }}
          >
            Kindred
          </text>
        </svg>
      </div>
    </footer>
  );
}
