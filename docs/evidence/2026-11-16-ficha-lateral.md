# Ficha lateral en toda la app (2026-11-16)

## Qué cambió

La historia de un carácter ya no te saca de donde estás: se abre en un **panel lateral**
(escritorio) o **hoja inferior** (móvil) encima de la pantalla actual.

- Se abre desde **lección**, **repaso**, **historias** y el **menú contextual**.
- La pantalla de fondo **no se desmonta**: la tarjeta de la lección o la lectura siguen
  ahí al cerrar.
- **Navegación entre caracteres**: si abres 阿 dentro de 阿姨, el panel trae
  «← 1 / 2 →» y puedes pasar a 姨 sin volver atrás.
- Las piezas del árbol también abren el panel, así que se puede bajar de nivel sin
  perder la ficha anterior.
- «Página completa ↗» sigue existiendo para enlazar una ficha concreta (`#/caracter/好`).
- Cerrar con **Escape**, con la capa oscura o con la ✕. El scroll del fondo se bloquea
  mientras está abierto.

## Por qué

La revisión de terra marcó dos problemas: se perdía la lectura al abrir un carácter y
solo se podía consultar el primer carácter de una palabra. El panel resuelve los dos sin
duplicar pantallas: el estado queda detrás y el contexto viaja en `chars`.

## Evidencia

```bash
npx vitest run   # 126 passed (18 files)
npx tsc -b       # 0
pnpm lint        # 0 (19 advertencias conocidas)
pnpm build       # OK
```

Comprobado en navegador:

- `#/lesson/h3-01` → chip 阿 abre el panel con «1 / 2»; → muestra 姨 con «2 / 2»;
  Escape cierra y la tarjeta sigue en 阿姨.
- `#/historias/parque` → tocar 周 → enlace 周 → panel sobre la lectura con «1 / 2» y
  el título de la historia todavía detrás.

## Límites

- El panel no atrapa el foco en bucle (sí responde a Escape y devuelve el foco al cerrar
  por el navegador). Es una mejora pendiente de accesibilidad.
- No hay historial propio del panel: el botón atrás del navegador no lo cierra.
- La posición exacta de lectura se conserva porque la pantalla no se desmonta, pero no se
  guarda si recargas la página.
