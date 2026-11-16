# Plan — Open Chinesse (web)

Clon educativo de código abierto para aprender chino mandarín desde cero, pensado
para hispanohablantes. La técnica no es decorativa: cada decisión de producto viene
de la literatura revisada en `resources/investigation-education/`.

## Objetivo de la v1

Que una persona sin conocimiento de chino pueda, en una sesión de 10 minutos:

1. Aprender 12 palabras nuevas con audio, pinyin y una frase de ejemplo.
2. Ser evaluada con recuperación activa (no reconocimiento pasivo).
3. Recibir un calendario de repaso personalizado (FSRS) y volver al día siguiente.

## No-goals de la v1

- Escritura a mano / orden de trazos (se evalúa en R5; la evidencia es mixta y el
  costo de datos es alto).
- Cuentas, sincronización multidispositivo, backend.
- Social, ranking, leaderboards.
- Contenido más allá de HSK 1 + esenciales (72 palabras).

## Técnicas incorporadas (y por qué)

| Técnica                           | Decisión en el producto                           | Evidencia                                                              |
| --------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| Práctica de recuperación          | Repaso = recall con feedback, nunca relectura     | Roediger & Karpicke 2006; Rowland 2014 (g=0.50); Adesope 2017          |
| Repetición espaciada FSRS         | `ts-fsrs` FSRS-6, retención objetivo 90%          | Benchmark SRS: 350M repasos, superioridad 99.6% vs SM-2                |
| Producción escrita (pinyin)       | Tarjetas maduras exigen teclear el pinyin         | Guan et al. 2011 (escritura alfabética fortalece ortografía→fonología) |
| Input comprensible                | Cada palabra nueva aparece en una frase           | Krashen 1985; crítica: Liu 2015, Lichtman 2021                         |
| Entrenamiento perceptual de tonos | Audio en cada tarjeta + pinyin coloreado por tono | Wang et al. 1999 (+21%); HVPT meta 2025 (g=0.92/0.67)                  |
| Interleaving                      | La cola de repaso mezcla unidades                 | Rowland 2014 (heterogeneidad); práctica distribuida                    |
| Gamificación sobria               | Racha informativa, sin castigo ni leaderboard     | Barasch & Silverman; ACM L@S 2022 (gamification misuse)                |

## Arquitectura

```
src/
  data/        contenido HSK1 (palabras, unidades, frases)
  srs/         adaptador ts-fsrs + cola de repaso (puro, testeado)
  store/       estado del aprendiz + persistencia local
  lib/         audio (speechSynthesis), pinyin/tonos, router hash
  screens/     Home · Lesson · Review · Stats
  components/  piezas de UI reutilizables
  styles/      SCSS: tokens, mixins, parciales por pantalla
```

Sin backend. Progreso en `localStorage` con versión de esquema y migración.

## Rondas

### R0 — Andamiaje y evidencia

- [x] Scaffold Vite 8 + React 19 + TS + SCSS + Vitest
- [x] `resources/investigation-education/` con papers y conclusiones
- [x] `docs/plan.md`

### R1 — Dominio (datos + SRS)

- [x] Contenido: 6 unidades × 12 palabras con pinyin, significado, frase y traducción.
- [x] Adaptador FSRS: crear tarjeta, previsualizar 4 calificaciones, calificar, serializar.
- [x] Cola de repaso: vencidas + nuevas, orden, re-encolado de pasos de aprendizaje.
- [x] Tests: serialización, intervalos crecientes, fallo reduce intervalo, cola.

### R2 — Estado del aprendiz

- [x] Store con persistencia, racha sin castigo, estadísticas.
- [x] Tests: racha, precisión, pronóstico 7 días, próxima fecha de repaso.

### R3 — Interfaz

- [x] Home con CTA de repaso/lección y progreso por unidad.
- [x] Lección: presentación → quiz de recuperación → resumen.
- [x] Repaso: tarjeta → audio → (pinyin en tarjetas maduras) → revelar → 4 botones.
- [x] Estadísticas: racha, repasos, dominadas, precisión, pronóstico.
- [x] SCSS con tokens; accesibilidad: foco visible, contraste AA, teclado.

### R4 — Cierre

- [x] `pnpm test`, `pnpm build`, `pnpm lint` verdes.
- [x] Captura visual de cada pantalla revisada (`docs/screenshots/`).
- [x] README, repo remoto `open-chinesse`, rama `develop`.

### R5 — Backlog (fuera de v0.1)

- [ ] Escritura de trazos con `hanzi-writer` (ver doc 05: aporta forma→significado).
- [ ] Audio pregrabado multihablante con `edge-tts` (HVPT real).
- [ ] PWA offline + instalación.
- [ ] Sincronización opcional (Supabase) sin cuentas obligatorias.
- [ ] Revisión del contenido por hablante nativo.
- [ ] Optimización de pesos FSRS con el historial del propio usuario.

## Desviaciones respecto al plan inicial

- **Sin router de terceros**: un router hash de 30 líneas cubre las cuatro rutas y
  evita una dependencia mayor. Tests no lo cubren; lo verifica la sesión E2E.
- **Los pasos de aprendizaje se re-encolan en la misma sesión**, así que un "Bien"
  de 10 minutos puede reaparecer antes. Es el comportamiento de Anki con learning
  steps y evita sesiones de dos tarjetas.
- **La racha se deriva del log**, no se guarda como contador: no puede desincronizarse.
- **Estado de unidad completada se deriva** de las tarjetas existentes, no se guarda.
- **`ts-fsrs` API síncrona** (FSRS-6) en lugar de `DefaultScheduler` (async, FSRS-7):
  menos complejidad, misma calidad de programación con pesos de fábrica.

## Evidencia de la ronda 4

- `pnpm test`: 51 pruebas en 6 archivos, todas verdes.
- `pnpm build`: 89,8 kB gzip de JS inicial (objetivo < 250 kB).
- Sesión E2E con Playwright: lección completa y 24 repasos solo con teclado, sin
  errores de consola; el progreso persiste tras recargar.
- Capturas revisadas en escritorio (1280×1000) y móvil (390×844).

## Criterios de éxito verificables

- Un usuario nuevo llega a Home, hace una lección y termina con 12 tarjetas programadas.
- Al recargar, el progreso persiste y la racha se mantiene.
- Ninguna interacción exige ratón (todo con teclado).
- El bundle inicial queda bajo 250 kB gzip.

## Riesgos

- `speechSynthesis` depende de voces del sistema; si no hay voz `zh-CN` se avisa y se
  ofrece el pinyin. Mitigación futura: MP3 pregrabados con `edge-tts`.
- FSRS-6 sin optimización por usuario usa parámetros por defecto. Aceptable hasta
  tener historial propio (>= 1000 repasos).
- Contenido escrito a mano: revisar tonos y traducciones en R5 con hablante nativo.

## Rondas de madurez de producto (noviembre 2026)

Objetivo: que la app se lea como producto y no como prototipo. Criterio común: en
cinco segundos se entiende qué toca hacer, la jerarquía se sostiene en escritorio y
móvil, y ninguna pantalla parece una lista de base de datos.

### P1 — Identidad y portada

- [x] Portada oscura de marca con una sola acción primaria y el progreso como
      contexto, no como tabla.
- [x] «Tu sesión de hoy» como tablero de tres pasos con meta visible.
- [x] Progreso y logros en un panel único con anillo, nivel e insignias.
- [x] Ruta como rejilla de unidades clicable; se elimina la lista infinita.
- [x] Cabecera y navegación con estado activo consistente; pie más sobrio.
- [x] Copy honesto: audio sintético, FSRS sin promesas de memoria perfecta.

### P2 — Sesión (Lección, Repaso, Tonos)

- [x] Modo foco: sin navegación global durante una sesión, con salida explícita.
- [x] Cabecera de sesión común: salir, contexto y contador.
- [ ] Progreso segmentado y acciones ancladas; teclas visibles en todo momento.
- [ ] Feedback de acierto/error y cierre de sesión con siguiente paso claro.

### P3 — Biblioteca (Practicar, Historias, Inmersión, Progreso, Perfil)

- [x] Practicar como rejilla de cuatro acciones con icono, estado y CTA.
- [x] Cabecera de página común en Practicar e Historias.
- [x] Perfil coherente: «Estudiadas» reales, 601 palabras y logros con el mismo
      lenguaje visual que la portada.
- [ ] Terminar de unificar Inmersión, Progreso y el lector de historias.
- [ ] Estados vacíos y de carga con la misma voz visual.

### P4 — Pulido

- [ ] Iconografía y motion coherentes; `prefers-reduced-motion` en todo.
- [ ] Revisión de contraste AA, foco visible y landmarks.
- [ ] Metadatos, favicon y rendimiento de fuentes.

### C1 — Contenido vivo

- [x] Cuatro situaciones interactivas (HSK 1–3) con decisiones, feedback y audio.
- [x] Progreso de situaciones persistido y sincronizado (esquema 7).
- [x] Teclas 1–3 para elegir y auto-scroll del chat.
- [x] Dos lecturas nuevas: restaurante (HSK 2) y día de lluvia (HSK 3).
- [ ] Notas de uso en palabras que se confunden (二/两, 几/多少, 的/得).
- [ ] Escenarios con voz propia del aprendiz (grabación o evaluación).

Cada ronda cierra con `vitest`, `tsc -b`, `pnpm lint`, `pnpm build`, capturas en
`.screens/`, despliegue y push a `develop` y `main`.
