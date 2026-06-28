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

#### 3. Ritmo visual de la landing ✅
- [x] Romper la monotonía vertical: "Sobre mí" como banda full-bleed (`border-y border-border bg-card/30`) para separar visualmente del resto.
- [x] Semántica: cada bloque ahora es un `<section>` con `<h2>` (componente `SectionHeading`) — a11y + jerarquía de encabezados.
- [x] Single source of truth del stack: `stack`/`focus` extraídos a `src/data/stack.ts` (antes inline en `page.tsx`). Nota: `playing-with.ts` es otra lista distinta, no era duplicado real.

---

## ✅ Completadas (actualizadas)

### Deploy y dominio
- [x] Deploy a Vercel (automático al push a main)
- [x] Conectar dominio `jdinamarca.dev` en Vercel
- [x] Añadir `jdinamarca.dev` a dominios autorizados en Firebase Auth
- [x] Login de Google funcionando en producción

---

## 🔵 Backlog (siguientes pasos)

> Modelos GLM por tier: **T1** `glm-4.6` (arquitectura, bug complejo, multi-archivo) ·
> **T2** `glm-4.5-air` (feature estándar siguiendo patrón) ·
> **T3** `glm-4-flash` (1 archivo, config, docs, Tailwind).

### SEO y funcionalidad
- [ ] Filtros por tags en `/blog` (`TagFilter` client component) — **T2 · `glm-4.5-air`**
- [ ] Búsqueda simple en el blog (client-side sobre posts cargados) — **T2 · `glm-4.5-air`**
- [x] RSS feed (`/feed.xml/route.ts`) — **T3 · `glm-4-flash`** ✅
- [x] Vercel Analytics (`@vercel/analytics`) — **T3 · `glm-4-flash`** ✅

### UX y robustez
- [ ] Loading skeletons (`loading.tsx`) + error boundary (`error.tsx`) en `/blog` — **T2 · `glm-4.5-air`**
- [ ] Limpieza de imágenes huérfanas en Storage al eliminar/reemplazar post — **T1 · `glm-4.6`**
- [ ] Newsletter / comentarios (opcional) — **T1 · `glm-4.6`**

### Orden recomendado de ejecución
1. ~~**[F2]** Analytics~~ ~~**[F4]** RSS~~ ✅ Completados
2. **[F1]** Filtros → **[F3]** Búsqueda (necesitan Input component primero)
3. **[F6]** Skeletons (necesita Skeleton component primero)
4. **[F5]** Limpieza Storage (necesita más detalle)
5. **[F7]** Newsletter (necesita diseño previo)

### Detalle de cada tarea

#### [F1] Filtro por tags en `/blog` — T2 · `glm-4.5-air` — ⚠️ Requiere prerequisito
- **Modelo:** `glm-4.5-air`
- **Prerequisito:** No existe `Input` en `src/components/ui/`. Instalar primero: `npx shadcn@latest add input`
- **Archivos:** crear `src/components/blog/TagFilter.tsx` (client), editar `src/app/blog/page.tsx`
- **Patrón a seguir:**
  - `blog/page.tsx` es server component (fetch con `getPosts`) → pasa `posts` como prop al client component
  - Imitar estructura de `PostCard.tsx` para los badges de tags
  - `Post` interface tiene `tags?: string[]` (`src/types/index.ts:22`)
- **Pasos:** extraer tags únicos de `posts.flatMap(p => p.tags ?? [])`, badges clicables con estado `selectedTag`, filtrar lista, mostrar todos si no hay selección
- **⚠️ Regla:** no usar `setState` síncrono en `useEffect` (lint `react-hooks/set-state-in-effect`)
- **Aceptación:** click en tag filtra la lista · lint ✓ build ✓

#### [F3] Búsqueda simple en el blog — T2 · `glm-4.5-air` — ⚠️ Requiere prerequisito
- **Modelo:** `glm-4.5-air`
- **Prerequisito:** mismo que F1 (necesita `Input` component)
- **Recomendación:** combinar F1 + F3 en un solo componente `BlogFilters.tsx` (tags + búsqueda juntas)
- **Archivos:** crear `src/components/blog/SearchPosts.tsx` o fusionar en `TagFilter`
- **Pasos:** input con filtrado case-insensitive sobre `title`, `excerpt` y `tags`
- **Aceptación:** escribir filtra la lista en vivo · lint ✓ build ✓

#### [F6] Loading skeletons + error boundary — T2 · `glm-4.5-air` — ⚠️ Requiere prerequisito
- **Modelo:** `glm-4.5-air`
- **Prerequisito:** No existe `Skeleton` en `src/components/ui/`. Instalar: `npx shadcn@latest add skeleton`
- **Archivos:** crear `src/app/blog/loading.tsx`, `src/app/blog/error.tsx`, `src/app/blog/[slug]/loading.tsx`
- **error.tsx debe ser client component:**
  ```typescript
  "use client";
  export default function Error({ reset }: { error: Error; reset: () => void }) { ... }
  ```
- **loading.tsx:** skeleton imitando `PostCard` (Card con rectángulos grises en lugar de texto)
- **Aceptación:** mientras carga `/blog` se ve skeleton · lint ✓ build ✓

#### [F5] Limpieza de imágenes huérfanas en Storage — T1 · `glm-4.6` — ❌ Insuficiente, necesita más detalle
- **Modelo:** `glm-4.6` (complejo, multi-archivo, regex, HTML parsing)
- **Gaps críticos a resolver antes de ejecutar:**
  1. **`PostSummary` no tiene `coverImage`** (`src/types/index.ts:25-28`). Opciones:
     - Añadir `coverImage?` a `PostSummary` y al API `/api/admin/posts`
     - O hacer fetch del post completo en `handleDelete`
  2. **Extracción de path de URL de Storage:** las URLs son tipo:
     `https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encodedPath}?alt=media&token=...`
     Regex necesaria: `decodeURIComponent(url.split("/o/")[1].split("?")[0])`
  3. **Imágenes inline en content:** el HTML del post tiene `<img src="...">` que apuntan a Storage. Necesita regex para extraer todas las URLs: `content.match(/<img[^>]+src="([^"]+)"/g)`
  4. **Import:** `deleteObject, ref` de `firebase/storage` (client SDK)
  5. **Patrón best-effort:** envolver cada `deleteObject` en try/catch individual, no fallar todo si una imagen no se borra
- **Archivos a tocar:** `PostList.tsx` (handleDelete), `PostEditor.tsx` (handleCoverUpload — borrar anterior), posiblemente `src/types/index.ts` y `/api/admin/posts`
- **Aceptación:** eliminar un post borra cover + imágenes inline de Storage · lint ✓ build ✓

#### [F7] Newsletter / comentarios — T1 · `glm-4.6` — ❌ Insuficiente, necesita diseño previo
- **Modelo:** `glm-4.6`
- **Bloqueadores:**
  - No hay decisión de servicio. Opciones: Mailchimp/Buttondown (newsletter), Giscus/utterances (comentarios)
  - No hay patrón de formularios en el codebase
  - No hay componentes de form adicionales (Input, Textarea, Form)
- **Recomendación:** posponer hasta decidir servicio y diseñar la UI. Documentar como ADR cuando se elija.

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
