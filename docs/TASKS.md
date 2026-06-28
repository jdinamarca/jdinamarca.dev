# Tareas — jdinamarca.dev

> Checklist de trabajo detallado. Actualizar al completar cada ítem.
> Estado verificado contra commit `96b3a7c` (rama `main`) + Sesión 4 completada.
> Para el roadmap por fases ver: `ROADMAP.md`

---

## ✅ Completadas

### Sesión 1 — 2026-06-03

- [x] Scaffold Next.js 16 + TypeScript + Tailwind CSS v4
- [x] Inicializar shadcn/ui con base-ui (versión actual sin `asChild`)
- [x] Instalar componentes shadcn: Badge, Card, Avatar, Separator, NavigationMenu, DropdownMenu, Dialog, Sonner
- [x] Instalar Firebase SDK (`firebase`, `firebase-admin`)
- [x] Instalar Tiptap (`@tiptap/react`, `starter-kit`, `extension-image`, `extension-link`, `extension-placeholder`)
- [x] Crear `src/lib/firebase.ts` — lazy getters browser-only para Auth, Firestore, Storage
- [x] Crear `src/lib/firebase-admin.ts` — Admin SDK inicializado server-side
- [x] Crear `src/hooks/useAuth.ts` — Google Auth con isAdmin por email
- [x] Crear `src/types/index.ts` — interfaces Post y Project
- [x] Crear `src/components/layout/Navbar.tsx` — sticky, login/logout, avatar, dropdown con link a /admin
- [x] Crear `src/components/layout/Footer.tsx`
- [x] Actualizar `src/app/layout.tsx` — root layout con Navbar, Footer, Toaster, lang="es", dark mode
- [x] Crear `src/app/page.tsx` — landing hero con nombre, bio, stack badges, CTA buttons
- [x] Crear páginas placeholder: `/blog`, `/projects`, `/lab`, `/admin` (auth gate)
- [x] Crear `src/components/blog/PostEditor.tsx` — editor Tiptap completo con subida de imágenes
- [x] Crear `.env.example` + `.gitignore` (excluye `.env.local`)
- [x] Crear `vercel.json`
- [x] Fix: Firebase lazy init para evitar error `auth/invalid-api-key` en build
- [x] Fix: Remover `asChild` de Button (no soportado en base-ui)
- [x] Verificar `npm run build` — build limpio sin errores ✓

### Conectar Firebase — 2026-06-04

- [x] Crear proyecto Firebase `jdinamarcadev-c1f8b`
- [x] Authentication → Google provider habilitado
- [x] Firestore Database creada
- [x] Storage creado
- [x] `.env.local` llenado con credenciales reales (client SDK + Admin SDK)

### Sesión 2 — 2026-06-21

#### Blog (lectura)
- [x] Crear `src/lib/posts.ts` (admin SDK): `getPosts`, `getPost`, `getPostsByCategory`, `getRecentPosts`, `getPublishedSlugs`
- [x] Crear `src/components/blog/PostCard.tsx`
- [x] Actualizar `/blog` — listado real con grid responsive + empty state + manejo de errores
- [x] Crear `/blog/[slug]` — `prose`, metadata OG/Twitter, back link, JSON-LD BlogPosting, reading time, generateStaticParams
- [x] Configurar `next/image` (remote patterns de Firebase Storage) en `next.config.ts`
- [x] `@tailwindcss/typography` + variables `prose` en `globals.css`
- [x] Fix lint: `ThemeToggle` — eliminar `setState-in-effect`

#### Admin (gestión de posts)
- [x] Crear `src/components/blog/PostList.tsx` — listado (borradores + publicados) con status badge, ver y eliminar
- [x] Actualizar `/admin` — editor toggleable + lista con refresh automático
- [x] Fix `PostEditor`: remover extensión `Link` duplicada (StarterKit v3 ya la incluye), `immediatelyRender: true`, `onSaved` callback
- [x] Fix `PostEditor`: error handling con código real de Firebase
- [x] Crear `firestore.rules` + `storage.rules` + `firebase.json`
- [x] Edición de post existente (precarga + `updateDoc` + remonta por `key={post.id}`)
- [x] Subida de cover image (upload/preview/remover, deleteField, storage `covers/**`)

#### Portafolio (Fase B — completa)
- [x] Decidir JSON estático vs Firestore → ADR 0006 (JSON estático)
- [x] Crear `src/data/projects.json` (5 proyectos)
- [x] Crear `src/components/portfolio/ProjectCard.tsx`
- [x] Actualizar `/projects` — grid ordenado por año + empty state + metadata

#### Landing completa (Fase C — completa)
- [x] Sección "Proyectos destacados" (featured, limit 3) en `/`
- [x] Sección "Últimos posts" (`getRecentPosts(3)`) en `/`
- [x] Sección "Sobre mí" (bio + stats + enlaces sociales) en `/`
- [x] Sección "Currently Playing With" (`src/data/playing-with.ts` + `CurrentlyPlaying.tsx`)
- [x] Sección "Experiencia" timeline (`src/data/experience.ts` + `ExperienceTimeline.tsx`)
- [x] `PostCard` mejorado con metadata opcional (category, level, readTime, tech, series, repo, demo)

#### SEO (parcial)
- [x] `src/app/sitemap.ts` (rutas estáticas + dinámicas por slug)
- [x] Metadata OG/Twitter para `/blog/[slug]`
- [x] JSON-LD `BlogPosting` en `/blog/[slug]`

#### Infra
- [x] Repo en GitHub vía SSH (`origin` → `git@github.com:jdinamarca/jdinamarca.dev.git`)
- [x] `.env.local` correctamente ignorado por git
- [x] Dark/light toggle funcional (`ThemeToggle` + `next-themes`)

---

### Sesión 3 — 2026-06-27

#### Lab (Fase A)
- [x] Decidir modelo de Lab (categoría `lab` vs `experimento`) → ADR 0007 (reutilizar `experimento`).
- [x] Crear `docs/adr/0007-lab-categoria-experimento.md`.
- [x] Actualizar `docs/adr/README.md` con ADR 0007.
- [x] Actualizar `src/app/lab/page.tsx`: importar `getPostsByCategory`, filtrar por `experimento`, metadata "Lab", heading "Lab", mensaje error específico.
- [x] Verificar `npm run lint` ✓ y `npm run build` ✓ (`/lab` marcado como dynamic).
- [x] Actualizar `docs/EXECUTION_PLAN.md` (A1 ✅, snapshot, orden recomendado).

---

### Sesión 4 — 2026-06-27

#### SEO y Metadatos (Fase D)
- [x] Crear `src/app/robots.ts` para indexación SEO (allow `/`, disallow `/admin`)
- [x] Crear `src/app/opengraph-image.tsx` (Edge Runtime, ImageResponse 1200×630)

---

### Sesión 5 — Mejoras de diseño, credibilidad y SEO — 2026-06-27

> Surgidas de una revisión de diseño de la landing. Orden por impacto/esfuerzo.

#### 1. Credibilidad + SEO base ✅
- [x] Setear `metadataBase` en el root layout (arregla OG/Twitter que resolvían a `http://localhost:3000`)
- [x] Stats de la landing reales: proyectos desde `projects.json` (`projects.length`) y posts vía `getPublishedPostCount()` (agregación `count()`). Años (15+) y curiosidad (∞) se mantienen.

#### 2. Diferenciar `/lab` ✅
- [x] `/lab` con estética terminal/notebook propia: hero `$ ls ~/lab --experiments` + `AI Lab`, fondo grid+radial, y `LabCard` (celdas tipo `exp_NNN.ipynb` con tech `[run]`, repo/demo y numeración por recencia). Ya no reusa `PostCard`.

#### 3. Ritmo visual de la landing
- [ ] Romper la monotonía vertical: alternar fondo/ancho en 1-2 secciones (ej. "Sobre mí" o "Experiencia" full-bleed con `bg-card`)
- [ ] Semántica: un `<section>` por bloque con su `<h2>` (a11y + jerarquía de encabezados)
- [ ] Single source of truth para el stack (hoy duplicado en `page.tsx`, `playing-with.ts` y `CLAUDE.md`)

---

## ❌ Pendientes — verificado que NO existen en código

### Deploy (manual)
- [ ] Deploy a Vercel (importar repo, env vars, build verde)
- [ ] Conectar dominio `jdinamarca.dev` en Vercel
- [ ] Añadir `jdinamarca.dev` + `*.vercel.app` a dominios autorizados en Firebase Auth

---

## 🔵 Backlog (no urgente)

- [ ] Filtros por tags en `/blog` (`TagFilter` client component)
- [ ] Búsqueda simple en el blog (client-side sobre posts cargados)
- [ ] RSS feed (`/feed.xml/route.ts`)
- [ ] Vercel Analytics (`@vercel/analytics`)
- [ ] Loading skeletons (`loading.tsx`) + error boundary (`error.tsx`) en `/blog`
- [ ] Limpieza de imágenes huérfanas en Storage al eliminar/reemplazar post
- [ ] Newsletter / comentarios (opcional)

---

## 📝 Notas de contexto

**¿Por qué lazy init en Firebase?**
Firebase client SDK no puede inicializarse en el servidor (Next.js hace SSR de
todos los componentes, incluso los `"use client"`). Si se inicializa a nivel de
módulo, el build falla con `auth/invalid-api-key`. Solución: getters que solo se
llaman desde efectos/handlers (browser únicamente).

**¿Por qué no `asChild` en Button?**
Esta versión de shadcn usa `@base-ui/react` en vez de Radix UI. La prop
`asChild` no existe. Patrón correcto: `<Link href="/ruta"><Button>Texto</Button></Link>`.

**¿Por qué el blog lee vía Admin SDK?**
Las reglas de Firestore son admin-only (escritura/lectura solo admin para
mantener borradores privados). El Admin SDK ignora las reglas, así que el blog
lee en SSR sin exponer borradores. Ver ADR 0004.

**shadcn Button size "sm"** tiene clase `h-7`, no `h-8` (default).
