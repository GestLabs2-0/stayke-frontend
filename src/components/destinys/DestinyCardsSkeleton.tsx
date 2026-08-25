interface DestinyCardsSkeletonProps {
  count?: number;
}

export function DestinyCardsSkeleton({ count = 6 }: DestinyCardsSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: stable skeleton placeholder
          key={`skel-${i}`}
          className="animate-pulse rounded-2xl border border-zinc-200 bg-white p-3"
        >
          <div className="aspect-16/10 w-full rounded-xl bg-zinc-200" />
          <div className="mt-3 space-y-2">
            <div className="h-3.5 w-3/4 rounded bg-zinc-200" />
            <div className="h-3 w-1/2 rounded bg-zinc-200" />
            <div className="h-3.5 w-1/3 rounded bg-zinc-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
