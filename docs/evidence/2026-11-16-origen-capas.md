# Origen en capas y ayudas de lectura (2026-11-16)

## La idea del dueño

Al abrir un carácter, su ficha sale en el centro. Al tocar una pieza, la
siguiente ficha aparece a la derecha, y así sucesivamente con una separación
creciente tipo Fibonacci. Implementado con offsets de **34, 55, 89, 144 y 233 px**
y escalas de 0.97 a 0.85, hasta seis capas.

## Veredicto de terra

Terra (gpt-6.1-terra, solo lectura) fue directo: **los desplazamientos por sí
solos son espectáculo**. No enseñan la relación entre caracteres y varias
ventanas pueden tapar el contenido. Proponía una comparación guiada de dos
fichas y una hoja única en móvil.

Se mantuvo la idea visual, pero se le añadió la parte didáctica:

- **Migas de pan** con los caracteres del recorrido; cada una vuelve a esa capa.
- **Banner de relación** al abrir una capa: «Radical de 好», «Componente de 请 ·
  verde azul», «Familia fonética de 青».
- **Comparación** `好 hǎo → 女 nǚ` con una nota: el radical orienta el
  significado, no garantiza el sonido; la familia fonética comparte pista, pero
  el tono puede cambiar.
- **Seis capas como máximo**; en móvil solo se ve la activa, con «Atrás» y migas.

## Otras mecánicas que propuso terra

Ordenadas por impacto/esfuerzo, para las próximas rondas:

1. **Recuperación inversa**: dar significado o contexto y pedir pinyin con tonos.
2. **Huecos en frases**: ocultar la palabra objetivo en un ejemplo real.
3. **Ayudas progresivas en situaciones**: ocultar pinyin y traducción bajo
   demanda. **Implementado en esta ronda**.
4. **Dictado breve**: audio → pinyin, con comparación por sílaba.
5. **Producción oral con autocomparación**, sin nota automática de pronunciación.

También recomendó simplificar el selector «¿Qué te falló?» tras cada error.
Queda anotado, no se tocó en esta ronda.

## Cambio de interacción en la ficha

Antes, una pieza con subcomponentes solo se desplegaba con «+ dentro» y no se
podía abrir como ficha. Ahora **todas las piezas abren su ficha**; «+ dentro»
solo muestra las piezas interiores. Es lo que el dueño esperaba al hacer clic.

## Ayudas de lectura en situaciones

Interruptores «Pinyin» y «Traducción» en la cabecera del chat. Se aplican a las
intervenciones, las opciones y el historial. Por defecto están activos; al
apagarlos, la escena se convierte en lectura a ciegas con audio.

## Evidencia

```text
npx vitest run    156 passed
npx tsc -b        limpio
pnpm lint         0 errores, 19 advertencias
pnpm build        ✓
```

Capturas en `.screens/origin/`:

- `origin-center.png` — primera ficha centrada.
- `origin-layer2.png` — 吃 → 口 con relación y comparación.
- `origin-please-qing.png` / `origin-3-layers.png` — 请 → 青 → 月.
- `origin-mobile-final2.png` — hoja única en móvil.
- `scenario-aids-off.png` — situación sin pinyin ni traducción.

## Límites

- La pista fonética es una **observación estructural**, no una etimología
  histórica completa.
- Seis capas es el máximo razonable; no es un árbol infinito.
- En móvil no hay cascada visual: se prioriza leer una ficha a la vez.
- Las ayudas no se guardan entre escenas; empiezan activas para no castigar al
  principiante.
