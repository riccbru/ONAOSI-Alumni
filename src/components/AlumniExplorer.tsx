"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useState } from "react";
import type { Alumnus, Destination } from "@/types/alumni";
import { CityDrawer } from "./CityDrawer";
import { Header } from "./Header";
import { ListView } from "./ListView";
import type { ViewMode } from "./ViewToggle";

// Il globo è pesante (WebGL): niente SSR, caricato alla bisogna.
const GlobeView = dynamic(
  () => import("./GlobeView").then((m) => m.GlobeView),
  { ssr: false },
);

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function AlumniExplorer({ alumni }: { alumni: Alumnus[] }) {
  // La pagina si apre sulla vista a lista; il globo 3D viene montato (e il suo
  // contesto WebGL creato) solo quando si passa alla vista mappa.
  const [view, setView] = useState<ViewMode>("list");
  const [selected, setSelected] = useState<Destination | null>(null);

  const handleSelect = useCallback((d: Destination) => setSelected(d), []);
  const closeDrawer = useCallback(() => setSelected(null), []);

  const isMap = view === "map";

  return (
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
    </div>
  );
}
