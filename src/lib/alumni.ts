import fs from "node:fs";
import path from "node:path";
import type { Alumnus, Cohort } from "@/types/alumni";

const ALUMNI_DIR = path.join(process.cwd(), "data", "alumni");

/**
 * Parsing tollerante: piccole modifiche manuali ai file non devono rompere la
 * build. Al primo fallimento ripulisce (a) le virgole finali e (b) i caratteri
 * di controllo grezzi (es. TAB o a-capo dentro una stringa, non ammessi da JSON)
 * sostituendoli con uno spazio, poi riprova il parse.
 */
function parseLoose<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    const cleaned = raw
      .replace(/[\u0000-\u001F]/g, " ")
      .replace(/,(\s*[}\]])/g, "$1");
    return JSON.parse(cleaned) as T;
  }
}

/**
 * Legge tutti i file JSON degli alumni (data/alumni/<anno>/*.json) a build-time.
 * Eseguito solo lato server (Server Component). I dati vengono poi passati come
 * prop ai Client Component della mappa e delle liste.
 */
export function getAllAlumni(): Alumnus[] {
  if (!fs.existsSync(ALUMNI_DIR)) return [];

  const years = fs
    .readdirSync(ALUMNI_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const alumni: Alumnus[] = [];

  for (const year of years) {
    const dir = path.join(ALUMNI_DIR, year);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(dir, file), "utf-8");
        alumni.push(parseLoose<Alumnus>(raw));
      } catch {
        // Ignora file malformati senza interrompere la build.
      }
    }
  }

  // Ordinamento stabile: coorte decrescente, poi cognome, poi nome.
  return alumni.sort((a, b) => {
    if (a.fellowship.cohort !== b.fellowship.cohort) {
      return b.fellowship.cohort - a.fellowship.cohort;
    }
    const byLast = a.lastName.localeCompare(b.lastName, "it");
    return byLast !== 0 ? byLast : a.firstName.localeCompare(b.firstName, "it");
  });
}

export function getCohorts(alumni: Alumnus[]): Cohort[] {
  const set = new Set<Cohort>();
  alumni.forEach((a) => set.add(a.fellowship.cohort));
  return Array.from(set).sort((a, b) => a - b);
}
