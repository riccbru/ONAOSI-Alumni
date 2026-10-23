"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Alumnus, Cohort, Destination } from "@/types/alumni";
import { filterAlumni, groupByCohort } from "@/lib/filters";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { AlumniAccordionList, EmptyState } from "./AlumniAccordionList";
import { SearchBar } from "./SearchBar";
import { CloseIcon } from "./icons";

const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

// Anni selezionabili, in ordine decrescente. Nessuna selezione ⇒ tutti gli anni.
const YEARS: Cohort[] = [2026, 2025];

export function CityDrawer({
  destination,
  alumni,
  onClose,
}: {
  destination: Destination | null;
  alumni: Alumnus[];
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const isMobile = useMediaQuery("(max-width: 639px)");
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<Cohort | null>(null); // null ⇒ tutti gli anni

  const open = destination !== null;

  // Reset dei filtri all'apertura di una nuova città.
  useEffect(() => {
    if (open) {
      setQuery("");
      setYear(null);
    }
  }, [destination, open]);

  // Chiusura con Escape + blocco dello scroll del body.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // Raggruppata per coorte (desc), come nella view principale.
  const cohorts = useMemo(() => {
    if (!destination) return [];
    const base = alumni.filter((a) => a.fellowship.destination === destination);
    const list = filterAlumni(base, { query, year: year ?? "all" });
    return groupByCohort(list);
  }, [alumni, destination, query, year]);

  const total = destination
    ? alumni.filter((a) => a.fellowship.destination === destination).length
    : 0;

  const panelVariants = isMobile
    ? { hidden: { y: "100%" }, visible: { y: 0 } }
    : { hidden: { x: "100%" }, visible: { x: 0 } };

  return (
    <AnimatePresence>
      {open && destination && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={`Alumni di ${destination}`}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
            onClick={onClose}
            className="absolute inset-0 bg-primary-950/40 backdrop-blur-[2px]"
          />

          {/* Pannello / bottom sheet */}
          <motion.aside
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: reduce ? 0 : 0.42, ease: EASE_DRAWER }}
            drag={isMobile ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 500) onClose();
            }}
            className="absolute flex flex-col bg-neutral-50 shadow-drawer
              inset-x-0 bottom-0 max-h-[88dvh] rounded-t-2xl
              sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[440px] sm:rounded-none"
          >
            {/* Maniglia (solo mobile) */}
            {isMobile && (
              <div className="flex justify-center pt-3">
                <span className="h-1.5 w-10 rounded-full bg-neutral-300" />
              </div>
            )}

            {/* Header del drawer */}
            <div className="sticky top-0 z-10 border-b border-border bg-neutral-50/95 px-4 pb-3 pt-4 backdrop-blur sm:px-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-lg font-bold text-primary-900">{destination}</h2>
                  <span className="text-xs text-text-secondary">
                    {total} {total === 1 ? "alumnus" : "alumni"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Chiudi"
                  className="press inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-neutral-0 text-text-secondary hover:border-primary-200 hover:text-text"
                >
                  <CloseIcon />
                </button>
              </div>

              <div className="mt-3 space-y-2.5">
                <SearchBar value={query} onChange={setQuery} autoFocus={!isMobile} />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-secondary">Anno</span>
                  {YEARS.map((y) => {
                    const active = year === y;
                    return (
                      <button
                        key={y}
                        type="button"
                        onClick={() => setYear(active ? null : y)}
                        aria-pressed={active}
                        className={`press rounded-full px-3 py-1 text-xs font-semibold transition-colors duration-150 ease-out ${
                          active
                            ? "bg-primary-500 text-neutral-0 shadow-sm"
                            : "border border-border bg-neutral-0 text-text-secondary hover:border-primary-200 hover:text-primary-700"
                        }`}
                      >
                        {y}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Lista, raggruppata per coorte (desc) */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
              {cohorts.length === 0 ? (
                <EmptyState message="Nessun alumnus trovato." />
              ) : (
                <div className="flex flex-col gap-6">
                  {cohorts.map(({ cohort, items }) => (
                    <section key={cohort}>
                      <div className="mb-2.5 flex items-center gap-3">
                        <h3 className="text-sm font-bold text-primary-900">Coorte {cohort}</h3>
                        <span className="h-px flex-1 bg-border" />
                        <span className="text-xs text-text-secondary">
                          {items.length} {items.length === 1 ? "alumnus" : "alumni"}
                        </span>
                      </div>
                      <AlumniAccordionList alumni={items} stagger allowExpand />
                    </section>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
