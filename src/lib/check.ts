import { ALL_WORDS, WORDS_BY_ID } from '../data/curriculum';

export type CheckQuestion = { wordId: string; options: string[]; answer: string };

/** Diez preguntas de significado sobre palabras ya estudiadas, sin pistas. */
export function makeCheck(wordIds: string[]): CheckQuestion[] {
  return wordIds.flatMap((wordId, index) => {
    const word = WORDS_BY_ID.get(wordId);
    if (!word) return [];
    const pool = ALL_WORDS.filter(
      (candidate) => candidate.id !== wordId && candidate.meaning !== word.meaning,
    );
    const distractors: string[] = [];
    for (let step = 0; step < pool.length && distractors.length < 3; step += 1) {
      const candidate = pool[(index * 7 + step * 13) % pool.length];
      if (!distractors.includes(candidate.meaning)) distractors.push(candidate.meaning);
    }
    // La respuesta no va siempre en el mismo sitio: el índice decide dónde cae.
    const options = [...distractors];
    options.splice(index % (options.length + 1), 0, word.meaning);
    return [{ wordId, options, answer: word.meaning }];
  });
}

/** Clases de una opción ya contestada: acierta, falla o queda apagada. */
export function optionState(option: string, picked: string | null, answer: string): string {
  if (picked === null) return '';
  if (option === answer) return ' is-correct';
  return option === picked ? ' is-wrong' : ' is-muted';
}

/** La prueba solo se abre a partir de su fecha y una sola vez. */
export function isDue(retention: { dueAt: number; takenAt?: number }, now: number): boolean {
  return retention.takenAt === undefined && now >= retention.dueAt;
}
