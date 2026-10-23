import type { GetServerSideProps } from "next";
import { AlumniExplorer } from "@/components/AlumniExplorer";
import type { ViewMode } from "@/components/ViewToggle";
import { getAllAlumni } from "@/lib/alumni";
import type { Alumnus, Destination } from "@/types/alumni";

type Props = {
  alumni: Alumnus[];
  initialView: ViewMode;
  initialCity: Destination | null;
  initialAlumnusSlug: string | null;
};

/**
 * Home: monta l'explorer (mappa 3D + direttorio). La vista iniziale e la città
 * del drawer sono decise lato server dai query param (?view / ?city), così al
 * refresh l'HTML arriva già nello stato giusto senza flash lista→mappa.
 */
export default function HomePage({
  alumni,
  initialView,
  initialCity,
  initialAlumnusSlug,
}: Props) {
  return (
    <AlumniExplorer
      alumni={alumni}
      initialView={initialView}
      initialCity={initialCity}
      initialAlumnusSlug={initialAlumnusSlug}
    />
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const alumni = getAllAlumni();
  const destinations = new Set(alumni.map((a) => a.fellowship.destination));
  const slugs = new Set(alumni.map((a) => a.slug));

  const initialView: ViewMode = query.view === "map" ? "map" : "list";

  const rawCity = Array.isArray(query.city) ? query.city[0] : query.city;
  const initialCity =
    rawCity && destinations.has(rawCity as Destination)
      ? (rawCity as Destination)
      : null;

  const rawAlumnus = Array.isArray(query.alumnus) ? query.alumnus[0] : query.alumnus;
  const initialAlumnusSlug = rawAlumnus && slugs.has(rawAlumnus) ? rawAlumnus : null;

  return { props: { alumni, initialView, initialCity, initialAlumnusSlug } };
};
