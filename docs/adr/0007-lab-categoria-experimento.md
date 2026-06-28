# 0007. Lab: reutilizar categoría `experimento`

- **Estado:** Aceptada
- **Fecha:** 2026-06-27

## Contexto

La sección `/lab` debe listar experimentos técnicos con IA. Actualmente:
- El modelo de `Post.category` permite: `opinion | tutorial | arquitectura | experimento`
- No existe una categoría `lab`
- Reutilizar una categoría existente simplifica el modelo vs añadir una nueva

## Decisión

**Reutilizar la categoría `experimento` para los posts de Lab.**

Razones:
1. **Semántica idéntica:** "experimento" = "Lab" en el contexto de este sitio
2. **Simplicidad:** no añadir categoría extra al modelo ni migración de datos
3. **URLs consistentes:** los experimentos de Lab viven en `/blog/[slug]` (no `/lab/[slug]`)
4. **Filtrado trivial:** `/lab` = `getPostsByCategory("experimento")`

## Consecuencias

- `/lab` filtra por `category === "experimento"`
- No se crea `/lab/[slug]` — los posts ya se leen en `/blog/[slug]` (A2)
- `Post.category` no cambia (ya tiene `experimento`)
- `PostEditor` debe permitir seleccionar `experimento` como categoría