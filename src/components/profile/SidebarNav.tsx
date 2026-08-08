"use client";

import { usePathname } from "next/navigation";
import React from "react";

import type { SidebarNavProps } from "@/types/profile";

export function SidebarNav({
  items,
  onSelect,
  expanded,
  mode,
}: SidebarNavProps) {
  const pathName = usePathname();
  return (
    <nav className="flex-1 space-y-1 px-2 py-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isLogout = item.id === "logout";

        const childrenComponent = (
          <>
            <Icon className="size-5 shrink-0" />
            <span
              className={`overflow-hidden whitespace-nowrap text-sm transition-all duration-200 ${
                expanded ? "max-w-40 opacity-100" : "max-w-0 opacity-0"
              }`}
            >
              {item.label}
            </span>
          </>
        );

        if (mode === item.role || item.role === "all") {
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect(item);
              }}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                item.id === pathName && !isLogout
                  ? "bg-[#3b007f] text-white "
                  : isLogout
                    ? "text-red-500 hover:bg-red-50 bg-white"
                    : "bg-white text-[#434654] hover:bg-[#f0eaf5]"
              }`}
              title={!expanded ? item.label : undefined}
            >
              {childrenComponent}
            </button>
          );
        }

        return <React.Fragment key={item.id} />;
      })}
    </nav>
  );
}
