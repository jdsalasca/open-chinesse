# Revisión pedagógica (2026-11-16)

Dos búsquedas con `gpt-6.1-terra` (medium) sobre lo que falta en la app. Se contrastó con lo
ya implementado antes de decidir.

## Prácticas con evidencia y su coste

| Práctica                                | Evidencia                                     | Impacto              | Coste      | Estado en la app                                      |
| --------------------------------------- | --------------------------------------------- | -------------------- | ---------- | ----------------------------------------------------- |
| Recuperación productiva (sin opciones)  | Nakata, 2016                                  | Alto                 | Bajo-medio | **Parcial**: el repaso escribe pinyin, pero sin tonos |
| Discriminación de tonos (pares mínimos) | Uchihara, Karas y Thomson, 2025 (79 estudios) | Alto para percepción | Medio      | **No existe**                                         |
| Lectura graduada                        | Jeon y Day, 2016 (49 estudios)                | Medio-alto           | Alto       | No existe (Historias está marcado «próximamente»)     |
| Glosas en contexto                      | Yanagisawa, Webb y Uchihara, 2020             | Medio                | Medio      | Parcial: ficha de carácter                            |
| Feedback correctivo específico          | Li, 2010                                      | Medio                | Bajo-medio | **Sí** desde esta ronda (motivo del fallo)            |
| Intercalado de contrastes               | Pan et al., 2019                              | Medio e incierto     | Bajo-medio | No existe                                             |

## Decisión

La carencia más rentable es **el tono**: el repaso actual pide pinyin _sin tonos_, así que el
tono nunca se evalúa. Eso convierte una app de chino en una app de caracteres.

Siguiente ronda propuesta: **producción con tonos** (aceptar `ni3 hao3` o `nǐ hǎo`, marcar el
tono fallado y mostrar cuál era) y, después, **discriminación de tonos** con pares mínimos
usando el audio ya generado (2 064 MP3).

## Fuentes

- Nakata, T. (2016). <https://doi.org/10.20806/KATEJOURNAL.30.0_139>
- Uchihara, Karas & Thomson (2025). <https://www.cambridge.org/core/services/aop-cambridge-core/content/view/S0272263125100879>
- Jeon & Day (2016). <https://files.eric.ed.gov/fulltext/EJ1117026.pdf>
- Yanagisawa, Webb & Uchihara (2020). <https://www.cambridge.org/core/journals/studies-in-second-language-acquisition/article/abs/how-do-different-forms-of-glossing-contribute-to-l2-vocabulary-learning-from-reading/38124150D59DF3039EE1FF5AE88FE922>
- Li (2010). <https://onlinelibrary.wiley.com/doi/10.1111/j.1467-9922.2010.00561.x>
- Pan et al. (2019). <https://www.sciencedirect.com/science/article/pii/S2211368119301329>

## Autoexplicación (búsqueda paralela)

- Zhang & Fiorella (2024). <https://doi.org/10.1016/j.cedpsych.2024.102326>
- Belardi et al. (2021). <https://pmc.ncbi.nlm.nih.gov/articles/PMC8638698/>
- Smith & Karpicke (2014). <https://learninglab.psych.purdue.edu/downloads/2014/2014_Smith_Karpicke_Memory.pdf>
- Choffin et al. (2019). <https://arxiv.org/abs/1905.06873>

Nota metodológica: casi toda la evidencia viene de otras lenguas y de contextos de
laboratorio. Estas decisiones son hipótesis razonables, no verdades medidas en esta app.
