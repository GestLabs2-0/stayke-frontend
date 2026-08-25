import { SectionWrapper } from "@/components/shared/SectionWrapper";

export const EscapadasCercaSkeleton = () => {
  return (
    <SectionWrapper>
      {/* Skeleton FilterBar */}
      <div className="container mx-auto px-4 pb-12 pt-10">
        <div className="flex items-center justify-between border-b border-[#C3C6D6] pb-4 gap-4">
          <div className="flex items-center gap-6 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
                key={`filter-skel-${i}`}
                className="animate-pulse flex flex-col items-center gap-2"
              >
                <div className="size-6 rounded-full bg-zinc-200" />
                <div className="h-3 w-14 rounded bg-zinc-200" />
              </div>
            ))}
          </div>
          <div className="animate-pulse size-10 rounded-full md:w-24 md:h-10 md:rounded-md bg-zinc-200 shrink-0" />
        </div>
      </div>

      {/* Encabezado Skeleton */}
      <div className="mb-6 ml-13 max-[1025px]:ml-0 flex flex-col gap-2">
        <div className="animate-pulse h-8 w-72 sm:w-96 rounded-md bg-zinc-200" />
        <div className="animate-pulse h-4 w-48 sm:w-64 rounded bg-zinc-200" />
      </div>

      {/* GridCards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6 gap-10">
        {/* Featured Card Skeleton */}
        <div className="animate-pulse px-2 py-2 pb-4 rounded-lg flex flex-col gap-3">
          <div className="w-full aspect-[737/398] rounded-2xl bg-zinc-200" />
          <div className="flex flex-col gap-2 px-2 pt-2">
            <div className="h-5 w-3/4 rounded bg-zinc-200" />
            <div className="h-4 w-1/2 rounded bg-zinc-200" />
            <div className="h-6 w-1/3 rounded bg-zinc-200 mt-1" />
          </div>
        </div>

        {/* Secondary Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6 gap-10">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
              key={`sec-skel-${i}`}
              className="animate-pulse px-2 py-2 pb-4 rounded-lg flex flex-col gap-3"
            >
              <div className="w-full aspect-[737/398] lg:aspect-[737/796] rounded-2xl bg-zinc-200" />
              <div className="flex flex-col gap-2 px-2 pt-2">
                <div className="h-5 w-3/4 rounded bg-zinc-200" />
                <div className="h-4 w-1/2 rounded bg-zinc-200" />
                <div className="h-6 w-1/3 rounded bg-zinc-200 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
