export type Example = {
  hanzi: string;
  pinyin: string;
  translation: string;
};

export type Word = {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  example: Example;
};

export type Unit = {
  id: string;
  level: 1 | 2;
  index: number;
  title: string;
  subtitle: string;
  words: Word[];
};
