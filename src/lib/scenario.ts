/** Frase de cierre según los intentos fallidos de la escena. */
export function scenarioResult(mistakes: number): string {
  if (mistakes === 0) return 'Sin fallos: elegiste bien en cada decisión.';
  if (mistakes === 1) return 'Un intento extra: la opción incorrecta ya te explicó por qué.';
  return `${mistakes} intentos extra: cada opción incorrecta ya te explicó por qué.`;
}
