"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

import { routes } from "@/constants/routes";

const routesTitle: { [key: string]: string } = {
  [routes.Profile.index]: "Perfil",
  [routes.Profile.properties.index]: "Propiedades",
  [routes.Profile.properties.create]: "Crear propiedad",
  [routes.Profile.bookings.index]: "Reservas",
  [routes.Profile.disputes.index]: "Disputas",
};

export function Breadcrumb() {
  const pathname = usePathname();

  const crumbs = useMemo(() => {
    const paths = pathname.split("/");

    return paths
      .map((_, i, arr) => {
        const buildKey = arr.slice(0, i + 1).join("/");
        const title: string = routesTitle[buildKey];

        if (!title) {
          return null;
        }

        return {
          title,
          link: buildKey,
        };
      })
      .filter((item) => item !== null);
  }, [pathname]);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 font-plus-jakarta text-[13px] text-[#a0a5b5]">
        {crumbs.map((item, i, arr) => {
          if (arr.length - 1 === i) {
            return (
              <li
                className="text-[#434654]"
                key={item.link}
                aria-current="page"
              >
                {item.title}
              </li>
            );
          }

          return (
            <React.Fragment key={item.link}>
              <li>
                <Link
                  href={item.link}
                  className="transition-colors hover:text-[#434654]"
                >
                  {item.title}
                </Link>
              </li>
              <li aria-hidden="true" className="select-none">
                /
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
