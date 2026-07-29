"use client";

import type { FormTextareaProps } from "@/types/property/FormTextarea";

export function FormTextarea({ label, error, ...props }: FormTextareaProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={props.id}
        className="font-plus-jakarta text-[13px] font-semibold text-[#434654]"
      >
        {label}
      </label>
      <textarea
        {...props}
        className="w-full resize-none rounded-[10px] bg-[#EFF3F6] px-4 py-3 font-plus-jakarta text-[14px] font-semibold text-[#171717] placeholder:text-[#7C838F] focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_rgba(59,0,127,0.4)]"
      />
      {error && (
        <p className="mt-1 font-plus-jakarta text-[14px] font-medium text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
