# Ronda P3: biblioteca y perfil (2026-11-16)

## Diagnóstico

- **Practicar** era una columna de cuatro tarjetas idénticas de 720 px con un
  enlace de texto. En escritorio sobraba media pantalla; ninguna acción se
  distinguía de otra.
- **Historias** tenía una cabecera propia que no compartía ritmo con el resto.
- **Perfil** mostraba «Aprendidas … de 301 palabras» cuando el curso tiene 601, y
  contaba tarjetas creadas, no palabras repasadas. Los logros eran píldoras de
  texto sin icono ni descripción, distintos de los de la portada.

## Cambios

| Antes                                 | Ahora                                                        |
| ------------------------------------- | ------------------------------------------------------------ |
| Cuatro tarjetas apiladas en Practicar | Rejilla 2×2 con barra de color, icono, estado y CTA          |
| Sin cifras vivas                      | «6 pendientes» calculado de la cola real                     |
| Cabeceras distintas por pantalla      | `PageHeader` común con borde y jerarquía                     |
| «Aprendidas… de 301»                  | «Estudiadas… de 601», contadas desde el historial            |
| Logros como píldoras                  | Mismas insignias que la portada: icono, título y descripción |

## Detalle de Practicar

- **Repaso espaciado** (menta): muestra las tarjetas pendientes de hoy.
- **Tonos** (violeta): diez variantes de la misma sílaba.
- **Prueba de retención** (ámbar): hasta diez palabras a siete días.
- **Escucha** (azul): recuerda que la práctica de cada unidad ya entrena el oído.

La rejilla usa 2 columnas desde 720 px y 1 en móvil. Cada tarjeta entera es un
enlace; no hay botones anidados.

## Bug de datos corregido

El perfil sumaba `Object.keys(cards).length` y lo llamaba «Aprendidas». Eso cuenta
tarjetas creadas al abrir una unidad, no palabras estudiadas, y el total estaba
escrito a mano como 301 (el curso tiene 601). Ahora cuenta palabras únicas del
historial de repaso y usa `TOTAL_WORDS`.

## Evidencia

```text
npx vitest run    143 passed
npx tsc -b        limpio
pnpm lint         0 errores, 18 advertencias
pnpm build        ✓
```

Capturas en `.screens/audit/`:

- `r3-practice.png` — Practicar a 1440×900.
- `r3-practice-mobile.png` — Practicar a 390×844.
- `r3-stories2.png` — Historias con la cabecera común.

El perfil con sesión iniciada no se capturó en local porque el proxy de Vite no
tiene backend; el cambio es de datos y de marcado, y lo cubren `tsc -b` y la
revisión del diff. Se verificará en producción con la cuenta de prueba.

## Pendiente para P4

- Unificar Inmersión y Progreso con la misma cabecera.
- Revisión de contraste y foco con teclado en las pantallas nuevas.
- Valorar ocultar la barra inferior en el lector de historias.
