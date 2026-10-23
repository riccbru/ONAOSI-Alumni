"use client";

import { createContext, useContext } from "react";
import type { Alumnus } from "@/types/alumni";

type ProfileModalContextValue = {
  /** Apre il modale sul profilo completo dell'alumnus. */
  openProfile: (a: Alumnus) => void;
};

const ProfileModalContext = createContext<ProfileModalContextValue | null>(null);

export const ProfileModalProvider = ProfileModalContext.Provider;

/**
 * Accesso all'apertura del modale profilo. Ritorna null se usato fuori dal
 * provider (in tal caso il bottone "espandi" semplicemente non viene mostrato).
 */
export function useProfileModal() {
  return useContext(ProfileModalContext);
}
