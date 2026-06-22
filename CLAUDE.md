# jdinamarca.dev — Contexto del proyecto para Claude

> Este archivo es leído automáticamente por Claude al iniciar cada sesión.
> Mantenerlo actualizado permite retomar el trabajo desde cualquier sesión.

## ¿Qué es este proyecto?

Sitio web personal en **jdinamarca.dev** con enfoque **"Dev + AI Lab"**:
- Portafolio de proyectos
- Blog técnico (tech, IA, desarrollo)
- Sección Lab (experimentos documentados con IA)
- Panel admin con editor WYSIWYG para publicar posts con imágenes

**Dueño:** Jason Dinamarca — jdinamarca@snakode.com

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Estilos | Tailwind CSS v4 + shadcn/ui (usa `@base-ui/react`) |
| Editor de posts | Tiptap |
| Auth | Firebase Auth (Google login) |
| Base de datos | Firebase Firestore |
| Almacenamiento | Firebase Storage (imágenes) |
| Deploy frontend | Vercel |

---

## Estructura de archivos clave

```
src/
├── lib/
│   ├── firebase.ts          # Lazy getters browser-only
│   ├── firebase-admin.ts    # Admin SDK para server actions / SSR
│   ├── posts.ts             # Lectura de posts (SSR via admin SDK)
│   └── utils.ts             # cn()
├── hooks/
│   └── useAuth.ts           # Google Auth + isAdmin check por email
├── types/index.ts           # Interfaces: Post, Project
├── components/
│   ├── layout/Navbar.tsx    # Navbar sticky con login/avatar/dropdown
│   ├── layout/Footer.tsx
│   ├── layout/ThemeToggle.tsx
│   ├── theme-provider.tsx   # next-themes
│   ├── blog/PostEditor.tsx  # Editor Tiptap con subida de imágenes
│   └── blog/PostCard.tsx    # Tarjeta de post para el listado
└── app/
    ├── page.tsx             # Landing hero
    ├── blog/page.tsx        # Listado de posts (SSR)
    ├── blog/[slug]/page.tsx # Vista de post (SSR + prose + OG metadata)
    ├── projects/page.tsx    # Portafolio (placeholder)
    ├── lab/page.tsx         # Lab section (placeholder)
    └── admin/page.tsx       # Panel admin protegido
```

---

## Reglas de código — IMPORTANTE

1. **shadcn Button no tiene `asChild`** — usar `<Link><Button>...</Button></Link>`.
2. **Firebase siempre con getters lazy**, nunca instancias directas:
   - ✅ `getFirebaseAuth()`, `getFirebaseDb()`, `getFirebaseStorage()`
   - ❌ `import { auth, db } from "@/lib/firebase"`
3. Páginas con Firebase Auth en cliente: agregar `export const dynamic = "force-dynamic"`.
4. Firebase Admin SDK solo en Server Actions o Route Handlers. Las páginas de blog leen de Firestore vía `src/lib/posts.ts` (admin SDK) en server components — marcar con `export const dynamic = "force-dynamic"` para datos siempre frescos.
5. Imágenes de Firebase Storage: usar `next/image` (remote patterns ya configurados en `next.config.ts` para `firebasestorage.googleapis.com`, `storage.googleapis.com`, `*.appspot.com`).

---

## Variables de entorno

Ver `.env.example` para la estructura completa. Archivo real: `.env.local` (no commiteado).

---

## Estado del proyecto

- **Plan ejecutable detallado (tarea por tarea, con modelo recomendado):** `docs/EXECUTION_PLAN.md`
- **Filosofía de trabajo con GLM (ahorro de tokens):** `docs/PHILOSOPHY.md`
- **Decisiones de arquitectura (ADRs):** `docs/adr/README.md`
- Roadmap por fases: `docs/ROADMAP.md`
- Checklist de tareas: `docs/TASKS.md`

> **Para continuar el trabajo:** leer `docs/EXECUTION_PLAN.md`, elegir la
> siguiente tarea sin completar y seguir el flujo de `docs/PHILOSOPHY.md` §5.

### Snapshot rápido del estado actual

**Completado:** scaffold, Firebase SDK, auth con Google, navbar, footer, theme toggle (dark/light), layout, editor Tiptap, páginas placeholder, vercel.json, Firebase conectado. **Blog funcional (lectura):** `posts.ts` (admin SDK), `PostCard`, listado `/blog` y vista `/blog/[slug]` con `prose` + metadata dinámica + `next/image`. **Admin completo:** lista borradores/publicados, editar, eliminar, cover image, errores con código Firebase.

**Próxima tarea a retomar:** `docs/EXECUTION_PLAN.md` → Fase B (Portafolio) empezando por **[B1]**.

---

## Comandos útiles

```bash
npm run dev        # servidor de desarrollo → http://localhost:3000
npm run build      # build de producción
npm run lint       # linting
```
