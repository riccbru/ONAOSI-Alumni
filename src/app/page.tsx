import { AlumniExplorer } from "@/components/AlumniExplorer";
import { getAllAlumni } from "@/lib/alumni";

export default function HomePage() {
  const alumni = getAllAlumni();
  return <AlumniExplorer alumni={alumni} />;
}
