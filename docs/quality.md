# Calidad — contrato de `teachers`

El repositorio adopta el contrato de
[`teachers/AGENTS.md`](https://github.com/jdsalasca) (100 columnas, ≤4 parámetros,
≤40 líneas por función, complejidad ≤8, sin imports muertos).

## Herramientas

| Regla                             | Herramienta                          |
| --------------------------------- | ------------------------------------ |
| Formato (100 columnas, comas, LF) | Prettier 3.10 con `.prettierrc.json` |
| Complejidad ≤ 8                   | Oxlint (`complexity`)                |
| ≤ 4 parámetros                    | Oxlint (`max-params`)                |
| ≤ 40 líneas por función           | Oxlint (`max-lines-per-function`)    |
| Profundidad ≤ 3                   | Oxlint (`max-depth`)                 |
| Imports y variables muertas       | TypeScript + Oxlint                  |

```bash
pnpm lint     # oxlint + prettier --check
pnpm format   # aplica prettier
```

## Desviación documentada

1. **`max-lines-per-function` es advertencia en `src/screens/**`.** Los componentes
   de pantalla son árboles JSX declarativos; partirlos para cumplir 40 líneas
   produce más archivos sin mejorar la lectura. La regla sigue siendo **error** en
   `src/gamification`, `src/lib`, `src/srs` y `src/store`, donde el tamaño sí indica
   un problema de diseño. Deuda: `Home` (250), `Review` (235), `Lesson` (197),
   `Stats` (107).
2. **Comillas simples.** El `prettierrc` de `teachers/typescript-teacher` usa
   comillas dobles; aquí se mantienen simples por convención del repo. La anchura
   (100) y el resto de reglas son idénticas.
3. **Sin ESLint.** El repo usa TypeScript 7 (compilador nativo) y
   `typescript-eslint` aún no lo soporta. Oxlint cubre las mismas reglas numéricas
   con un binario único.
4. **JSDoc.** Se documenta la API pública de los módulos de dominio y de los
   componentes reutilizables; no se exige `@param` por cada prop de React.

## Estado actual

- `oxlint`: 0 errores, 19 advertencias (todas en pantallas).
- `prettier --check`: limpio.
- `tsc -b`: limpio.
- 156 pruebas de frontend y 13 de backend.
