# Contenido HSK 3

## Fuente

- 299 filas en `.tmp/hsk3.json` (repo `clem109/hsk-vocabulary`,
  `hsk-vocab-json/hsk-level-3.json`), ids 301–599, con `只` duplicado
  (`zhī` clasificador y `zhǐ` "solo": son dos palabras distintas) y sin id 600.
- Contraste con `HSK Official With Definitions 2012 L3` (`glxxyz/hskhsk.com`):
  300 entradas, de las cuales 37 no están en la fuente de arriba. Son ediciones
  distintas de la lista, no un archivo incompleto.

## Palabra 300

El HSK 3 oficial tiene 300 palabras. Nuestra fuente trae 299, así que se añade
una sola, documentada aquí:

**最后** (`zuìhòu`, "por último"). Motivo: cubre un hueco real de los adverbios
de tiempo del curso (ya están `以前`, `以后`, `最近`) y no se repite con HSK 1 ni
HSK 2. Queda como `h3-20-w15`.

## Formato

20 unidades de 15 palabras (`h3-01` … `h3-20`), ids `h3-NN-wMM`.
Cada palabra: `hanzi`, `pinyin` con tonos y sílabas unidas (`dìdi`), `meaning` en
español (1–3 palabras, minúscula inicial) y `example` de 4–12 caracteres que
contiene la palabra.

## Verificación

```bash
node scripts/validate-curriculum.mjs hsk3   # conteo, ejemplo contiene la palabra, duplicados, pinyin
npx vitest run
npx tsc -b
```

El ejemplo debe contener el hanzi completo, no solo el primer carácter: un
ejemplo de `事情` con `事` a secas ya se coló una vez.
