# 04 — Tonos: entrenamiento perceptual (HVPT)

**Pregunta:** ¿se puede entrenar el oído adulto para distinguir los cuatro tonos?
¿Cómo influye el material de audio?

## Hallazgos

### Wang, Spence & Jongman (1999)
*Training American listeners to perceive Mandarin tones.*
JASA, 106(6), 3649–3658. DOI: 10.1121/1.428217

8 aprendices, 8 sesiones en 2 semanas con **alta variabilidad de hablantes** (HVPT).
Resultados: +21% de precisión del pretest al postest, +18% de generalización a
estímulos nuevos, +25% a hablantes nuevos, y **la mejora se mantuvo a los 6 meses**
(+21% sobre el pretest).

### Metaanálisis HVPT (2025)
*High variability phonetic training (HVPT): A meta-analysis of L2 perceptual training
studies.* Studies in Second Language Acquisition. DOI: 10.1017/S0272263125000352

79 estudios. Efecto global **g = 0.92** (pre-post, k=96) y **g = 0.67** (vs. control,
k=32). Retención a 6 meses sin caída significativa. Moderadores relevantes: número de
hablantes, tipo de tarea, tiempo total de entrenamiento y tipo de etiqueta de respuesta.

### Percepción de tonos en L2 (2024)
*Enhancing lexical tone learning for second language speakers: effects of acoustic
properties in Mandarin tone perception.* Frontiers in Psychology, 15, 1403816.
DOI: 10.3389/fpsyg.2024.1403816

N=290. Jerarquía de dificultad consistente: **Tono 3 es el más difícil; Tono 1 el más
fácil** (T3 < T2 ≈ T4 < T1). Manipular F0 y duración ayuda de forma **específica por
tono** (expandir F0 ayuda a T2/T3 y estorba a T1/T4; alargar ayuda a T3/T4). El
entrenamiento perceptual mejora y generaliza a estímulos nuevos salvo para T3.

### Variabilidad de hablantes
- *The role of talker variability in the perceptual learning of Mandarin tones* (2020,
  JSLP): grupo multihablante supera al de un solo hablante y **retiene la mejora 6
  meses**.
- *High vs low talker variability* (2019, PMC6690337): ventaja de baja variabilidad en
  los estímulos de entrenamiento; sin beneficio claro de alta variabilidad en
  generalización. Conclusión práctica: **variar hablantes es bueno, pero no mágico**.

## Implicaciones para Open Chinesse

1. **Audio en cada tarjeta**, no como opción escondida: botón de altavoz visible y
   atajo de teclado.
2. **Pinyin coloreado por tono** (T1 rojo, T2 ámbar, T3 verde, T4 azul, neutro gris) y
   punto de tono en las tarjetas: el tono es información de primer nivel, no detalle.
3. **Orden de dificultad respetado**: los tonos 3 y 2 aparecen más tarde en el
   currículo, y el repaso los trata igual que cualquier otro ítem (el algoritmo de
   memoria no sabe de tonos; la secuencia de contenido sí).
4. **Una voz por ahora, varias en el backlog.** `speechSynthesis` da una voz del
   sistema; para HVPT real se necesitan MP3 de varios hablantes (viable con `edge-tts`,
   R5).
5. **La frase de ejemplo también se reproduce**: el tono se aprende en contexto, no en
   sílabas aisladas.

## Límites

- HVPT requiere feedback correctivo y varios hablantes; la v1 solo cumple lo primero.
- `speechSynthesis` no permite controlar calidad ni variedad de hablantes; en Linux
  puede no haber voz `zh-CN`.
- Ningún estudio mide transferencia a producción oral espontánea en una app.
