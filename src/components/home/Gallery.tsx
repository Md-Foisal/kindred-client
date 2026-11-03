import { galleryImages } from "./images";

export default function Gallery() {
  return (
    <section className="bg-base-100 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 grid gap-5 md:mb-16 md:grid-cols-2 md:items-end md:gap-12">
          <h2 className="section-title max-w-md">Moments from the field</h2>
          <p className="section-subtitle md:justify-self-end">
            No stock smiles, just the work. Bags of litter, rows of saplings and boxes packed by people who showed up on
            a Saturday morning.
          </p>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {galleryImages.map((img) => (
            <li key={img.src}>
              {/* tiles are focusable so keyboard users get the caption too */}
              <figure
                tabIndex={0}
                className="group relative aspect-[4/5] overflow-hidden rounded-[1.25rem] bg-base-300 outline-offset-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04] group-focus:scale-[1.04]"
                />
                <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-12 text-white transition duration-500 sm:p-4 sm:pt-16 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus:translate-y-0 lg:group-focus:opacity-100">
                  <span className="font-display text-[0.95rem] font-semibold leading-tight tracking-tight sm:text-lg">
                    {img.caption}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/75 sm:text-sm">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5 shrink-0" aria-hidden>
                      <path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11z" />
                      <circle cx="12" cy="10" r="2" />
                    </svg>
                    {img.place}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
