# Las 1000 palabras del mandarín

**Pregunta:** si solo pudieras enseñar mil palabras, ¿cuáles y por qué?

## Dataset

Generado y reproducible. Salida en [`data/`](data/):

| Archivo         | Contenido                                                        |
| --------------- | ---------------------------------------------------------------- |
| `top-1000.json` | 1000 entradas con rango, hanzi, pinyin con tonos, glosa y conteo |
| `top-1000.csv`  | Mismo contenido en CSV para hojas de cálculo                     |
| `coverage.json` | Estadísticas del corpus                                          |

### Fuentes

- **Frecuencia:** [FrequencyWords](https://github.com/hermitdave/FrequencyWords),
  corpus OpenSubtitles 2018 `zh_cn` (MIT). 74.675.845 tokens tras filtrar
  puntuación y latinos.
- **Pinyin y glosa:** [CC-CEDICT](https://www.mdbg.net/chinese/dictionary?page=cedict)
  (CC BY-SA 4.0).

### Resultado medido

| Métrica               | Valor            |
| --------------------- | ---------------- |
| Palabras              | 1000             |
| Cobertura de tokens   | **73,2 %**       |
| Palabra más frecuente | 的 (3.957.141)   |
| Palabra nº 1000       | 6118 apariciones |

Traducción práctica: con estas mil palabras se entiende casi tres de cada cuatro
palabras de un subtítulo corriente. Para conversación básica es el mejor retorno
por palabra aprendida.

> Aviso: OpenSubtitles es habla coloquial de series y películas. Sobrerrepresenta
> pronombres, verbos de habla y partículas; subrepresenta vocabulario académico y
> técnico. Para un curso introductorio es exactamente el registro que queremos.

## Cómo se regenera

```bash
cd investigation/core-1000-words/scripts
node build-dataset.mjs
```

Descarga las fuentes en `scripts/raw/` (~4 MB) y reescribe `data/`. El script
convierte el pinyin numérico de CC-CEDICT (`ni3 hao3`) a marcas de tono (`nǐ hǎo`).

## Qué hacemos con esto

1. **Orden del currículo.** HSK 1 y 2 (301 palabras) cubren la base funcional; el
   dataset dice qué viene después. La siguiente expansión se elige por frecuencia
   dentro del vocabulario aún no enseñado, no por capítulo de libro.
2. **Prioridad de ejemplos.** Si una palabra del top-100 aparece en una frase de
   ejemplo, no necesita tarjeta propia hasta más adelante: ya se está practicando
   en contexto.
3. **Métrica de producto.** "Palabras aprendidas" es una métrica vanidosa.
   "Cobertura estimada del corpus" es honesta: 300 palabras ≈ 50 %; 1000 ≈ 73 %.

## Límites

- Frecuencia de subtítulos ≠ frecuencia de conversación espontánea ni de lectura.
- CC-CEDICT incluye acepciones arcaicas; la glosa es la primera, no siempre la más
  frecuente.
- El ranking mezcla palabras y compuestos; no distingue categoría gramatical.
- No hay datos de español: la glosa está en inglés y la traducción al español la
  hace el curso a mano.

Para el cálculo de cobertura de las 1000 palabras sobre texto real se puede cruzar
este dataset con cualquier corpus propio y obtener un número verificable.
