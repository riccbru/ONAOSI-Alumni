import type { GetStaticProps } from "next";
import { AlumniExplorer } from "@/components/AlumniExplorer";
import { getAllAlumni } from "@/lib/alumni";
import type { Alumnus } from "@/types/alumni";

/**
 * Home: monta l'explorer (mappa 3D + direttorio). I dati arrivano come prop
 * da getStaticProps, così la lettura dei file resta solo lato server.
 */
export default function HomePage({ alumni }: { alumni: Alumnus[] }) {
  return <AlumniExplorer alumni={alumni} />;
}

export const getStaticProps: GetStaticProps<{ alumni: Alumnus[] }> = () => {
  return { props: { alumni: getAllAlumni() } };
};
