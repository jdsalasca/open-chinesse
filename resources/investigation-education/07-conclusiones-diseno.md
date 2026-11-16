# 07 — Conclusiones de diseño

Este documento cierra la revisión: qué se decidió, con qué evidencia y qué se dejó
fuera a propósito. Es la referencia para no re-litigar el diseño en cada ronda.

## Las seis decisiones

### 1. El repaso es recuperación, no relectura

**Decisión:** la tarjeta muestra el estímulo y oculta la respuesta hasta que el
usuario intenta recordar. Las tarjetas maduras piden **teclear el pinyin**; la
lección inicial usa opción múltiple porque ahí se codifica, no se evalúa.

**Evidencia:** Roediger & Karpicke (2006) —a la semana, examinarse supera a releer
aunque la sensación subjetiva diga lo contrario—; Rowland (2014) g = 0.50, y el
recall supera al reconocimiento (g = 0.57 vs 0.31); Adesope (2017) confirma frente a
subrayar y mapear.

**Costo asumido:** la app se siente más difícil que una de relectura. Es la
dificultad deseable que produce el efecto.

---

### 2. La programación la hace FSRS-6, no una caja de Leitner

**Decisión:** `ts-fsrs` 6.0 con retención objetivo 0.90, cuatro calificaciones e
intervalo visible en cada botón.

**Evidencia:** benchmark abierto con 350M repasos: FSRS-6 supera a Anki SM-2 en el
99,6% de los usuarios; FSRS v4 ya bajaba el log loss de 0.3945 (media) a 0.3726.
Settles & Meeder (2016) muestran en producción (Duolingo) que un modelo entrenable
mejora la retención diaria ~12% frente a Leitner.

**Costo asumido:** los pesos son de fábrica; sin historial propio no se optimizan.
La crítica metodológica de 2025 al benchmark se acepta: FSRS predice recuerdo, no
maximiza aprendizaje por minuto.

---

### 3. Cada palabra vive en una frase

**Decisión:** toda palabra nueva se presenta con hanzi, pinyin, significado, audio y
una frase de ejemplo traducida. El repaso también la muestra al revelar.

**Evidencia:** Krashen (1985) puso el input comprensible en el centro; la crítica
(Liu 2015) demuestra que no es suficiente, y Lichtman (2021) confirma que sigue
siendo necesario. La producción (Swain) y la interacción (Long) aportan lo que
falta. Una app sin tutor puede ofrecer input de calidad y forzar producción escrita;
la interacción oral queda fuera.

**Costo asumido:** no prometemos conversación. El objetivo de la v0.1 es
reconocimiento y fonología, no fluidez oral.

---

### 4. El tono se ve y se oye

**Decisión:** pinyin coloreado por tono, audio en palabra y frase, atajo `P` para
escuchar. Contenido ordenado para que los tonos 3 y 2 aparezcan después.

**Evidencia:** Wang et al. (1999): +21% de identificación y retención a 6 meses con
HVPT. Metaanálisis 2025: g = 0.67 frente a control, g = 0.92 pre-post, con retención
sin caída. La jerarquía de dificultad (T3 < T2 ≈ T4 < T1) está replicada
(Frontiers 2024, N = 290).

**Costo asumido:** `speechSynthesis` da una sola voz por sistema. El HVPT real pide
varios hablantes: queda para R5 con MP3 pregrabados (`edge-tts`).

---

### 5. Reconocer y teclear antes que dibujar trazos

**Decisión:** no hay lienzo de escritura en la v0.1. Se implementa reconocimiento
(hanzi → significado) y producción fonológica (significado → pinyin).

**Evidencia:** Guan et al. (2011) muestran efectos disociados: escribir fortalece
forma→significado; teclear pinyin fortalece forma→sonido. Zhang (2021, n = 108)
encuentra que el tecleo iguala lectura y supera retención acumulada. El estudio de
2026 (n = 28, 40 h) recomienda tecleo temprano y escritura dirigida después.

**Costo asumido:** el usuario no aprende a escribir a mano. Es una fase posterior
del currículo, no un olvido; el roadmap la incluye con `hanzi-writer`.

---

### 6. Gamificación que no secuestra el objetivo

**Decisión:** racha informativa, sin leaderboards, sin notificaciones, sin mecánicas
de pérdida; borrar el progreso sin fricción.

**Evidencia:** ACM L@S 2022 documenta "gamification misuse" en Duolingo (usuarios
optimizando métricas en vez de aprender); Barasch & Silverman (2023) muestran que al
romperse la racha la gente abandona o cambia de idioma; el estudio de 2026 reporta
que 40% asocia la racha con presión y 45% los leaderboards con malestar.

**Costo asumido:** menor retención diaria que un diseño agresivo. Se elige no dañar.

---

## Lo que NO se construyó (y por qué)

| Descartado | Razón |
|---|---|
| Backend / cuentas | No hacen falta para validar el bucle de aprendizaje; localStorage con esquema versionado es suficiente. |
| Next.js / SSR | La app vive detrás de una interacción, no necesita SEO ni streaming. |
| Reconocimiento de voz | `Web Speech API` no evalúa tonos con fiabilidad; un score falso es peor que no tenerlo. |
| Leaderboards y ligas | Evidencia de presión y distracción del objetivo. |
| Escritura de trazos en v0.1 | Costo de datos alto; la evidencia favorece teclear primero. |
| PWA / offline | Valioso, pero no cambia la calidad del aprendizaje en la primera versión. |

## Cómo se verificó

- 51 pruebas automatizadas sobre el dominio (FSRS, cola, métricas, pinyin, quiz).
- Sesión E2E real: lección y 24 repasos solo con teclado, sin errores de consola, con
  progreso persistente tras recargar.
- Revisión visual en escritorio (1280×1000) y móvil (390×844).
- Build de producción: 89,8 kB gzip de JS.

## Qué haría cambiar estas conclusiones

1. **Datos propios de retención**: si la precisión real a 30 días cae por debajo del
   85%, revisar el orden del contenido antes que el algoritmo.
2. **Un hablante nativo corrigiendo el contenido**: puede invalidar frases o
   traducciones puntuales.
3. **Pruebas de usabilidad**: si el pinyin tecleado genera abandono, bajar la
   exigencia a reconocimiento en las primeras repeticiones.
