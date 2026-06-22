# Roadmap — jdinamarca.dev

> Fases ordenadas por dependencia. Completar en orden.

---

## Fase 1 — Fundación (COMPLETADA)

Scaffold completo del proyecto con toda la infraestructura base.

- [x] Crear proyecto Next.js 16 con TypeScript + Tailwind CSS
- [x] Configurar shadcn/ui (base-ui)
- [x] Instalar y configurar Firebase SDK (client + admin)
- [x] Sistema de autenticación con Google (useAuth hook)
- [x] Navbar sticky con login/logout/avatar/dropdown admin
- [x] Root layout con Navbar + Footer + Toaster
- [x] Editor de posts Tiptap (bold, italic, código, imágenes a Firebase Storage)
- [x] Página /admin protegida por auth + email admin
- [x] Páginas placeholder: /, /blog, /projects, /lab
- [x] vercel.json configurado
- [x] .env.example documentado
- [x] Build de producción limpio ✓

---

## Fase 2 — Conectar Firebase (COMPLETADA)

Sin esto nada funciona en producción.

- [x] Crear proyecto Firebase `jdinamarcadev-c1f8b`
- [x] Activar Authentication → Google provider
- [x] Crear Firestore database
- [x] Crear Storage bucket
- [x] Llenar `.env.local` con credenciales reales (client SDK + Admin SDK)
- [x] Verificar que `npm run dev` corra sin errores ✓
- [ ] Definir reglas de seguridad Firestore (lectura pública, escritura solo admin)
- [ ] Definir reglas de Storage (lectura pública, escritura autenticada)
- [ ] Agregar dominio autorizado en Firebase Auth: jdinamarca.dev (cuando se haga deploy)

---

## Fase 3 — Blog funcional

- [ ] Crear `src/lib/posts.ts` — funciones para leer posts de Firestore
- [ ] Página `/blog` — listado de posts publicados con thumbnail, título, excerpt, tags, fecha
- [ ] Página `/blog/[slug]` — vista del post completo con HTML del editor Tiptap
- [ ] Agregar estilos `prose` de Tailwind Typography para el contenido del post
- [ ] Componente `PostCard` para el listado
- [ ] Paginación o infinite scroll en /blog
- [ ] Panel admin `/admin` — listado de posts (borradores + publicados) con editar/eliminar
- [ ] Edición de posts existentes desde /admin
- [ ] Preview de post antes de publicar

---

## Fase 4 — Portafolio

- [ ] Definir estructura de datos de proyectos en Firestore (o JSON estático)
- [ ] Página `/projects` — grid de tarjetas de proyectos
- [ ] Componente `ProjectCard` con tech stack badges, links a repo/demo
- [ ] Sección "Featured" en la landing page

---

## Fase 5 — Lab

- [ ] Definir qué diferencia Lab de Blog (experimentos con resultados reales, más técnico)
- [ ] Página `/lab` — listado de experimentos con categoría IA/tool/benchmark
- [ ] Reutilizar PostEditor para crear entradas de Lab (categoría = "lab")
- [ ] Componente `LabCard` diferenciado visualmente del BlogCard

---

## Fase 6 — Landing page completa

- [ ] Hero section con animación/transición
- [ ] Sección "Stack actual" (tech que usas día a día)
- [ ] Sección "Proyectos destacados" (2-3 cards de /projects)
- [ ] Sección "Últimos posts" (3 posts recientes del blog)
- [ ] Sección "Últimos experimentos Lab"
- [ ] About/bio section

---

## Fase 7 — SEO y metadatos

- [ ] Metadata dinámica para /blog/[slug] (title, description, og:image)
- [ ] Metadata para /projects y /lab
- [ ] sitemap.xml generado dinámicamente
- [ ] robots.txt
- [ ] Open Graph image por defecto
- [ ] Structured data (JSON-LD) para posts del blog

---

## Fase 8 — Deploy y dominio

- [ ] Crear repositorio en GitHub
- [ ] Push del código
- [ ] Conectar repo a Vercel (New Project → Import)
- [ ] Agregar env vars en Vercel dashboard
- [ ] Conectar dominio jdinamarca.dev en Vercel
- [ ] Agregar jdinamarca.dev a dominios autorizados en Firebase Auth
- [ ] Verificar deploy en producción
- [ ] Configurar HTTPS (automático en Vercel)

---

## Fase 9 — Mejoras y extras (post-launch)

- [ ] Búsqueda en el blog (Firestore full-text o Algolia)
- [ ] Sistema de tags/categorías con filtros en /blog
- [ ] Modo oscuro/claro toggle (actualmente siempre dark)
- [ ] RSS feed
- [ ] Newsletter (Resend o ConvertKit)
- [ ] Analytics (Vercel Analytics o Plausible)
- [ ] Comentarios en posts (opcional)
- [ ] AI-powered search semántica
