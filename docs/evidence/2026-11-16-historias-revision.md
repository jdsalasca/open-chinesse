# Historias, conversaciones y revisión (2026-11-16)

## Contenido nuevo

- **3 historias** (HSK 1, 2, 3) y **2 conversaciones** (HSK 1, 2) escritas solo con
  vocabulario del curso: rutina, parque, viaje, supermercado y direcciones.
- **25 frases con audio propio** (Piper), generadas por la línea, no por la página.
- Lectura con **pinyin coloreado por tono**, traducción por frase y **glosa al tocar
  cualquier palabra**: significado, audio y enlace a cada carácter.
- La lectura abierta vive en la URL (`#/historias/parque`), así que volver desde la
  ficha de un carácter no pierde el sitio.

## Revisión de terra y qué se aplicó

| Hallazgo                                                         | Decisión                                                 |
| ---------------------------------------------------------------- | -------------------------------------------------------- |
| Se perdía la lectura al abrir un carácter                        | **Arreglado**: estado en la ruta                         |
| Solo se podía abrir el primer carácter de la palabra             | **Arreglado**: un enlace por carácter                    |
| «Aprendidas» solo contaba unidades completas                     | **Arreglado**: cuenta palabras con tarjeta               |
| La portada podía anunciar el curso terminado antes de tiempo     | **Arreglado**: exige todas las unidades                  |
| Traducciones imprecisas (hora, pretérito, «hermana menor», 前面) | **Corregido** en las 5 lecturas                          |
| Tarjetas sin jerarquía                                           | Chino grande y subtítulo español separado                |
| Palabras consultables poco visibles                              | Subrayado punteado y contorno en la elegida              |
| Entrada genérica en todas las pantallas                          | Opacidad general; el lector sube con su propia animación |

Pendiente y anotado: botones «anterior/siguiente» dentro de la ficha del carácter y
restaurar la posición exacta de lectura al volver.

## Evidencia

```bash
npx vitest run   # 122 passed (17 files)
npx tsc -b       # 0
pnpm lint        # 0 (19 advertencias conocidas)
pnpm build       # OK, 25 audios de historia generados
```

Comprobado en navegador: `#/historias` lista las 5 lecturas con título chino y
subtítulo; el lector muestra 7 líneas con audio, pinyin y traducción; tocar 我 abre
la glosa con «yo», su audio y enlaces a los caracteres. Captura en
`docs/screenshots/historias.png`.
