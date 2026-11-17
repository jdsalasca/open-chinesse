# Ronda C20: detective de confusables y cambia la intención (2026-11-17)

## Juicio externo

Terra propuso, por orden:

1. **Detective de confusables** — discriminación visual con datos existentes.
2. **Cambia la intención** — transferencia y producción controlada; su mecánica
   estrella.
3. **¿Qué pasó en la escena?** — inferencia con evidencia en micro-lecturas.

También dejó como horizonte: Pistas del carácter, ¿Quién hizo qué?, Memoria de lo
que importa y Elige la respuesta que encaja.

Esta ronda implementa las dos primeras.

## Cambia la intención (`/intencion`)

- **20 transformaciones** base → intención → frase transformada.
- Cada una tiene tres opciones con pinyin y traducción; solo una cumple la
  intención.
- Ronda de **10 transformaciones** con progreso y feedback.
- El feedback explica **qué cambió**: tiempo, negación, persona, partícula o
  orden.
- Las opciones se **barajan por ítem**; un test comprueba que la correcta no cae
  siempre en la misma posición.
- Actividad registrada como `transform`.

Ejemplos:

- 我今天喝茶 → «mañana» → 我明天喝茶.
- 他吃米饭 → «no comió» → 他没吃米饭.
- 她喜欢茶 → «no le gusta» → 她不喜欢茶.

## Detective de confusables (`/detective`)

- **10 pares** de caracteres que se parecen, solo del curso.
- Prompt: «¿Cuál significa X?».
- Dos caracteres grandes; feedback con el significado de ambos y el radical del
  correcto.
- Enlace directo a la ficha para ver la historia y las piezas.
- Las opciones se barajan; test de posición.
- Actividad registrada como `detective`.

Ejemplo: «¿Cuál significa uno mismo?» → 目 / 自; explicación:
«自 (zì) = uno mismo; 目 (mù) = ojo. El radical de 自 es 自 (nariz).»

## Corrección de contenido

La QA del detective mostró que 自 se presentaba como «nariz» (sentido del
radical) en vez de «uno mismo». Se añadieron sentidos propios para 自, 儿, 而,
示, 方 y 斤, con test.

## Verificación

```text
npx prettier --check src docs      limpio
npx tsc -b                         limpio
npx vitest run                     248 passed (248)
ESLint externo (teachers)          0 errores
Stylelint (teachers)               limpio
pnpm build                         ✓
```

### QA en navegador

- Cambia la intención: base 我今天喝茶, intención «beberé té mañana», opciones
  barajadas, acierto, feedback «Solo cambia el tiempo: 今天 → 明天», resumen.
- Con la primera opción siempre: 5/10, lo que confirma que la correcta no está
  fija.
- Detective: «¿Cuál significa uno mismo?», opciones 目/自, feedback y enlace a
  la ficha; con la primera opción siempre: 2/10.
- Practicar: 16 tarjetas, incluidas las dos nuevas.
- Móvil 390: 0 px de desbordamiento en ambas y en Practicar.

Capturas en `.screens/audit/`: `c20-transform.png`,
`c20-transform-summary.png`, `c20-detective.png`.

## Límites

- Cambia la intención es **opción múltiple**, no producción libre; el alumno
  elige entre transformaciones, no escribe la suya.
- Solo hay 20 transformaciones; se rota una tanda de 10 al día.
- El detective usa pares curados; no genera pares por similitud visual.
- Dos opciones por ronda dan un 50% de acierto por azar; el feedback y la
  explicación son la parte que enseña.
- Las actividades se registran, pero no entran en el FSRS ni en las misiones.
- La comprensión con evidencia («¿qué pasó en la escena?») queda para la
  siguiente ronda.
