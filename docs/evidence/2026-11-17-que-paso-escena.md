# Ronda C21: ¿qué pasó en la escena? (2026-11-17)

## Mecánica

- **15 preguntas** sobre las micro-lecturas HSK 1.
- Cada pregunta tiene:
  - Dos resúmenes posibles; solo uno es correcto.
  - Una línea del texto que justifica la respuesta (índice de evidencia).
  - Explicación en español.
- Tanda de **8 escenas** al día, con opciones de resumen barajadas.

## Flujo

1. **Leer o escuchar** la escena. El texto se muestra en hanzi; el pinyin y la
   traducción están ocultos. Cada línea tiene audio.
2. **Elegir qué pasó** entre dos resúmenes. El feedback no revela todavía la
   línea de evidencia.
3. **Señalar la línea que lo justifica**. Las líneas se vuelven botones.
4. **Feedback doble**:
   - Acierto de resumen.
   - Acierto de evidencia.
5. Se revelan pinyin y traducción de todas las líneas, se marca la línea con
   «justifica» y se cita.
6. Resumen final con **dos puntuaciones**: resumen y evidencia.

## Ejemplos

- 「你好！」 → «¿Qué hacen al final?» → Se despiden → evidencia: 不客气。再见！
- 「去北京」 → «¿Cómo va a Pekín?» → En avión → evidencia: 明天我坐飞机去北京。
- 「多少钱？」 → «¿Pueden comprar el libro entre los dos?» → Sí: tienen veinte
  yuanes → evidencia: 我有十块，朋友有十块。

## Verificación

```text
npx prettier --check src docs      limpio
npx tsc -b                         limpio
npx vitest run                     250 passed (250)
ESLint externo (teachers)          0 errores
Stylelint (teachers)               limpio
pnpm build                         ✓
```

### QA en navegador

- Escena 1: tres líneas con audio, sin pinyin/traducción; pregunta con dos
  resúmenes barajados.
- Tras elegir «Se despiden», las líneas se vuelven seleccionables.
- Al elegir la tercera línea: «Evidencia correcta», cita, pinyin/traducción y
  botón «Siguiente escena».
- Con la primera opción siempre: 6/8 resúmenes; la posición correcta no está
  fija.
- Móvil 390: 0 px de desbordamiento.
- Practicar: 17 tarjetas, incluida la nueva.

Capturas en `.screens/audit/`: `c21-scene.png`, `c21-scene-evidence.png`,
`c21-scene-summary.png`.

## Límites

- Las preguntas son de comprensión **global o literal**; solo una requiere una
  inferencia sencilla (sumar diez y diez).
- Dos opciones por resumen dan un 50% de acierto por azar; la evidencia es la
  parte que exige volver al texto.
- Solo HSK 1: las micro-lecturas son las que tienen audio y 3–4 líneas.
- La evidencia es una sola línea; algunas respuestas se apoyan en dos.
- La actividad se registra, pero no entra en el FSRS ni en las misiones.
