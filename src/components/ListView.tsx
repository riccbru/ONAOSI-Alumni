"use client";

import { useMemo, useState } from "react";
import type { Alumnus } from "@/types/alumni";
import {
  filterAlumni,
  groupByYearAndDestination,
  type DestinationFilter,
  type YearFilter,
} from "@/lib/filters";
import { AlumniAccordionList, EmptyState } from "./AlumniAccordionList";
import { DestinationBadge } from "./Badges";
import { SearchBar } from "./SearchBar";
import { Select } from "./Select";

const DEST_OPTIONS: { value: DestinationFilter; label: string }[] = [
  { value: "all", label: "Tutte" },
  { value: "Chicago", label: "Chicago" },
  { value: "Taipei", label: "Taipei" },
];

const YEAR_OPTIONS: { value: YearFilter; label: string }[] = [
  { value: "all", label: "Tutti" },
  { value: 2025, label: "2025" },
  { value: 2026, label: "2026" },
];

export function ListView({ alumni }: { alumni: Alumnus[] }) {
  const [query, setQuery] = useState("");
  const [destination, setDestination] = useState<DestinationFilter>("all");
  const [year, setYear] = useState<YearFilter>("all");

  const filtered = useMemo(
    () => filterAlumni(alumni, { query, year, destination }),
    [alumni, query, year, destination],
  );

  const grouped = useMemo(
    () => groupByYearAndDestination(filtered),
    [filtered],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      {/* Barra filtri sticky */}
      <div className="z-30 mb-6 rounded-xl border border-border bg-neutral-50/90 px-4 py-3 shadow-sm backdrop-blur sm:sticky sm:top-[76px]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="sm:flex-1">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:w-auto sm:grid-cols-[minmax(0,10rem)_minmax(0,8rem)]">
            <Select label="Destinazione" options={DEST_OPTIONS} value={destination} onChange={setDestination} />
            <Select label="Anno" options={YEAR_OPTIONS} value={year} onChange={setYear} />
          </div>
        </div>
        <p className="mt-2 text-xs text-text-secondary">
          {filtered.length} di {alumni.length} alumni
        </p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="Nessun alumnus corrisponde ai criteri." />
      ) : (
        <div className="flex flex-col gap-8">
          {grouped.map(({ cohort, groups }) => (
            <section key={cohort}>
              <div className="mb-3 flex items-center gap-3">
                <h2 className="text-lg font-bold text-primary-900">Coorte {cohort}</h2>
                <span className="h-px flex-1 bg-border" />
              </div>
              <div className="flex flex-col gap-6">
                {groups.map(({ destination: dest, items }) => (
                  <div key={dest}>
                    <div className="mb-2.5 flex items-center gap-2">
                      <DestinationBadge destination={dest} />
                      <span className="text-xs text-text-secondary">
                        {items.length} {items.length === 1 ? "alumnus" : "alumni"}
                      </span>
                    </div>
                    <AlumniAccordionList alumni={items} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
