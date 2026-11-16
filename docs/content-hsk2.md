# Contenido HSK 2 — formato exacto

Archivo a crear: `src/data/hsk2.ts` (solo ese archivo, no toques nada más).

## Fuente del vocabulario

`.tmp/hsk2.json` contiene las 150 palabras oficiales de HSK 2 con `hanzi`, `pinyin`
(con marcas de tono) y traducciones al inglés. Léelo con Node:

```bash
node -e "const d=require('./.tmp/hsk2.json');console.log(d.length)"
```

Debes cubrir **exactamente esas 150 palabras**, sin omitir ni inventar, sin duplicar
hanzi (ojo: 得 aparece dos veces con distinto pinyin/uso; usa una sola entrada con el
uso más frecuente y notación `de` / `děi` según corresponda, y 长 igual: elige `cháng`).

## Forma del archivo

```ts
import type { Unit } from './types';

export const HSK2_UNITS: Unit[] = [
  {
    id: 'h2-01',
    level: 2,
    index: 1,
    title: 'Título corto en español',
    subtitle: 'Una línea que explique qué se aprende',
    words: [
      {
        id: 'h2-01-w01',
        hanzi: '帮助',
        pinyin: 'bāngzhù',
        meaning: 'ayudar',
        example: {
          hanzi: '你能帮助我吗？',
          pinyin: 'Nǐ néng bāngzhù wǒ ma?',
          translation: '¿Puedes ayudarme?',
        },
      },
    ],
  },
];
```

## Reglas de contenido

1. **15 unidades de 10 palabras**, agrupadas por tema y ordenadas de fácil a difícil
   (personas, familia, tiempo, comida, casa, ciudad, transporte, escuela, trabajo,
   cuerpo y salud, clima, compras, ocio, emociones, comparaciones y varios).
2. `pinyin`: siempre con marcas de tono. Dentro de una palabra, sílabas juntas
   (`bāngzhù`, `piányi`); en frases, separadas por espacios.
3. `meaning`: español, 1 a 3 palabras, minúscula inicial. Sinónimos separados por coma
   solo si aportan (`casa, hogar`).
4. `example`: frase de **4 a 10 caracteres**, gramática HSK 1-2, que use la palabra
   (puede ir con partículas). Nada de oraciones largas ni vocabulario fuera del nivel.
5. `translation`: español natural, ≤ 50 caracteres.
6. Los ejemplos deben ser distintos entre sí; no repitas la misma plantilla
   (`我喜欢…`) más de tres veces en todo el archivo.
7. Comillas simples en TS; escapa apóstrofes si hace falta.

## Verificación antes de responder

Ejecuta y pega el resultado:

```bash
node -e "const fs=require('fs');const s=fs.readFileSync('src/data/hsk2.ts','utf8');const n=(s.match(/id: 'h2-/g)||[]).length;console.log('palabras',n)"
```

Debe imprimir `palabras 150`. Además comprueba que cada `pinyin` de palabra tenga al
menos una vocal con tilde o sea tono neutro, y que no haya dos `hanzi` repetidos.

No hagas commits ni toques otros archivos.
