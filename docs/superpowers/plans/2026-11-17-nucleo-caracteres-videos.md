# C18 — Núcleo: historia del carácter y vídeos

**Goal:** Que la ficha de cualquier carácter del curso tenga una historia legible, un gancho de memoria, piezas con rol y un sentido propio; ampliar Inmersión con más vídeos y una sección de historia de los caracteres.

**Architecture:**

- `src/data/character-notes.ts`: pictogramas curados, notas de historia, sentidos propios y confundibles.
- `src/lib/character-story.ts`: historia para los 618 caracteres; las notas curadas mandan y los datos rellenan el resto.
- `src/data/character-sheet.ts`: roles de piezas, uso en palabra, confundibles y limpieza de pictogramas.
- `src/components/CharacterSheet.tsx`: historia, memoria, fuente plegada, leyenda de roles y tarjeta de confundibles.
- `src/data/resources.ts` e `Immersion`: 8 vídeos nuevos de inmersión y 4 de historia de caracteres.

**Tech Stack:** React + TypeScript, Vitest, SCSS, yt-dlp para verificar YouTube.

## Tareas

- [x] Test de historia para los 618 caracteres; pictogramas, compuestos y sonido.
- [x] Notas curadas: 47 pictogramas HSK 1, partículas y verbos opacos.
- [x] Roles semántico/fonético, sentido propio y uso en palabra.
- [x] Ocultar la descomposición gráfica engañosa de pictogramas.
- [x] Confundibles filtrados a caracteres del curso.
- [x] 8 vídeos HSK + 4 de caracteres, verificados con yt-dlp.
- [x] Tests de recursos y de ficha; QA de escritorio y móvil.
