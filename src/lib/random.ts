/** Generador pseudoaleatorio reproducible para barajar sin `Math.random`. */
export function lcg(seed: number): () => number {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
}

export function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Semilla estable a partir de un texto (id de palabra, por ejemplo). */
export function hashSeed(value: string): number {
  return [...value].reduce(
    (total, char) => (total * 31 + (char.codePointAt(0) ?? 0)) % 2147483647,
    7,
  );
}
