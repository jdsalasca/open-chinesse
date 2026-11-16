# Pronunciación y tonos

## Evidencia

| Estudio                               | Resultado                                 |
| ------------------------------------- | ----------------------------------------- |
| Wang, Spence & Jongman (1999)         | +21 % de identificación; retenido 6 meses |
| Metaanálisis HVPT (2025, 79 estudios) | g = 0.92 pre-post; g = 0.67 vs control    |
| Frontiers (2024, N=290)               | T3 es el más difícil; T1 el más fácil     |
| Variabilidad de hablantes (2020)      | Multihablante retiene la mejora 6 meses   |

## Qué implementamos

- **Audio en todas las tarjetas**, con atajo `P`.
- **Pinyin coloreado por tono**: T1 rojo, T2 ámbar, T3 verde-azulado, T4 azul,
  neutro gris. El color es información, no decoración.
- **Frase de ejemplo también con audio**: el tono se aprende en contexto.
- **Orden de contenido**: los tonos 3 y 2 llegan después de los fáciles.

## Qué falta para hacer HVPT de verdad

1. Varios hablantes (mínimo 3) por palabra.
2. Feedback correctivo tras cada intento.
3. Tarea de identificación de tono aislado, no solo escucha pasiva.

La ruta barata: generar MP3 con `edge-tts` (voces `zh-CN` distintas) y servirlos
como estáticos. Coste: ~301 palabras × 3 voces × ~15 KB ≈ 13 MB.

## Límites

- `speechSynthesis` depende de las voces instaladas; en Linux puede no haber
  ninguna `zh-CN`.
- Ningún estudio mide transferencia a producción espontánea en una app web.

## Referencias

- Wang, Y., Spence, M. & Jongman, A. (1999). _JASA_, 106(6).
- _HVPT: a meta-analysis of L2 perceptual training studies_ (2025). SSLA.
- _Enhancing lexical tone learning…_ (2024). Frontiers in Psychology, 15.
