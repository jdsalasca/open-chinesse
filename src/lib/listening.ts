import { CHINA_TEXTS } from '../data/china';
import { STORIES, type Line } from '../data/stories';
import type { ListeningQuestion } from '../data/types';

export type ListeningLine = Line & { explain?: string };

export type ListeningExercise = {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  minutes: number;
  note: string;
  prefix: string;
  lines: ListeningLine[];
  question: ListeningQuestion;
};

/** Audios con pregunta de comprensión: historias y lecturas de China. */
export function listeningExercises(): ListeningExercise[] {
  const stories = STORIES.flatMap((story) =>
    story.question
      ? [
          {
            id: `story-${story.id}`,
            title: story.title,
            level: story.level,
            minutes: story.minutes,
            note: story.note,
            prefix: story.id,
            lines: story.lines,
            question: story.question,
          },
        ]
      : [],
  );
  const china = CHINA_TEXTS.map((text) => ({
    id: `china-${text.id}`,
    title: text.title,
    level: text.level,
    minutes: text.minutes,
    note: text.note,
    prefix: `china-${text.id}`,
    lines: text.lines,
    question: text.question,
  }));
  return [...stories, ...china].sort((a, b) => a.level - b.level || a.title.localeCompare(b.title));
}
