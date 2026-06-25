import { statsData } from "./mocks";

export const StaykeStats = () => {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
      {statsData.map((stat) => (
        <div
          key={stat.value}
          className="flex flex-col pl-6 border-l border-zinc-400"
        >
          <span className="font-montserrat text-[48px] font-bold text-zinc-900 leading-none tracking-tight">
            {stat.value}
          </span>
          <p className="font-sans text-sm font-semibold text-zinc-600 leading-relaxed max-w-[320px]">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
};
