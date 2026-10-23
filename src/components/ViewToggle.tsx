"use client";

import { motion } from "framer-motion";
import { GlobeIcon, ListIcon } from "./icons";

export type ViewMode = "map" | "list";

const OPTIONS: { value: ViewMode; label: string; icon: React.ReactNode }[] = [
  { value: "list", label: "Lista alumni", icon: <ListIcon className="h-[18px] w-[18px]" /> },
  { value: "map", label: "Mappa 3D", icon: <GlobeIcon className="h-[18px] w-[18px]" /> },
];

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Modalità di visualizzazione"
      className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 p-1 backdrop-blur"
    >
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => onChange(opt.value)}
            className={`press relative inline-flex items-center justify-center rounded-full p-2.5 transition-colors duration-150 ease-out ${
              active ? "text-primary-900" : "text-text-inverse/85 hover:text-text-inverse"
            }`}
          >
            {active && (
              <motion.span
                layoutId="view-toggle-indicator"
                transition={{ type: "spring", duration: 0.4, bounce: 0.18 }}
                className="absolute inset-0 rounded-full bg-neutral-0 shadow-sm"
              />
            )}
            <span className="relative z-10 flex items-center">{opt.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
