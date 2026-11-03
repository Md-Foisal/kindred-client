"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import ImageUpload from "@/components/ui/ImageUpload";
import { formatTime, toLocalInput } from "@/lib/format";
import { EVENT_TYPES, type EventInput, type EventType } from "@/lib/types";
import { isUrl, validateEvent, type EventErrors } from "@/lib/validation";

export const EMPTY_EVENT: EventInput = {
  title: "",
  description: "",
  eventType: "",
  thumbnail: "",
  location: "",
  eventDate: "",
};

interface EventFormProps {
  initial?: EventInput;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (input: EventInput) => Promise<void>;
}

// tall rounded field, red when wrong, violet ring while typing
export function fieldClass(kind: "input" | "textarea", error?: string) {
  const base = kind === "input" ? "input h-12 w-full px-4 text-base" : "textarea min-h-40 w-full px-4 py-3 text-base leading-relaxed";
  return `${base} bg-base-100 ${error ? (kind === "input" ? "input-error" : "textarea-error") : "focus-within:outline-primary focus:outline-primary"}`;
}

export default function EventForm({ initial = EMPTY_EVENT, submitLabel, submitting, onSubmit }: EventFormProps) {
  const [values, setValues] = useState<EventInput>(initial);
  const [errors, setErrors] = useState<EventErrors>({});
  const [tried, setTried] = useState(false);
  const [brokenUrl, setBrokenUrl] = useState("");

  function setField<K extends keyof EventInput>(key: K, value: EventInput[K]) {
    const next = { ...values, [key]: value };
    setValues(next);
    // after the first submit, errors update live while the user fixes them
    if (tried) setErrors(validateEvent(next));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTried(true);
    const found = validateEvent(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      toast.error("A few fields need a fix. They're marked in red.");
      // jump to the first problem so people don't hunt for it
      const first = (["title", "eventType", "description", "eventDate", "location", "thumbnail"] as const).find((k) => found[k]);
      if (first) document.getElementById(first)?.focus();
      return;
    }
    await onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      thumbnail: values.thumbnail.trim(),
      location: values.location.trim(),
    });
  }

  const showPreview = isUrl(values.thumbnail) && brokenUrl !== values.thumbnail;
  const minDate = toLocalInput(new Date());
  const descLength = values.description.trim().length;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-12">
      <form onSubmit={handleSubmit} noValidate className="ticket shadow-[0_30px_80px_-50px_rgb(23_21_61/0.45)]">
        <Section title="The basics" text="A clear title and cause help the right people find you.">
          <Field id="title" label="Event title" error={errors.title}>
            <input
              id="title"
              type="text"
              className={fieldClass("input", errors.title)}
              placeholder="e.g. Saturday beach cleanup at Ocean Park"
              value={values.title}
              maxLength={100}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : undefined}
              onChange={(e) => setField("title", e.target.value)}
            />
          </Field>

          <Field id="eventType" label="Event type" error={errors.eventType}>
            <select
              id="eventType"
              className={`select h-12 w-full cursor-pointer px-4 text-base bg-base-100 ${
                errors.eventType ? "select-error" : "focus-within:outline-primary focus:outline-primary"
              }`}
              value={values.eventType}
              aria-invalid={Boolean(errors.eventType)}
              aria-describedby={errors.eventType ? "eventType-error" : undefined}
              onChange={(e) => setField("eventType", e.target.value as EventType)}
            >
              <option value="" disabled>
                Pick a cause
              </option>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id="description"
            label="What will people do?"
            error={errors.description}
            hint={`${descLength}/2000`}
            help="Say what volunteers will do, what to bring and who it suits. At least 20 characters."
          >
            <textarea
              id="description"
              rows={6}
              className={fieldClass("textarea", errors.description)}
              placeholder="We'll pick up litter along the shore for two hours. Gloves and bags are provided. Bring water and a hat. Kids are welcome with an adult."
              value={values.description}
              maxLength={2000}
              aria-invalid={Boolean(errors.description)}
              aria-describedby={errors.description ? "description-error" : "description-help"}
              onChange={(e) => setField("description", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="When and where" text="Times show in each visitor's own timezone.">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="eventDate" label="Date and time" error={errors.eventDate}>
              <input
                id="eventDate"
                type="datetime-local"
                className={fieldClass("input", errors.eventDate)}
                min={minDate}
                value={values.eventDate}
                aria-invalid={Boolean(errors.eventDate)}
                aria-describedby={errors.eventDate ? "eventDate-error" : undefined}
                onChange={(e) => setField("eventDate", e.target.value)}
                suppressHydrationWarning
              />
            </Field>

            <Field id="location" label="Location" error={errors.location}>
              <input
                id="location"
                type="text"
                className={fieldClass("input", errors.location)}
                placeholder="e.g. Ocean Park, Santa Monica"
                value={values.location}
                maxLength={150}
                aria-invalid={Boolean(errors.location)}
                aria-describedby={errors.location ? "location-error" : undefined}
                onChange={(e) => setField("location", e.target.value)}
              />
            </Field>
          </div>
        </Section>

        <Section title="Cover photo" text="A bright landscape photo works best. It shows on the event card and page.">
          <Field
            id="thumbnail"
            label="Image URL"
            error={errors.thumbnail}
            help="Upload an image or paste a direct link starting with https://"
          >
            <input
              id="thumbnail"
              type="url"
              className={fieldClass("input", errors.thumbnail)}
              placeholder="https://images.unsplash.com/photo-..."
              value={values.thumbnail}
              aria-invalid={Boolean(errors.thumbnail)}
              aria-describedby={errors.thumbnail ? "thumbnail-error" : "thumbnail-help"}
              onChange={(e) => setField("thumbnail", e.target.value)}
            />
            <ImageUpload label="Upload image" onUploaded={(url) => setField("thumbnail", url)} />
          </Field>
        </Section>

        <div className="ticket-notch flex flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-sm text-base-content/60">You can change any of this later.</p>
          <button type="submit" className="btn-kind h-12! w-full! text-base! disabled:opacity-60 sm:w-auto! sm:px-10!" disabled={submitting}>
            {submitting && <span className="loading loading-spinner loading-sm" />}
            {submitting ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>

      {/* live preview, same look as the real event card */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-3 text-sm font-semibold text-base-content/60">How your card will look</p>
        <PreviewCard
          values={values}
          showImage={showPreview}
          brokenImage={Boolean(brokenUrl) && brokenUrl === values.thumbnail}
          onImageError={() => setBrokenUrl(values.thumbnail)}
        />
      </aside>
    </div>
  );
}

function PreviewCard({
  values,
  showImage,
  brokenImage,
  onImageError,
}: {
  values: EventInput;
  showImage: boolean;
  brokenImage: boolean;
  onImageError: () => void;
}) {
  const d = values.eventDate ? new Date(values.eventDate) : null;
  return (
    <article className="ticket flex flex-col" aria-label="Card preview">
      <figure className="relative aspect-[16/10] overflow-hidden bg-base-200">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={values.thumbnail} alt="Cover preview" className="h-full w-full object-cover" onError={onImageError} />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-6 text-center text-sm text-base-content/55">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-9" aria-hidden>
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="9" cy="10" r="2" />
              <path d="m21 16-5-5-9 9" />
            </svg>
            {brokenImage ? "That link didn't load as an image. Try another one." : "Your cover photo shows up here"}
          </div>
        )}
        {values.eventType && (
          <span className="absolute left-4 top-4 rounded-full bg-base-100/90 px-3 py-1 text-xs font-semibold text-base-content backdrop-blur">
            {values.eventType}
          </span>
        )}
      </figure>

      <div className="flex flex-1 flex-col p-5">
        <h3
          className={`line-clamp-2 min-h-[3.3rem] font-display text-xl font-bold leading-tight tracking-tight ${
            values.title.trim() ? "" : "text-base-content/35"
          }`}
        >
          {values.title.trim() || "Your event title"}
        </h3>
        <p className="mt-2 flex items-center gap-2 text-sm text-base-content/70">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 shrink-0 text-primary" aria-hidden>
            <path d="M12 21s-6-5.3-6-11a6 6 0 1 1 12 0c0 5.7-6 11-6 11z" />
            <circle cx="12" cy="10" r="2" />
          </svg>
          <span className="truncate">{values.location.trim() || "Location"}</span>
        </p>
      </div>

      <div className="ticket-notch mt-auto flex items-center justify-between gap-3 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex w-12 flex-col items-center rounded-xl bg-base-200 py-1">
            <span className="text-[0.7rem] font-semibold text-base-content/60">
              {d ? d.toLocaleDateString("en-US", { month: "short" }) : "Mon"}
            </span>
            <span className="font-display text-xl font-extrabold leading-none">{d ? d.getDate() : "--"}</span>
          </div>
          <div className="text-sm leading-tight">
            <p className="font-semibold">{d ? d.toLocaleDateString("en-US", { weekday: "long" }) : "Pick a date"}</p>
            <p className="text-base-content/60">{d ? formatTime(d) : "and a time"}</p>
          </div>
        </div>
        <span className="btn-kind btn-sm pointer-events-none" aria-hidden>
          View Event
        </span>
      </div>
    </article>
  );
}

function Section({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <section className="border-b border-base-300 px-6 py-7 last-of-type:border-b-0 sm:px-8">
      <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-base-content/60">{text}</p>
      <div className="mt-6 space-y-6">{children}</div>
    </section>
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
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

function Field({
  id,
  label,
  error,
  hint,
  help,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold">
          {label}
        </label>
        {hint && <span className="text-xs tabular-nums text-base-content/50">{hint}</span>}
      </div>
      {children}
      {error ? (
        <ErrorText id={`${id}-error`}>{error}</ErrorText>
      ) : (
        help && (
          <p id={`${id}-help`} className="mt-2 text-sm text-base-content/55">
            {help}
          </p>
        )
      )}
    </div>
  );
}

export function EventFormSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-12">
      <div className="ticket">
        {[0, 1, 2].map((s) => (
          <div key={s} className="space-y-5 border-b border-base-300 px-6 py-7 last:border-b-0 sm:px-8">
            <div className="space-y-2">
              <div className="skeleton h-6 w-40" />
              <div className="skeleton h-4 w-64 max-w-full" />
            </div>
            <div className="space-y-2">
              <div className="skeleton h-4 w-24" />
              <div className={`skeleton w-full ${s === 0 ? "h-40" : "h-12"}`} />
            </div>
          </div>
        ))}
        <div className="ticket-notch flex justify-end px-6 py-6 sm:px-8">
          <div className="skeleton h-12 w-44 rounded-full" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="skeleton h-4 w-40" />
        <div className="ticket">
          <div className="skeleton aspect-[16/10] w-full rounded-none" />
          <div className="space-y-3 p-5">
            <div className="skeleton h-6 w-4/5" />
            <div className="skeleton h-4 w-1/2" />
          </div>
          <div className="ticket-notch flex items-center justify-between px-5 py-4">
            <div className="skeleton h-12 w-28" />
            <div className="skeleton h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
