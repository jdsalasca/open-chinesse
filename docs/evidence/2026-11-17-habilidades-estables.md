# Ronda C26: habilidades estables (2026-11-17)

## Problema

La sección Practicar tenía 18 actividades valiosas, pero no decía qué destreza
entrenaba cada una. Además, algunos bordes podían romper la experiencia:
niveles inválidos en la URL, un carácter malformado, un fallo de render y una
grabadora que no liberaba el micrófono si `MediaRecorder` fallaba.

## Cambios

### Cinco destrezas visibles

`src/lib/practice.ts` define:

- **Oído**: tonos, cuentos, comprensión auditiva.
- **Habla**: repetición en voz alta y situaciones.
- **Lectura**: contexto, China, gramática, detective, escena y piezas.
- **Escritura**: dictado y transformación de frases.
- **Memoria**: repaso, fallos, jefes, mixta y prueba de retención.

La pantalla Practicar añade:

- filtros «Todas / Oído / Habla / Lectura / Escritura / Memoria»;
- una etiqueta con punto de color en cada tarjeta;
- el filtro se aplica en cliente y mantiene las 18 actividades.

### Boundary de pantalla

`AppErrorBoundary` envuelve el contenido de la ruta. Si un componente lanza una
excepción, la aplicación muestra «Esta pantalla no cargó», explica que el
progreso está guardado y ofrece volver al inicio. El boundary se remonta al
cambiar de ruta para no dejar la app atrapada.

### Rutas normalizadas

- `#/jefes/9` ya no construye un jefe inexistente: vuelve a la lista.
- `#/certificado/9` ya no muestra «Certificado HSK 9»: vuelve a jefes.
- `#/caracter/%E0%A4%A` ya no muestra un título roto: vuelve al inicio.
- Un carácter Han válido sigue abriendo su ficha.

### Grabadora más estable

- Si `getUserMedia` o `MediaRecorder` fallan, se detiene el stream y no queda
  el micrófono encendido.
- Al denegar permiso aparece **Reintentar micrófono**, no solo un aviso.
- El temporizador de 10 segundos se limpia al terminar la grabación.
- El texto explica el máximo de 10 segundos.

## Verificación

```text
npx prettier --check src        limpio
npx tsc -b                      limpio
npx vitest run                  264 passed (264)
ESLint externo (teachers)       0 errores
Stylelint (teachers)            limpio
pnpm build                      ✓
```

Tests nuevos:

- `src/screens/Practice.test.ts`: cinco destrezas, rutas únicas y cobertura.
- `src/components/AppErrorBoundary.test.tsx`: contenido sano y fallback.
- `src/lib/router.test.ts`: niveles inválidos y carácter malformado.

### QA visual

- Practicar: 18 tarjetas, seis filtros, etiquetas de destreza y 0 px de
  desbordamiento.
- Filtrar «Oído» deja Tonos, Cuentos para dormir y Comprensión auditiva.
- `#/certificado/9` cae en la lista de jefes.
- `#/caracter/%E0%A4%A` cae en la portada.
- Grabadora con permiso denegado: aviso y botón de reintento.
- Grabadora con stream sintético: graba, detiene, muestra «Escuchar mi
  grabación» y «Grabar otra vez».
- Móvil 390×844: filtros en dos filas, tarjetas apiladas, 0 px de
  desbordamiento.

Capturas en `.screens/audit/`: `c26-practice.png`,
`c26-practice-mobile.png`, `c26-recorder.png`, `c26-recorder-ready.png`.

## Límites

- Los filtros son de cliente; no cambian el orden ni el progreso.
- No hay métricas por destreza todavía: se ve qué practicas, no cuánto has
  mejorado en cada habilidad.
- Las rutas de gramática, escucha o repetición con un id inexistente siguen
  cayendo en su lista; es una salida válida, no un error.
- La grabación real con micrófono físico sigue pendiente de una prueba en un
  navegador normal; aquí se verificó el camino completo con un stream sintético
  y el camino de permiso denegado.
