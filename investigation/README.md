# Investigation — Open Chinesse

Dossier de investigación aplicada para construir una alternativa web al
aprendizaje de mandarín. Cada carpeta termina en decisiones concretas de producto;
nada aquí es bibliografía decorativa.

## Mapa

| Carpeta                                                 | Qué responde                                           | Estado                          |
| ------------------------------------------------------- | ------------------------------------------------------ | ------------------------------- |
| [`comprehensive-input/`](comprehensive-input/README.md) | ¿Cuánto contexto necesita una palabra nueva?           | Cerrado                         |
| [`core-1000-words/`](core-1000-words/README.md)         | ¿Qué mil palabras rinden más?                          | Dataset generado y reproducible |
| [`didactic-tools/`](didactic-tools/README.md)           | ¿Qué herramientas existen y cuáles sirven?             | Cerrado                         |
| [`gamification/`](gamification/README.md)               | ¿Qué mecánicas motivan sin dañar?                      | Cerrado                         |
| [`hello-chinese/`](hello-chinese/README.md)             | Qué hace bien el referente del mercado y qué no copiar | Teardown + propuesta            |

## Reglas del dossier

1. **Fuente primaria o dataset reproducible.** Si un número no se puede recalcular,
   no entra.
2. **Conclusión con decisión.** Cada hallazgo termina en "qué hacemos" o "qué no
   hacemos", con su costo asumido.
3. **Límites explícitos.** Se anota la muestra, el contexto y lo que no se probó.

## Cómo se conecta con el código

| Documento                           | Implementación                                         |
| ----------------------------------- | ------------------------------------------------------ |
| `comprehensive-input/`              | Frase de ejemplo por palabra, lección antes del repaso |
| `core-1000-words/`                  | Orden de unidades y futuras expansiones HSK 3-4        |
| `didactic-tools/srs.md`             | `src/srs/` (FSRS-6)                                    |
| `didactic-tools/pronunciation.md`   | Audio + pinyin por tono                                |
| `gamification/`                     | XP, meta diaria, estrellas, logros                     |
| `hello-chinese/visual-identity.md`  | `src/styles/_tokens.scss`                              |
| `hello-chinese/component-system.md` | `src/components/ui/`                                   |
