# 0006. Portafolio: datos en JSON estático vs Firestore

- **Estado:** Aceptada
- **Fecha:** 2026-06-21

## Contexto

El portafolio necesita almacenar proyectos con datos relativamente estáticos
(título, descripción, tags, enlaces, imagen de portada). Los proyectos cambian
poco y no requieren un editor en tiempo real como el blog. Opciones:

1. **Firestore**: datos dinámicos, pero requiere reglas de seguridad, SDK en
   cliente/servidor, y es excesivo para datos que raramente cambian.
2. **JSON estático**: archivos en `src/data/`, versionados con Git, sin reglas,
   sin SDK, ideal para datos que cambian poco.

## Decisión

Usar **JSON estático** (`src/data/projects.json`) para almacenar los datos de
proyectos.

- **Ventajas**:
  - Simplicidad: sin reglas de Firestore, sin SDK adicionales.
  - Versionado: Git controla cambios en los proyectos.
  - Rendimiento: lectura instantánea, sin llamadas a Firebase.
  - Seguridad: no expone credenciales de admin en el cliente.

- **Desventajas** (aceptables para este caso):
  - Actualización manual: requiere commit/push para cambios.
  - No tiene consultas complejas: pero los proyectos no necesitan filtros
    avanzados.

## Consecuencias

- ✅ **Implementación simple**: crear `src/data/projects.json` con la interfaz
  `Project` existente.
- ✅ **Sin reglas de Firestore**: no se añaden reglas para la colección
  `projects`.
- ✅ **No SDK adicional**: no se necesita `@firebase/firestore` para el
  portafolio.
- ⚠️ **Actualización manual**: cambios en proyectos requieren commit y
  deploy.
- ⚠️ **No soporta búsquedas complejas**: si en el futuro se necesita, se puede
  migrar a Firestore.