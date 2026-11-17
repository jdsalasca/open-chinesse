# Ronda C18: núcleo del carácter y más vídeos (2026-11-17)

## Qué cambia para el estudiante

La ficha de carácter deja de ser una ficha técnica y pasa a contar una historia:

- **La historia**: qué representa el carácter, cómo se construyó o qué piezas lo
  forman, en español y sin jerga.
- **Para recordarlo**: un gancho de memoria breve.
- **El sonido**: cuando la pieza fonética ya no suena igual, se dice.
- **Fuente histórica**: el texto original del Shuowen queda plegado, como
  consulta, no como texto principal.
- **Piezas con rol**: verde = significado; azul = sonido; la etiqueta lo dice
  también en texto, no solo por color.
- **Sentido propio y uso**: 火 = fuego y «en 火车站: estación de tren»; 明 =
  claro, brillante y «en 明天: mañana»; 苹 = manzana y «en 苹果».
- **No confundir**: caracteres de forma parecida, solo si están en el curso.
- **Pictogramas sin trampa**: 火, 水 o 人 ya no muestran una descomposición
  gráfica que parecía semántica; se explica que son dibujos.

## Cobertura

- **618 caracteres** del curso (HSK 1–3) tienen historia y gancho.
- **47 pictogramas HSK 1** con imagen concreta: fuego, río, persona, mujer,
  bebé, sol, luna, árbol, mano, ojo, boca, corazón, montaña, puerta, caballo,
  pájaro, pez, lluvia, arroz, melón, paraguas, red…
- Notas curadas para partículas y verbos opacos: 的, 是, 有, 在, 和, 了, 吗,
  呢, 这, 谁, 什么, 怎, 都, 很, 太, 会, 能, 我, 不, 没…
- **Confundibles** por forma: 人/八, 大/太/天/夫, 日/目/白, 木/本/末,
  土/士, 千/干/午, 在/再, 做/作, 坐/座, 那/哪, 买/卖, 请/情/清/晴…
- El buscador y las fichas de HSK 1–3 usan los mismos datos.

## Vídeos

- **18 recursos de inmersión** (antes 10):
  - HSK 1: 9 (tres nuevos de Mandarin Click y jiayouchinese).
  - HSK 2: 5 (tres nuevos).
  - HSK 3: 4 (dos nuevos).
- **4 vídeos de historia de los caracteres**, en una sección propia:
  - TED-Ed: cómo funcionan los caracteres.
  - Explore Mode: evolución de los caracteres.
  - DracoChinese: radicales como piezas.
  - Uncle Hanzi: origen y evolución con ejemplos.
- Todos los enlaces nuevos se verificaron con `yt-dlp`: título, duración,
  canal y disponibilidad pública.

## Verificación

```text
npx prettier --check src docs      limpio
npx tsc -b                         limpio
npx vitest run                     236 passed (236)
ESLint externo (teachers)          0 errores
Stylelint (teachers)               limpio
pnpm build                         ✓
```

### QA en navegador

- 好: historia «mujer + hijo», memoria, fuente plegada, roles de significado y
  enlace a vídeos.
- 你: leyenda verde/azul, 亻 significado y 尔 sonido; sonido 尔 (ěr) → nǐ.
- 火: historia de llamas, sin piezas falsas, con fuente y enlace.
- 苹: sentido «manzana» y uso «En 苹果».
- 明: sentido «claro, brillante» y uso «En 明天».
- Inmersión: 18 recursos en chino + 4 de caracteres; filtros 9/5/4.
- Móvil 390×844 sin desbordamiento en ficha e Inmersión.

Capturas en `.screens/audit/`: `c18-character-story.png`,
`c18-character-you.png`, `c18-character-fire.png`,
`c18-character-videos.png`, `c18-character-mobile.png`.

## Producción

- Desplegado `2addd3b` en `https://open-chinesse.eridu.top`.
- 好: historia mujer + hijo, memoria y roles de significado.
- 你: leyenda verde/azul, 亻 significado y 尔 sonido; «尔 (ěr) → nǐ».
- 火: sentido «fuego», historia de llamas, sin piezas falsas.
- 是: «Sol sobre una base recta… ser y sí».
- Inmersión: 22 tarjetas (18 de chino + 4 de caracteres); filtros 9/5/4.
- Móvil 390: 0 px de desbordamiento; sin errores de consola distintos del
  401 esperado sin sesión.

## Límites

- La historia de los 618 caracteres se **genera** con datos y plantillas; las
  partes curadas a mano son los pictogramas HSK 1 y los casos opacos. Puede
  haber etimologías simplificadas.
- El Shuowen sigue en chino clásico; se ofrece como fuente, sin traducción
  completa.
- No hay orden de trazos ni escritura manual: esta ronda es comprensión, no
  producción escrita.
- Una parte de los vídeos está en inglés; son apoyo para entender los
  caracteres, no práctica de escucha HSK.
- Los vídeos son externos: si un canal los retira, el enlace se cae.
