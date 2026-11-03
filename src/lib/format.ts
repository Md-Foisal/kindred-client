export function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(value: string | Date) {
  return new Date(value).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// value for <input type="datetime-local"> in the user's own timezone
export function toLocalInput(value: string | Date) {
  const d = new Date(value);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

export function isPast(value: string | Date) {
  return new Date(value).getTime() < Date.now();
}
