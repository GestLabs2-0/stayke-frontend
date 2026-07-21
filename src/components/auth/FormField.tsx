"use client";

import { useField } from "formik";

import type { FormFieldProps } from "@/types/form/FormField";

const inputBase =
  "w-full rounded-[10px] bg-[#EFF3F6] px-4 py-3 font-plus-jakarta text-[14px] font-semibold text-[#171717] placeholder:text-[#7C838F] focus-visible:outline-none transition-shadow duration-150 focus-visible:shadow-[0_0_0_2px_rgba(59,0,127,0.4)]";

const errorClass =
  "text-[14px] font-plus-jakarta font-medium text-red-300 font-bold mt-1";

export const FormField = ({
  label,
  className = "",
  ...props
}: FormFieldProps) => {
  const [field, meta] = useField(props);

  return (
    <div>
      <label
        htmlFor={props.id ?? props.name}
        className="mb-1.5 block font-plus-jakarta text-[13px] font-semibold text-white"
      >
        {label}
      </label>
      <input
        {...field}
        {...props}
        id={props.id ?? props.name}
        className={`${inputBase} ${className}`.trim()}
      />
      {meta.touched && meta.error ? (
        <p className={errorClass}>{meta.error}</p>
      ) : null}
    </div>
  );
};
