# Contenido revisado, audio real y ficha reutilizable (2026-11-16)

## Revisiones con terra (`gpt-6.1-terra` medium)

Dos revisiones de solo lectura en paralelo.

**Contenido (40 entradas de HSK 3 al azar): 5 fallos, 5 corregidos.**

| id             | antes                                 | ahora                                  |
| -------------- | ------------------------------------- | -------------------------------------- |
| h3-02-w03 比较 | «bastante» / «Hoy hace bastante frío» | «relativamente» / «relativamente frío» |
| h3-10-w11 老   | «anciano» (sustantivo)                | «viejo»                                |
| h3-11-w03 了解 | «conocer bien»                        | «conocer»                              |
| h3-11-w11 米   | «mide diez metros»                    | «mide diez metros de largo»            |
| h3-17-w03 校长 | «director» (ambiguo)                  | «director de escuela»                  |

**Arquitectura: 8 hallazgos.** Se resolvieron los 6 de más peso:

1. La pantalla mezclaba datos, navegación y render → `getCharacterSheetData()`
   (adaptador con caché) + `CharacterSheet` (componente reutilizable).
2. Datos duplicados entre subcomponentes → todo sale del adaptador.
3. Botones de pieza que no hacían nada → ahora: enlace si es hoja, botón solo
   si se puede abrir, con `aria-expanded` y «Desplegar/Contraer».
4. La ficha no tenía audio → botón en la cabecera y en cada palabra.
5. Caché de voces desactualizada en `speech.ts` → se refresca al recibir
   `voiceschanged`.
6. La ficha no tenía `h1` → el carácter es ahora el encabezado principal.

Quedan anotados como menores: índices precalculados (no hay lentitud medida) y
el destino de una palabra sin unidad (hoy ya no genera `#/lesson/`).

## Audio

**2 064 MP3** generados en local con **Piper** (`zh_CN-huayan-medium`), no con
servicios en la nube: 601 palabras + 601 frases + 928 caracteres, 10,5 MB.

- `scripts/build-audio.mjs` + `scripts/tts-worker.py`: el modelo se carga una
  vez y sintetiza en lote; ffmpeg convierte a MP3 48 kbps. Idempotente.
- `public/audio/` está en `.gitignore` (son artefactos); `deploy.sh` genera lo
  que falte antes del build.
- `AudioButton` reproduce el MP3 y **cae a la voz del navegador** si el archivo
  falta o falla. El estado «sonando» ahora depende de los eventos reales del
  audio, no de un temporizador de 600 ms.
- Requisitos globales (fuera del repo): `uv tool install piper-tts`, modelo en
  `%LOCALAPPDATA%\piper`, `ffmpeg`.

## Componente reutilizable

`getCharacterSheetData(char)` devuelve todo masticado (lectura, significado,
radical con glosa, nivel, formación, Shuowen, variante, árbol de piezas con
etiquetas, palabras con posición y unidad, caracteres que la contienen y familia
fonética). `CharacterSheet` solo pinta: se puede montar en la ruta actual, en un
modal o en una tarjeta sin tocar datos.

## Evidencia

```bash
$ npx vitest run   # 108 passed (14 files)
$ npx tsc -b       # 0
$ pnpm lint        # 0 (19 advertencias conocidas)
$ pnpm build       # audio incluido: 2 064 archivos, 10,5 MB
```

- `GET /audio/chars/u8bf7.mp3` → 200 (3,5 kB); palabra 4,9 kB; frase 9,5 kB.
- Captura de `#/caracter/请`: radical 讠 (palabra), formación semántico-fonética,
  piezas 讠 + 青 con «+ dentro», y la palabra 请 con su botón de audio.
