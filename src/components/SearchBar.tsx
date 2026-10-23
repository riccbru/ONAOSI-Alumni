"use client";

import { CloseIcon, SearchIcon } from "./icons";

export function SearchBar({
  value,
  onChange,
  placeholder = "Cerca per nome, progetto, PI o tutor…",
  autoFocus = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="group relative flex items-center">
      <SearchIcon className="pointer-events-none absolute left-3 h-[18px] w-[18px] text-text-secondary transition-colors duration-150 ease-out group-focus-within:text-primary-500" />
      <input
        type="search"
        inputMode="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Cerca negli alumni"
        className="w-full rounded-lg border border-border bg-neutral-0 py-2.5 pl-10 pr-9 text-sm text-text shadow-inset-field outline-none transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-text-secondary/70 focus:border-accent focus:shadow-glow"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Cancella ricerca"
          className="press absolute right-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-text-secondary hover:bg-neutral-150 hover:text-text"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
