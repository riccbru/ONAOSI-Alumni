"use client";

import type { Networking } from "@/types/alumni";
import {
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  ScholarIcon,
} from "./icons";

/** True se la stringa è un link http(s) o mailto valido. */
export function isLink(v?: string | null): v is string {
  return !!v && /^(https?:|mailto:)/.test(v.trim());
}

/** Abstract diviso in paragrafi sulle righe vuote (\n\n); i singoli \n restano. */
export function splitAbstract(text?: string | null): string[] {
  return (text || "")
    .split(/\n[ \t]*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
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

/**
 * Riga di contatti (solo icone), centrata. Mostrata solo se l'alumnus è aperto
 * al networking e ha almeno un contatto valido; altrimenti non rende nulla.
 */
export function ContactLinks({
  networking: n,
  className = "",
}: {
  networking: Networking;
  className?: string;
}) {
  const mailto = n.email && n.email.includes("@") ? `mailto:${n.email}` : null;
  const has =
    n.openToChat && [mailto, n.linkedin, n.github, n.scholar].some((v) => v && isLink(v));
  if (!has) return null;

  return (
    <div className={`flex items-center justify-center gap-2.5 ${className}`}>
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
  );
}

/**
 * Riga di pill dei topic di ricerca. Stesso stile e stessa posizione (sotto
 * PI/Tutor) ovunque venga mostrata, così card e modale coincidono. Non rende
 * nulla se la lista è vuota.
 */
export function TopicList({ topics }: { topics: string[] }) {
  if (topics.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {topics.map((t) => (
        <span
          key={t}
          className="inline-flex items-center rounded-full border border-border bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-primary-700"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
