"use client";

import type { SidebarNavProps } from "@/types/profile";

export function SidebarNav({
  items,
  activeItem,
  onSelect,
  expanded,
}: SidebarNavProps) {
  return (
    <nav className="flex-1 space-y-1 px-2 py-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isLogout = item.id === "logout";

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
              item.id === activeItem && !isLogout
                ? "bg-[#3b007f] text-white border-l-2 border-accent-warm"
                : isLogout
                  ? "text-red-500 hover:bg-red-50 bg-white"
                  : "bg-white text-[#434654] hover:bg-[#f0eaf5]"
            }`}
            title={!expanded ? item.label : undefined}
          >
            <Icon className="size-5 shrink-0" />
            <span
              className={`overflow-hidden whitespace-nowrap text-sm transition-all duration-200 ${
                expanded ? "max-w-40 opacity-100" : "max-w-0 opacity-0"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
