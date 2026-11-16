# Plan v4 — siguientes rondas (post `141f69c`)

Orden acordado. Cada ronda termina con tests verdes, despliegue y push.

## R1 — HSK 3 completo (300 palabras)

Estado: hecho en `fa83fd8` (20 unidades de 15 palabras).

- 15 unidades de 20 palabras o 20 de 15 (decidir por tema, no por número).
- Fuente del vocabulario: lista oficial HSK 3 de `clem109/hsk-vocabulary`
  (`hsk-level-3.json`), igual que se hizo con HSK 1 y 2.
- Cada palabra: `id`, `hanzi`, `pinyin` con tonos, `meaning` en español,
  `example` (4-12 caracteres) + `pinyin` + `translation`.
- Validaciones a extender en `src/data/curriculum.test.ts`:
  - total 601 palabras, 50 unidades (15 + 15 + 20);
  - ids únicos, sin frases repetidas;
  - pinyin solo con marcas válidas;
  - quiz de 4 opciones para las 50 unidades.
- Criterio de aceptación: `pnpm test` verde, build < 200 kB gzip, lección de una
  unidad HSK 3 completada en navegador con captura.

## R2 — Origen del carácter

Estado: hecho (ver `docs/evidence/2026-11-16-caracteres.md`). Ampliado en
`docs/evidence/2026-11-16-origen-v2.md`: formación, Shuowen, familia fonética,
glosas de piezas y menú contextual.

- Dataset: descomposición ideográfica (IDS) de Unihan (`kIDS`) o CHISE.
  Generar `src/data/decomposition.json` con `carácter → [componentes]` solo para
  los caracteres del currículo.
- Ficha nueva (`#/caracter/<hanzi>`): carácter, pinyin, significado, árbol de
  componentes, radical y frase de ejemplo.
- Enlace desde `Lesson` y `Review` (tocar el hanzi abre la ficha).
- Criterio: los 301 caracteres actuales tienen descomposición o se marcan como
  «sin datos» sin romper la ficha.

## R3 - Ordenar frases

Estado: hecho (ver `docs/evidence/2026-11-16-ordenar.md`).

- Nuevo `mode: 'order'` en `src/lib/quiz.ts`: dividir `example.hanzi` en chunks
  (palabras, no caracteres sueltos), barajar y validar el orden.
- Criterio: 6 preguntas por unidad sin chunks ambiguos; test de que el orden
  correcto es único.

## R4 - Navegación inferior y secciones de curso

Estado: hecho (ver `docs/evidence/2026-11-16-navegacion.md`).

- Barra fija en móvil: Aprender · Practicar · Historias · Inmersión · Yo.
- «Practicar» agrupa: repaso, escucha, tonos.
- «Historias» e «Inmersión» quedan como próximamente explícito (no vacío falso).
- Selector de curso con secciones (HSK 1, 2, 3) y progreso por sección.
- Criterio: navegación con teclado, foco visible, sin romper rutas actuales.

## R5 — Autoexplicación y calibración

- Tras un fallo: micro-explicación con opciones («¿qué te confundió?»), no texto libre.
- Antes de revelar: botón «seguro / dudo» y registro de calibración.
- Informe semanal: confianza vs acierto.
- Criterio: medir precisión a 30 días antes/después; sin cambios en FSRS.

## Descartado

- **Elegir imagen**: requiere ~300 ilustraciones; se pospone sin fecha.
