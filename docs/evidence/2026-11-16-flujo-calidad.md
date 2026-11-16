# Ronda C5: flujo y contrato de calidad (2026-11-16)

## Diagnóstico

Terra revisó el código en solo lectura y confirmó cinco fallos de flujo, además
de la deuda de tamaño:

1. El resumen de repaso era inalcanzable: al agotar la cola se mostraba «Estás al
   día».
2. Una unidad aparecía completada al abrir la lección, sin recorrerla.
3. El XP de ayer seguía visible hasta la siguiente actividad.
4. El teclado global del repaso cancelaba Enter y espacio sobre botones.
5. La ficha de carácter declaraba `aria-modal` sin contener ni devolver el foco.

La deuda medida con el ESLint externo era: Home 237 líneas y complejidad 21,
Review 263/29, Lesson 263/19, Stats 132, Profile 122, Login 103/11; 8
`autoFocus`; keys por índice en cuatro componentes; cuatro errores SCSS.

## Cambios

| Antes                                            | Ahora                                                             |
| ------------------------------------------------ | ----------------------------------------------------------------- |
| «Estás al día» tras terminar el repaso           | «Sesión terminada» con el número de repasos y el próximo repaso   |
| Unidad completada al abrir la lección            | Completada solo al registrar la lección (`stars`)                 |
| `completedUnits` derivado de tarjetas            | Eliminado; la ruta usa `stars`                                    |
| XP de hoy congelado hasta la siguiente actividad | `useDayRefresh` al cargar y en `visibilitychange`                 |
| Enter/espacio interceptados sobre botones        | El manejador ignora controles nativos y campos editables          |
| 8 `autoFocus`                                    | `useEnterKey` + `useFocusOnMount`/`ref` programático              |
| Keys por índice                                  | `withKeys` (texto + repetición) en pinyin, piezas, migas y textos |
| Ficha sin trampa de foco                         | Foco al abrir, Tab atrapado, Escape y retorno al origen           |
| Pantallas monolíticas                            | Componentes ≤40 líneas y complejidad ≤8                           |

Además se corrigieron dos bugs introducidos por el propio refactor y detectados
en la QA de navegador:

- El manejador de Enter del padre se desactivó por error durante la fase de
  aprendizaje porque el primer quiz era de tipo «ordenar».
- El modo «ordenar» recibía `next` (que no hace nada sin opción elegida) en vez
  de `finish`; la frase correcta no avanzaba ni con Enter ni con clic.

Y dos detalles de credibilidad:

- El aviso de fallo decía «La última vez falló por…» justo después de pulsar
  «No lo sé»; ahora dice «Fallaste por…».
- `CharacterLinks` usaba `key={char}` y avisaba por caracteres repetidos (谢谢).

### Revisión de terra sobre el commit

Terra señaló dos bugs reales, ya corregidos y verificados en navegador:

- **Repaso consecutivo:** el estado de la pregunta se reiniciaba solo al cambiar
  `wordId`; si una tarjeta se reencolaba y volvía a ser la siguiente (misma
  palabra, distinto cursor), seguía revelada y se podía calificar sin responder.
  Ahora el reinicio depende del cursor (`useReviewTyping(queue.cursor)`).
- **Atajos con la ficha abierta:** Enter avanzaba la lección y las teclas 1–4
  calificaban el repaso por detrás del diálogo. `useEnterKey` y el teclado del
  repaso ignoran eventos mientras exista `[aria-modal="true"]`.

Queda como limitación conocida, sin tocar migraciones: un usuario con datos
anteriores al esquema 3 tiene `stars` vacío y verá sus unidades como pendientes.
La app lleva en producción desde el esquema 9; se documenta en vez de reescribir
progreso ajeno.

## Evidencia

```text
npx vitest run                                     176 passed (176)
npx tsc -b                                         limpio
npx prettier --check src                           limpio
pnpm lint (oxlint + prettier)                      0 errores, 9 advertencias
eslint externo (teachers) sobre src                0 errores, 1 aviso preexistente
stylelint (teachers) sobre src/**/*.scss            limpio
pnpm build                                         ✓
```

### QA en navegador (Chromium, 390×844 y escritorio)

- Home: hero, sesión, progreso y ruta; `scrollWidth === clientWidth` (sin
  desbordamiento horizontal).
- Repaso con una tarjeta vencida: input enfocado, «No lo sé» revela pinyin,
  significado y audio; al calificar «Bien» aparece «Sesión terminada · 1
  repaso» y «El próximo repaso toca en 6 d.».
- Lección: Enter avanza de 1/11 a 2/11; Enter sobre el botón enfocado avanza
  exactamente uno; 11 avances entran a la práctica; el ejercicio de ordenar
  queda correcto y avanza con clic y con Enter; el resumen registra 1 de 6 y
  +25 XP.
- Repaso reencolado: al calificar «Otra vez» una tarjeta que vuelve en la misma
  sesión, la siguiente pregunta se muestra sin revelar, con el campo vacío y
  enfocado (antes conservaba la respuesta).
- Ficha abierta: Enter no avanza la lección y las teclas 1–4 no califican por
  detrás; al cerrar, los atajos vuelven a funcionar.
- Ficha de carácter: al abrir, el foco está en `.drawer__panel.is-active`; 14
  Tab consecutivos permanecen dentro del panel; Escape cierra y devuelve el
  foco al botón «Ver el origen del carácter 你».
- Historias: glosa por palabra, enlaces de carácter y sin avisos de keys
  duplicadas.

Capturas en `.screens/audit/` (ignoradas por git): `c5-home.png`,
`c5-home-mobile.png`, `c5-review-mobile.png`, `c5-review-summary.png`.

## Producción

- Desplegados `403b0f8` y luego `6bb3b44` en
  `https://open-chinesse.eridu.top`; health del contenedor OK.
- `/` y `/api/health` responden 200; `/api/me` 401 es el comportamiento esperado
  en modo invitado.
- Lección `h1-01` en producción: Enter avanza de 1/11 a 2/11.
- Único error de consola: el 401 de `/api/me` sin sesión.

## Pendiente

- Dividir `Scenarios.tsx` (564 líneas) y `_home.scss` (728 líneas).
- Llevar el ancho dinámico de las barras de progreso a una variable CSS sin
  `style` inline.
- Unificar el tipo de `Miss` exportado para las props de Review.
- Migración opcional para usuarios anteriores al esquema 3 (`stars` vacío).
