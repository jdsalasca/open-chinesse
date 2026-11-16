# Sistema de componentes

Objetivo: que cualquier pantalla nueva se arme con piezas existentes, sin CSS
suelto y sin reinventar botones.

## Tokens (`src/styles/_tokens.scss`)

- **Color:** `$mint`, `$mint-dark`, `$teal`, `$pink`, `$violet`, `$amber`, `$ink`,
  `$surface`, `$paper`, `$line`, y 6 pasteles de tarjeta.
- **Espacio:** escala de 4 px (`$space-1`…`$space-8`).
- **Radio:** `$radius-sm` 8, `$radius` 14, `$radius-lg` 20, `$radius-pill`.
- **Sombra:** `$shadow-sm`, `$shadow-md`, `$shadow-lg`.
- **Movimiento:** 160 ms con `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- **Tipografía:** Poppins (UI), Noto Sans SC (hanzi), JetBrains Mono (cifras).

## Inventario

| Componente     | API                                                   | Estados                        |
| -------------- | ----------------------------------------------------- | ------------------------------ |
| `Button`       | `variant`, `size`, `icon`, `block`                    | hover, focus, active, disabled |
| `Card`         | `tone` (surface, mint, cream, lilac, pink, sky), `as` | —                              |
| `Badge`        | `tone`, `icon`                                        | —                              |
| `ProgressRing` | `value`, `max`, `label`, `size`                       | animado                        |
| `StatTile`     | `label`, `value`, `hint`, `tone`                      | —                              |
| `Icon`         | `name`, `size`                                        | decorativo (`aria-hidden`)     |
| `Confetti`     | `pieces`, `active`                                    | respeta `reduced-motion`       |
| `AudioButton`  | `text`, `label`, `compact`                            | reproduciendo                  |
| `Pinyin`       | `pinyin`, `showToneNumber`                            | 5 tonos                        |

## Reglas

1. Un componente nuevo solo si aparece **dos veces** o tiene estado propio.
2. Nada de estilos inline salvo porcentajes calculados (`width`, `height`).
3. Todo control interactivo tiene foco visible propio.
4. Los iconos son SVG inline de 24×24, `stroke-width` 1,8, sin dependencias.
5. Las variantes se resuelven con clases (`button--primary`), no con `style`.

## Accesibilidad mínima por componente

- `Button`: `type="button"` por defecto, área ≥ 40×40 px, foco con anillo de 2 px.
- `ProgressRing`: `role="img"` + `aria-label` con el valor; el número también en
  texto visible.
- `Confetti`: `aria-hidden="true"`; nunca es la única señal de un logro.
- `Badge`: texto, no solo color.

## Lo que no entra

- Librería de UI externa (peso y estilo ajeno).
- Storybook (coste de mantenimiento para 8 componentes).
- Tema oscuro hasta que el claro esté afinado.
