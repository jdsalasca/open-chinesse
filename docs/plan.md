# Plan — Open Chinesse (web)

Clon educativo de código abierto para aprender chino mandarín desde cero, pensado
para hispanohablantes. La técnica no es decorativa: cada decisión de producto viene
de la literatura revisada en `resources/investigation-education/`.

## Objetivo de la v1

Que una persona sin conocimiento de chino pueda, en una sesión de 10 minutos:

1. Aprender 12 palabras nuevas con audio, pinyin y una frase de ejemplo.
2. Ser evaluada con recuperación activa (no reconocimiento pasivo).
3. Recibir un calendario de repaso personalizado (FSRS) y volver al día siguiente.

## No-goals de la v1

- Escritura a mano / orden de trazos (se evalúa en R5; la evidencia es mixta y el
  costo de datos es alto).
- Cuentas, sincronización multidispositivo, backend.
- Social, ranking, leaderboards.
- Contenido más allá de HSK 1 + esenciales (72 palabras).

## Técnicas incorporadas (y por qué)

| Técnica                           | Decisión en el producto                           | Evidencia                                                              |
| --------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| Práctica de recuperación          | Repaso = recall con feedback, nunca relectura     | Roediger & Karpicke 2006; Rowland 2014 (g=0.50); Adesope 2017          |
| Repetición espaciada FSRS         | `ts-fsrs` FSRS-6, retención objetivo 90%          | Benchmark SRS: 350M repasos, superioridad 99.6% vs SM-2                |
| Producción escrita (pinyin)       | Tarjetas maduras exigen teclear el pinyin         | Guan et al. 2011 (escritura alfabética fortalece ortografía→fonología) |
| Input comprensible                | Cada palabra nueva aparece en una frase           | Krashen 1985; crítica: Liu 2015, Lichtman 2021                         |
| Entrenamiento perceptual de tonos | Audio en cada tarjeta + pinyin coloreado por tono | Wang et al. 1999 (+21%); HVPT meta 2025 (g=0.92/0.67)                  |
| Interleaving                      | La cola de repaso mezcla unidades                 | Rowland 2014 (heterogeneidad); práctica distribuida                    |
| Gamificación sobria               | Racha informativa, sin castigo ni leaderboard     | Barasch & Silverman; ACM L@S 2022 (gamification misuse)                |

## Arquitectura

```
src/
  data/        contenido HSK1 (palabras, unidades, frases)
  srs/         adaptador ts-fsrs + cola de repaso (puro, testeado)
  store/       estado del aprendiz + persistencia local
  lib/         audio (speechSynthesis), pinyin/tonos, router hash
  screens/     Home · Lesson · Review · Stats
  components/  piezas de UI reutilizables
  styles/      SCSS: tokens, mixins, parciales por pantalla
```

Sin backend. Progreso en `localStorage` con versión de esquema y migración.

## Rondas

### R0 — Andamiaje y evidencia

- [x] Scaffold Vite 8 + React 19 + TS + SCSS + Vitest
- [x] `resources/investigation-education/` con papers y conclusiones
- [x] `docs/plan.md`

### R1 — Dominio (datos + SRS)

- [x] Contenido: 6 unidades × 12 palabras con pinyin, significado, frase y traducción.
- [x] Adaptador FSRS: crear tarjeta, previsualizar 4 calificaciones, calificar, serializar.
- [x] Cola de repaso: vencidas + nuevas, orden, re-encolado de pasos de aprendizaje.
- [x] Tests: serialización, intervalos crecientes, fallo reduce intervalo, cola.

### R2 — Estado del aprendiz

- [x] Store con persistencia, racha sin castigo, estadísticas.
- [x] Tests: racha, precisión, pronóstico 7 días, próxima fecha de repaso.

### R3 — Interfaz

- [x] Home con CTA de repaso/lección y progreso por unidad.
- [x] Lección: presentación → quiz de recuperación → resumen.
- [x] Repaso: tarjeta → audio → (pinyin en tarjetas maduras) → revelar → 4 botones.
- [x] Estadísticas: racha, repasos, dominadas, precisión, pronóstico.
- [x] SCSS con tokens; accesibilidad: foco visible, contraste AA, teclado.

### R4 — Cierre

- [x] `pnpm test`, `pnpm build`, `pnpm lint` verdes.
- [x] Captura visual de cada pantalla revisada (`docs/screenshots/`).
- [x] README, repo remoto `open-chinesse`, rama `develop`.

### R5 — Backlog (fuera de v0.1)

- [ ] Escritura de trazos con `hanzi-writer` (ver doc 05: aporta forma→significado).
- [ ] Audio pregrabado multihablante con `edge-tts` (HVPT real).
- [ ] PWA offline + instalación.
- [ ] Sincronización opcional (Supabase) sin cuentas obligatorias.
- [ ] Revisión del contenido por hablante nativo.
- [ ] Optimización de pesos FSRS con el historial del propio usuario.

## Desviaciones respecto al plan inicial

- **Sin router de terceros**: un router hash de 30 líneas cubre las cuatro rutas y
  evita una dependencia mayor. Tests no lo cubren; lo verifica la sesión E2E.
- **Los pasos de aprendizaje se re-encolan en la misma sesión**, así que un "Bien"
  de 10 minutos puede reaparecer antes. Es el comportamiento de Anki con learning
  steps y evita sesiones de dos tarjetas.
- **La racha se deriva del log**, no se guarda como contador: no puede desincronizarse.
- **Estado de unidad completada se deriva** de las tarjetas existentes, no se guarda.
- **`ts-fsrs` API síncrona** (FSRS-6) en lugar de `DefaultScheduler` (async, FSRS-7):
  menos complejidad, misma calidad de programación con pesos de fábrica.

## Evidencia de la ronda 4

- `pnpm test`: 51 pruebas en 6 archivos, todas verdes.
- `pnpm build`: 89,8 kB gzip de JS inicial (objetivo < 250 kB).
- Sesión E2E con Playwright: lección completa y 24 repasos solo con teclado, sin
  errores de consola; el progreso persiste tras recargar.
- Capturas revisadas en escritorio (1280×1000) y móvil (390×844).

## Criterios de éxito verificables

- Un usuario nuevo llega a Home, hace una lección y termina con 12 tarjetas programadas.
- Al recargar, el progreso persiste y la racha se mantiene.
- Ninguna interacción exige ratón (todo con teclado).
- El bundle inicial queda bajo 250 kB gzip.

## Riesgos

- `speechSynthesis` depende de voces del sistema; si no hay voz `zh-CN` se avisa y se
  ofrece el pinyin. Mitigación futura: MP3 pregrabados con `edge-tts`.
- FSRS-6 sin optimización por usuario usa parámetros por defecto. Aceptable hasta
  tener historial propio (>= 1000 repasos).
- Contenido escrito a mano: revisar tonos y traducciones en R5 con hablante nativo.

## Rondas de madurez de producto (noviembre 2026)

Objetivo: que la app se lea como producto y no como prototipo. Criterio común: en
cinco segundos se entiende qué toca hacer, la jerarquía se sostiene en escritorio y
móvil, y ninguna pantalla parece una lista de base de datos.

### P1 — Identidad y portada

- [x] Portada oscura de marca con una sola acción primaria y el progreso como
      contexto, no como tabla.
- [x] «Tu sesión de hoy» como tablero de tres pasos con meta visible.
- [x] Progreso y logros en un panel único con anillo, nivel e insignias.
- [x] Ruta como rejilla de unidades clicable; se elimina la lista infinita.
- [x] Cabecera y navegación con estado activo consistente; pie más sobrio.
- [x] Copy honesto: audio sintético, FSRS sin promesas de memoria perfecta.

### P2 — Sesión (Lección, Repaso, Tonos)

- [x] Modo foco: sin navegación global durante una sesión, con salida explícita.
- [x] Cabecera de sesión común: salir, contexto y contador.
- [ ] Progreso segmentado y acciones ancladas; teclas visibles en todo momento.
- [ ] Feedback de acierto/error y cierre de sesión con siguiente paso claro.

### P3 — Biblioteca (Practicar, Historias, Inmersión, Progreso, Perfil)

- [x] Practicar como rejilla de cuatro acciones con icono, estado y CTA.
- [x] Cabecera de página común en Practicar e Historias.
- [x] Perfil coherente: «Estudiadas» reales, 601 palabras y logros con el mismo
      lenguaje visual que la portada.
- [ ] Terminar de unificar Inmersión, Progreso y el lector de historias.
- [ ] Estados vacíos y de carga con la misma voz visual.

### P4 — Pulido

- [ ] Iconografía y motion coherentes; `prefers-reduced-motion` en todo.
- [ ] Revisión de contraste AA, foco visible y landmarks.
- [ ] Metadatos, favicon y rendimiento de fuentes.

### C1 — Contenido vivo

- [x] Cuatro situaciones interactivas (HSK 1–3) con decisiones, feedback y audio.
- [x] Progreso de situaciones persistido y sincronizado (esquema 7).
- [x] Teclas 1–3 para elegir y auto-scroll del chat.
- [x] Dos lecturas nuevas: restaurante (HSK 2) y día de lluvia (HSK 3).
- [ ] Notas de uso en palabras que se confunden (二/两, 几/多少, 的/得).
- [ ] Escenarios con voz propia del aprendiz (grabación o evaluación).

### C2 — Origen en capas y ayudas

- [x] La ficha abre centrada; cada pieza encadena una capa a la derecha con
      offsets de Fibonacci (34, 55, 89, 144, 233 px), hasta seis.
- [x] Paneles anteriores en segundo plano, migas de pan, «Atrás» y salto a
      cualquier capa.
- [x] Comparación didáctica entre fichas: relación (radical, componente, familia
      fonética), lecturas y una nota de qué mirar.
- [x] Todas las piezas abren su ficha; «+ dentro» solo despliega.
- [x] Ayudas conmutables de pinyin y traducción en las situaciones.
- [ ] Recuperación inversa y dictado (propuestas de terra).

### C3 — Producción en contexto

- [x] Huecos sobre los ejemplos existentes: 425 de 601 palabras tienen una
      aparición única y completa, verificada por test.
- [x] Respuesta escrita en hanzi o pinyin, con o sin tonos; sin opciones ni
      distractores ambiguos.
- [x] Pista opcional, «No lo sé», frase completa con pinyin y audio al resolver.
- [x] Solo palabras ya estudiadas; no altera FSRS.
- [ ] Dictado, recuperación inversa y producción oral.

### C4 — Misiones diarias

- [x] Registro de actividad por tipo (repaso, lección, tonos, situación, contexto)
      en el esquema 8, con límite de 600 entradas y sincronización.
- [x] Tres misiones por día: repaso fijo y dos rotatorias según la fecha.
- [x] Progreso real desde la actividad; «En contexto» solo cuenta aciertos.
- [x] Recompensa de +30 XP una vez al día; el botón no se puede reclamar dos veces.
- [x] Racha de misiones persistida (`missionDays`) y visible en Home.
- [x] Resumen semanal en Progreso: siete días de actividad, aciertos y racha.
- [x] Confeti y sonido al reclamar la recompensa.
- [x] Tarjeta en Home; los logros siguen en Perfil.
- [ ] Rachas de misión con recompensa por hitos (3, 7, 30 días).

### C5 — Flujo y contrato de calidad

- [x] El repaso muestra «Sesión terminada» al agotar la cola, con el número de
      repasos; «Estás al día» queda solo para una cola que empieza vacía.
- [x] Una unidad se marca completada al registrar la lección (`stars`), no al
      abrirla; `completedUnits` desaparece.
- [x] El XP de hoy se refresca al cargar la app y al volver a la pestaña.
- [x] El teclado del repaso no intercepta botones ni enlaces; los controles
      nativos conservan Enter y espacio.
- [x] `autoFocus` eliminado en toda la app: `useEnterKey` avanza y el foco de
      los campos es programático (`useFocusOnMount`, `useRef`).
- [x] Sin keys por índice: `withKeys` da identidad estable a pinyin, piezas,
      migas, lecturas y enlaces de carácter.
- [x] La ficha de carácter atrapa el foco, cierra con Escape y lo devuelve al
      control de origen.
- [x] Home, Review, Lesson, Stats, Profile y Login divididos en componentes:
      ≤40 líneas por función, complejidad ≤8, archivos de pantalla <400 líneas.
- [x] ESLint externo de `teachers`, Stylelint y Prettier limpios; Oxlint sin
      errores (9 advertencias de pureza de `Date.now`, preexistentes).

### C6 — Producto: situaciones y biblioteca

- [x] Situaciones con barra de progreso, resumen con intentos fallidos y
      anuncio accesible del paso actual.
- [x] Teclado 1–3 bloqueado mientras hay un diálogo abierto.
- [x] Lista de situaciones con contador de completadas; Practicar muestra el
      mismo dato en vez de una cifra fija.
- [x] Inmersión con la cabecera común, filtros con recuento y color estable por
      nivel (sin depender de la posición).
- [x] Progreso con la cabecera común y estado vacío del pronóstico semanal.
- [x] Opciones de tonos más grandes: las marcas de tono dejan de perderse.
- [x] Audio verificado en las 23 líneas de las cuatro situaciones.

### C7 — Deuda: módulos pequeños

- [x] `Scenarios.tsx` dividido: lista de 88 líneas, reproductor de 298 y
      componentes de burbuja, elección y resumen en `components/scenario/`.
- [x] `_home.scss` dividido en parciales (portada, sesión, progreso, misiones,
      logros y ruta); el mayor queda en 202 líneas.
- [x] Plural corregido en la insignia de racha («1 día», no «1 días»).
- [ ] Extraer el ancho dinámico de las barras a una variable CSS sin `style`.

### C8 — Mecánicas de lectura

- [x] Glosa al pasar el cursor o enfocar una palabra de una historia; el clic
      la fija y permite cerrarla.
- [x] Modo de escucha continua de la historia: play, pausa, seguir y detener,
      con la línea activa iluminada y desplazamiento automático.
- [x] Audio de las 45 líneas de historia regenerado: estaba truncado
      (0,7–1,1 s por frase); ahora dura 1,55 s de media.
- [x] Mapa de mecánicas pendientes en `docs/roadmap-mecanicas.md`, priorizado
      por impacto y coste.

### C9 — Dictado y cuentos para dormir

- [x] Ruta `/dictado` con diez palabras ya estudiadas, audio real y respuesta
      en hanzi o pinyin, con o sin tonos.
- [x] Corrección con feedback, resumen, «Otra tanda» y estado vacío; la
      actividad queda registrada para el resumen semanal.
- [x] Tres cuentos HSK 1–2 en `/dormir` con pinyin, traducción y explicación
      detallada de cada línea.
- [x] Voz lenta (`length_scale 1.25`) para los 24 audios nuevos y reproductor
      extraído a `lib/story-audio.ts`, compartido con Historias.
- [x] Panel nocturno, línea activa iluminada y controles de pausa, seguir y
      detener.
- [x] Tarjetas de Dictado y Cuentos en Practicar.

### C10 — Cultura china en chino

- [x] Tres lecturas HSK 3: el té, una mañana en Pekín y una noche en familia.
- [x] 24 líneas con hanzi, pinyin, traducción y explicación de gramática o
      vocabulario.
- [x] Audio propio con `length_scale 1.1`, reproductor con línea activa y
      controles de pausa, seguir y detener.
- [x] Una pregunta de comprensión por lectura, con respuesta razonada.
- [x] Tarjeta «China en chino» en Practicar y test de nivel de vocabulario.

### C11 — Sesión mixta y reto del día

- [x] Ruta `/mixta` con diez preguntas intercaladas: significado, escucha,
      contexto y tonos.
- [x] Tipos de opción única con cuatro alternativas, audio real en escucha y
      tonos, y explicación tras responder.
- [x] El generador reserva para «Completa la frase» palabras cuyo ejemplo admite
      hueco, en vez de caer siempre en significado.
- [x] Tarjeta «Sesión mixta» en Practicar y actividad registrada.
- [x] Reto del día en Home: siete retos que rotan con la fecha y enlazan a una
      pantalla existente.
- [x] Home considera «empezado» si hay historial aunque no queden tarjetas.

### C12 — Fallos y tonos

- [x] Ruta `/fallos`: sesión con las palabras falladas, ordenadas por fallo más
      reciente y con el formato que pide el motivo (escucha, significado,
      contexto o tonos).
- [x] Motivo «Confundí el tono» añadido al selector de fallos.
- [x] Tarjeta «Tus fallos» en Practicar con el número de palabras pendientes.
- [x] Dictado con «Exigir tonos» activado por defecto: `ni hao` no cuenta como
      acierto; se muestra `nǐ hǎo` o `ni3 hao3` y el motivo.
- [x] La actividad guarda la palabra concreta (`wordId`) para poder medir el
      acierto diferido de los fallos.

### C13 — Jefes de nivel y certificado

- [x] Ruta `/jefes` con los tres niveles; el jefe se abre al tener una estrella
      en todas las unidades del nivel.
- [x] Examen de 15 preguntas mezcladas, sin pistas; 80% para aprobar.
- [x] Certificado de práctica con nombre, nivel, aciertos y fecha; se guarda el
      mejor resultado y se puede volver a ver o imprimir en `/certificado/<nivel>`.
- [x] Certificados incluidos en el estado persistido, la exportación y la
      sincronización (esquema 10).
- [x] Tarjeta «Jefes de nivel» en Practicar.

### C14 — Comprensión auditiva

- [x] Ruta `/escucha` con seis audios: tres historias y tres lecturas de China.
- [x] Preguntas de comprensión añadidas a tres historias; las lecturas de China ya
      tenían la suya.
- [x] El texto permanece oculto hasta responder; después se revela la
      transcripción con pinyin, traducción y explicaciones.
- [x] Reproductor con pausa, seguir y detener; el audio se corta al responder.
- [x] Tarjeta «Comprensión auditiva» en Practicar.

### C15 — Repite en voz alta

- [x] Ruta `/repite` con diez textos y audio por frase.
- [x] Grabación local con `MediaRecorder`; se borra al cambiar de frase o salir.
- [x] Comparación con el modelo: escuchar el audio, grabar, escuchar la
      grabación y ajustar tonos/ritmo. Sin nota automática.
- [x] Estados de permiso denegado y navegador sin soporte.
- [x] Tarjeta «Repite en voz alta» en Practicar.

### C16 — Gramática en contraste: 不 / 没

- [x] Tema `/gramatica/bu-mei` con cuatro reglas, tres contrastes y doce
      frases: siete de práctica y cinco reservadas.
- [x] Práctica con feedback que explica el porqué; los fallos quedan en el tema
      y se pueden repasar aparte.
- [x] Prueba diferida a los 7 días con las cinco frases reservadas; se guarda
      solo el primer resultado.
- [x] Repaso de la práctica a los 3 días, sin retrasar la prueba al repetir.
- [x] Progreso compatible (esquema 11) y tarjeta «Gramática en contraste» en
      Practicar.

### C17 — Micro-lecturas HSK 1 por unidad

- [x] Quince micro-lecturas, una por unidad de HSK 1, de 3–4 líneas.
- [x] Cada texto usa solo vocabulario HSK 1 y al menos dos palabras de su unidad.
- [x] Audio por línea (55 archivos nuevos) y una pregunta de comprensión con
      explicación.
- [x] Integradas en Historias, Comprensión auditiva (21 audios) y Repite en voz
      alta (25 textos) sin pantallas nuevas.

### C18 — Núcleo: historia del carácter y vídeos

- [x] Historia legible y gancho de memoria para los 618 caracteres del curso.
- [x] 47 pictogramas HSK 1 con imagen concreta; notas curadas para partículas y
      verbos opacos.
- [x] Piezas con rol (significado/sonido), sentido propio del carácter y uso en
      palabra.
- [x] Confundibles por forma y fuente histórica plegada; pictogramas sin
      descomposición engañosa.
- [x] Inmersión con 18 recursos en chino y 4 vídeos sobre la historia de los
      caracteres, verificados con `yt-dlp`.

### C19 — Sesión diaria y familia del radical

- [x] Sesión guiada en tres actos: recuperar, aprender y producir; sin repaso si
      no hay tarjetas.
- [x] Cierre diario con carácter, mini-quiz, frase escuchada y una frase propia
      con modelo y autoevaluación.
- [x] CTA «Empezar la sesión de hoy» y barra con los pasos reales.
- [x] Familia del radical en la ficha, filtrada a caracteres del curso.
- [x] Feedback de opción incorrecta en rosa, no en verde.

### C20 — Detective de confusables y Cambia la intención

- [x] Veinte transformaciones base → intención → respuesta, con una sola opción
      correcta y explicación del cambio mínimo.
- [x] Ronda de diez frases con opciones barajadas por ítem y feedback.
- [x] Detective de confusables: diez pares del curso con significado, explicación
      y enlace a la ficha.
- [x] Opciones del detective barajadas; sentido propio corregido en 自, 儿 y
      otros caracteres abstractos.
- [x] Tarjetas en Practicar, rutas `/intencion` y `/detective`, actividad
      registrada.

### C21 — ¿Qué pasó en la escena?

- [x] Quince preguntas de comprensión global sobre micro-lecturas, cada una con
      una línea de evidencia.
- [x] Tanda de ocho: leer o escuchar sin traducción, elegir qué pasó y señalar
      la frase que lo justifica.
- [x] Doble puntuación (resumen y evidencia), revelado de pinyin/traducción y
      cita de la línea.
- [x] Opciones de resumen barajadas; test de posición.

### C22 — Laboratorio de piezas

- [x] Ocho caracteres por tanda con al menos dos piezas clasificables.
- [x] Clasificación táctil significado/sonido, comprobación y feedback por pieza.
- [x] Enlace desde cada ficha con roles y tarjeta en Practicar.
- [x] Actividad `pieces` y resumen final.

### C23 — Pulido didáctico y visual del núcleo

- [x] Lección con recuperación antes de revelar: «Mostrar significado» y «No lo
      recuerdo»; el significado y el ejemplo aparecen después.
- [x] Feedback de quiz con contraste elegido/respuesta y frase de ejemplo.
- [x] Ejemplo resuelto de 不/没 antes de la práctica.
- [x] Movimiento 180 ms, fade de feedback, hover discreto, halo de fondo y
      `prefers-reduced-motion`.

### C24 — Lección activa

- [x] Ciclo de dos palabras nuevas + dos comprobaciones, con ronda visible y
      objetivo de la unidad.
- [x] Cinco modos: significado, escucha, tono, frase con hueco y ordenar.
- [x] Feedback específico por modo, contraste elegido/respuesta y ejemplo.
- [x] Barra de acción sticky, tarjeta en dos columnas y resumen con palabras
      que merecen otra mirada.
- [x] Plan de lección determinista y tests de respuesta correcta.

### C25 — Estética de la lección

- [x] Progreso segmentado por rondas, tarjeta con marca de agua y divisor
      editorial.
- [x] Ejemplo con la palabra objetivo resaltada.
- [x] Etiquetas de modo con icono y color, opciones con check/equis y feedback
      en banner.
- [x] Resumen con anillo de aciertos y palabras pendientes en tarjetas.
- [x] Pulso del audio, hover elevado y `prefers-reduced-motion`.

### C26 — Habilidades estables

- [x] Cinco destrezas visibles: oído, habla, lectura, escritura y memoria.
- [x] Filtros por destreza y etiqueta en cada una de las 18 actividades.
- [x] Boundary de pantalla con salida amable.
- [x] Rutas de jefe/certificado normalizadas y carácter inválido controlado.
- [x] Grabadora con limpieza de stream, reintento y límite de 10 segundos.

### C27 — La lección enseña antes de preguntar

- [x] Primera exposición con significado y ejemplo, sin revelado previo.
- [x] Acción principal fija y feedback con auto-scroll.
- [x] Dificultad progresiva: reconocer antes que tono y hueco.
- [x] Pinyin separado por sílabas con color y número de tono correctos.
- [x] Comprobación de pinyin alineada con la separación por sílabas.

### C28 — Lección en tres partes e historias con velocidad

- [x] Tres partes por lección con repaso intermedio y progreso de 3 segmentos.
- [x] Repaso sin significados visibles, con las palabras de la parte.
- [x] La última parte cierra con dos frases de ordenar.
- [x] Control de velocidad 0.75×/1×/1.25× en Historias y Cuentos.
- [x] Barra de avance por líneas y velocidad aplicada en caliente.

### C29 — Persistencia de la parte de lección

- [x] Guardar la parte actual por unidad en `localStorage`.
- [x] Retomar la lección en esa parte al recargar o volver.
- [x] Limpiar el progreso al completar la última parte.
- [x] Mostrar «Continuar: … · parte X/3» en la portada.
- [x] Tests y QA de guardado, reanudación y limpieza.

Cada ronda cierra con `vitest`, `tsc -b`, `pnpm lint`, `pnpm build`, capturas en
`.screens/`, despliegue y push a `develop` y `main`.
