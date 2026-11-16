# Auditoría de terra y correcciones (2026-11-16)

Seis preguntas incómodas, respuestas sin halagos. Esto es lo que se arregló y lo que
queda como deuda declarada.

## Arreglado en esta ronda

| Hallazgo                                                                 | Corrección                                                                            |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| La historia «HSK 1» usaba vocabulario de HSK 2 y 3 (起床, 早上, 面包)    | Pasa a nivel 2, 面包 → 米饭 y se regeneró su audio                                    |
| «Aprendidas» contaba tarjetas creadas al abrir la lección, no estudiadas | Ahora «Estudiadas»: palabras con al menos un repaso real                              |
| La sesión no encadenaba tareas                                           | Barra «Sesión de hoy» con tres pasos y botón «Seguir con…» en repaso, lección y tonos |

También se corrigió un error propio: al crear el store de la sesión diaria sobrescribí el
store de autenticación (`store/session.ts`). `tsc` lo detectó; se restauró desde git y el
nuevo pasó a `store/daily-session.ts`.

## Deuda que la auditoría deja sobre la mesa (no maquillada)

1. **El quiz de la lección es fijo**: seis preguntas deterministas por unidad; repetir
   permite memorizar opciones. Falta rotación por intento.
2. **El repaso permite revelar sin responder** y admite pinyin sin tonos: la señal que
   alimenta FSRS es más débil de lo que debería.
3. **Una sola voz TTS** para todo el audio; falta variedad y validación nativa.
4. **Sin evaluación de aprendizaje**: XP, rachas y tarjetas miden uso. La propuesta de
   terra (prueba inicial y diferida a 7/30 días con palabras reservadas) no está hecha.
5. **La micro-pregunta de error es autorreporte**, no autoexplicación real: elegir un
   motivo no explica por qué la respuesta es correcta.
6. **La graduación de las historias** solo está comprobada a mano en una: no hay test que
   verifique que cada nivel usa solo vocabulario de ese nivel.

## Evidencia

```bash
npx vitest run   # 132 passed (20 files)
npx tsc -b       # 0
pnpm lint        # 0 (19 advertencias conocidas)
pnpm build       # OK (audio de la historia regenerado)
```

Comprobado en navegador:

- Portada: «Estudiadas 41 / 601» (repasos reales), cuenta intacta («Entrar»).
- Botón de la sesión → `#/review` con barra «Sesión de hoy · Repaso · Lección · Tonos».

## Próxima ronda sugerida

1. Rotación del quiz y obligar un intento escrito antes de revelar en el repaso.
2. Test de graduación de historias (cada nivel solo con vocabulario ≤ su nivel).
3. Prueba diferida de 7 días con 20 palabras reservadas, como primera métrica de
   aprendizaje real.
