import Link from "next/link";

import type { FooterLinkGroup } from "@/types/FooterTypes";

export function FooterItem({ links, title }: FooterLinkGroup) {
  return (
    <div
      key={title}
      className="flex flex-col md:items-center lg:items-start gap-3 max-md:px-2"
    >
      <h3 className="font-sans text-sm font-bold text-[#222222]">{title}</h3>
      <ul className="flex flex-col gap-2 md:items-center lg:items-start">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-sans text-sm text-[#717171] transition-colors hover:text-[#222222]"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
