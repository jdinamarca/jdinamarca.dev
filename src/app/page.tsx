import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { PostCard } from "@/components/blog/PostCard";
import { CurrentlyPlaying } from "@/components/home/CurrentlyPlaying";
import { ExperienceTimeline } from "@/components/home/ExperienceTimeline";
import { getRecentPosts, getPublishedPostCount } from "@/lib/posts";
import type { Post, Project } from "@/types";
import {
  ArrowRight,
  BookOpen,
  FlaskConical,
  Terminal,
  User,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { stack, focus } from "@/data/stack";
import projectsData from "@/data/projects.json";

export const dynamic = "force-dynamic";

const projects = projectsData as Project[];
const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

function SectionHeading({
  icon: Icon,
  children,
  action,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3.5" />
        {children}
      </h2>
      {action}
    </div>
  );
}

export default async function Home() {
  let recentPosts: Post[] = [];
  let postCount = 0;
  try {
    [recentPosts, postCount] = await Promise.all([
      getRecentPosts(3),
      getPublishedPostCount(),
    ]);
  } catch {
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid mask-fade-b" />
        <div className="absolute inset-x-0 top-0 h-[480px] bg-radial-brand" />
      </div>

      <section className="container mx-auto max-w-4xl px-4 pt-28 pb-16 md:pt-36">
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
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-10">
        <SectionHeading icon={Terminal}>Stack &amp; herramientas</SectionHeading>
        <div className="flex flex-wrap gap-2">
          {stack.map((tech) => (
            <Badge key={tech} variant="outline" className="py-1">
              {tech}
            </Badge>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-10">
        <SectionHeading icon={Terminal}>Currently Playing With</SectionHeading>
        <CurrentlyPlaying />
      </section>

      {featuredProjects.length > 0 && (
        <section className="container mx-auto max-w-4xl px-4 py-10">
          <SectionHeading
            icon={Terminal}
            action={
              <Link
                href="/projects"
                className="flex items-center gap-1 text-sm text-foreground/70 transition-colors hover:text-brand"
              >
                Ver todos
                <ArrowRight className="size-3" />
              </Link>
            }
          >
            Proyectos destacados
          </SectionHeading>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {recentPosts.length > 0 && (
        <section className="container mx-auto max-w-4xl px-4 py-10">
          <SectionHeading
            icon={Terminal}
            action={
              <Link
                href="/blog"
                className="flex items-center gap-1 text-sm text-foreground/70 transition-colors hover:text-brand"
              >
                Ver todo el blog
                <ArrowRight className="size-3" />
              </Link>
            }
          >
            Últimos posts
          </SectionHeading>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      <section className="border-y border-border bg-card/30">
        <div className="container mx-auto max-w-4xl px-4 py-16">
          <SectionHeading icon={User}>Sobre mí</SectionHeading>
          <div className="max-w-2xl space-y-4 text-base text-muted-foreground">
            <p>
              Soy un apasionado de la tecnología con más de 15 años de experiencia diseñando e implementando
              soluciones de software escalables y eficientes. Actualmente enfoco mi carrera en la intersección de
              la arquitectura de sistemas y la ingeniería de IA, buscando siempre optimizar el ciclo de desarrollo
              y crear herramientas de alto valor.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient">15+</div>
              <div className="mt-1 text-xs text-muted-foreground">Años de experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient">{projects.length}</div>
              <div className="mt-1 text-xs text-muted-foreground">Proyectos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient">{postCount}</div>
              <div className="mt-1 text-xs text-muted-foreground">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient">∞</div>
              <div className="mt-1 text-xs text-muted-foreground">Curiosidad</div>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <Link
              href="https://github.com/jdinamarca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground transition-colors hover:text-brand"
            >
              GitHub
            </Link>
            <Link
              href="https://linkedin.com/in/jdinamarca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-foreground transition-colors hover:text-brand"
            >
              LinkedIn
            </Link>
            <a
              href="mailto:jdinamarca@snakode.com"
              className="text-sm font-medium text-foreground transition-colors hover:text-brand"
            >
              Email
            </a>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-16">
        <SectionHeading icon={Briefcase}>Experiencia</SectionHeading>
        <ExperienceTimeline />
      </section>
    </div>
  );
}
