# Ronda 2026-11-16 — dossier, rediseño y gamificación

## Entregado

| Área          | Resultado                                                                |
| ------------- | ------------------------------------------------------------------------ |
| Investigación | `investigation/` con 5 bloques y 11 documentos                           |
| Dataset       | 1000 palabras más frecuentes con pinyin (CC-CEDICT) y cobertura 73,2 %   |
| Diseño        | Paleta HelloChinese adaptada, Poppins, tokens nuevos, tarjetas y sombras |
| Componentes   | `Button`, `Card`, `Badge`, `ProgressRing`, `Icon`, `Confetti`            |
| Gamificación  | XP por repaso, niveles, meta diaria, estrellas, 6 logros, confeti        |
| Calidad       | Contrato de `teachers` vía Oxlint + Prettier (`docs/quality.md`)         |

## Evidencia

```text
pnpm test        71 pasan (8 archivos)
pnpm build       106,6 kB gzip
pnpm lint        0 errores · 12 advertencias (pantallas)
npx tsc -b       limpio
```

Navegador real (Playwright 1280×1100):

- Lección `h1-01`: 6/6 correctas, **3 estrellas**, **+50 XP**, 26 piezas de confeti.
- Home tras la lección: 50 XP, Nivel 1, anillo al 50 %, 2 logros, estrellas en la unidad.
- Consola sin errores propios (solo los 401 esperados de `/api/me` en modo invitado).

## Datos verificables

- Corpus: 74.675.845 tokens (OpenSubtitles 2018 zh_cn).
- Cobertura de las 1000 palabras: **73,2 %**.
- Regenerable con `node investigation/core-1000-words/scripts/build-dataset.mjs`.

## Pendiente consciente

- Dividir `Home`, `Review`, `Lesson` y `Stats` en componentes menores
  (`docs/quality.md`, deuda declarada).
- Revisión de las 301 frases por un hablante nativo.
- Audio multihablante para HVPT real.
