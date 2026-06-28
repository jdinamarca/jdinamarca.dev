export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;

  // Metadata enriquecida opcional
  category?: "opinion" | "tutorial" | "arquitectura" | "experimento";
  level?: "basico" | "medio" | "avanzado";
  readTime?: number;
  tech?: string[];
  series?: string;
  seriesPart?: number;
  seriesTotal?: number;
  repo?: string;
  demo?: string;
  tags?: string[];
}

export type PostSummary = Pick<
  Post,
  "id" | "title" | "slug" | "category" | "published" | "createdAt"
>;

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  repoUrl?: string;
  liveUrl?: string;
  coverImage?: string;
  featured: boolean;
  year: number;
}
