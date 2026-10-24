"use client";

import { ViewToggle, type ViewMode } from "./ViewToggle";

export function Header({
  view,
  onViewChange,
}: {
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-primary-950/40 bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 text-text-inverse">
      <div className="mx-auto flex max-w-7xl flex-row items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          {/* Marchio: stemma ONAOSI su pastiglia chiara (contrasto sul fondo scuro). */}
          <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-neutral-0 ring-1 ring-accent/50">
            <img
              src="/brand/android-icon-192x192.png"
              alt=""
              aria-hidden="true"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
            />
          </span>
          <div className="leading-tight">
            <h1 className="text-lg font-bold sm:text-xl">ONAOSI Alumni</h1>
          </div>
        </div>

        <ViewToggle value={view} onChange={onViewChange} />
      </div>
    </header>
  );
}
