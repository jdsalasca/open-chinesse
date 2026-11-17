# Ronda C11: sesión mixta y reto del día (2026-11-16)

## Sesión mixta

- Nueva ruta `/mixta` y tarjeta en Practicar.
- Diez preguntas intercaladas de cuatro tipos:
  - **Significado**: hanzi → elegir el significado.
  - **Escucha**: audio → elegir el significado.
  - **Contexto**: frase con hueco → elegir el hanzi que falta.
  - **Tonos**: audio → elegir el pinyin con sus tonos.
- Generador propio (`lib/mixed.ts`): usa palabras ya estudiadas, opciones únicas
  de cuatro alternativas y reserva para contexto palabras cuyo ejemplo admite un
  hueco real.
- Corrección inmediata con la respuesta y una explicación; resumen con
  puntuación y «Otra tanda».
- Cada respuesta se registra como actividad `mixed`; no altera FSRS.

## Reto del día

- Tarjeta en Home entre la sesión y el progreso.
- Siete retos que rotan de forma determinista con la fecha: pedir un café,
  presentarse, comprar fruta, preguntar cómo llegar, escuchar un cuento, leer
  sobre el té o hacer una ronda de dictado.
- Cada reto enlaza a la pantalla que lo permite; no suma XP ni exige registro.
- Home ahora considera «empezado» al usuario con historial aunque no le queden
  tarjetas, para no ofrecerle la primera lección como si fuera nuevo.

## Evidencia

```text
npx vitest run                       196 passed (196)
npx tsc -b                           limpio
npx prettier --check src             limpio
pnpm lint                            0 errores, 9 avisos
ESLint externo (teachers)            0 errores
Stylelint (teachers)                 limpio
pnpm build                           ✓
```

### QA en navegador

- Home: tarjeta «Reto de hoy · Pide un café» con enlace a la cafetería.
- Sesión mixta: tanda de 10 con los cuatro tipos observados; audio en escucha y
  tonos; resumen «3 de 10»; «Otra tanda» reinicia.
- Practicar: nueve tarjetas, incluida Sesión mixta.
- Móvil 390×844: opciones en una columna, sin desbordamiento.

Capturas en `.screens/audit/`: `c11-home-challenge.png`, `c11-mixed.png`,
`c11-mixed-summary.png`, `c11-mixed-mobile.png`.

## Producción

- Desplegado `b9ee872` en `https://open-chinesse.eridu.top`.
- Home con «Reto de hoy · Pide un café» y enlace a la cafetería.
- Practicar con nueve tarjetas, incluida «Sesión mixta».
- `/mixta`: tanda de 10, primera pregunta de significado con cuatro opciones;
  los cuatro tipos se verificaron en local.
- Sin errores de consola distintos del 401 esperado sin sesión.

## Pendiente

- Shadowing y comprensión auditiva con pregunta.
- Glosa al pasar el cursor en ejemplos y escenarios.
- Segundo ejemplo por palabra.
