import type { Destination } from "@/types/alumni";
import { MapPinIcon, StarIcon } from "./icons";

const DEST_STYLES: Record<Destination, string> = {
  Chicago: "bg-primary-100 text-primary-800 ring-primary-200",
  Taipei: "bg-[#e3f9f9] text-[#0a6e70] ring-[#9fe6e8]",
};

export function DestinationBadge({ destination }: { destination: Destination }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${DEST_STYLES[destination]}`}
    >
      <MapPinIcon className="h-3.5 w-3.5" />
      {destination}
    </span>
  );
}

export function TeamLeaderBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full bg-gradient-to-br from-accent to-accent-soft px-2 py-0.5 text-xs font-bold text-primary-950 shadow-[0_1px_4px_rgba(101,221,224,0.5)]"
      title="Team Leader"
    >
      <StarIcon className="h-3.5 w-3.5 text-primary-950" />
      {!compact && "Team Leader"}
    </span>
  );
}

export function YearChip({ cohort }: { cohort: number }) {
  return (
    <span className="inline-flex items-center rounded-md bg-neutral-150 px-2 py-0.5 text-xs font-semibold text-text-secondary">
      {cohort}
    </span>
  );
}
