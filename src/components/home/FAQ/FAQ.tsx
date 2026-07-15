"use client";

import Link from "next/link";
import { useState } from "react";

import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { routes } from "@/constants/routes";
import { MailIcon } from "@/icons";
import { FaqAccordionItem } from "./FaqAccordionItem";
import { faqData } from "./mock";

export const FAQ = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <SectionWrapper>
      <div className="flex w-full justify-between flex-col gap-12 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex shrink-0 flex-col gap-4 lg:max-w-[320px]">
          <span className="inline-flex w-fit items-center rounded-full bg-[#3B007F] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
            FAQ
          </span>

          <h2 className="font-montserrat text-[40px] font-bold leading-tight text-[#3B007F]">
            Preguntas frecuentes
          </h2>

          <p className="font-sans text-base leading-relaxed text-[#9CA3AF]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          <Link
            href={routes.Contact}
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#3B007F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5307AD]"
          >
            Contáctenos
            <MailIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-1 flex-col gap-3 lg:w-full md:max-w-3xl">
          {faqData.map((item) => (
            <FaqAccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
};
