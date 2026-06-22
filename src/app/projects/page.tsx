import type { Metadata } from "next";
import type { Project } from "@/types";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import projectsData from "@/data/projects.json";

export const metadata: Metadata = {
  title: "Projects",
  description: "Proyectos que he construido, desde aplicaciones web hasta herramientas de IA.",
};

const projects = projectsData as Project[];
const sortedProjects = [...projects].sort((a, b) => b.year - a.year);

export default function ProjectsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <header className="mb-12 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Projects
        </h1>
        <p className="mt-2 text-muted-foreground">
          Proyectos que he construido, desde aplicaciones web hasta herramientas de IA.
        </p>
      </header>

      {sortedProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">
            Aún no hay proyectos.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Los proyectos aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}