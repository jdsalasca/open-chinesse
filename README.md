# Open Chinesse

App web de código abierto para aprender chino mandarín desde cero. Doce palabras
nuevas por unidad, audio en cada tarjeta, repaso espaciado FSRS y práctica de
recuperación real: primero intentas recordar, la respuesta aparece después.

![Inicio](docs/screenshots/home.png)

## Estado

v0.1 — funcional y usable: 6 unidades, 72 palabras de HSK 1, repaso con FSRS-6,
producción escrita de pinyin, estadísticas locales. Sin backend, sin cuentas.

| | |
|---|---|
| Stack | Vite 8 · React 19 · TypeScript 7 · SCSS · Zustand · ts-fsrs 6 |
| Pruebas | 51 (Vitest + Testing Library) |
| Progreso | `localStorage`, con versión de esquema |
| Idiomas | Español (UI) · Chino mandarín (contenido) |

## Cómo correr

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm test       # 51 pruebas
pnpm build      # build de producción
pnpm lint
```

## Qué hace distinto

### Recuperación antes que relectura

La pantalla de repaso nunca muestra la respuesta antes del intento. Las tarjetas
maduras piden **escribir el pinyin** en lugar de reconocer una opción: producción,
no reconocimiento. La lección sí usa opción múltiple, porque ahí el objetivo es
codificar, no evaluar.

### FSRS-6, no SM-2

Cada tarjeta se programa con [`ts-fsrs`](https://github.com/open-spaced-repetition/ts-fsrs)
(FSRS-6, retención objetivo 90%). Los cuatro botones muestran el intervalo que
resultaría **antes** de elegir. Los pasos de aprendizaje cortos (1 min, 10 min) se
re-encolan en la misma sesión, como en Anki.

### El tono es información de primer nivel

Pinyin coloreado por tono (T1 rojo, T2 ámbar, T3 verde, T4 azul, neutro gris),
audio en la palabra y en la frase de ejemplo, y atajo de teclado para escuchar sin
soltar el teclado.

### Gamificación sobria

Racha informativa que no castiga, sin leaderboards, sin notificaciones y sin
mecánicas de pérdida. Borrar el progreso está a un clic, sin fricción.

## La evidencia detrás

Cada decisión de producto viene de literatura revisada y resumida en
[`resources/investigation-education/`](resources/investigation-education/):

| Decisión | Evidencia |
|---|---|
| Recuperación activa | Roediger & Karpicke 2006; Rowland 2014 (g = 0.50); Adesope 2017 |
| FSRS en lugar de SM-2 | Benchmark SRS (350M repasos): superioridad 99.6% vs Anki SM-2 |
| Frase de ejemplo por palabra | Krashen 1985; crítica y síntesis en Liu 2015 y Lichtman 2021 |
| Audio y pinyin por tono | Wang et al. 1999 (+21%, retenido 6 meses); metaanálisis HVPT 2025 (g = 0.67–0.92) |
| Pinyin tecleado en tarjetas maduras | Guan et al. 2011 (tecleo fortalece forma→sonido) |
| Sin rachas punitivas | ACM L@S 2022 (gamification misuse); Barasch & Silverman 2023 |

## Estructura

```
src/
  data/curriculum.ts    72 palabras, 6 unidades, frases y traducciones
  srs/                  adaptador FSRS + cola de repaso (puro, testeado)
  store/                estado del aprendiz, métricas, persistencia
  lib/                  audio, pinyin/tonos, router hash, generador de quiz
  screens/              Home · Lesson · Review · Stats
  components/           AudioButton, Pinyin
  styles/               tokens, mixins y parciales SCSS por pantalla
docs/
  plan.md               plan por rondas y criterios de aceptación
  screenshots/          capturas de referencia
resources/
  investigation-education/   papers, hallazgos y conclusiones de diseño
```

## Atajos de teclado

| Tecla | Acción |
|---|---|
| `Enter` | Avanzar en la lección |
| `Espacio` | Revelar la respuesta en el repaso |
| `1`–`4` | Calificar: Otra vez · Difícil · Bien · Fácil |
| `P` | Escuchar la palabra |

## Límites conocidos

- La calidad del audio depende de las voces `zh-CN` instaladas en el sistema.
  Si no hay, se usa la voz por defecto del navegador.
- Los pesos de FSRS son los de fábrica. Se pueden optimizar por usuario cuando
  haya historial suficiente (≥ 1000 repasos).
- El contenido está escrito a mano; falta revisión de un hablante nativo.
- Sin escritura de trazos, sin PWA y sin sincronización: ver el roadmap en
  [`docs/plan.md`](docs/plan.md).

## Licencia

MIT. El contenido didáctico es original; el vocabulario se basa en la lista HSK 1
(dominio público).
