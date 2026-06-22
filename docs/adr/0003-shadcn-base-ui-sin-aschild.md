# 0003. shadcn sobre `@base-ui/react` (sin `asChild`)

- **Estado:** Aceptada
- **Fecha:** 2026-06-03

## Contexto

La versión actual de shadcn/ui usa `@base-ui/react` (de Base UI) en vez de
Radix UI. La prop `asChild` típica de Radix **no existe** aquí. Intentar
usarla rompe silenciosamente el componente o da errores.

## Decisión

- Para envolver un `Button` en un `Link`, **no** usar `asChild`:

  ```tsx
  // ❌ NO
  <Button asChild><Link href="/x">X</Link></Button>

  // ✅ SÍ
  <Link href="/x"><Button>X</Button></Link>
  ```

- Revisar la API real de cada componente shadcn en `src/components/ui/*.tsx`
  antes de usarlo (variantes, sizes, props). Ej: `Button` tiene `size="sm"`
  con `h-7` (no `h-8`); `Badge` usa `render` (de `useRender`) en vez de `asChild`.

## Consecuencias

- ✅ Sin errores por APIs inexistentes.
- ⚠️ Hay que leer cada componente `ui/*` la primera vez que se usa.
- ⚠️ Patrones copiados de otros proyectos shadcn/Radix pueden no aplicar.
