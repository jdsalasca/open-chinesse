# Herramientas didácticas

Qué piezas técnicas existen para enseñar mandarín, cuáles están maduras y cuáles
son una trampa. Cada ficha termina en una decisión.

## Mapa de herramientas

| Herramienta                      | Madurez                     | Decisión                     |
| -------------------------------- | --------------------------- | ---------------------------- |
| SRS (FSRS)                       | Alta, con benchmark abierto | **Usada**                    |
| TTS del navegador                | Media, depende del sistema  | **Usada** con degradación    |
| TTS pregrabado (`edge-tts`)      | Alta, voz consistente       | Backlog (R5)                 |
| ASR para tonos                   | Baja para evaluación fina   | **Descartada** en v1         |
| Trazos (`hanzi-writer`)          | Alta, datos abiertos        | Backlog (R5)                 |
| Diccionario (CC-CEDICT)          | Alta, CC BY-SA              | Usado en investigación       |
| Pinyin automático (`pinyin-pro`) | Alta                        | No hace falta: datos curados |

## SRS — `srs.md`

FSRS-6 con retención objetivo 0.90. La decisión y su evidencia están en
[`../didactic-tools/srs.md`](srs.md).

## Pronunciación — `pronunciation.md`

Audio en cada tarjeta, pinyin coloreado por tono y atajos de teclado. Detalle en
[`pronunciation.md`](pronunciation.md).

## Escritura — `handwriting.md`

Sin lienzo de trazos en v1. Evidencia y plan en [`handwriting.md`](handwriting.md).

## Lo que no usamos y por qué

### Reconocimiento de voz para evaluar tonos

La `Web Speech API` transcribe texto, no evalúa contornos de F0. Un "score de
pronunciación" calculado sobre la transcripción premia acertar la sílaba y castiga
el tono, que es justo lo que hay que entrenar. **Un número falso es peor que no
tener número.**

Alternativa honesta cuando haya presupuesto: grabar, comparar con un modelo de
referencia (p. ej. un clasificador de tonos entrenado con corpus nativo) y mostrar
el contorno de F0 del usuario junto al del hablante. Eso es un proyecto aparte.

### Gamificación con vidas y corazones

Los "hearts" convierten un error en una pérdida y empujan a pagar o a abandonar.
La evidencia de _gamification misuse_ (ACM L@S 2022) muestra el patrón. No se
implementan.

### Rachas con pérdida

Ver [`../gamification/README.md`](../gamification/README.md).

## Criterio de adopción

Una herramienta entra si cumple tres condiciones:

1. Existe una implementación mantenida y con licencia compatible.
2. El beneficio es medible en el bucle de aprendizaje, no solo en la sensación.
3. Si falla, la app sigue funcionando.
