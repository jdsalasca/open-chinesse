# Ronda C10: China en chino (2026-11-16)

## Contenido

Tres lecturas HSK 3 sobre cultura y vida cotidiana:

- **一杯茶** (una taza de té): cuándo se toma, cómo se recibe a un invitado y
  los tipos de té.
- **北京的早上**: mayores en el parque, café, bicicletas y niños camino de la
  escuela.
- **一家人的晚上**: la mesa, los platos, los niños corriendo y el té después de
  comer.

Cada una tiene ocho líneas con hanzi, pinyin, traducción y una explicación
gramatical o de vocabulario, más una pregunta de comprensión con tres opciones y
respuesta razonada.

## Mecánica

- Ruta `/china` con listado y `/china/<id>` para cada lectura.
- Reproductor de audio por línea con pausa, seguir y detener; la línea activa se
  ilumina y la página se desplaza sola.
- Voz un poco más lenta que una historia normal (`length_scale 1.1`).
- Pregunta final con una sola respuesta correcta; al elegir se marca la correcta
  y se explica por qué.
- Tarjeta «China en chino» en Practicar.

## Validación

- Test de contenido: solo caracteres de palabras del curso, pinyin/traducción/
  explicación en todas las líneas, ids únicos y exactamente una opción correcta
  por pregunta.
- 24 audios nuevos generados; duraciones de 1,65 a 2,25 s para las primeras
  líneas, sin locuciones truncadas.

## Evidencia

```text
npx vitest run                       189 passed (189)
npx tsc -b                           limpio
npx prettier --check src             limpio
pnpm lint                            0 errores, 9 avisos
ESLint externo (teachers)            0 errores
Stylelint (teachers)                 limpio
pnpm build                           ✓
```

### QA en navegador

- Listado: tres tarjetas con era, nivel y duración; sin desbordamiento en móvil.
- Lector: ocho líneas y ocho explicaciones; «Escuchar la lectura» activa
  «Línea 1 de 8», ilumina la línea y avanza.
- Pregunta: la opción correcta queda marcada y el feedback cita la línea del
  texto; las demás quedan apagadas.
- Practicar: ocho tarjetas, incluidas Dictado, Cuentos y China en chino.

Capturas en `.screens/audit/`: `c10-china-list.png`, `c10-china-reader.png`,
`c10-china-quiz.png`, `c10-china-mobile.png`.

## Pendiente

- Sesión inmersiva mixta y reto del día.
- Shadowing y comprensión auditiva con pregunta.
- Glosa al pasar el cursor en estas lecturas (hoy la explicación va por línea).
