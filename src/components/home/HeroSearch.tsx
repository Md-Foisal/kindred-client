"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { EVENT_TYPES } from "@/lib/types";

export default function HeroSearch() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const qs = new URLSearchParams();
    if (search.trim()) qs.set("search", search.trim());
    if (type) qs.set("type", type);
    router.push(`/events${qs.toString() ? `?${qs}` : ""}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full max-w-2xl flex-col gap-2 rounded-[1.75rem] border border-white/15 bg-white/10 p-2 backdrop-blur-xl sm:flex-row sm:items-center sm:rounded-full"
      role="search"
    >
      <label className="flex flex-1 items-center gap-3 px-4">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 shrink-0 text-white/60">
          <path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11z" />
          <circle cx="12" cy="10" r="2" />
        </svg>
        <span className="sr-only">Search by title or location</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search a city, area or cause"
          className="h-12 w-full bg-transparent text-white placeholder:text-white/50 focus:outline-none"
        />
      </label>
      <label className="flex items-center gap-2 border-white/15 px-4 sm:border-l">
        <span className="sr-only">Event type</span>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-12 w-full cursor-pointer bg-transparent text-white focus:outline-none sm:w-40 [&>option]:text-ink"
        >
          <option value="">Any cause</option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn h-12 rounded-full border-0 bg-white px-7 font-semibold text-ink hover:bg-secondary">
        Find events
      </button>
    </form>
  );
}
