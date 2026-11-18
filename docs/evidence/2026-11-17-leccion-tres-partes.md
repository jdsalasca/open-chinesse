# Ronda C28: lección en tres partes e historias con velocidad (2026-11-17)

## Problema

Una lección de 10 palabras se hacía larga y solo se revisaba al final. Las
historias tenían audio, pero no se podía ajustar la velocidad ni ver un avance
claro.

## Cambios

### Lección en tres partes

Cada unidad se divide en:

| Parte | Palabras           | Repaso                                           |
| ----- | ------------------ | ------------------------------------------------ |
| 1     | 3                  | 3 preguntas de reconocimiento                    |
| 2     | 3                  | escuchar, reconocer y completar                  |
| 3     | resto (4 en HSK 1) | tono, completar, reconocer y escuchar + 2 frases |

El flujo es:

1. presentar las palabras de la parte;
2. tarjeta **«Parte X completada · Repaso de lo aprendido»** con los caracteres
   que se van a recuperar, **sin significados**;
3. preguntas de repaso;
4. siguiente parte.

La cabecera muestra «Parte X de 3» y tres segmentos de progreso. La tarjeta de
cada palabra ya no habla de «ronda», sino de «parte». El repaso de la última
parte incluye las dos frases de ordenar y después aparece el resumen.

### Historias con velocidad

`SpeedControl` ofrece **0.75×, 1× y 1.25×** en:

- `Historias` (`/#/historias/:id`).
- `Cuentos para dormir` (`/#/dormir/:id`), con variante visual oscura.

El cambio de velocidad:

- se aplica al audio que está sonando;
- se conserva para las líneas siguientes;
- no reinicia la reproducción.

También se añadió una **barra de avance** por líneas y se mantiene el resaltado
de la línea activa y el autoscroll.

## Verificación

```text
npx prettier --check src        limpio
npx tsc -b                      limpio
npx vitest run                  269 passed (269)
ESLint externo (teachers)       0 errores
Stylelint (teachers)            limpio
pnpm build                      ✓
```

Tests:

- `lesson.test.ts`: tres partes, tres repasos, cada palabra enseñada y
  recuperada, primeras preguntas de reconocimiento.
- `SpeedControl.test.tsx`: velocidad activa y emisión del cambio.

### QA visual

- `/#/lesson/h1-08`: 中国, 北京 y 医院, después tarjeta de repaso con los tres
  caracteres sin significados.
- «Empezar el repaso» lleva a tres preguntas y después a «Parte 2 de 3» con el
  primer segmento completado.
- 390×844: 0 px de desbordamiento, acción fija y tarjeta de repaso visible.
- `/#/historias/micro-h1-01`: 0.75× aplica `playbackRate = 0.75` al audio;
  1.25× cambia la velocidad sin reiniciar y la barra de avance aparece.
- `/#/dormir/gatito`: control de velocidad legible sobre fondo oscuro y barra de
  avance; 0.75× se aplica a las líneas.

Capturas en `.screens/audit/`: `c28-review.png`, `c28-review-mobile.png`,
`c28-part2.png`, `c28-story.png`, `c28-bedtime.png`,
`c28-story-mobile.png`.

### Producción

Despliegue con `./deploy.sh`: backend OK y verificación pública `/` 200,
`/api/me` 401, `/api/health` 200.

- `/#/lesson/h1-08`: «Parte 1 de 3 · Primer contacto», tres segmentos y tres
  palabras antes del repaso.
- Repaso: «Repaso de lo aprendido», caracteres 中国, 北京 y 医院, sin
  significados, y «Empezar el repaso».
- `/#/historias/micro-h1-01`: 0.75× aplica `playbackRate = 0.75`, la barra de
  avance aparece y la línea 1 se marca.
- 390×844: 0 px de desbordamiento; la tarjeta de repaso y su botón quedan
  dentro de la pantalla; el control de velocidad sigue visible.

Capturas de producción: `.screens/audit/c28-prod-review.png` y
`.screens/audit/c28-prod-mobile.png`.

## Límites

- Las tres partes viven en la misma ruta de lección; no son tres rutas
  separadas. Si se sale a mitad, se vuelve a empezar la lección.
- El repaso es dentro de la lección, no una cola de FSRS distinta.
- La velocidad no se guarda entre historias ni entre sesiones.
- No hay métricas de retención que comparen este formato con el anterior.
