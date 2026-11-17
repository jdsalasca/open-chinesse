# Ronda C16: gramática en contraste 不 / 没 (2026-11-16)

## Mecánica

- Ruta `/gramatica` con el tema **不 y 没** (HSK 1) y ruta de sesión
  `/gramatica/bu-mei`.
- Introducción con:
  - **Cuatro reglas** en español con ejemplos en hanzi, pinyin y traducción.
  - **Tres contrastes** de frase incorrecta → correcta, con el motivo.
- **Siete frases de práctica** con dos o tres opciones. Al responder, el
  feedback dice cuál era la correcta y **por qué**.
- **Cinco frases reservadas** que no aparecen en la práctica: son la prueba
  diferida.
- Al terminar la práctica:
  - Repaso programado a los **3 días**.
  - Prueba diferida disponible a los **7 días**.
  - Los fallos quedan anotados en el tema y se pueden repasar aparte; al
    terminar el repaso se actualiza la lista.
- La prueba diferida:
  - Usa las cinco frases reservadas.
  - Se guarda **solo la primera vez**; no se puede repetir para maquillar el
    resultado.
  - No cambia el calendario de palabras ni el FSRS.
- Repetir la práctica **no retrasa** la prueba: `checkAt` se conserva.
- Tarjeta «Gramática en contraste» en Practicar (14 tarjetas en total).

## Datos y persistencia

- `src/data/grammar.ts`: tema, reglas, contrastes, 7 + 5 ítems con pinyin,
  traducción y explicación.
- `src/lib/grammar.ts`: programación pura (`afterPractice`, `afterCheck`,
  `grammarStage`, `failedItems`).
- Store: campo nuevo `grammar` (esquema **11**), compatible con payloads
  anteriores; se normaliza al hidratar, se incluye en `partialize` y en
  `exportPayload`, y viaja con la sincronización.
- No se tocaron FSRS, tarjetas ni migraciones de palabras.

## Evidencia

```text
npx prettier --check src docs      limpio
npx tsc -b                         limpio
npx vitest run                     218 passed (218)
ESLint externo (teachers)          0 errores
Stylelint (teachers)               limpio
pnpm build                         ✓
```

### QA en navegador

- Lista: una tarjeta «不 y 没», HSK 1, 12 ítems, «Sin empezar».
- Introducción: 4 reglas, 3 contrastes, botón «Practicar las 7 frases»; sin
  botón de prueba antes de tiempo.
- Práctica: primera frase `他 ___ 有钱。`; al elegir 不 aparece «Era: 没. Con 有
  siempre usamos 没: 他没有钱。»; al terminar, **6 de 7** y «Repasar el fallo».
- Repaso del fallo: vuelve `他 ___ 有钱。`, acierta 没 y termina en **1 de 1**.
- Estado tras el repaso: «Prueba diferida en 7 días», sin botón de prueba.
- Prueba forzada moviendo `checkAt` al pasado: aparece «Prueba diferida
  disponible» y el botón de 5 frases. Resultado **4 de 5**; el tema muestra
  «Primera prueba: 4/5» y el botón ya no aparece.
- Persistencia: tras recargar sigue «Primera prueba: 4/5».
- Repetir la práctica después de la prueba conserva `checkAt` y el resultado.
- Móvil 390×844 sin desbordamiento.
- Practicar: 14 tarjetas, incluida «Gramática en contraste».

### Bug encontrado y corregido

En la primera versión, acertar un fallo lo eliminaba del store mientras la
sesión de repaso seguía abierta; la lista se quedaba vacía y la pantalla en
blanco. Ahora la lista se congela al empezar y los fallos se actualizan al
terminar la sesión.

Capturas en `.screens/audit/`: `c16-grammar-intro.png`,
`c16-grammar-question.png`, `c16-grammar-summary.png`,
`c16-grammar-mobile.png`.

## Límites

- Solo hay un tema (不/没); 了/过, 的/得 y clasificadores quedan para después.
- Los fallos de gramática se repasan dentro del tema; no se mezclan con el
  cuaderno de fallos de palabras (`/fallos`), que sigue siendo léxico.
- El resultado se guarda por alumno, pero todavía no hay panel agregado para
  calcular la métrica de piloto de Terra (≥70% de quienes vuelven). El dato
  existe; falta la vista.
- No hay aviso cuando la prueba está disponible; el alumno la ve al entrar al
  tema.
- Tras la prueba no hay un calendario indefinido de gramática: el tema queda
  como consulta y la práctica se puede repetir a mano.
- La prueba es de un solo intento y las explicaciones son deliberadamente
  breves.
