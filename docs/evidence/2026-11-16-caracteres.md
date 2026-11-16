# Origen del carácter (2026-11-16)

## Qué se añadió

- `src/data/decomposition.json`: 618 caracteres del currículo con descomposición
  IDS, radical y número de trazos (49 kB, generado).
- `src/lib/ids.ts`: parser de la notación IDS (`⿰女子` → árbol de componentes).
- `#/caracter/<hanzi>`: ficha con carácter, radical, trazos, nivel mínimo, árbol
  de composición navegable y las palabras del curso que lo usan.
- Chips «Origen» en lección y repaso; cada pieza del árbol abre su propia ficha.

## Fuentes

| Dato             | Fuente                                                         | Licencia |
| ---------------- | -------------------------------------------------------------- | -------- |
| IDS              | `cjkvi/cjkvi-ids` (`ids.txt`, base CHISE)                      | CC BY-SA |
| Radical y trazos | Unihan `Unihan_IRGSources.txt` (`kRSUnicode`, `kTotalStrokes`) | Unicode  |

Regeneración: descargar `ids.txt` y `Unihan.zip` a `.tmp/` y ejecutar
`node scripts/build-decomposition.mjs`. El script imprime la cobertura.

## Evidencia

```bash
$ node scripts/build-decomposition.mjs
caracteres=618 conIds=618 conRadical=618 sinNada=0

$ npx vitest run
Test Files  11 passed (11)
Tests       87 passed (87)

$ npx tsc -b        # exit 0
$ pnpm lint         # exit 0 (19 advertencias conocidas)
$ pnpm build        # gzip 134,84 kB (< 200 kB)
```

Comprobado en navegador:

- `#/caracter/好` → radical 女, 6 trazos, HSK 1, «izquierda + derecha» (女 + 子).
- `#/caracter/亮` → árbol anidado: `⿱ ⿳亠口冖 几`.
- `#/caracter/姨` → 女 + 夷, HSK 3, y la palabra 阿姨 con su unidad.
- `#/caracter/万` → pieza fuera del plano básico (𠃌) como un solo glifo.
- Lección `h3-01` y repaso: chips «Origen» navegan a la ficha.

## Decisiones

- **Se indexa por puntos de código, no por unidades UTF-16.** 70 caracteres de la
  fuente tienen componentes fuera del plano básico; con `text[i]` se partían en
  dos mitades rotas. Hay test de regresión (`⿰𠮷子`).
- **Solo se generan los caracteres del currículo** (618), no los 90 000 de
  Unihan: el bundle no paga por lo que no se muestra. Un carácter fuera del curso
  enseña «sin datos» sin romper.
- **El significado de cada pieza no se inventa.** La ficha muestra estructura y
  palabras reales; el gloss de componentes llegará con una fuente etiquetada.
