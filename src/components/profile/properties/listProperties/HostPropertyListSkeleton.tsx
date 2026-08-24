"use client";

const skeleton = Array.from({ length: 4 }, () => {
  return crypto.randomUUID();
});

export function HostPropertyListSkeleton() {
  return (
    <div className="space-y-3">
      {skeleton.map((key) => (
        <article
          key={key}
          className="card-white animate-skeleton-pulse flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
        >
          <div className="size-24 shrink-0 rounded-xl bg-surface md:size-28" />
          <div className="min-w-0 flex-1 space-y-2.5">
            <div className="h-4 w-2/3 rounded-md bg-surface" />
            <div className="h-3.5 w-1/3 rounded-md bg-surface" />
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <div className="h-3.5 w-16 rounded-md bg-surface" />
              <div className="h-3.5 w-16 rounded-md bg-surface" />
            </div>
          </div>
          <div className="flex shrink-0 gap-2 sm:flex-col">
            <div className="h-9 w-24 rounded-full bg-surface" />
            <div className="h-9 w-24 rounded-full bg-surface" />
          </div>
        </article>
      ))}
    </div>
  );
}
