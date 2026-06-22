# 0005. Tiptap v3: StarterKit incluye Link; `immediatelyRender: true`

- **Estado:** Aceptada
- **Fecha:** 2026-06-21

## Contexto

Tras actualizar/instalar Tiptap v3, el editor mostraba dos warnings y los
botones de guardar no respondían:

1. `Duplicate extension names found: ['link']`
2. `immediatelyRender defaults to false to avoid hydration mismatches`

(1) ocurría porque **StarterKit v3 ya registra la extensión `link`**, y se
añadía `@tiptap/extension-link` por separado. (2) es un cambio de default en
v3 para evitar hydration mismatches en SSR.

## Decisión

1. **No** importar `@tiptap/extension-link` por separado. Configurar Link
   dentro de StarterKit:
   ```ts
   StarterKit.configure({ link: { openOnClick: false } })
   ```
2. Pasar `immediatelyRender: true` a `useEditor`, **porque** el `PostEditor`
   es client-only (detrás del gate de auth de `/admin`): no hay SSR y por
   tanto no hay hydration mismatch.
3. Al editar posts, pasar `content: post.content` a `useEditor` y remontar
   el componente con `key={post.id}` desde `/admin` para que cargue el
   contenido correcto como estado inicial.

## Consecuencias

- ✅ Sin warnings; editor estable; guardado funciona.
- ⚠️ Si el editor se mueve a un contexto con SSR, reevaluar
  `immediatelyRender: true`.
- ⚠️ Recordar: verificar la API de StarterKit leyendo
  `node_modules/@tiptap/starter-kit/dist/index.d.ts` si se añaden extensiones.
