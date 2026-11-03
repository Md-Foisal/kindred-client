export default function EventCardSkeleton() {
  return (
    <div className="ticket flex h-full flex-col">
      <div className="skeleton aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-6 w-4/5" />
        <div className="skeleton h-6 w-3/5" />
        <div className="skeleton h-4 w-1/2" />
      </div>
      <div className="ticket-notch mt-auto flex items-center justify-between px-5 py-4">
        <div className="skeleton h-12 w-28" />
        <div className="skeleton h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}

export function EventGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}
