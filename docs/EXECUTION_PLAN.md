# Execution Plan — jdinamarca.dev

> Plan detallado, **tarea por tarea**, para dejar el sitio 100% funcional.
> Pensado para ejecutarse con modelos GLM pequeños (una tarea por sesión).
>
> **Cómo usarlo:** elige la próxima tarea sin completar (respeta dependencias),
> abre una sesión con el modelo indicado y pásale la plantilla de
> `PHILOSOPHY.md` §8. Marca `✅` al terminar y actualiza `TASKS.md`.

---

## Snapshot — estado actual (verificado contra commit `96b3a7c` + A1 completado)

**Completado:**
- Fase 1 (Fundación) ✓ — scaffold, Firebase SDK, auth Google, navbar, footer,
  theme toggle dark/light, layout, editor Tiptap, `/admin` con auth gate.
- Fase 2 (Firebase conectado) ✓ — proyecto, Auth, Firestore, Storage, `.env.local`,
  reglas `firestore.rules` + `storage.rules`.
- Fase 3 (Blog lectura) ✓ — `src/lib/posts.ts`, `PostCard`, `/blog`, `/blog/[slug]`
  con `prose` + metadata OG/Twitter + **JSON-LD BlogPosting** + reading time.
- Fase 3 (Admin) ✓ — lista borradores/publicados, **editar**, **eliminar**,
  **cover image**, manejo de errores con código Firebase.
- Fase B (Portafolio) ✓ — ADR 0006, `projects.json`, `ProjectCard`, `/projects`.
- Fase C (Landing) ✓ — todas las secciones (C1–C6).
- Fase D parcial ✓ — **D1 JSON-LD**, **D2 sitemap**, **D3 robots.ts** y **D4 opengraph-image.tsx** hechos.
- Fase A (Lab) ✓ — **A1 completo 2026-06-27**: `/lab` filtra por `experimento`, metadata "Lab",
  ADR 0007. A2 ya estaba ✓.
- Repo en GitHub vía SSH ✓ (origin → `git@github.com:jdinamarca/jdinamarca.dev.git`).

**Pendiente (este plan):**
- Fase E (Deploy Vercel + dominio), Fase F (extras).

---

## Modelos por tier (recortar tokens → usar el más pequeño posible)

| Tier | Modelo | Cuándo |
|---|---|---|
| **T1** | `glm-4.6` | Arquitectura, bug complejo, refactor multi-archivo, librería nueva |
| **T2** | `glm-4.5-air` | Feature estándar **siguiendo patrón existente**, componente imitando otro |
| **T3** | `glm-4-flash` | 1 archivo, config, docs, copiar/pegar patrón, Tailwind, texto |

Reglas fijas (todas las tareas): sin `any`, sin `asChild`, sin `setState` en
`useEffect` síncrono, Firebase siempre lazy/Admin SDK (ver ADRs 0002/0003).
Verificar siempre `npm run lint` + `npm run build`.

---

# Fase A — Lab (reutiliza el blog)

Lab = posts con `category: "lab"`. No hace falta nuevo modelo de datos.

## [A1] ✅ Página `/lab` con listado de experimentos — **T2**
- **Dependencias:** ninguna.
- **Objetivo:** `/lab` lista posts publicados de categoría `lab`.
- **Referencia:** imitar `src/app/blog/page.tsx` y `src/components/blog/PostCard.tsx`.
- **⚠️ Estado real:** completado 2026-06-27. ADR 0007: Lab reutiliza categoría `experimento`.
- **Archivos:**
  - Editar `src/app/lab/page.tsx`.
  - Crear `docs/adr/0007-lab-categoria-experimento.md`.
- **Pasos:**
  1. **Decidir modelo de Lab:** reutilizar `experimento` (ADR 0007).
  2. Convertir `/lab/page.tsx` en server component async que usa
     `getPostsByCategory("experimento")` (envolver en try/catch como `/blog`).
  3. Reusar `PostCard` para renderizar el grid.
  4. `export const dynamic = "force-dynamic";`
  5. Metadata: `{ title: "Lab", description: "Experimentos técnicos con IA y desarrollo web..." }`.
- **Aceptación:**
  - [x] `/lab` devuelve 200 y muestra **solo** cards de posts `experimento`.
  - [x] El título/heading y metadata dicen "Lab" (no "Blog").
  - [x] lint ✓ build ✓.

## [A2] ✅ Link de Lab apunta a `/blog/[slug]` — **T3**
- **Dependencias:** A1 ✅.
- **Objetivo:** los experimentos se leen en la misma vista que el blog (no
  duplicar `/lab/[slug]`).
- **Decisión:** NO crear `/lab/[slug]`. `PostCard` ya enlaza a `/blog/[slug]`,
  así que no hay que tocar nada salvo verificar.
- **Aceptación:**
  - [x] Al hacer click en una card de `/lab`, abre `/blog/[slug]` con el contenido.
- **Nota:** si se quiere distinguir visualmente, añadir un prefix "Lab" al
  breadcrumb del post (opcional, tarea separada).

---

# Fase B — Portafolio

Decisión recomendada: **datos estáticos en JSON** (los proyectos cambian poco,
no necesitan editor). Documentar como ADR al ejecutar B1.

## [B1] ✅ Decidir + documentar almacenamiento de proyectos — **T1**
- **Objetivo:** decidir JSON estático vs Firestore y registrar el ADR.
- **Recomendación:** **JSON estático** (`src/data/projects.json`) —simple,
  versionado, sin reglas, ideal para proyectos que cambian poco.
- **Archivos:**
  - Crear `docs/adr/0006-portafolio-datos-json-estatico.md` (formato del `PHILOSOPHY.md`).
- **Aceptación:**
  - [x] ADR creado con contexto, decisión y consecuencias.

## [B2] ✅ Datos de proyectos en JSON + tipado — **T3**
- **Dependencias:** B1.
- **Referencia:** interfaz `Project` en `src/types/index.ts` (ya existe).
- **Archivos:**
  - Crear `src/data/projects.json` con 3–5 proyectos de ejemplo (usa la
    interfaz `Project`: id, title, description, tags[], repoUrl?, liveUrl?,
    coverImage?, featured, year).
- **Pasos:**
  1. Crear `src/data/`.
  2. Crear `projects.json` con un array de objetos `Project`.
  3. En `src/types/index.ts`, añadir `import`/`type` si hace falta (no es necesario).
- **Aceptación:**
  - [x] JSON válido, campos alineados con `Project`.
  - [x] build ✓ (TS no valida JSON por defecto; opcional: `resolveJsonModule`
        ya está en tsconfig de Next).

## [B3] ✅ Componente `ProjectCard` — **T2**
- **Dependencias:** B2.
- **Referencia:** imitar `src/components/blog/PostCard.tsx` (estructura y estilos).
- **Archivos:**
  - Crear `src/components/portfolio/ProjectCard.tsx`.
- **Pasos:**
  1. Props: `{ project: Project }`.
  2. Card con: título, descripción (2 líneas), tags (badges), año, y enlaces
     repo/demo (abren en nueva pestaña, `target="_blank"`).
  3. Si `coverImage`, mostrar imagen arriba (usar `next/image` con
     `remotePatterns` ya configurados — si la URL es externa tipo GitHub,
     añadir hostname a `next.config.ts` o usar `<img>` con eslint-disable).
  4. Importar `Project` de `@/types`.
- **Aceptación:**
  - [x] Card renderiza sin errores con un proyecto de prueba.
  - [x] lint ✓ build ✓.

## [B4] ✅ Página `/projects` con grid — **T2**
- **Dependencias:** B3.
- **Referencia:** imitar `src/app/blog/page.tsx` (header + grid responsive).
- **Archivos:**
  - Editar `src/app/projects/page.tsx`.
- **Pasos:**
  1. Importar datos: `import projectsData from "@/data/projects.json"`.
  2. Cast a `Project[]`: `const projects = projectsData as Project[];`.
  3. Renderizar header + grid `sm:grid-cols-2 lg:grid-cols-3` de `ProjectCard`.
  4. Ordenar por `year` desc.
  5. Metadata `{ title: "Projects" }`.
- **Aceptación:**
  - [x] `/projects` devuelve 200 y muestra el grid.
  - [x] lint ✓ build ✓.

---

# Fase C — Landing completa

## [C1] ✅ Sección "Proyectos destacados" en `/` — **T2**
- **Dependencias:** B2.
- **Referencia:** imitar la sección "Stack" actual de `src/app/page.tsx`.
- **Archivos:**
  - Editar `src/app/page.tsx`.
- **Pasos:**
  1. Importar `projectsData` y `ProjectCard` (o un enlace).
  2. Filtrar `featured === true`, limit 2–3.
  3. Añadir una `<section>` tras la sección Stack con grid de `ProjectCard`.
  4. Enlace "Ver todos →" a `/projects`.
- **Aceptación:**
  - [x] La landing muestra proyectos destacados.
  - [x] lint ✓ build ✓.

## [C2] ✅ Sección "Últimos posts" en `/` — **T2**
- **Dependencias:** Fase 3 (posts.ts ya hecho).
- **Archivos:**
  - Editar `src/app/page.tsx`.
- **Pasos:**
  1. Como `page.tsx` es server component, importar `getRecentPosts` de `@/lib/posts`.
  2. `const posts = await getRecentPosts(3);` (try/catch → array vacío si falla).
  3. Convertir `Home()` en `async function Home()`.
  4. Añadir sección con `PostCard` (limit 3) + enlace "Ver todo el blog →".
- **Aceptación:**
  - [x] La landing muestra los 3 posts más recientes (o nada si no hay).
  - [x] lint ✓ build ✓.

## [C3] ✅ Sección "Sobre mí" breve en `/` — **T3**
- **Dependencias:** ninguna.
- **Archivos:**
  - Editar `src/app/page.tsx`.
- **Pasos:**
  1. Añadir `<section>` con párrafo bio corto (2–3 líneas) + enlaces sociales.
  2. Usar el Footer como referencia de los links (GitHub, LinkedIn).
- **Aceptación:**
  - [x] Sección renderiza, coherente con el resto.
  - [x] lint ✓ build ✓.

## [C4] ✅ Sección "Currently Playing With" en `/` — **T2**
- **Dependencias:** ninguna.
- **Archivos:**
  - Crear `src/data/playing-with.ts` con PlayingWith[].
  - Crear `src/components/home/CurrentlyPlaying.tsx`.
  - Editar `src/app/page.tsx`.
- **Pasos:**
  1. Crear datos locales (name, icon, status, note, url?).
  2. Card grid con badges coloreados por status.
  3. Insertar entre Stack y Proyectos destacados.
- **Aceptación:**
  - [x] La landing muestra "Currently Playing With".
  - [x] lint ✓ build ✓.

## [C5] ✅ Sección "Experiencia" timeline en `/` — **T2**
- **Dependencias:** ninguna.
- **Archivos:**
  - Crear `src/data/experience.ts` con Experience[].
  - Crear `src/components/home/ExperienceTimeline.tsx`.
  - Editar `src/app/page.tsx`.
- **Pasos:**
  1. Crear datos locales (role, company, period, description, tech[]).
  2. Timeline vertical con línea izquierda.
  3. Insertar después de "Sobre mí".
- **Aceptación:**
  - [x] La landing muestra timeline de experiencia.
  - [x] lint ✓ build ✓.

## [C6] ✅ PostCard mejorado con metadata — **T2**
- **Dependencias:** Fase 3.
- **Archivos:**
  - Actualizar `src/types/index.ts` Post interface.
  - Editar `src/components/blog/PostCard.tsx`.
  - Editar `src/lib/posts.ts` serialize.
  - Editar `src/components/blog/PostList.tsx`.
  - Editar `src/components/blog/PostEditor.tsx`.
  - Editar `src/app/blog/[slug]/page.tsx`.
  - Editar `src/app/lab/page.tsx`.
- **Pasos:**
  1. Añadir campos opcionales: category, level, readTime, tech, series, repo, demo.
  2. Actualizar category values: opinion | tutorial | arquitectura | experimento.
  3. Renderizar badges opcionales en PostCard.
  4. Actualizar serialize y editor para soportar nuevos valores.
- **Aceptación:**
  - [x] PostCard muestra badges opcionales.
  - [x] TypeScript sin errores.
  - [x] lint ✓ build ✓.

---

# Fase D — SEO y metadatos

## [D1] ✅ JSON-LD `Article` en `/blog/[slug]` — **T3**
- **Dependencias:** Fase 3.
- **Referencia:** usar `<script type="application/ld+json">` con
  `dangerouslySetInnerHTML` dentro del `<article>`.
- **Archivos:**
  - Editar `src/app/blog/[slug]/page.tsx`.
- **Pasos:**
  1. Construir objeto JSON-LD tipo `Article` (headline, datePublished,
     author, image, keywords).
  2. Renderizar `<script>` con `dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}`.
- **Aceptación:**
  - [x] El HTML de `/blog/[slug]` contiene el script JSON-LD válido.
  - [x] lint ✓ build ✓.

## [D2] ✅ `sitemap.ts` dinámico — **T3**
- **Dependencias:** Fase 3.
- **Archivos:**
  - Crear `src/app/sitemap.ts`.
- **Pasos:**
  1. Importar `getPublishedSlugs` de `@/lib/posts`.
  2. Exportar `default async function sitemap(): Promise<MetadataRoute.Sitemap>`.
  3. Incluir rutas estáticas (`/`, `/blog`, `/projects`, `/lab`) + una entrada
     por slug (`/blog/[slug]`) con `lastModified` desde el post.
  4. Base URL: `https://jdinamarca.dev`.
- **Aceptación:**
  - [x] `/sitemap.xml` devuelve XML con las URLs.
  - [x] lint ✓ build ✓.

## [D3] ✅ `robots.ts` — **T3**
- **Dependencias:** ninguna.
- **Objetivo:** `/robots.txt` generado para indexación y SEO.
- **Archivos:**
  - Crear `src/app/robots.ts`.
- **Pasos:**
  1. `export default function robots(): MetadataRoute.Robots`.
  2. `allow: "/"`, `sitemap: "https://jdinamarca.dev/sitemap.xml"`, disallow `/admin`.
- **Aceptación:**
  - [x] `/robots.txt` devuelve el texto correcto.
  - [x] build ✓.

## [D4] ✅ Open Graph image por defecto — **T2**
- **Dependencias:** ninguna.
- **Objetivo:** OG image por defecto para compartir en redes sociales.
- **Archivos:**
  - Crear `src/app/opengraph-image.tsx` (ImageResponse de `next/og`).
- **Pasos:**
  1. `import { ImageResponse } from "next/og";`
  2. `export const runtime = "edge";` `export const size = { width: 1200, height: 630 };`
  3. Exportar `default async function OG()` que devuelve un JSX con el
     nombre "Jason Dinamarca" + tagline + colores de marca.
  4. Next la usa automáticamente como `og:image` por defecto.
- **Aceptación:**
  - [x] `/opengraph-image` devuelve un PNG 1200×630.
  - [x] build ✓.

---

# Fase E — Deploy

> Tareas mayormente manuales / CLI. Usar T1 solo para troubleshoot.

## [E1] Repositorio GitHub — **T1 (guía) / manual**
- **Pasos:**
  1. Crear repo `jdinamarca.dev` (privado o público) en GitHub.
  2. `git remote add origin <url>`.
  3. Verificar `.gitignore` excluye `.env.local`, `.next/`, `node_modules/`.
  4. `git add . && git commit -m "..." && git push -u origin main`.
- **Aceptación:**
  - [ ] Código en GitHub sin `.env.local`.

## [E2] Deploy en Vercel — **manual**
- **Pasos:**
  1. Vercel → New Project → importar el repo.
  2. Framework: Next.js (auto).
  3. **Environment Variables:** copiar TODAS de `.env.local` (client +
     admin). Ojo: `FIREBASE_ADMIN_PRIVATE_KEY` con saltos `\n`.
  4. Deploy.
- **Aceptación:**
  - [ ] Build en Vercel verde.
  - [ ] `/blog` carga en la URL de preview.

## [E3] Dominio `jdinamarca.dev` — **manual**
- **Pasos:**
  1. Vercel → Project → Settings → Domains → añadir `jdinamarca.dev` y `www`.
  2. En el registrador, apuntar nameservers/A record a Vercel.
  3. Esperar propagación + HTTPS automático.
- **Aceptación:**
  - [ ] `https://jdinamarca.dev` sirve el sitio con candado.

## [E4] Dominios autorizados en Firebase Auth — **manual**
- **Pasos:**
  1. Firebase Console → Authentication → Settings → Authorized domains.
  2. Añadir `jdinamarca.dev` y el dominio `*.vercel.app`.
- **Aceptación:**
  - [ ] Login con Google funciona en producción.

---

# Fase F — Extras / Polish

## [F1] Filtro por tags en `/blog` — **T2**
- **Dependencias:** Fase 3.
- **Archivos:**
  - Editar `src/app/blog/page.tsx` (convertir parte a client) o crear
    `src/components/blog/TagFilter.tsx` (client) que reciba posts y filtre.
- **Pasos:**
  1. Extraer tags únicos de los posts.
  2. `TagFilter` con badges clicables (estado `selectedTag`).
  3. Filtrar la lista por tag seleccionado.
  4. Para no perder SSR: server component pasa posts a `<TagFilter posts={...}/>`
     que es client y maneja el filtrado.
- **Aceptación:**
  - [ ] Click en un tag filtra la lista.
  - [ ] lint ✓ build ✓.

## [F2] Vercel Analytics — **T3**
- **Dependencias:** E2.
- **Pasos:**
  1. `npm i @vercel/analytics`.
  2. En `src/app/layout.tsx`, añadir `<Analytics />` dentro de `<body>`.
- **Aceptación:**
  - [ ] build ✓; analytics aparece en el dashboard de Vercel tras deploy.

## [F3] Búsqueda simple en el blog — **T2**
- **Dependencias:** Fase 3.
- **Decisión:** search client-side sobre los posts cargados (título + excerpt
  + tags). No requiere Algolia.
- **Pasos:**
  1. Crear `src/components/blog/SearchPosts.tsx` (client) con input.
  2. Filtrar posts por query (case-insensitive).
  3. Integrar en `/blog` junto con la lista.
- **Aceptación:**
  - [ ] Escribir filtra la lista en vivo.
  - [ ] lint ✓ build ✓.

## [F4] RSS feed — **T3**
- **Dependencias:** Fase 3.
- **Archivos:**
  - Crear `src/app/feed.xml/route.ts`.
- **Pasos:**
  1. `import { getPosts } from "@/lib/posts";`
  2. Construir XML RSS 2.0 con los posts.
  3. `return new Response(xml, { headers: { "Content-Type": "application/xml" } });`
- **Aceptación:**
  - [ ] `/feed.xml` devuelve RSS válido.
  - [ ] build ✓.

## [F5] Limpieza de imágenes huérfanas en Storage — **T1**
- **Dependencia:** haber usado el editor un tiempo.
- **Objetivo:** borrar covers/imágenes de Storage cuando se reemplazan o se
  elimina un post.
- **Pasos:**
  1. Al eliminar un post (`PostList`), extraer paths de las URLs (regex sobre
     `firebasestorage.googleapis.com/.../o/<path>`) y `deleteObject`.
  2. Al reemplazar cover, borrar la anterior.
  3. Manejar errores silenciosamente (best-effort).
- **Aceptación:**
  - [ ] Eliminar un post borra sus imágenes de Storage.
  - [ ] lint ✓ build ✓.

## [F6] Loading skeletons + error boundary — **T2**
- **Dependencias:** según página.
- **Pasos:**
  1. `loading.tsx` en `/blog` y `/blog/[slug]` (skeleton de cards).
  2. `error.tsx` con reset + mensaje.
- **Aceptación:**
  - [ ] Mientras carga `/blog` se ve el skeleton.
  - [ ] lint ✓ build ✓.

---

## Orden recomendado de ejecución

1. **[E2 → E3 → E4]** Deploy Vercel + dominio + Firebase Auth domains (E1 GitHub ✓).
2. **[F1 → F2 → F3 → F4 → F5 → F6]** Extras, por prioridad.

Ya completado: Fases 1–3, A (Lab), B (Portafolio), C (Landing), D (JSON-LD + sitemap + robots.ts + opengraph-image.tsx),
reglas Firestore/Storage, repo GitHub.

---

## Cómo actualizar este plan

- Al completar una tarea: cambia `[ ]` por `[x]` en la lista de aceptación
  y/o marca la tarea con ✅ en el título.
- Añade nuevas tareas al final de la fase correspondiente.
- Si una tarea revela una decisión de arquitectura → crea un ADR en
  `docs/adr/` y enlázalo aquí.
