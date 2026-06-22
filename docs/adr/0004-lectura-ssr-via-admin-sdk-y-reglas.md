# 0004. Lectura SSR vía Admin SDK; reglas Firestore/Storage admin-only

- **Estado:** Aceptada
- **Fecha:** 2026-06-21

## Contexto

El blog público (`/blog`, `/blog/[slug]`) debe leer posts sin requerir login.
Pero los **borradores** no pueden ser públicos. Si las reglas permitieran
lectura pública de toda la colección `posts`, cualquiera con la API key
(pública en el bundle) podría listar borradores con una query directa.

## Decisión

1. **Lectura pública:** las páginas del blog leen Firestore vía **Admin SDK**
   desde server components (`src/lib/posts.ts`), que **ignora las reglas de
   seguridad**. Filtan `where("published", "==", true)`. Así el público solo
   ve publicados, sin reglas permisivas.
2. **Reglas (`firestore.rules`):** `posts` con `read, write: if isAdmin()`
   (email admin). Como el blog no usa el client SDK para leer, no hace falta
   lectura pública en reglas → los borradores quedan privados.
3. **Storage (`storage.rules`):** lectura pública de `posts/**` y `covers/**`
   (las imágenes se muestran en el blog), escritura solo admin.
4. `isAdmin()` verifica `request.auth.token.email == 'jdinamarca@snakode.com'`.

## Consecuencias

- ✅ Borradores privados incluso aunque la API key sea pública.
- ✅ Blog con SEO (server-side) y sin login.
- ⚠️ Si en el futuro se quiere lectura client-side (ej. search con SDK), las
  reglas deben permitir `read` pública de publicados — hoy no se necesita.
- ⚠️ El Admin SDK bypass de reglas es un poder peligroso: filtrar siempre
  `published == true` en funciones de lectura pública.
