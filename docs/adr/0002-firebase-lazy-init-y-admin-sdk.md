# 0002. Firebase client con lazy getters; Admin SDK para SSR

- **Estado:** Aceptada
- **Fecha:** 2026-06-03

## Contexto

Next.js hace SSR de todos los componentes (incluso los `"use client"` durante
el prerender). Si se inicializa Firebase **a nivel de módulo**, el build
falla con `auth/invalid-api-key` porque las env vars públicas no están
disponibles en ese momento del SSR o el SDK toca APIs de browser.

Por otro lado, las páginas del blog (`/blog`, `/blog/[slug]`) necesitan leer
datos en el servidor para SEO, y el cliente no debe poder leer borradores.

## Decisión

1. **Client SDK (`src/lib/firebase.ts`):** exportar **getters lazy**
   (`getFirebaseAuth()`, `getFirebaseDb()`, `getFirebaseStorage()`) que
   inicializan la app solo al ser llamados desde efectos/handlers (browser).
   Nunca instancias directas a nivel de módulo.
2. **Admin SDK (`src/lib/firebase-admin.ts`):** inicializado a nivel de
   módulo (server-only) con credenciales de service account. Se usa en
   `src/lib/posts.ts` para leer posts desde server components.
3. Páginas con Auth en cliente: `export const dynamic = "force-dynamic"`.

## Consecuencias

- ✅ Build limpio sin `auth/invalid-api-key`.
- ✅ Blog con SEO (lectura server-side) sin exponer reglas al cliente.
- ⚠️ Hay que respetar la convención: nunca `import { auth, db }` directo.
- ⚠️ El Admin SDK **ignora las reglas de seguridad** → la protección de
  borradores vive en las reglas (escritura/lectura admin-only), no en el SDK.
