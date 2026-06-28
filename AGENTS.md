<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# jdinamarca.dev — Contexto del proyecto

> Este archivo lo lee opencode al iniciar cada sesión. Mantenerlo actualizado
> permite retomar el trabajo desde cualquier sesión sin explicaciones.

## ¿Qué es?

Sitio personal en **jdinamarca.dev** ("Dev + AI Lab"): portafolio de proyectos,
blog técnico, sección Lab (experimentos con IA) y panel admin con editor
WYSIWYG (Tiptap) para publicar posts con imágenes.

**Dueño:** Jason Dinamarca — jdinamarca@snakode.com

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 16** (App Router, TypeScript strict) |
| Estilos | **Tailwind CSS v4** + **shadcn/ui** (base `@base-ui/react`, style `base-nova`) |
| Editor posts | Tiptap v3 |
| Auth | Firebase Auth (Google login) |
| DB | Firebase Firestore |
| Storage | Firebase Storage (imágenes) |
| Deploy | Vercel |

---

## Comandos

```bash
npm run dev        # dev server → http://localhost:3000
npm run build      # build de producción
npm run lint       # ESLint (eslint-config-next)
npx tsc --noEmit   # typecheck (no hay script, ejecutar así)
```

**Verificación obligatoria tras cada cambio:** `npm run lint` + `npm run build`.
Si no pasa, la tarea no está terminada.

---

## Reglas de código — OBLIGATORIO

1. **shadcn Button NO tiene `asChild`** (usa `@base-ui/react`, no Radix).
   Patrón correcto: `<Link href="/ruta"><Button>Texto</Button></Link>`.
2. **Firebase siempre con getters lazy**, nunca instancias directas:
   - ✅ `getFirebaseAuth()`, `getFirebaseDb()`, `getFirebaseStorage()`
   - ❌ `import { auth, db } from "@/lib/firebase"`
3. **Firebase Admin SDK** solo en Server Actions / Route Handlers / server
   components. El blog lee vía `src/lib/posts.ts` (admin SDK).
4. Páginas con datos dinámicos de Firestore: `export const dynamic = "force-dynamic"`.
5. Imágenes de Firebase Storage: usar `next/image` (remote patterns ya
   configurados en `next.config.ts`).
6. **Path alias:** `@/*` → `src/*`.
7. **Prohibido `any`.** TS está en `strict`. Tipar todo.
8. **Prohibido `setState` síncrono dentro de `useEffect`** (lo bloquea el lint:
   `react-hooks/set-state-in-effect`). Ver `ThemeToggle`/`PostList` como
   referencia de cómo evitarlo.
9. **No añadir comentarios** salvo que aporten contexto no obvio.
10. **Next.js 16 ≠ lo que sabes.** Leer `node_modules/next/dist/docs/` antes de
    usar APIs/conventions que puedan haber cambiado.

---

## Estructura de archivos

```
src/
├── data/                    # Datos estáticos (experience.ts, playing-with.ts)
├── types/index.ts           # Interfaces Post, Project
├── lib/
│   ├── firebase.ts          # Lazy getters browser-only (Auth, Firestore, Storage)
│   ├── firebase-admin.ts    # Admin SDK server-side
│   ├── posts.ts             # Lectura de posts (SSR via admin SDK)
│   └── utils.ts             # cn()
├── hooks/useAuth.ts         # Google Auth + isAdmin check por email
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Navbar, Footer, ThemeToggle
│   ├── blog/                # PostEditor, PostCard, PostList
│   ├── portfolio/           # ProjectCard
│   └── home/                # ExperienceTimeline, CurrentlyPlaying
└── app/
    ├── layout.tsx           # Root: Navbar + Footer + Toaster + ThemeProvider
    ├── page.tsx             # Landing
    ├── sitemap.ts           # Sitemap dinámico
    ├── blog/page.tsx        # Listado de posts (SSR)
    ├── blog/[slug]/page.tsx # Vista de post (prose + OG metadata)
    ├── projects/page.tsx    # Portafolio
    ├── lab/page.tsx         # Lab (placeholder)
    └── admin/page.tsx       # Panel admin protegido (auth gate)
```

---

## Documentación del proyecto (en `docs/`)

| Archivo | Rol |
|---|---|
| `docs/EXECUTION_PLAN.md` | Plan detallado tarea por tarea con modelo recomendado |
| `docs/PHILOSOPHY.md` | Filosofía de trabajo con modelos (ahorro de tokens, ADRs) |
| `docs/TASKS.md` | Checklist histórico de sesiones |
| `docs/ROADMAP.md` | Visión de fases de alto nivel |
| `docs/adr/` | Decisiones de arquitectura (una por archivo) |

> ⚠️ `CLAUDE.md`, `TASKS.md` y `ROADMAP.md` están algo desactualizados respecto
> al código real (ya existen `sitemap.ts`, `ProjectCard`, secciones home en
> `src/components/home/`, datos en `src/data/`). Verificar el estado real del
> código antes de confiar en esos checklists.

---

## Variables de entorno

Ver `.env.example`. Archivo real: `.env.local` (no commiteado). Requiere:
- Firebase Client SDK (`NEXT_PUBLIC_*`)
- Firebase Admin SDK (`FIREBASE_ADMIN_*`)
- Email admin (`NEXT_PUBLIC_ADMIN_EMAIL`)

---

## Estado actual (snapshot)

**Completado:** scaffold, Firebase conectado, auth Google, navbar/footer/theme
toggle, blog funcional (lectura + vista individual con prose + OG metadata),
admin completo (crear/editar/eliminar/cover image), `firestore.rules` +
`storage.rules`, sitemap.ts, portafolio iniciado (`ProjectCard`), secciones home
(`ExperienceTimeline`, `CurrentlyPlaying`).

**Pendientes principales:** reutilizar listado para `/lab`, secciones extra en
landing (proyectos destacados, últimos posts), SEO restante (robots.txt,
JSON-LD), deploy a Vercel + dominio, modo claro/oscuro si se quiere, filtros
por tags en /blog.

---

## Flujo de trabajo

1. Una tarea atómica por sesión (1–3 archivos, una sola responsabilidad).
2. Mostrar patrones, no inventar: "hazlo como `PostCard.tsx`".
3. Tras terminar: `npm run lint` + `npm run build`. Arreglar si falla.
4. Si se tomó una decisión no obvia → registrar ADR en `docs/adr/`.
5. Actualizar `TASKS.md` / `EXECUTION_PLAN.md` al cerrar la sesión.
6. No commitear salvo que se pida explícitamente.
