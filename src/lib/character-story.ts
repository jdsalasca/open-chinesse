import {
  charInfo,
  meaningOf,
  readingOf,
  type CharInfo,
  type FormationType,
} from '../data/characters';
import { CONFUSABLES, PICTOGRAPHS, STORY_NOTES } from '../data/character-notes';
import { ALL_WORDS } from '../data/curriculum';
import { glossOf } from '../data/glosses';

export type CharacterStory = {
  idea: string;
  mnemonic: string;
  sound?: string;
};

const COURSE_CHARS = new Set(ALL_WORDS.flatMap((word) => [...word.hanzi]));

function labelOf(char: string): string {
  return glossOf(char) ?? meaningOf(char) ?? readingOf(char) ?? char;
}

function firstWord(char: string) {
  return ALL_WORDS.find((word) => word.hanzi.includes(char));
}

function senseOf(char: string): string {
  return meaningOf(char) ?? firstWord(char)?.meaning ?? glossOf(char) ?? readingOf(char) ?? char;
}

function subjectOf(char: string): string {
  const own = meaningOf(char);
  if (own) return own;
  const word = firstWord(char);
  if (word) return `la palabra ${word.hanzi} (${word.meaning})`;
  return glossOf(char) ?? readingOf(char) ?? char;
}

function withLabel(char: string): string {
  return `${char} (${labelOf(char)})`;
}

function withSound(char: string): string {
  return `${char} (${readingOf(char) ?? labelOf(char)})`;
}

function partsOf(info: CharInfo | undefined): string[] {
  return [...new Set([...(info?.semantic ?? []), ...(info?.phonetic ?? [])])];
}

function ideographicStory(char: string, info: CharInfo | undefined): CharacterStory {
  const parts = partsOf(info);
  if (parts.length === 0) {
    return {
      idea: `Combina sus trazos para expresar ${senseOf(char)}.`,
      mnemonic: `Asocia ${char} con ${senseOf(char)}.`,
    };
  }
  return {
    idea: `Combina ${parts.map(withLabel).join(' + ')}. La idea: ${senseOf(char)}.`,
    mnemonic: `Piensa en ${parts.map(labelOf).join(' + ')} → ${senseOf(char)}.`,
  };
}

function phoneticStory(char: string, info: CharInfo | undefined): CharacterStory {
  const semantic = info?.semantic ?? [];
  const phonetic = info?.phonetic ?? [];
  if (semantic.length === 0 || phonetic.length === 0) return ideographicStory(char, info);
  const sound = phonetic.map((part) => readingOf(part) ?? labelOf(part)).join('/');
  return {
    idea: `${semantic.map(withLabel).join(' + ')} aporta la idea; ${phonetic
      .map(withSound)
      .join(' + ')} aporta el sonido. Juntos forman ${subjectOf(char)}.`,
    mnemonic: `La pieza ${semantic.join('/')} te recuerda el significado; ${phonetic.join(
      '/',
    )} te suena a ${sound}.`,
    sound: `El sonido viene de ${phonetic.join('/')} (${sound}); hoy ${char} se lee ${
      readingOf(char) ?? char
    }.`,
  };
}

function pictureStory(char: string): CharacterStory {
  const picture = PICTOGRAPHS[char];
  return {
    idea: picture ?? `Su forma antigua era un dibujo; hoy se usa en ${subjectOf(char)}.`,
    mnemonic: picture
      ? `Imagina la escena: ${picture.replace(/\.$/, '').toLowerCase()}.`
      : `Asocia ${char} con ${senseOf(char)}.`,
  };
}

const STORY_BUILDERS: Record<
  FormationType,
  (char: string, info: CharInfo | undefined) => CharacterStory
> = {
  pictographic: (char) => pictureStory(char),
  ideographic: (char, info) => ideographicStory(char, info),
  'phono-semantic': (char, info) => phoneticStory(char, info),
  indicative: (char) => ({
    idea: `Una marca abstracta para ${senseOf(char)}.`,
    mnemonic: `Asocia la marca con ${senseOf(char)}.`,
  }),
  'phonetic-loan': (char) => ({
    idea: `Se tomó por su sonido para escribir ${subjectOf(char)}.`,
    mnemonic: `Suena como ${readingOf(char) ?? char}: úsalo por el sonido.`,
  }),
};

function defaultStory(char: string, info: CharInfo | undefined): CharacterStory {
  const builder = info?.type ? STORY_BUILDERS[info.type] : undefined;
  if (builder) return builder(char, info);
  return {
    idea: `No tenemos su clasificación histórica; hoy se usa en ${subjectOf(char)}.`,
    mnemonic: `Asocia ${char} con ${senseOf(char)}.`,
  };
}

/** Historia en español para cualquier carácter del curso, con o sin nota curada. */
export function buildCharacterStory(char: string): CharacterStory {
  const base = defaultStory(char, charInfo(char));
  const note = STORY_NOTES[char];
  if (!note) return base;
  return {
    idea: note.idea ?? base.idea,
    mnemonic: note.mnemonic ?? base.mnemonic,
    sound: note.sound ?? base.sound,
  };
}

/** Caracteres del curso que se parecen por forma, filtrados a fichas existentes. */
export function confusablesFor(char: string): string[] {
  return (CONFUSABLES[char] ?? []).filter((other) => other !== char && COURSE_CHARS.has(other));
}
