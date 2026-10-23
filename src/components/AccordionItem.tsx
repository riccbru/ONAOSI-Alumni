"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import type { Alumnus } from "@/types/alumni";
import { Avatar } from "./Avatar";
import { DestinationBadge, YearChip } from "./Badges";
import {
  BriefcaseIcon,
  BuildingIcon,
  ChevronDown,
  GithubIcon,
  GraduationIcon,
  LinkedinIcon,
  MailIcon,
  ScholarIcon,
  StarIcon,
} from "./icons";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

function isLink(v?: string | null): v is string {
  return !!v && /^(https?:|mailto:)/.test(v.trim());
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

function SocialLink({
  href,
  label,
  children,
}: {
  href?: string | null;
  label: string;
  children: React.ReactNode;
}) {
  if (!isLink(href)) return null;
  const isMail = href.startsWith("mailto:");
  return (
    <a
      href={href}
      target={isMail ? undefined : "_blank"}
      rel={isMail ? undefined : "noopener noreferrer"}
      aria-label={label}
      title={label}
      className="press inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-neutral-0 text-primary-700 transition-colors duration-150 ease-out hover:border-accent hover:bg-[#f0fcfc] hover:text-primary-900"
    >
      {children}
    </a>
  );
}

export function AccordionItem({
  alumnus,
  isOpen,
  onToggle,
}: {
  alumnus: Alumnus;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  const bodyId = useId();
  const { fellowship: f, background: b, currentStatus: cs, networking: n } = alumnus;

  const pis = f.pis.filter(Boolean).join(", ");
  const tutors = f.tutors.filter(Boolean).join(", ");
  const mailto = n.email && n.email.includes("@") ? `mailto:${n.email}` : null;

  // Abstract diviso in paragrafi sulle righe vuote (\n\n); i singoli \n restano.
  const abstractParagraphs = (f.projectAbstract || f.summary || "")
    .split(/\n[ \t]*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  // Mostra i contatti solo se l'alumnus è aperto al networking.
  const hasContacts =
    n.openToChat &&
    [mailto, n.linkedin, n.github, n.scholar].some((v) => v && isLink(v));

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-neutral-0 transition-[border-color,box-shadow] duration-200 ease-out ${
        isOpen
          ? "border-accent shadow-glow"
          : "border-border hover:border-primary-200"
      }`}
    >
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={bodyId}
          className="press flex w-full items-start gap-3 p-4 text-left sm:gap-4 sm:p-5"
        >
          <div className="relative shrink-0">
            <Avatar
              src={alumnus.avatar}
              firstName={alumnus.firstName}
              lastName={alumnus.lastName}
              size={56}
              teamLeader={f.isTeamLeader}
            />
            {f.isTeamLeader && (
              <span
                title="Team Leader"
                aria-label="Team Leader"
                className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-soft shadow-[0_1px_4px_rgba(101,221,224,0.6)] ring-2 ring-neutral-0"
              >
                <StarIcon className="h-3 w-3 text-primary-950" />
              </span>
            )}
          </div>

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

              {/* Contatti & social — solo icone, centrati in fondo al body.
                  Visibili solo se openToChat e solo i link effettivamente valorizzati. */}
              {hasContacts && (
                <div className="mt-6 flex items-center justify-center gap-2.5">
                  <SocialLink href={mailto ?? ""} label="Invia email">
                    <MailIcon className="h-[18px] w-[18px]" />
                  </SocialLink>
                  <SocialLink href={n.linkedin} label="LinkedIn">
                    <LinkedinIcon className="h-[18px] w-[18px]" />
                  </SocialLink>
                  <SocialLink href={n.github} label="GitHub">
                    <GithubIcon className="h-[18px] w-[18px]" />
                  </SocialLink>
                  <SocialLink href={n.scholar} label="Google Scholar">
                    <ScholarIcon className="h-[18px] w-[18px]" />
                  </SocialLink>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
