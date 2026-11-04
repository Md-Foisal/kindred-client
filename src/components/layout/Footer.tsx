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
      </div>

      {/* the signature: a giant outlined wordmark, drawn as a path because Safari clips stretched svg text */}
      <div aria-hidden className="pointer-events-none mx-auto mt-12 max-w-7xl select-none px-4 md:mt-16">
        <svg viewBox="-4 -30 1008 304" className="block w-full overflow-visible">
          <defs>
            <linearGradient id="footer-mark" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b74ff" />
              <stop offset="0.55" stopColor="#e36bff" />
              <stop offset="1" stopColor="#ffc266" />
            </linearGradient>
          </defs>
          <path
            d="M89.4 138.6L90.8 90.9L163.3 262L115.5 262L66.7 138.6L85.9 142.3L54.6 202.8L58.1 163.8L58.1 262L14.3 262L14.3 3.9L58.1 3.9L58.1 135.3L50 129.9L113.7 3.9L159.8 3.9ZM179.6 262L179.6 76.2L223 76.2L223 262ZM201.3 50.1Q191.4 50.1 184 42.7Q176.6 35.4 176.6 21.9Q176.6 8.3 184 1Q191.4 -6.3 201.3 -6.3Q211.2 -6.3 218.6 1Q225.9 8.3 225.9 21.9Q225.9 35.6 218.6 42.8Q211.2 50.1 201.3 50.1ZM339 262L339 186.4Q339 180.3 339 174.8Q339 169.3 339 165.1Q339 154.6 337.3 145.4Q335.7 136.2 330.9 130.5Q326.2 124.8 316.6 124.8Q308.4 124.8 302.7 130Q297.1 135.1 294.3 144.6Q291.4 154 291.4 166.8L281.4 154.4Q281.4 129.5 288.7 111.2Q296 92.8 308.5 82.6Q321 72.5 336.7 72.5Q353 72.5 363.1 81.9Q373.3 91.4 378 108.2Q382.7 125 382.7 146.9Q382.7 156.1 382.7 167.9Q382.7 179.6 382.7 192.2L382.7 262ZM247.7 262L247.7 76.2L291.4 76.2L291.4 262ZM463.4 266.4Q447.1 266.4 433.2 255.3Q419.2 244.2 410.7 222.3Q402.3 200.4 402.3 168Q402.3 137.2 411 115.9Q419.7 94.5 433.7 83.5Q447.7 72.5 463.4 72.5Q479.1 72.5 491.8 83.9Q504.6 95.4 512.2 115.2Q519.8 134.9 519.8 160.5Q519.8 161.4 519.8 162.3Q519.8 163.1 519.8 164.2L502.9 164.4Q502.9 163.8 502.9 163.2Q502.9 162.6 502.9 162.1Q502.9 149.7 498.8 141.2Q494.7 132.7 488.4 128.2Q482.1 123.8 475.4 123.8Q464.4 123.8 456 134.2Q447.5 144.6 447.5 168Q447.5 191.5 456 202.3Q464.4 213.2 475.4 213.2Q482.4 213.2 488.6 208.4Q494.9 203.7 498.9 194.9Q502.9 186.1 502.9 173.8L519.8 175.2Q519.8 200.6 512.3 221.2Q504.7 241.9 492 254.1Q479.2 266.4 463.4 266.4ZM502.9 262L502.9 -11.5L546.8 -11.5L546.8 262ZM573.4 262L573.4 76.2L617.3 76.2L617.3 142.7L609 134.3Q610.8 120.4 614.4 109Q618.1 97.5 624 89.4Q629.8 81.2 637.6 76.9Q645.4 72.5 655.2 72.5Q663.2 72.5 667.5 74.1Q671.7 75.6 672.8 76.5L666.3 131.6Q665.2 130.8 661.4 128.9Q657.6 127.1 651.9 127.1Q642.2 127.1 635.5 131.5Q628.8 136 624.8 143.5Q620.8 151.1 619.1 160.3Q617.3 169.6 617.3 178.9L617.3 262ZM705.9 186.9L705.9 147.9L787.6 147.9L783.9 157Q783.9 155.6 783.9 154.1Q783.9 152.6 783.9 151.4Q783.9 143.5 781.1 135.7Q778.2 128 772.1 122.8Q765.9 117.6 756 117.6Q746.2 117.6 739.3 123.5Q732.5 129.3 729 140.6Q725.5 151.9 725.5 167.9Q725.5 184.5 728.9 196.3Q732.3 208.1 739.3 214.3Q746.3 220.5 757.2 220.5Q764 220.5 768.8 218.9Q773.7 217.4 776.7 214.8Q779.7 212.3 781.2 209.2Q782.8 206.2 783.1 203.2L826.4 203.2Q825.7 215.3 820.5 226.6Q815.3 237.8 806.3 246.9Q797.3 255.9 784.4 261.1Q771.6 266.4 755.4 266.4Q733.1 266.4 716.7 254Q700.2 241.7 691.2 219.8Q682.1 197.9 682.1 169.4Q682.1 140.4 691.4 118.6Q700.6 96.8 717.1 84.6Q733.6 72.5 755.4 72.5Q777.9 72.5 794.2 84.8Q810.5 97.2 819.4 119.6Q828.2 141.9 828.2 172.2Q828.2 176.9 828.1 180.8Q828 184.7 827.7 186.9ZM903.7 266.4Q887.3 266.4 873.4 255.3Q859.4 244.2 851 222.3Q842.5 200.4 842.5 168Q842.5 137.2 851.2 115.9Q859.9 94.5 873.9 83.5Q887.9 72.5 903.7 72.5Q919.3 72.5 932.1 83.9Q944.8 95.4 952.5 115.2Q960.1 134.9 960.1 160.5Q960.1 161.4 960.1 162.3Q960.1 163.1 960.1 164.2L943.1 164.4Q943.1 163.8 943.1 163.2Q943.1 162.6 943.1 162.1Q943.1 149.7 939 141.2Q934.9 132.7 928.6 128.2Q922.3 123.8 915.6 123.8Q904.7 123.8 896.2 134.2Q887.7 144.6 887.7 168Q887.7 191.5 896.2 202.3Q904.7 213.2 915.6 213.2Q922.6 213.2 928.9 208.4Q935.1 203.7 939.1 194.9Q943.1 186.1 943.1 173.8L960.1 175.2Q960.1 200.6 952.5 221.2Q945 241.9 932.2 254.1Q919.4 266.4 903.7 266.4ZM943.1 262L943.1 -11.5L987 -11.5L987 262Z"
            fill="var(--color-night)"
            stroke="url(#footer-mark)"
            strokeOpacity="0.75"
            strokeWidth="2.8"
            paintOrder="stroke"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-8">
        <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:justify-between">
          <p>&copy; {year} Kindred. All rights reserved.</p>
          <p>Made with care for communities everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
