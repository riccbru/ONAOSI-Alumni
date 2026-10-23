import type { Alumnus, Cohort, Destination } from "@/types/alumni";

export type YearFilter = "all" | Cohort;
export type DestinationFilter = "all" | Destination;

/** Nome completo normalizzato. */
export function fullName(a: Alumnus): string {
  return `${a.firstName} ${a.lastName}`;
}

/**
 * Ordinamento per la visualizzazione delle liste: prima i Team Leader, poi gli
 * altri in ordine lessicografico di cognome (quindi nome).
 */
export function sortForDisplay(alumni: Alumnus[]): Alumnus[] {
  return [...alumni].sort((a, b) => {
    const lead = Number(b.fellowship.isTeamLeader) - Number(a.fellowship.isTeamLeader);
    if (lead !== 0) return lead;
    const byLast = a.lastName.localeCompare(b.lastName, "it");
    return byLast !== 0 ? byLast : a.firstName.localeCompare(b.firstName, "it");
  });
}

/**
 * Filtro combinato di ricerca testuale + anno + destinazione.
 * La ricerca copre: nome, cognome, titolo progetto, PI e Tutor (e topic/università).
 */
export function filterAlumni(
  alumni: Alumnus[],
  opts: { query?: string; year?: YearFilter; destination?: DestinationFilter },
): Alumnus[] {
  const q = (opts.query ?? "").trim().toLowerCase();
  const year = opts.year ?? "all";
  const dest = opts.destination ?? "all";

  return alumni.filter((a) => {
    if (year !== "all" && a.fellowship.cohort !== year) return false;
    if (dest !== "all" && a.fellowship.destination !== dest) return false;
    if (!q) return true;

    const haystack = [
      a.firstName,
      a.lastName,
      a.fellowship.projectTitle,
      a.fellowship.lab,
      a.fellowship.hostInstitution,
      a.background.homeUniversity,
      a.background.degree,
      ...a.fellowship.pis,
      ...a.fellowship.tutors,
      ...a.fellowship.topics,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

/** Raggruppa per anno (desc) e, dentro, per città di destinazione. */
export function groupByYearAndDestination(
  alumni: Alumnus[],
): { cohort: Cohort; groups: { destination: Destination; items: Alumnus[] }[] }[] {
  const byYear = new Map<Cohort, Alumnus[]>();
  for (const a of alumni) {
    const arr = byYear.get(a.fellowship.cohort) ?? [];
    arr.push(a);
    byYear.set(a.fellowship.cohort, arr);
  }

  const cohorts = Array.from(byYear.keys()).sort((a, b) => b - a);

  return cohorts.map((cohort) => {
    const items = byYear.get(cohort)!;
    const byDest = new Map<Destination, Alumnus[]>();
    for (const a of items) {
      const arr = byDest.get(a.fellowship.destination) ?? [];
      arr.push(a);
      byDest.set(a.fellowship.destination, arr);
    }
    const groups = Array.from(byDest.entries())
      .map(([destination, items]) => ({ destination, items }))
      .sort((a, b) => a.destination.localeCompare(b.destination));
    return { cohort, groups };
  });
}
