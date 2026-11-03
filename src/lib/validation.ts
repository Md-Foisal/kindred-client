import type { EventInput } from "./types";

export function passwordProblem(password: string): string | null {
  if (password.length < 6) return "Password must be at least 6 characters";
  if (!/[A-Z]/.test(password)) return "Password needs at least one uppercase letter";
  if (!/[a-z]/.test(password)) return "Password needs at least one lowercase letter";
  return null;
}

export function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export type EventErrors = Partial<Record<keyof EventInput, string>>;

export function validateEvent(input: EventInput): EventErrors {
  const errors: EventErrors = {};
  if (input.title.trim().length < 5) errors.title = "Title needs at least 5 characters";
  if (input.description.trim().length < 20) errors.description = "Description needs at least 20 characters";
  if (!input.eventType) errors.eventType = "Choose an event type";
  if (!isUrl(input.thumbnail)) errors.thumbnail = "Give a valid image URL";
  if (input.location.trim().length < 3) errors.location = "Location is too short";
  if (!input.eventDate) errors.eventDate = "Pick a date and time";
  else if (new Date(input.eventDate).getTime() <= Date.now()) errors.eventDate = "Date must be in the future";
  return errors;
}
