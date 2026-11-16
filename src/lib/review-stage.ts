export type ReviewStage = 'empty' | 'summary' | 'question';

/**
 * La cola se agota antes de que falte la tarjeta: primero «resumen», luego
 * «vacío». Invertirlo ocultaba el resumen al terminar la sesión.
 */
export function reviewStage(queueLength: number, cursor: number): ReviewStage {
  if (queueLength === 0) return 'empty';
  if (cursor >= queueLength) return 'summary';
  return 'question';
}
