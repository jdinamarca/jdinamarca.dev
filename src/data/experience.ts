export interface Experience {
  role: string
  company: string
  period: string
  description: string
  tech: string[]
}

export const experience: Experience[] = [
  {
    role: "Software Architect",
    company: "Snakode",
    period: "2020 - Presente",
    description: "Diseño de plataformas escalables, consultoría técnica y liderazgo de equipos distribuidos.",
    tech: ["Next.js", "Kubernetes", "GCP", "AI/ML"],
  },
  {
    role: "Senior Full Stack Developer",
    company: "Tech Innovations",
    period: "2017 - 2020",
    description: "Desarrollo de aplicaciones web empresariales y microservicios.",
    tech: ["React", "Node.js", "PostgreSQL", "AWS"],
  },
  {
    role: "Full Stack Developer",
    company: "Digital Solutions",
    period: "2014 - 2017",
    description: "Creación de productos digitales y gestión de proyectos ágiles.",
    tech: ["Angular", "PHP", "MySQL", "Docker"],
  },
  {
    role: "Junior Developer",
    company: "StartUp Labs",
    period: "2011 - 2014",
    description: "Desarrollo de aplicaciones móviles y web en entorno de startup.",
    tech: ["iOS", "Android", "JavaScript", "MongoDB"],
  },
]