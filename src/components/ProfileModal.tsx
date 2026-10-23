"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import type { Alumnus } from "@/types/alumni";
import { Avatar } from "./Avatar";
import { DestinationBadge, TeamLeaderBadge, YearChip } from "./Badges";
import { ContactLinks, TopicList, splitAbstract } from "./profileParts";
import { BriefcaseIcon, BuildingIcon, CloseIcon, GraduationIcon } from "./icons";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Pilastro informativo centrato (Formazione / Ricerca / Occupazione). */
function Pillar({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 basis-0 flex-col items-center gap-1.5 text-center">
      <span className="text-primary-500">{icon}</span>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
        {label}
      </div>
      <div className="text-sm text-text">{children}</div>
    </div>
  );
}

/**
 * Modale a tutta pagina con la scheda completa di un alumnus: lettura immersiva
 * dell'abstract e di tutti i dettagli. Si apre dal bottone "espandi" e dal
 * deep-link (?alumnus=id). Chiusura con Escape, backdrop e tasto X.
 */
export function ProfileModal({
  alumnus,
  onClose,
}: {
  alumnus: Alumnus | null;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const open = alumnus !== null;

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

  return (
    <AnimatePresence>
      {open && alumnus && (
        <ProfileModalContent alumnus={alumnus} onClose={onClose} reduce={!!reduce} />
      )}
    </AnimatePresence>
  );
}

function ProfileModalContent({
  alumnus,
  onClose,
  reduce,
}: {
  alumnus: Alumnus;
  onClose: () => void;
  reduce: boolean;
}) {
  const { fellowship: f, background: b, currentStatus: cs, networking: n } = alumnus;

  const pis = f.pis.filter(Boolean).join(", ");
  const tutors = f.tutors.filter(Boolean).join(", ");
  const topics = f.topics.filter(Boolean);
  const abstractParagraphs = splitAbstract(f.projectAbstract || f.summary);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-stretch justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Scheda di ${alumnus.firstName} ${alumnus.lastName}`}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
        onClick={onClose}
        className="absolute inset-0 bg-primary-950/50 backdrop-blur-[2px]"
      />

      {/* Pannello */}
      <motion.div
        initial={{ opacity: 0, scale: reduce ? 1 : 0.97, y: reduce ? 0 : 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: reduce ? 1 : 0.97, y: reduce ? 0 : 8 }}
        transition={{ duration: reduce ? 0 : 0.3, ease: EASE_OUT }}
        className="relative flex max-h-full w-full flex-col overflow-hidden bg-neutral-50 shadow-drawer sm:max-w-2xl sm:rounded-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start gap-4 border-b border-border bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 px-5 py-5 text-text-inverse sm:px-6">
          <div className="relative shrink-0">
            <Avatar
              src={alumnus.avatar}
              firstName={alumnus.firstName}
              lastName={alumnus.lastName}
              size={64}
              teamLeader={f.isTeamLeader}
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold leading-tight sm:text-xl">
              {alumnus.firstName} {alumnus.lastName}
            </h2>
            {alumnus.tagline && (
              <p className="mt-0.5 text-sm text-white/70">{alumnus.tagline}</p>
            )}
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
              <DestinationBadge destination={f.destination} />
              <YearChip cohort={f.cohort} />
              {f.isTeamLeader && <TeamLeaderBadge compact />}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="press inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-text-inverse transition-colors duration-150 ease-out hover:bg-white/20"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Corpo scrollabile */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
          <h3 className="text-base font-bold text-primary-900">{f.projectTitle}</h3>

          {(pis || tutors) && (
            <div className="mt-1.5 space-y-0.5 text-xs text-text-secondary">
              {pis && (
                <p>
                  <span className="font-semibold text-text">PI:</span> {pis}
                </p>
              )}
              {tutors && (
                <p>
                  <span className="font-semibold text-text">Tutor:</span> {tutors}
                </p>
              )}
            </div>
          )}

          {/* Topic: stessa posizione della card in lista (sotto PI/Tutor). */}
          {topics.length > 0 && (
            <div className="mt-2.5">
              <TopicList topics={topics} />
            </div>
          )}

          {abstractParagraphs.length > 0 && (
            <div className="mt-4 space-y-3">
              {abstractParagraphs.map((para, i) => (
                <p key={i} className="whitespace-pre-line text-sm leading-relaxed text-text">
                  {para}
                </p>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-start justify-evenly gap-4 border-t border-border/70 pt-5">
            <Pillar icon={<GraduationIcon className="h-5 w-5" />} label="Formazione">
              {b.homeUniversity}
              <span className="block text-text-secondary">{b.degree}</span>
            </Pillar>

            <Pillar icon={<BriefcaseIcon className="h-5 w-5" />} label="Ricerca">
              {f.hostInstitution}
              {(f.lab || f.department) && (
                <span className="block text-text-secondary">
                  {[f.lab, f.department].filter(Boolean).join(" · ")}
                </span>
              )}
            </Pillar>

            {(cs.role || cs.institution) && (
              <Pillar icon={<BuildingIcon className="h-5 w-5" />} label="Occupazione">
                {[cs.role, cs.institution].filter(Boolean).join(" @ ")}
                {(cs.city || cs.country) && (
                  <span className="block text-text-secondary">
                    {[cs.city, cs.country].filter(Boolean).join(", ")}
                  </span>
                )}
              </Pillar>
            )}
          </div>

          <ContactLinks
            networking={n}
            className="mt-6 border-t border-border/70 pt-5"
          />
        </div>
      </motion.div>
    </div>
  );
}
