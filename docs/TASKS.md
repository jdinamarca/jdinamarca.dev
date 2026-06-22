# Tareas — jdinamarca.dev

> Checklist de trabajo detallado. Actualizar al completar cada ítem.
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
- [x] Crear `src/app/blog/page.tsx` — placeholder
- [x] Crear `src/app/projects/page.tsx` — placeholder
- [x] Crear `src/app/lab/page.tsx` — placeholder
- [x] Crear `src/app/admin/page.tsx` — panel admin con auth gate (login → isAdmin check → editor)
- [x] Crear `src/components/blog/PostEditor.tsx` — editor Tiptap completo con subida de imágenes
- [x] Crear `.env.local` (vacío, para llenar) y `.env.example` documentado
- [x] Crear `vercel.json`
- [x] Actualizar `.gitignore` — excluir .env.local, incluir .env.example
- [x] Fix: Firebase lazy init para evitar error `auth/invalid-api-key` en build
- [x] Fix: Remover `asChild` de Button (no soportado en base-ui)
- [x] Verificar `npm run build` — build limpio sin errores ✓
- [x] Crear `CLAUDE.md` — contexto del proyecto para sesiones futuras
- [x] Crear `docs/ROADMAP.md` — fases del proyecto
- [x] Crear `docs/TASKS.md` — este archivo

---

## ✅ Bloqueante — RESUELTO (2026-06-04)

### Conectar Firebase

- [x] Crear proyecto Firebase `jdinamarcadev-c1f8b`
- [x] Authentication → Google provider habilitado
- [x] Firestore Database creada
- [x] Storage creado
- [x] `.env.local` llenado con credenciales reales (client SDK + Admin SDK)

---

## ✅ Completadas — Sesión 2 (2026-06-21)

### Fase 3 — Blog funcional (lectura)

- [x] Crear `src/lib/posts.ts` con funciones server-side (admin SDK):
  - `getPosts()` — posts publicados ordenados por fecha desc
  - `getPost(slug)` — un post publicado por slug
  - `getPostsByCategory(category)` — filtrar por blog/lab/ai
  - `getRecentPosts(limit)` — para la landing
  - `getPublishedSlugs()` — para generateStaticParams / sitemap
- [x] Crear `src/components/blog/PostCard.tsx` — tarjeta con categoría, fecha, tiempo de lectura, excerpt, tags, hover de marca
- [x] Actualizar `src/app/blog/page.tsx` — listado real con grid responsive + empty state + manejo de errores
- [x] Crear `src/app/blog/[slug]/page.tsx` — vista individual con `prose`, metadata dinámica (OG/Twitter), back link
- [x] Configurar `next/image` (remote patterns de Firebase Storage) en `next.config.ts`
- [x] `@tailwindcss/typography` ya instalado y variables `prose` alineadas a la marca en `globals.css`
- [x] Fix lint: `ThemeToggle` — eliminar `setState-in-effect` (iconos vía clase `.dark`)
- [x] Verificar `npm run lint` ✓ y `npm run build` ✓ y `/blog` 200 en dev ✓

### Fase 3 — Admin (gestión de posts)

- [x] Crear `src/components/blog/PostList.tsx` — listado de posts (borradores + publicados) con status badge, categoría, fecha, ver y eliminar
- [x] Actualizar `src/app/admin/page.tsx` — editor toggleable ("Nuevo post") + lista con refresh automático tras crear/eliminar
- [x] Fix `PostEditor`: remover extensión `Link` duplicada (StarterKit v3 ya la incluye), `immediatelyRender: true`, `onSaved` callback
- [x] Fix `PostEditor`: error handling que muestra el código real de Firebase (ej. `permission-denied`)
- [x] Crear `firestore.rules` + `storage.rules` + `firebase.json` (escritura/lectura solo admin para mantener borradores privados; el blog lee vía Admin SDK que ignora las reglas)
- [x] Edición de post existente: `PostEditor` acepta `post`, precarga campos + contenido, usa `updateDoc` (sin regenerar slug) y remonta por `key={post.id}`; botón editar en `PostList`
- [x] Subida de cover image: UI upload/preview/remover en el editor, payload con coverImage + deleteField al eliminar, storage `covers/**` reglas
- [x] Verificar `npm run lint` ✓ y `npm run build` ✓

---

## 🟡 Pendientes — Próximas tareas técnicas

### Blog — conectar con Firestore

- [x] Crear `src/lib/posts.ts` con funciones:
  - `getPosts()` — traer posts publicados ordenados por fecha
  - `getPost(slug)` — traer un post por slug
  - `getPostsByCategory(category)` — filtrar por blog/lab/ai
- [x] Actualizar `src/app/blog/page.tsx` — renderizar posts reales con `getPosts()`
- [x] Crear `src/components/blog/PostCard.tsx` — tarjeta con thumbnail, título, excerpt, tags, fecha
- [x] Crear `src/app/blog/[slug]/page.tsx` — vista del post individual
- [x] Instalar `@tailwindcss/typography` para estilos `prose` en el contenido del post
- [x] Configurar `prose` en `src/app/blog/[slug]/page.tsx`
- [ ] Reutilizar el listado para `/lab` (filtrar por categoría "lab")

### Admin — gestión de posts

- [x] Agregar listado de posts en `/admin` (borradores + publicados)
- [x] Agregar botones editar/eliminar por post
- [x] Edición de post existente (cargar contenido en editor Tiptap)
- [ ] Subida de cover image para el post

### Portafolio

- [ ] Decidir: ¿datos de proyectos en Firestore o JSON estático en el repo?
- [ ] Crear estructura de datos de proyectos
- [ ] Actualizar `src/app/projects/page.tsx` con datos reales
- [ ] Crear `src/components/portfolio/ProjectCard.tsx`

### Landing page

- [ ] Agregar sección de proyectos destacados en `/`
- [ ] Agregar sección de últimos posts en `/`
- [ ] Agregar sección "sobre mí" breve

---

## ⚪ Backlog (no urgente)

- [ ] Configurar Firestore security rules (leer posts públicos, escribir solo admin)
- [ ] Configurar Storage security rules
- [ ] SEO: metadata dinámica para /blog/[slug]
- [ ] sitemap.xml dinámico
- [ ] robots.txt
- [ ] Crear repo GitHub y hacer primer push
- [ ] Conectar repo a Vercel
- [ ] Configurar dominio jdinamarca.dev en Vercel
- [ ] Modo oscuro/claro toggle
- [ ] Sistema de tags con filtros en /blog
- [ ] Analytics (Vercel Analytics)

---

## 📝 Notas de contexto

**¿Por qué lazy init en Firebase?**
Firebase client SDK no puede inicializarse en el servidor (Next.js hace SSR de todos los componentes, incluso los `"use client"`). Si se inicializa a nivel de módulo, el build falla con `auth/invalid-api-key`. La solución fue exportar funciones getter que solo se llaman desde efectos/handlers (browser únicamente).

**¿Por qué no `asChild` en Button?**
Esta versión de shadcn usa `@base-ui/react` en vez de Radix UI. La prop `asChild` no existe. Patrón correcto: `<Link href="/ruta"><Button>Texto</Button></Link>`.

**shadcn Button size "sm"** tiene clase `h-7`, no `h-8` (default).
