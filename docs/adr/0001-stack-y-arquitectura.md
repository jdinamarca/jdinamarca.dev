# 0001. Stack base: Next.js 16 App Router + TS + Tailwind v4 + shadcn/base-ui + Firebase + Tiptap

- **Estado:** Aceptada
- **Fecha:** 2026-06-03

## Contexto

Sitio personal "Dev + AI Lab": portafolio, blog técnico, sección Lab y panel
admin con editor. Necesitaba SSR/SEO bueno, auth, DB y storage de imágenes
sin gestionar backend, y un editor WYSIWYG real (no markdown).

## Decisión

- **Framework:** Next.js 16 (App Router, TypeScript, Turbopack).
- **Estilos:** Tailwind CSS v4 + shadcn/ui (variante sobre `@base-ui/react`).
- **Auth/DB/Storage:** Firebase (Auth Google, Firestore, Storage).
- **Editor:** Tiptap v3 (salida HTML, imágenes inline).
- **Deploy:** Vercel.

## Consecuencias

- ✅ SEO first-class (server components + metadata API).
- ✅ Cero backend propio (Firebase + Vercel serverless).
- ✅ Editor rico con subida de imágenes.
- ⚠️ Dependencia de Firebase (costo a escala, vendor lock-in moderado).
- ⚠️ Next 16 / Tailwind v4 / Tiptap v3 tienen APIs distintas a versiones
  anteriores → siempre verificar docs antes de codear (ver `AGENTS.md`).
