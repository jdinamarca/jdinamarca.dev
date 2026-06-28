# Roadmap — jdinamarca.dev

> Fases ordenadas por dependencia. Estado verificado contra commit `96b3a7c`.
> Completar en orden. Para detalle tarea-por-tarea ver `EXECUTION_PLAN.md`.

---

## Fase 1 — Fundación ✅ COMPLETADA

- [x] Crear proyecto Next.js 16 con TypeScript + Tailwind CSS
- [x] Configurar shadcn/ui (base-ui)
- [x] Instalar y configurar Firebase SDK (client + admin)
- [x] Sistema de autenticación con Google (useAuth hook)
- [x] Navbar sticky con login/logout/avatar/dropdown admin
- [x] Root layout con Navbar + Footer + Toaster + ThemeProvider
- [x] Editor de posts Tiptap (bold, italic, código, imágenes a Firebase Storage)
- [x] Página /admin protegida por auth + email admin
- [x] Páginas placeholder: /, /blog, /projects, /lab
- [x] vercel.json + .env.example
- [x] Build de producción limpio ✓

---

## Fase 2 — Conectar Firebase ✅ COMPLETADA

- [x] Crear proyecto Firebase `jdinamarcadev-c1f8b`
- [x] Activar Authentication → Google provider
- [x] Crear Firestore database
- [x] Crear Storage bucket
- [x] Llenar `.env.local` con credenciales reales
- [x] Definir reglas de seguridad Firestore (`firestore.rules`)
- [x] Definir reglas de Storage (`storage.rules`)
- [ ] Agregar dominio autorizado en Firebase Auth: jdinamarca.dev (al deployar)

---

## Fase 3 — Blog funcional ✅ COMPLETADA

- [x] `src/lib/posts.ts` — leer posts de Firestore (admin SDK)
- [x] Página `/blog` — listado de posts con grid responsive + empty state
- [x] Página `/blog/[slug]` — vista completa con HTML del editor + `prose`
- [x] `@tailwindcss/typography` para estilos `prose`
- [x] Componente `PostCard`
- [x] Panel admin `/admin` — listado (borradores + publicados) con editar/eliminar
- [x] Edición de posts existentes
- [x] Subida de cover image
- [x] Metadata OG/Twitter + JSON-LD BlogPosting + reading time
- [ ] Paginación o infinite scroll en /blog (backlog)

---

## Fase 4 — Portafolio ✅ COMPLETADA

- [x] Decidir almacenamiento → JSON estático (ADR 0006)
- [x] `src/data/projects.json` (5 proyectos)
- [x] Página `/projects` — grid de tarjetas ordenado por año
- [x] Componente `ProjectCard` con tags, repo/demo, año
- [x] Sección "Featured" en la landing page

---

## Fase 5 — Lab ✅ COMPLETADA

- [x] Decisión: Lab reutiliza categoría `experimento` (ADR 0007).
- [x] Página `/lab` — listado de posts con categoría `experimento`, metadata "Lab",
      heading "Lab", error handling específico.
- [x] Navegación a `/blog/[slug]` (reutiliza `PostCard`, no duplica vista).

---

## Fase 6 — Landing completa ✅ COMPLETADA

- [x] Hero section con badge "disponible para colaborar"
- [x] Sección "Stack & herramientas"
- [x] Sección "Currently Playing With"
- [x] Sección "Proyectos destacados" (2-3 cards)
- [x] Sección "Últimos posts" (3 posts recientes)
- [x] Sección "Sobre mí" + stats + enlaces sociales
- [x] Sección "Experiencia" timeline

---

## Fase 7 — SEO y metadatos ⚠️ PARCIAL

- [x] Metadata dinámica para /blog/[slug] (OG/Twitter)
- [x] JSON-LD `BlogPosting` en `/blog/[slug]`
- [x] `sitemap.ts` generado dinámicamente (estáticas + posts)
- [x] `robots.ts` — (allow `/`, disallow `/admin`, sitemap)
- [x] `opengraph-image.tsx` — OG image por defecto 1200×630
- [ ] Metadata para /projects y /lab
- [ ] Structured data adicional (JSON-LD WebSite / Person)

---

## Fase 8 — Deploy y dominio ⬜ PENDIENTE

- [x] Repositorio en GitHub (vía SSH) ✓
- [ ] Conectar repo a Vercel (New Project → Import)
- [ ] Agregar env vars en Vercel (client + admin; ojo `\n` en private key)
- [ ] Conectar dominio jdinamarca.dev en Vercel
- [ ] Agregar jdinamarca.dev + *.vercel.app a dominios autorizados en Firebase Auth
- [ ] Verificar deploy en producción + HTTPS automático

---

## Fase 9 — Mejoras y extras (post-launch) ⬜ BACKLOG

- [ ] Búsqueda en el blog (client-side o Algolia)
- [ ] Sistema de tags/categorías con filtros en /blog
- [ ] RSS feed
- [ ] Vercel Analytics
- [ ] Loading skeletons + error boundary
- [ ] Limpieza de imágenes huérfanas en Storage
- [ ] Newsletter (Resend o ConvertKit)
- [ ] Comentarios en posts (opcional)
- [ ] AI-powered search semántica
