import { CHINA_TEXTS } from '../data/china';
import { STORIES } from '../data/stories';
import type { Line } from '../data/stories';

export type ShadowingLine = Line & { explain?: string };

export type ShadowingText = {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  prefix: string;
  lines: ShadowingLine[];
};

/** Textos con audio por línea para escuchar, grabar y comparar. */
export function shadowingTexts(): ShadowingText[] {
  const stories = STORIES.map((story) => ({
    id: `story-${story.id}`,
    title: story.title,
    level: story.level,
    prefix: story.id,
    lines: story.lines,
  }));
  const china = CHINA_TEXTS.map((text) => ({
    id: `china-${text.id}`,
    title: text.title,
    level: text.level,
    prefix: `china-${text.id}`,
    lines: text.lines,
  }));
  return [...stories, ...china].sort((a, b) => a.level - b.level || a.title.localeCompare(b.title));
}
