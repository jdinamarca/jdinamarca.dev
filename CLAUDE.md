# jdinamarca.dev — Contexto del proyecto

> Este archivo lo lee el modelo al iniciar cada sesión. Mantenerlo actualizado
> permite retomar el trabajo desde cualquier sesión sin explicaciones.
>
> **Nota:** el código es la fuente de verdad. Si este snapshot difiere del
> código real, gana el código. Verificado contra commit `96b3a7c` (rama `main`).

## ¿Qué es este proyecto?

Sitio web personal en **jdinamarca.dev** con enfoque **"Dev + AI Lab"**:
- Portafolio de proyectos (`/projects`)
- Blog técnico (`/blog`)
- Sección Lab — experimentos con IA (`/lab`)
- Panel admin con editor WYSIWYG (`/admin`)

**Dueño:** Jason Dinamarca — jdinamarca@snakode.com

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript strict) |
| Estilos | Tailwind CSS v4 + shadcn/ui (base `@base-ui/react`, style `base-nova`) |
| Editor de posts | Tiptap v3 |
| Auth | Firebase Auth (Google login) |
| Base de datos | Firebase Firestore |
| Almacenamiento | Firebase Storage (imágenes) |
| Deploy | Vercel (pendiente) |

**Path alias:** `@/*` → `src/*`.

---

## Comandos

```bash
npm run dev        # dev server → http://localhost:3000
npm run build      # build de producción
npm run lint       # ESLint (eslint-config-next)
npx tsc --noEmit   # typecheck (no hay script dedicado)
```

**Verificación obligatoria tras cada cambio:** `npm run lint` + `npm run build`.

---

## Reglas de código — OBLIGATORIO

1. **shadcn Button NO tiene `asChild`** (usa `@base-ui/react`, no Radix).
   Patrón correcto: `<Link href="/ruta"><Button>Texto</Button></Link>`.
2. **Firebase siempre con getters lazy** en cliente; Admin SDK en server:
   - ✅ `getFirebaseAuth()`, `getFirebaseDb()`, `getFirebaseStorage()` (cliente)
   - ✅ `adminDb` desde `@/lib/firebase-admin` (server actions / SSR)
   - ❌ `import { auth, db } from "@/lib/firebase"` a nivel de módulo en server
3. **Firebase Admin SDK** solo en Server Actions / Route Handlers / server
   components. El blog lee vía `src/lib/posts.ts` (admin SDK).
4. Páginas con datos dinámicos de Firestore: `export const dynamic = "force-dynamic"`.
5. Imágenes de Firebase Storage: usar `next/image` (remote patterns en `next.config.ts`).
6. **Prohibido `any`.** TS está en `strict`. Tipar todo.
7. **Prohibido `setState` síncrono dentro de `useEffect`** (lo bloquea el lint:
   `react-hooks/set-state-in-effect`). Ver `ThemeToggle`/`PostList`.
8. **No añadir comentarios** salvo que aporten contexto no obvio.
9. **Next.js 16 ≠ lo que sabes.** Leer `node_modules/next/dist/docs/` antes de
   usar APIs/conventions que puedan haber cambiado.

---

## Estructura de archivos

```
src/
├── data/                    # Datos estáticos (experience.ts, playing-with.ts, projects.json)
├── types/index.ts           # Interfaces Post, Project
├── lib/
│   ├── firebase.ts          # Lazy getters browser-only (Auth, Firestore, Storage)
│   ├── firebase-admin.ts    # Admin SDK server-side
│   ├── posts.ts             # Lectura de posts (SSR via admin SDK)
│   └── utils.ts             # cn()
├── hooks/useAuth.ts         # Google Auth + isAdmin check por email
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Navbar, Footer, ThemeToggle (dark/light)
│   ├── blog/                # PostEditor, PostCard, PostList
│   ├── portfolio/           # ProjectCard
│   └── home/                # ExperienceTimeline, CurrentlyPlaying
└── app/
    ├── layout.tsx           # Root: Navbar + Footer + Toaster + ThemeProvider
    ├── page.tsx             # Landing completa (hero + stack + playing + projects + posts + about + experiencia)
    ├── sitemap.ts           # Sitemap dinámico
    ├── blog/page.tsx        # Listado de posts (SSR)
    ├── blog/[slug]/page.tsx # Vista de post (prose + OG/Twitter + JSON-LD + reading time)
    ├── projects/page.tsx    # Portafolio (lee projects.json)
    ├── lab/page.tsx         # ⚠️ copia del blog, sin filtrar por categoría (PENDIENTE)
    └── admin/page.tsx       # Panel admin protegido (auth gate)
```

---

## Estado actual (snapshot verificado)

### ✅ Completado
- **Fundación:** scaffold, Firebase SDK (client + admin), auth Google, navbar,
  footer, theme toggle dark/light, layout, editor Tiptap, `/admin` con auth gate.
- **Firebase conectado:** proyecto `jdinamarcadev-c1f8b`, Auth, Firestore,
  Storage, `.env.local` (no commiteado).
- **Blog (lectura):** `posts.ts` (`getPosts`, `getPost`, `getPostsByCategory`,
  `getRecentPosts`, `getPublishedSlugs`), `PostCard`, `/blog`, `/blog/[slug]`
  con `prose` + metadata OG/Twitter + **JSON-LD BlogPosting** + reading time +
  `generateStaticParams`.
- **Admin completo:** lista borradores/publicados, crear, editar, eliminar,
  cover image upload, manejo de errores con código Firebase.
- **Reglas:** `firestore.rules` + `storage.rules` + `firebase.json`.
- **Portafolio:** decisión ADR 0006 (JSON estático), `projects.json` (5
  proyectos), `ProjectCard`, `/projects` con orden por año + empty state.
- **Landing completa:** hero + badge "disponible", stack, currently playing,
  proyectos destacados, últimos posts, sobre mí + stats, experiencia timeline.
- **SEO parcial:** `sitemap.ts` (estáticas + dinámicas), metadata blog OG/Twitter,
  JSON-LD. Repo en GitHub vía SSH (`origin` → `git@github.com:jdinamarca/jdinamarca.dev.git`).
- **ADRs:** 0001–0006.

### ❌ Pendiente (verificado que NO existe en código)
- **`/lab` no diferenciado:** es copia de `/blog`, usa `getPosts()` (muestra
  todos los posts), metadata dice "Blog". Falta `getPostsByCategory("lab")` +
  metadata "Lab". **Inconsistencia de modelo:** las categorías son
  `opinion|tutorial|arquitectura|experimento` (no existe `lab`).
- **`robots.ts`:** no existe (necesario para SEO).
- **`opengraph-image.tsx`:** no existe (OG image por defecto).
- **Deploy Vercel** + dominio `jdinamarca.dev`.
- **Dominios autorizados** en Firebase Auth para producción.

### 🔵 Backlog (no urgente)
- Filtros por tags en `/blog`.
- Búsqueda en el blog.
- RSS feed (`/feed.xml`).
- Vercel Analytics.
- Loading skeletons + error boundary en `/blog`.
- Limpieza de imágenes huérfanas en Storage al eliminar post.

---

## Documentación del proyecto (en `docs/`)

| Archivo | Rol |
|---|---|
| `docs/EXECUTION_PLAN.md` | Plan detallado tarea por tarea con modelo recomendado |
| `docs/PHILOSOPHY.md` | Filosofía de trabajo con modelos (ahorro de tokens, ADRs) |
| `docs/TASKS.md` | Checklist histórico de sesiones |
| `docs/ROADMAP.md` | Visión de fases de alto nivel |
| `docs/adr/` | Decisiones de arquitectura (0001–0006) |

---

## Variables de entorno

Ver `.env.example`. Archivo real: `.env.local` (no commiteado, ignorado por git).
Requiere Firebase Client SDK (`NEXT_PUBLIC_*`), Firebase Admin SDK
(`FIREBASE_ADMIN_*`) y `NEXT_PUBLIC_ADMIN_EMAIL`.

---

## Flujo de trabajo

1. Una tarea atómica por sesión (1–3 archivos, una sola responsabilidad).
2. Mostrar patrones, no inventar: "hazlo como `PostCard.tsx`".
3. Tras terminar: `npm run lint` + `npm run build`. Arreglar si falla.
4. Si se tomó una decisión no obvia → registrar ADR en `docs/adr/`.
5. Actualizar `TASKS.md` / `EXECUTION_PLAN.md` al cerrar la sesión.
6. No commitear salvo que se pida explícitamente.
