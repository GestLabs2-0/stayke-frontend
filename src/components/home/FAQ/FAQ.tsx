"use client";

import Link from "next/link";
import { useState } from "react";
import { MailIcon } from "@/icons";
import { faqData } from "./mocks";

export const FAQ = () => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="w-full px-4 py-16 md:px-6 lg:px-20 xl:px-40 2xl:px-60">
      <div className="mx-auto flex w-full md:max-w-[1000px] flex-col gap-12 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex shrink-0 flex-col gap-4 lg:w-[300px]">
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
            href="/contacto"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#3B007F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5307AD]"
          >
            Contáctenos
            <MailIcon className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-1 flex-col gap-3 lg:w-full">
          {faqData.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-[#3B007F] p-5 md:p-6"
              >
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="flex w-full cursor-pointer items-center justify-between text-left"
                >
                  <span className="font-sans pr-4 text-base font-semibold text-white">
                    {item.question}
                  </span>

                  <svg
                    className="h-6 w-6 shrink-0 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14" />

                    <path
                      d="M12 5v14"
                      style={{
                        transformOrigin: "12px 12px",
                        transition:
                          "transform 300ms ease-in-out, opacity 300ms ease-in-out",
                        transform: isOpen ? "scaleY(0)" : "scaleY(1)",
                        opacity: isOpen ? 0 : 1,
                      }}
                    />
                  </svg>
                </button>

                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: isOpen ? "500px" : "0",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="font-sans pt-4 text-sm leading-relaxed text-white/80">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
