import { SCENE_QUESTIONS, type SceneQuestion } from '../data/scenes';
import { hashSeed, lcg, shuffle } from './random';

/** Ocho escenas estables por día, con opciones barajadas. */
export function pickSceneQuestions(seed: string, count = 8): SceneQuestion[] {
  return shuffle(SCENE_QUESTIONS, lcg(hashSeed(seed)))
    .slice(0, count)
    .map((item) => ({
      ...item,
      options: shuffle(item.options, lcg(hashSeed(`${seed}:${item.id}:options`))),
    }));
}
