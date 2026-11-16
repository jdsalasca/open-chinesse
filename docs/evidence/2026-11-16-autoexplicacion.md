# Autoexplicación tras el fallo (2026-11-16)

## Qué se añadió

Cuando fallas una pregunta de la práctica, la app pregunta **«¿Qué te falló?»** con cuatro
opciones cerradas (no texto libre):

- No conocía la palabra
- Confundí el significado
- No la reconocí de oído
- No supe ordenar la frase

Se puede ignorar («No lo sé») sin fricción. El motivo se guarda como **metadato** por palabra:

- En el **repaso**, la tarjeta avisa: «La última vez falló por …»; si fue de oído, añade
  «Escúchala antes de calificar».
- En **Progreso**, una sección «Por qué fallas» cuenta los motivos.
- **No toca FSRS**: el intervalo lo decide la calificación real, no la explicación. Es lo que
  recomienda la evidencia (Choffin et al., 2019): un motivo declarado no es un grado.

En los ejercicios de ordenar, el motivo «No supe ordenar la frase» se registra solo, sin
preguntar, para no añadir fricción a una tarea que ya es producción.

## Por qué así (evidencia)

| Hallazgo                                                                                                | Fuente                       |
| ------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Mostrar la respuesta correcta tras fallar mejora el recuerdo en vocabulario L2                          | Belardi et al., 2021         |
| Autoexplicar tras el error ayuda a corregir, con efectos no uniformes                                   | Zhang y Fiorella, 2024       |
| Opción múltiple y respuesta corta no difieren tanto como se cree; la dificultad de recuperación importa | Smith y Karpicke, 2014       |
| El motivo del fallo debe ser metadato, no un intervalo inventado                                        | Choffin et al., 2019 (DAS3H) |

## Evidencia

```bash
npx vitest run   # 111 passed (15 files)
npx tsc -b       # 0
pnpm lint        # 0 (19 advertencias conocidas)
```

Comprobado en navegador:

- `h3-01`: respuesta incorrecta → aparecen las cuatro opciones + «No lo sé».
- Elegir «No la reconocí de oído» → «Anotado…» y queda en `localStorage`.
- `#/stats` → «Por qué fallas»: «No supe ordenar la frase = 2», «No la reconocí de oído = 1».
- `#/review` → 爱好 muestra «La última vez falló por «No la reconocí de oído». Escúchala antes
  de calificar.»; 搬 y 帮忙, «No supe ordenar la frase».
