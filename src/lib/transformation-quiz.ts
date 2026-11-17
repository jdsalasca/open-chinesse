import { TRANSFORMATIONS, type Transformation } from '../data/transformations';
import { hashSeed, lcg, shuffle } from './random';

/** Diez transformaciones estables por día, con opciones barajadas. */
export function pickTransformations(seed: string, count = 10): Transformation[] {
  const random = lcg(hashSeed(seed));
  return shuffle(TRANSFORMATIONS, random)
    .slice(0, count)
    .map((item) => ({
      ...item,
      options: shuffle(item.options, lcg(hashSeed(`${seed}:${item.id}`))),
    }));
}
