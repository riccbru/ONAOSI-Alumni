"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import type { Alumnus } from "@/types/alumni";
import { Avatar } from "./Avatar";
import { DestinationBadge, YearChip } from "./Badges";
import { ContactLinks, TopicList, splitAbstract } from "./profileParts";
import { useProfileModal } from "./ProfileModalContext";
import {
  BriefcaseIcon,
  BuildingIcon,
  ChevronDown,
  ExpandIcon,
  GraduationIcon,
  StarIcon,
} from "./icons";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Avatar + badge team leader, riutilizzato sia cliccabile sia statico. */
function AvatarVisual({
  alumnus,
  teamLeader,
}: {
  alumnus: Alumnus;
  teamLeader: boolean;
}) {
  return (
    <>
      <Avatar
        src={alumnus.avatar}
        firstName={alumnus.firstName}
        lastName={alumnus.lastName}
        size={56}
        teamLeader={teamLeader}
      />
      {teamLeader && (
        <span
          title="Team Leader"
          aria-label="Team Leader"
          className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-soft shadow-[0_1px_4px_rgba(101,221,224,0.6)] ring-2 ring-neutral-0"
        >
          <StarIcon className="h-3 w-3 text-primary-950" />
        </span>
      )}
    </>
  );
}

/** Riga descrittiva con icona nel corpo dell'accordion. */
function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-primary-500">{icon}</span>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-text-secondary">
          {label}
        </div>
        <div className="text-sm text-text">{children}</div>
      </div>
    </div>
  );
}

export function AccordionItem({
  alumnus,
  isOpen,
  onToggle,
  allowExpand = false,
}: {
  alumnus: Alumnus;
  isOpen: boolean;
  onToggle: () => void;
  // Mostra il bottone "Apri scheda completa" (utile nel drawer; superfluo
  // nella vista a lista, dove c'è già l'intero direttorio).
  allowExpand?: boolean;
}) {
  const reduce = useReducedMotion();
  const bodyId = useId();
  const profileModal = useProfileModal();
  const { fellowship: f, background: b, currentStatus: cs, networking: n } = alumnus;

  const pis = f.pis.filter(Boolean).join(", ");
  const tutors = f.tutors.filter(Boolean).join(", ");
  const topics = f.topics.filter(Boolean);
  const showExpand = allowExpand && profileModal !== null;
  const abstractParagraphs = splitAbstract(f.projectAbstract || f.summary);

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-neutral-0 transition-[border-color,box-shadow] duration-200 ease-out ${
        isOpen
          ? "border-accent shadow-glow"
          : "border-border hover:border-primary-200"
      }`}
    >
      <div className="flex items-start gap-3 p-4 sm:gap-4 sm:p-5">
        {/* Avatar: nel drawer è cliccabile e apre la scheda completa. */}
        {showExpand && profileModal ? (
          <button
            type="button"
            onClick={() => profileModal.openProfile(alumnus)}
            aria-label={`Apri la scheda completa di ${alumnus.firstName} ${alumnus.lastName}`}
            className="press group relative shrink-0 rounded-full"
          >
            <AvatarVisual alumnus={alumnus} teamLeader={f.isTeamLeader} />
            <span className="absolute inset-0 grid place-items-center rounded-full text-text-inverse opacity-0 transition-opacity duration-150 ease-out group-hover:bg-primary-950/45 group-hover:opacity-100">
              <ExpandIcon className="h-5 w-5" />
            </span>
          </button>
        ) : (
          <div className="relative shrink-0">
            <AvatarVisual alumnus={alumnus} teamLeader={f.isTeamLeader} />
          </div>
        )}

        <h3 className="min-w-0 flex-1">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={isOpen}
            aria-controls={bodyId}
            className="press flex w-full items-start gap-3 text-left"
          >
            <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-[15px] font-bold leading-tight text-primary-900 sm:text-base">
                {alumnus.firstName} {alumnus.lastName}
              </span>
              <DestinationBadge destination={f.destination} />
              <YearChip cohort={f.cohort} />
            </div>

            <p className="mt-1 line-clamp-2 text-sm font-semibold text-text sm:line-clamp-none">
              {f.projectTitle}
            </p>

            {(pis || tutors) && (
              <div className="mt-1 space-y-0.5 text-xs text-text-secondary">
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

            {topics.length > 0 && (
              <div className="mt-2">
                <TopicList topics={topics} />
              </div>
            )}
          </div>

            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: EASE_OUT }}
              className="mt-1 shrink-0 text-primary-500"
            >
              <ChevronDown />
            </motion.span>
          </button>
        </h3>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={bodyId}
            role="region"
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: reduce ? 0 : 0.28, ease: EASE_OUT },
              opacity: { duration: reduce ? 0 : 0.2, ease: EASE_OUT },
            }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/70 px-4 pb-5 pt-4 sm:px-5">
              {/* Abstract: ogni riga vuota (\n\n nel JSON) separa un paragrafo;
                  i singoli \n diventano a-capo grazie a whitespace-pre-line. */}
              {abstractParagraphs.length > 0 && (
                <div className="space-y-3">
                  {abstractParagraphs.map((para, i) => (
                    <p
                      key={i}
                      className="whitespace-pre-line text-sm leading-relaxed text-text"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <Row icon={<GraduationIcon className="h-[18px] w-[18px]" />} label="Formazione">
                  {b.homeUniversity}
                  <span className="block text-text-secondary">{b.degree}</span>
                </Row>

                <Row icon={<BriefcaseIcon className="h-[18px] w-[18px]" />} label="Ricerca">
                  {f.hostInstitution}
                  {(f.lab || f.department) && (
                    <span className="block text-text-secondary">
                      {[f.lab, f.department].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </Row>

                {(cs.role || cs.institution) && (
                  <Row icon={<BuildingIcon className="h-[18px] w-[18px]" />} label="Occupazione">
                    {[cs.role, cs.institution].filter(Boolean).join(" @ ")}
                    {(cs.city || cs.country) && (
                      <span className="block text-text-secondary">
                        {[cs.city, cs.country].filter(Boolean).join(", ")}
                      </span>
                    )}
                  </Row>
                )}
              </div>

              {/* Contatti & social — solo icone, centrati in fondo al body. */}
              <ContactLinks networking={n} className="mt-6" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
