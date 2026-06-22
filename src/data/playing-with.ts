export interface PlayingWith {
  name: string
  icon: string
  status: "testing" | "exploring" | "building" | "comparing"
  note: string
  url?: string
}

export const playingWith: PlayingWith[] = [
  { name: "Bun 1.2", icon: "🥟", status: "testing", note: "vs Node.js en producción", url: "https://bun.sh" },
  { name: "Tailwind v4", icon: "🎨", status: "exploring", note: "nuevo engine CSS", url: "https://tailwindcss.com" },
  { name: "Hono", icon: "🔥", status: "building", note: "API personal", url: "https://hono.dev" },
  { name: "Drizzle ORM", icon: "💾", status: "comparing", note: "vs Prisma", url: "https://orm.drizzle.team" },
]