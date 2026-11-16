# Prueba de retención a siete días (2026-11-16)

## Qué se añadió

`#/prueba` es una prueba de **significado sin pistas** sobre las primeras diez
palabras que el aprendiz repasó. No comparte pantalla con el repaso: no revela
respuesta, no pide calificación y **no cambia el calendario FSRS**. Sirve para
ver qué queda siete días después, no para inflar el progreso.

| Estado                   | Qué ve el aprendiz                                                 |
| ------------------------ | ------------------------------------------------------------------ |
| Sin diez repasos         | «Aún no hay prueba. Se programa sola a los diez primeros repasos.» |
| Programada y aún no toca | «Todavía no toca» + fecha exacta + «Seguir repasando»              |
| Toca                     | Hasta diez preguntas de cuatro opciones (las palabras repasadas)   |
| Terminada                | Marcador y una frase explícita: **no cambia tu calendario**        |

El enlace está en **Practicar → Prueba de retención**, con el texto «Diez
palabras sin pistas, siete días después».

## Reglas que la prueba respeta

1. **La fecha manda.** `isDue()` impide abrirla antes de `dueAt`; una vez tomada
   (`takenAt`) no se repite. Sin esa puerta, el enlace de Practicar habría
   permitido hacerla al instante y la promesa «siete días» sería falsa.
2. **Es un espejo, no un jurado.** El resultado no toca XP, estrellas ni
   intervalos. La pantalla lo dice.
3. **La respuesta no cae siempre en el mismo sitio.** El test descubrió que la
   primera versión ponía el significado correcto en la posición 0 siempre; ahora
   el índice de la palabra decide dónde cae.
4. **Sobrevive al login.** `retention` viaja en `exportPayload()` y en
   `normalizePayload()`, así que entrar en otro dispositivo no borra la prueba
   ni su resultado.

## Auditoría filosófica (gpt-6.1-terra, solo lectura)

Terra señaló tres cosas y este cambio aplica dos:

- **La promesa se exageraba** al decir que cada palabra vuelve «justo antes de
  que la olvides» y que el repaso «hará el resto». Se cambió el texto de Home y
  del resumen de lección: el repaso «vuelve cuando toca», no garantiza nada.
- **Enter/espacio revelaban la respuesta sin escribir.** Ya no: sin texto, la
  tecla no hace nada; solo envía el intento escrito.
- **Falta práctica oral y de escritura.** No se simula aquí: la app lo deja
  fuera y lo documenta. Queda como la prioridad pedagógica siguiente, no como
  una promesa de producto.

## Evidencia

```text
npx vitest run       143 passed
npx tsc -b           sin errores
pnpm lint            0 errores, 19 advertencias (todas de pantalla, presupuesto intacto)
pnpm build           ✓ built
```

Capturas locales en `.screens/retencion/` (ignoradas por git, convención del repo):

- `2026-11-16-retencion-pendiente.png` — pregunta sin pistas.
- `2026-11-16-retencion-antes-de-tiempo.png` — «Todavía no toca» con fecha.
- `2026-11-16-retencion-resultado.png` — marcador con el aviso de que no altera
  el calendario.

La prueba manual en navegador recorrió los cinco pasos: opción incorrecta,
siguiente, cuatro preguntas más, resultado y comprobación de que
`localStorage['open-chinesse'].state.retention` guarda `score` y `takenAt`.

## Deuda conocida

- La prueba es de **reconocimiento** (elegir significado), no de producción.
- Solo se programa una vez; no hay segunda prueba a los 30 días.
- XP, estrellas y «dominadas» siguen siendo señales de uso, no de competencia
  comunicativa. La interfaz lo dice en el resultado y en Home, pero no hay
  evaluación oral.
