"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Newsletter() {
  const [email, setEmail] = useState("");

  // design only, nothing is sent anywhere
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!EMAIL_RE.test(value)) {
      toast.error("That email does not look right. Please check it.");
      return;
    }
    toast.success("Thanks! You will hear from us soon.");
    setEmail("");
  };

  return (
    <section className="grain relative isolate overflow-hidden bg-sunrise py-20 text-white md:py-28" aria-labelledby="newsletter-title">
      {/* a couple of faint rings, the logo shape blown up */}
      <div aria-hidden className="pointer-events-none absolute -right-24 top-1/2 -z-10 hidden -translate-y-1/2 md:block">
        <div className="relative size-[34rem]">
          <span className="absolute inset-y-0 left-0 w-[34rem] rounded-full border border-white/20" />
          <span className="absolute inset-y-8 left-48 w-[30rem] rounded-full border border-white/15" />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl items-end gap-10 px-4 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <h2 id="newsletter-title" className="section-title max-w-2xl">
            One email a week. Only the good stuff.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
            New events near you, one short story from the field, and nothing else. Unsubscribe with a single click
            whenever you like.
          </p>
        </div>

        <div>
          <form
            onSubmit={handleSubmit}
            noValidate
            data-theme="kindred"
            className="flex w-full flex-col gap-2 rounded-[1.75rem] bg-base-100 p-2 text-base-content shadow-[0_30px_70px_-30px_rgb(23_21_61/0.7)] ring-white/50 transition focus-within:ring-4 sm:flex-row sm:items-center sm:rounded-full"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="h-12 w-full min-w-0 flex-1 rounded-full bg-transparent px-5 text-base-content placeholder:text-base-content/45 focus:outline-none"
            />
            <button type="submit" className="btn-kind h-12 px-7">
              Subscribe
            </button>
          </form>
          <p className="mt-4 px-2 text-sm text-white/75">We never share your address. Promise.</p>
        </div>
      </div>
    </section>
  );
}
