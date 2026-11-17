# C26 — Habilidades estables

**Goal:** Hacer visibles las destrezas que entrena cada práctica y blindar los bordes que podían romper la experiencia: rutas inválidas, errores de pantalla y grabación de voz.

**Architecture:**

- `src/lib/practice.ts`: taxonomía de cinco destrezas (oído, habla, lectura, escritura, memoria).
- `src/screens/Practice.tsx`: filtros por destreza y etiqueta en cada tarjeta.
- `src/components/AppErrorBoundary.tsx`: salida amable si una pantalla falla.
- `src/lib/router.ts`: normalización de niveles de jefe/certificado y validación de caracteres.
- `src/lib/use-recorder.ts` y `src/screens/Shadowing.tsx`: limpieza de stream, reintento y límite visible.

## Tareas

- [x] Filtros por habilidad y etiqueta de destreza en las 18 actividades.
- [x] Boundary global con «Volver al inicio».
- [x] Niveles de jefe/certificado normalizados; carácter inválido vuelve al inicio.
- [x] Grabadora: stream liberado en error, reintento tras denegar permiso y máximo de 10 s visible.
- [x] Tests de habilidades, rutas y boundary.
- [x] QA visual, despliegue y push.
