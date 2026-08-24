"use client";

import { useField } from "formik";

import type { FormSelectProps } from "@/types/form/FormSelectProps";

const selectBase =
  "w-full rounded-[10px] bg-[#EFF3F6] px-4 py-3 font-plus-jakarta text-[14px] font-semibold focus-visible:outline-none transition-shadow duration-150 focus-visible:shadow-[0_0_0_2px_rgba(59,0,127,0.4)] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%237C838F%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_16px_center] bg-no-repeat pr-10";

const errorClass =
  "text-[14px] font-plus-jakarta font-medium text-red-300 font-bold mt-1";

const SELECT_EMPTY_VALUE = "";

export const FormSelect = ({
  label,
  placeholder,
  options,
  className = "",
  ...props
}: FormSelectProps) => {
  const [field, meta] = useField(props);

  const isEmpty = field.value === SELECT_EMPTY_VALUE;
  const selectClass = isEmpty ? "text-[#7C838F]" : "text-[#171717]";

  return (
    <div>
      <label
        htmlFor={props.id ?? props.name}
        className="mb-1.5 block font-plus-jakarta text-[13px] font-semibold text-white"
      >
        {label}
      </label>
      <select
        {...field}
        {...props}
        id={props.id ?? props.name}
        className={`${selectBase} ${selectClass} ${className}`.trim()}
      >
        <option value={SELECT_EMPTY_VALUE} disabled>
          {placeholder}
        </option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {meta.touched && meta.error ? (
        <p className={errorClass}>{meta.error}</p>
      ) : null}
    </div>
  );
};
