---
description: Ejecuta npm run lint && npm run build y reporta el resultado (verificación obligatoria tras cada cambio).
---

Ejecuta la verificación obligatoria del proyecto en orden:

1. `npm run lint`
2. `npm run build`

Reporta el resultado de cada uno de forma concisa. Si alguno falla, NO
consideres la tarea terminada: analiza el error, arréglalo y vuelve a correr
ambos comandos hasta que pasen limpios.

Regla de aceptación: 0 errores de lint + build exitoso.
