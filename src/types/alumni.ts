// Modello dati per un Alumnus ONAOSI (corrisponde ai JSON in data/alumni/**).

export type Destination = "Chicago" | "Taipei";
export type Cohort = 2025 | 2026;

export interface Fellowship {
  cohort: Cohort;
  isTeamLeader: boolean;
  destination: Destination;
  hostInstitution: string;
  tutors: string[];
  pis: string[];
  lab: string;
  projectTitle: string;
  /** Abstract del progetto (campo attuale). */
  projectAbstract?: string;
  /** Vecchio campo riassunto — mantenuto come fallback per i record non aggiornati. */
  summary?: string;
  topics: string[];
  department?: string;
}

export interface Background {
  homeUniversity: string;
  degree: string;
}

export interface CurrentStatus {
  role: string;
  institution: string;
  city: string;
  country: string;
}

export interface Networking {
  openToChat: boolean;
  /** Per chi non vuole condividere un contatto: ometti la chiave o mettila a null. */
  email?: string | null;
  linkedin?: string | null;
  github?: string | null;
  scholar?: string | null;
}

export interface Alumnus {
  slug: string;
  firstName: string;
  lastName: string;
  avatar: string;
  tagline: string;
  fellowship: Fellowship;
  background: Background;
  currentStatus: CurrentStatus;
  networking: Networking;
}
