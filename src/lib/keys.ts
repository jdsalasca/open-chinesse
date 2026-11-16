export type Keyed<T> = { item: T; key: string };

/**
 * Claves estables para listas sin id propio: el texto del elemento más el
 * número de veces que ya apareció. Sustituye a la key por índice, que se
 * reutiliza mal cuando la lista cambia de orden.
 */
export function withKeys<T>(items: T[], base: (item: T) => string): Keyed<T>[] {
  const seen = new Map<string, number>();
  return items.map((item) => {
    const label = base(item);
    const count = seen.get(label) ?? 0;
    seen.set(label, count + 1);
    return { item, key: `${label}#${count}` };
  });
}
