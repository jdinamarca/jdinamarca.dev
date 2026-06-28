# Architecture Decision Records (ADRs)

Documentación de decisiones técnicas importantes tomadas durante el desarrollo
de jdinamarca.dev. Cada ADR sigue el formato:

```
# 000X. Título de la decisión

- **Estado:** Aceptada / Rechazada / Pendiente
- **Fecha:** YYYY-MM-DD

## Contexto
...

## Decisión
...

## Consecuencias
...
```

## Índice

- [0001. Stack base: Next.js 16 App Router + TS + Tailwind v4 + shadcn/base-ui + Firebase + Tiptap](0001-stack-y-arquitectura.md)
- [0002. Firebase client con lazy getters; Admin SDK para SSR](0002-firebase-lazy-init-y-admin-sdk.md)
- [0003. shadcn sobre `@base-ui/react` (sin `asChild`)](0003-shadcn-base-ui-sin-aschild.md)
- [0004. Lectura SSR vía Admin SDK; reglas Firestore/Storage admin-only](0004-lectura-ssr-via-admin-sdk-y-reglas.md)
- [0005. Tiptap v3: StarterKit incluye Link; `immediatelyRender: true`](0005-tiptap-v3-starterkit-incluye-link.md)
- [0006. Portafolio: datos en JSON estático vs Firestore](0006-portafolio-datos-json-estatico.md)
- [0007. Lab: reutilizar categoría `experimento`](0007-lab-categoria-experimento.md)