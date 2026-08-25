import { SectionWrapper } from "@/components/shared/SectionWrapper";

export const PopularStaysSkeleton = () => {
  return (
    <SectionWrapper ariaLabel="Cargando alojamientos populares">
      {/* Section Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="animate-pulse h-8 w-60 sm:w-72 rounded-md bg-zinc-200" />
        <div className="flex items-center gap-2">
          <div className="animate-pulse size-9 rounded-full bg-zinc-200" />
          <div className="animate-pulse size-9 rounded-full bg-zinc-200" />
        </div>
      </div>

      {/* Carousel Cards Skeleton */}
      <div className="mt-6 flex overflow-hidden gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton items
            key={`popular-skel-${i}`}
            className="animate-pulse w-[70%] md:w-[calc(100%/3.5)] lg:w-[calc(100%/4.5)] shrink-0 px-2 py-2 pb-4 rounded-lg flex flex-col gap-3"
          >
            <div className="w-full aspect-4/3 rounded-xl bg-zinc-200" />
            <div className="flex flex-col gap-2 px-0.5">
              <div className="h-4 w-4/5 rounded bg-zinc-200" />
              <div className="h-4 w-1/2 rounded bg-zinc-200 mt-1" />
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};
