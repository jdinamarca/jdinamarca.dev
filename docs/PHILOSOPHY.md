# Filosofía de trabajo con GLM — jdinamarca.dev

> Cómo construir y mantener este proyecto de forma eficiente usando modelos
> GLM, optimizando **tokens** y **calidad**. Aplicable a cualquier modelo,
> pero especialmente pensado para delegar tareas en modelos más pequeños.

---

## 1. Principios generales

1. **El contexto vive en el repo, no en la conversación.** Los modelos
   pequeños pierden contexto rápido. Si la información importante está en
   archivos (`CLAUDE.md`, ADRs, `EXECUTION_PLAN.md`), cualquier modelo la
   recupera al instante sin que se la expliques.
2. **Una tarea por sesión.** No apilar 5 features en un mismo prompt. Una
   tarea atómica, con criterios de aceptación claros, verificada antes de
   pasar a la siguiente.
3. **Mostrar patrones, no inventar.** "Hazlo como `PostCard.tsx`" es mejor
   que "haz una tarjeta de post". Referenciar un archivo existente fuerza a
   copiar convenciones (imports, naming, estilos, exports).
4. **Verificación obligatoria tras cada tarea:** `npm run lint` + `npm run build`.
   Si no pasa, la tarea no está terminada.
5. **Commit pequeño y atómico** por tarea. Mensaje descriptivo. Así se puede
   revertir una tarea sin arrastrar a las demás.

---

## 2. Gestión de contexto (mapa de archivos)

| Archivo | Rol | Cuándo actualizarlo |
|---|---|---|
| `CLAUDE.md` | Contexto global del proyecto (stack, reglas, estado). Lo lee el modelo al iniciar. | Al final de cada sesión |
| `docs/EXECUTION_PLAN.md` | Plan detallado tarea por tarea con modelo recomendado. | Al terminar una tarea (marcar ✓) |
| `docs/TASKS.md` | Checklist histórico de sesiones. | Al final de cada sesión |
| `docs/adr/` | Decisiones de arquitectura no obvias (una por archivo). | Cuando se toma una decisión importante |
| `docs/ROADMAP.md` | Visión de fases de alto nivel. | Poco frecuente |

**Regla:** al cerrar una sesión, el modelo debe dejar el repo en un estado en
el que **otra sesión nueva pueda continuar sin pedirte explicaciones**.

---

## 3. Tamaño de tarea (atomicidad)

Una tarea buena para un modelo pequeño:

- Toca **1–3 archivos**.
- Tiene **una sola responsabilidad** ("añadir sección X a la landing").
- Tiene **criterios de aceptación verificables** (lint, build, visual).
- Se puede describir en **< 30 líneas de instrucciones**.

Una tarea mala: "implementa todo el SEO". → Dividir en: metadata por
página, JSON-LD, sitemap, robots, OG image (5 tareas).

---

## 4. Selección de modelo por tarea

Para ahorrar tokens, usa el modelo **más pequeño capaz** de hacer la tarea.

| Tier | Modelo (Zhipu) | Úsalo para | Ejemplos |
|---|---|---|---|
| **T1 — Flagship** | `glm-4.6` | Arquitectura, bugs complejos, refactors multi-archivo, integrar librería nueva, decisiones de diseño difíciles | Diseñar `posts.ts`, debug hydration de Tiptap, migrar de client a server component |
| **T2 — Balanceado** | `glm-4.5-air` | Features estándar **siguiendo un patrón existente**, componentes nuevos imitando otros, páginas CRUD, estilos | `ProjectCard` imitando `PostCard`, página `/projects`, sección de landing, filtros |
| **T3 — Ligero** | `glm-4-flash` | Edición de **1 archivo**, config, docs, copiar/pegar patrones, ajustes de clases Tailwind, texto | Añadir un enlace al navbar, cambiar colores, sitemap.ts, robots.ts, redactar docs |

**Heurística:** si la tarea dice "como el archivo X" → probablemente T2 o T3.
Si la tarea dice "decide cómo..." o "investiga por qué falla..." → T1.

Cada tarea en `EXECUTION_PLAN.md` tiene su tier recomendado.

---

## 5. Flujo de trabajo recomendado por sesión

1. **Abrir el plan:** leer `EXECUTION_PLAN.md`, elegir la siguiente tarea no
   completada (respeta dependencias).
2. **Prompt inicial** al modelo:
   > "Lee `CLAUDE.md` y `docs/adr/`. Ejecuta la tarea **[ID]** de
   > `docs/EXECUTION_PLAN.md`. Sigue los pasos literales. Al terminar ejecuta
   > `npm run lint` y `npm run build`."
3. **El modelo ejecuta** los pasos, edita archivos, verifica.
4. **Revisar visualmente** (dev server / screenshot).
5. **Si la tarea introdujo una decisión nueva** → pedirla como ADR en `docs/adr/`.
6. **Actualizar docs:** marcar ✓ en `EXECUTION_PLAN.md`, añadir entrada en
   `TASKS.md`, actualizar snapshot de `CLAUDE.md`.
7. **Commit** (solo si el usuario lo pide).

---

## 6. Architecture Decision Records (ADR)

**¿Cuándo escribir un ADR?** Cuando tomas una decisión **no obvia** cuyo
"por qué" se perdería si solo se ve el código. Ejemplos de este proyecto:

- ¿Por qué Firebase con lazy-init y no directo? → `adr/0002`
- ¿Por qué shadcn con `@base-ui` y no Radix? → `adr/0003`
- ¿Por qué el blog lee vía Admin SDK? → `adr/0004`
- ¿Por qué las reglas de Firestore son admin-only? → `adr/0004`

**Formato** (un archivo por decisión, en `docs/adr/NNNN-titulo.md`):

```
# NNNN. Título corto

- **Estado:** Aceptada | Deprecated | Sustituida por NNNN
- **Fecha:** YYYY-MM-DD

## Contexto
(Por qué había que decidir)

## Decisión
(Qué se decidió)

## Consecuencias
(Pros y contras)
```

Índice completo: `docs/adr/README.md`.

---

## 7. Anti-patrones a evitar

- ❌ **Inventar APIs de librerías** sin verificar. Si dudas, pide al modelo
  que lea `node_modules/<pkg>/dist/*.d.ts` antes de escribir código.
- ❌ **Asumir versiones.** Este es Next.js 16 y Tailwind v4 (no los de tu
  entrenamiento). Regla en `AGENTS.md`: leer la guía antes de codear.
- ❌ **Usar `any`.** El lint lo prohíbe. Tipar todo.
- ❌ **`setState` síncrono dentro de `useEffect`.** El lint lo prohíbe
  (`react-hooks/set-state-in-effect`). Ver `ThemeToggle` / `PostList` como
  referencia de cómo evitarlo.
- ❌ **`asChild` en shadcn.** No existe en `@base-ui`. Ver ADR 0003.
- ❌ **Firebase importado a nivel de módulo en server.** Cuelga el build.
  Ver ADR 0002.
- ❌ **Cerrar sesión sin actualizar docs.** Rompe la continuidad.
- ❌ **Apilar tareas.** Una por sesión.
- ❌ **Commits sin verificar build.**

---

## 8. Plantilla de prompt para delegar en modelo pequeño

```
Contexto: lee CLAUDE.md y docs/adr/README.md antes de empezar.

Tarea: [ID] de docs/EXECUTION_PLAN.md
- Lee el apartado [ID] completo.
- Ejecuta los pasos en orden.
- NO añadas funcionalidad fuera del alcance de la tarea.
- NO añadas comentarios al código salvo que aporten contexto no obvio.
- Al terminar: ejecuta `npm run lint` y `npm run build`.
- Si alguno falla, arréglalo antes de dar por terminada la tarea.
- Reporta: archivos creados/editados, resultado de lint/build, y cualquier
  decisión no obvia (para guardarla como ADR).
```

Esta plantilla funciona con T2/T3. Para T1, da más libertad.
