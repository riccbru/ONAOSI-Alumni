"use client";

import { useId } from "react";
import { ChevronDown } from "./icons";

interface SelectProps<T extends string | number> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

/**
 * Selettore a tendina (native <select> stilizzato) — scelto al posto delle pill
 * perché scala meglio al crescere di anni e destinazioni. Native = accessibile
 * e performante, con picker nativo su mobile.
 */
export function Select<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: SelectProps<T>) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={String(value)}
          onChange={(e) => {
            const picked = options.find((o) => String(o.value) === e.target.value);
            if (picked) onChange(picked.value);
          }}
          className="press w-full cursor-pointer appearance-none rounded-lg border border-border bg-neutral-0 py-2 pl-3 pr-9 text-sm font-semibold text-text shadow-inset-field outline-none transition-[border-color,box-shadow] duration-150 ease-out hover:border-primary-200 focus:border-accent focus:shadow-glow"
        >
          {options.map((o) => (
            <option key={String(o.value)} value={String(o.value)}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
      </div>
    </div>
  );
}
