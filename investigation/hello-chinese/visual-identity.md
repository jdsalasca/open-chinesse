# Identidad visual

Extraída del CSS servido por `hellochinese.cc` y adaptada a una app de estudio
densa. Los valores hex son los que usa su web; **no se copian activos**.

## Paleta observada

| Uso               | Valor               | Nota                 |
| ----------------- | ------------------- | -------------------- |
| Acento principal  | `#00ca72`           | Variable `--hlColor` |
| Degradado héroe   | `#00e393 → #00baa1` | Verde a teal         |
| Degradado rosa    | `#ff8491 → #ff4658` | Estados alternos     |
| Degradado violeta | `#b29bff → #6242ff` |                      |
| Degradado azul    | `#9bc7ff → #2699ff` |                      |
| Degradado pie     | `#00d2b6 → #00ee9a` |                      |
| Tarjeta crema     | `#fff9e5`           | Fondo pastel         |
| Tarjeta lila      | `#f3f2ff`           |                      |
| Tarjeta rosa      | `#ffeff4`           |                      |
| Tarjeta melocotón | `#fff4eb`           |                      |
| Tarjeta celeste   | `#e3f9ff`           |                      |
| Tarjeta menta     | `#dffff3`           |                      |

Tipografía: **Poppins** (400, 500, 700, 900). Formas muy redondeadas, ilustración
con volumen, sombras suaves y mucho aire.

## Adaptación a Open Chinesse

| Token        | Valor     | Por qué                                                           |
| ------------ | --------- | ----------------------------------------------------------------- |
| `$mint`      | `#00b86b` | Acento con contraste AA sobre blanco (el `#00ca72` puro no llega) |
| `$mint-dark` | `#008f57` | Hover y texto sobre pastel                                        |
| `$teal`      | `#00a99d` | Secundario, degradados                                            |
| `$pink`      | `#ff5c7a` | Errores suaves y acentos                                          |
| `$violet`    | `#6b5bff` | Nivel, logros                                                     |
| `$amber`     | `#e8a008` | Advertencia, tono 2                                               |
| `$ink`       | `#1f2430` | Texto principal (frío, no marrón)                                 |
| `$surface`   | `#ffffff` | Tarjetas                                                          |
| `$paper`     | `#f6f9fb` | Fondo                                                             |
| `$line`      | `#e3e9f0` | Bordes                                                            |

Se mantiene la lógica de HelloChinese (verde + pasteles + formas redondeadas) y se
corrige lo que una app de estudio necesita: contraste suficiente, jerarquía
tipográfica y densidad.

## Tipografía

- **Display y UI:** Poppins (500/600/700), cargada desde Google Fonts con
  `display=swap`; si falla, cae a `Source Sans 3` y `system-ui`.
- **Hanzi:** `Noto Sans SC`, `Microsoft YaHei`, `PingFang SC`.
- **Datos:** `JetBrains Mono` para cifras tabulares.

## Formas y movimiento

| Elemento          | Valor                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| Radio tarjeta     | 20 px                                                                 |
| Radio píldora     | 999 px                                                                |
| Sombra suave      | `0 1px 2px rgb(31 36 48 / 5%), 0 12px 32px -18px rgb(31 36 48 / 35%)` |
| Sombra flotante   | `0 24px 60px -32px rgb(31 36 48 / 40%)`                               |
| Duración estándar | 160 ms                                                                |
| Curva             | `cubic-bezier(0.2, 0.8, 0.2, 1)`                                      |

Todo movimiento respeta `prefers-reduced-motion`.

## Colores de tono (pinyin)

| Tono   | Color     | Contraste sobre blanco |
| ------ | --------- | ---------------------- |
| 1      | `#e0455c` | 4,7:1                  |
| 2      | `#b5730a` | 4,8:1                  |
| 3      | `#0f8f7f` | 4,9:1                  |
| 4      | `#2f5fe0` | 5,4:1                  |
| Neutro | `#6b7280` | 4,8:1                  |

Cambian respecto a la versión anterior (rojo/ámbar/verde/azul) para no chocar con
el verde de marca: el tono 3 pasa a teal y el 1 a rosa-rojo.

## Anti-patrones

- Degradados en superficies de lectura (cansan).
- Texto blanco sobre `#00ca72` (contraste 2,2:1).
- Pasteles para texto; solo como fondo.
