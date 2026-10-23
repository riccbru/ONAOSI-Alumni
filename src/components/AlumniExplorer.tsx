"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Alumnus, Destination } from "@/types/alumni";
import { CityDrawer } from "./CityDrawer";
import { GlobeSkeleton } from "./GlobeSkeleton";
import { Header } from "./Header";
import { ListView } from "./ListView";
import { ProfileModal } from "./ProfileModal";
import { ProfileModalProvider } from "./ProfileModalContext";
import type { ViewMode } from "./ViewToggle";

// Il globo è pesante (WebGL): niente SSR, caricato alla bisogna. Durante il
// download del chunk mostriamo lo skeleton del mappamondo.
const GlobeView = dynamic(
  () => import("./GlobeView").then((m) => m.GlobeView),
  { ssr: false, loading: () => <GlobeSkeleton /> },
);

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function AlumniExplorer({
  alumni,
  initialView = "list",
  initialCity = null,
  initialAlumnusSlug = null,
}: {
  alumni: Alumnus[];
  // Stato iniziale deciso dal server (dai query param): evita il flash al
  // refresh perché l'HTML arriva già con la vista corretta.
  initialView?: ViewMode;
  initialCity?: Destination | null;
  initialAlumnusSlug?: string | null;
}) {
  // Il globo 3D viene montato (e il suo contesto WebGL creato) solo quando si
  // è in vista mappa.
  const [view, setView] = useState<ViewMode>(initialView);
  const [selected, setSelected] = useState<Destination | null>(initialCity);
  // Slug del profilo aperto nel modale (null ⇒ chiuso). Deep-linkabile.
  const [profileSlug, setProfileSlug] = useState<string | null>(initialAlumnusSlug);

  const bySlug = useMemo(
    () => new Map(alumni.map((a) => [a.slug, a])),
    [alumni],
  );
  const profile = profileSlug ? bySlug.get(profileSlug) ?? null : null;

  // Sincronizzazione stato → URL (replaceState: niente nuove voci di history).
  useEffect(() => {
    const params = new URLSearchParams();
    if (view !== "list") params.set("view", view);
    if (selected) params.set("city", selected);
    if (profileSlug) params.set("alumnus", profileSlug);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [view, selected, profileSlug]);

  const handleSelect = useCallback((d: Destination) => setSelected(d), []);
  const closeDrawer = useCallback(() => setSelected(null), []);

  const openProfile = useCallback((a: Alumnus) => setProfileSlug(a.slug), []);
  const closeProfile = useCallback(() => setProfileSlug(null), []);
  const profileModal = useMemo(() => ({ openProfile }), [openProfile]);

  const isMap = view === "map";

  return (
    <ProfileModalProvider value={profileModal}>
      <div className={isMap ? "flex h-[100dvh] flex-col overflow-hidden" : "flex min-h-[100dvh] flex-col"}>
        <Header view={view} onViewChange={setView} />

        <main className={isMap ? "relative min-h-0 flex-1" : "flex-1"}>
          <AnimatePresence mode="wait">
            {isMap ? (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="absolute inset-0"
              >
                <GlobeView alumni={alumni} onSelectDestination={handleSelect} />
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
              >
                <ListView alumni={alumni} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <CityDrawer destination={selected} alumni={alumni} onClose={closeDrawer} />
        <ProfileModal alumnus={profile} onClose={closeProfile} />
      </div>
    </ProfileModalProvider>
  );
}
