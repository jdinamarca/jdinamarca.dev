import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { PostCard } from "@/components/blog/PostCard";
import { CurrentlyPlaying } from "@/components/home/CurrentlyPlaying";
import { ExperienceTimeline } from "@/components/home/ExperienceTimeline";
import { getRecentPosts } from "@/lib/posts";
import type { Post } from "@/types";
import { ArrowRight, BookOpen, FlaskConical, Terminal, User, Briefcase } from "lucide-react";
import type { Project } from "@/types";
import projectsData from "@/data/projects.json";

const stack = [
  "Next.js",
  "TypeScript",
  "Python",
  "Firebase",
  "LangChain",
  "TailwindCSS",
  "Kubernetes",
];

const focus = ["Arquitectura de software", "AI Engineering", "Plataformas", "DevEx"];

const projects = projectsData as Project[];
const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

export default async function Home() {
  let recentPosts: Post[] = [];
  try {
    recentPosts = await getRecentPosts(3);
  } catch {
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-fade-b" />
        <div className="absolute inset-x-0 top-0 h-[480px] bg-radial-brand" />
      </div>

      <section className="container mx-auto max-w-4xl px-4 pt-28 pb-20 md:pt-36">
        <div className="flex flex-col items-start gap-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-brand" />
            </span>
            Disponible para colaborar
          </div>

          <div className="space-y-4">
            <p className="font-mono text-sm text-brand">Hola, soy</p>
            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              <span className="text-gradient">Jason Dinamarca</span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
              Software Architect con +15 años en TI. Construyo plataformas,
              experimento con IA y documento lo que voy probando.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {focus.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/projects">
              <Button size="lg">
                Ver proyectos
                <ArrowRight />
              </Button>
            </Link>
            <Link href="/blog">
              <Button size="lg" variant="outline">
                <BookOpen />
                Leer el blog
              </Button>
            </Link>
            <Link href="/lab">
              <Button size="lg" variant="ghost">
                <FlaskConical />
                Lab
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <Terminal className="size-3.5" />
            Stack & herramientas
          </div>
          <div className="flex flex-wrap gap-2">
            {stack.map((tech) => (
              <Badge key={tech} variant="outline" className="py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <Terminal className="size-3.5" />
            Currently Playing With
          </div>
          <CurrentlyPlaying />
        </div>

        {featuredProjects.length > 0 && (
          <div className="mt-20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <Terminal className="size-3.5" />
                Proyectos destacados
              </div>
              <Link
                href="/projects"
                className="text-sm text-foreground/70 hover:text-brand transition-colors flex items-center gap-1"
              >
                Ver todos
                <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {recentPosts.length > 0 && (
          <div className="mt-20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                <Terminal className="size-3.5" />
                Últimos posts
              </div>
              <Link
                href="/blog"
                className="text-sm text-foreground/70 hover:text-brand transition-colors flex items-center gap-1"
              >
                Ver todo el blog
                <ArrowRight className="size-3" />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <User className="size-3.5" />
            Sobre mí
          </div>
          <div className="max-w-2xl space-y-4 text-base text-muted-foreground">
            <p>
              Soy un apasionado de la tecnología con más de 15 años de experiencia diseñando e implementando
              soluciones de software escalables y eficientes. Actualmente enfoco mi carrera en la intersección de
              la arquitectura de sistemas y la ingeniería de IA, buscando siempre optimizar el ciclo de desarrollo
              y crear herramientas de alto valor.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient">15+</div>
              <div className="text-xs text-muted-foreground mt-1">Años de experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient">50+</div>
              <div className="text-xs text-muted-foreground mt-1">Proyectos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient">10+</div>
              <div className="text-xs text-muted-foreground mt-1">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient">∞</div>
              <div className="text-xs text-muted-foreground mt-1">Curiosidad</div>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <Link
              href="https://github.com/jdinamarca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground hover:text-brand transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://linkedin.com/in/jdinamarca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground hover:text-brand transition-colors"
            >
              LinkedIn
            </Link>
            <a
              href="mailto:jdinamarca@snakode.com"
              className="text-sm font-medium text-foreground hover:text-brand transition-colors"
            >
              Email
            </a>
          </div>
        </div>

        <div className="mt-20 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <Briefcase className="size-3.5" />
            Experiencia
          </div>
          <ExperienceTimeline />
        </div>
      </section>
    </div>
  );
}