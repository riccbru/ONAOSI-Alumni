"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Alumnus } from "@/types/alumni";
import { alumnusId, sortForDisplay } from "@/lib/filters";
import { AccordionItem } from "./AccordionItem";
import { SearchIcon } from "./icons";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-neutral-0/60 px-6 py-12 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-150 text-text-secondary">
        <SearchIcon />
      </span>
      <p className="text-sm font-medium text-text">{message}</p>
      <p className="text-xs text-text-secondary">Prova a modificare ricerca o filtri.</p>
    </div>
  );
}

/**
 * Lista di AccordionItem a singola apertura. `stagger` abilita una
 * comparsa a cascata (consigliata solo per liste corte, es. nel drawer).
 */
export function AlumniAccordionList({
  alumni,
  stagger = false,
  allowExpand = false,
}: {
  alumni: Alumnus[];
  stagger?: boolean;
  // Propagato agli item: abilita il bottone "Apri scheda completa" (drawer).
  allowExpand?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const reduce = useReducedMotion();

  // Team Leader in cima, poi per cognome.
  const ordered = useMemo(() => sortForDisplay(alumni), [alumni]);

  if (ordered.length === 0) {
    return <EmptyState message="Nessun alumnus trovato." />;
  }

  return (
    <ul className="flex flex-col gap-3">
      {ordered.map((a, i) => {
        const id = alumnusId(a);
        const content = (
          <AccordionItem
            alumnus={a}
            isOpen={openId === id}
            onToggle={() => setOpenId((cur) => (cur === id ? null : id))}
            allowExpand={allowExpand}
          />
        );
        return (
          <li key={id}>
            {stagger && !reduce ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE_OUT, delay: Math.min(i * 0.04, 0.4) }}
              >
                {content}
              </motion.div>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ul>
  );
}
