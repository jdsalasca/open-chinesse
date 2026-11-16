export type ResourceKind = 'canal' | 'video' | 'playlist';

export type Resource = {
  id: string;
  title: string;
  channel: string;
  level: 1 | 2 | 3;
  kind: ResourceKind;
  minutes: number;
  url: string;
  why: string;
};

/**
 * Enlaces externos a YouTube: no se aloja vídeo ni imagen en el servidor.
 * Curados y verificados con yt-dlp (título y duración reales).
 */
export const RESOURCES: Resource[] = [
  {
    id: 'maestla-chen-1',
    title: 'HSK 1 · Lección 1: curso para hispanohablantes',
    channel: 'Maestla Chen',
    level: 1,
    kind: 'video',
    minutes: 28,
    url: 'https://www.youtube.com/watch?v=-OlkJUyqEVo',
    why: 'Explica en español pronunciación, vocabulario y primeros caracteres.',
  },
  {
    id: 'mandarin-click-home',
    title: 'HSK1: 我的家 (mi casa)',
    channel: 'Mandarin Click',
    level: 1,
    kind: 'video',
    minutes: 4,
    url: 'https://www.youtube.com/watch?v=rbLlUXT72C4',
    why: 'Historia breve sobre el hogar con apoyo visual.',
  },
  {
    id: 'lazy-chinese-ideal-men',
    title: 'Super easy Chinese conversation: our ideal men',
    channel: 'Lazy Chinese · Comprehensible Input',
    level: 1,
    kind: 'video',
    minutes: 34,
    url: 'https://www.youtube.com/watch?v=jjDYn0ysVUs',
    why: 'Conversación lenta para principiantes con apoyo contextual.',
  },
  {
    id: 'unleashed-intro',
    title: 'HSK 1+: presentarte y vida diaria',
    channel: 'Chinese Unleashed · Shadowing Practice',
    level: 1,
    kind: 'video',
    minutes: 25,
    url: 'https://www.youtube.com/watch?v=xlmbgpyIkEs',
    why: 'Historia visual y repetición guiada sobre la vida cotidiana.',
  },
  {
    id: 'unleashed-family',
    title: 'HSK 1: mi gran familia',
    channel: 'Chinese Unleashed · Shadowing Practice',
    level: 1,
    kind: 'video',
    minutes: 26,
    url: 'https://www.youtube.com/watch?v=fuzYUjN_B7w',
    why: 'Practica familia, edades y números mediante historia y repetición.',
  },
  {
    id: 'crazie-rice',
    title: 'Historias simples: cocinar arroz por primera vez',
    channel: 'Crazie Laoshi',
    level: 1,
    kind: 'video',
    minutes: 11,
    url: 'https://www.youtube.com/watch?v=CUCn3z1XP4s',
    why: 'Historia sencilla para practicar la escucha sobre cocinar arroz.',
  },
  {
    id: 'mandarin-slowly-story',
    title: 'Easy listening: historia para HSK 2',
    channel: 'Mandarin Slowly',
    level: 2,
    kind: 'video',
    minutes: 6,
    url: 'https://www.youtube.com/watch?v=aA1dBbEm70Y',
    why: 'Historia lenta y normal con caracteres y pinyin.',
  },
  {
    id: 'alison-family',
    title: 'HSK1-2: 小明一家 (la familia de Xiaoming)',
    channel: 'Alison Mandarin',
    level: 2,
    kind: 'video',
    minutes: 8,
    url: 'https://www.youtube.com/watch?v=Zx8cE4oeyKU',
    why: 'Historia familiar con subtítulos en inglés.',
  },
  {
    id: 'mandarin-click-cold',
    title: '我感冒了: historias lentas para principiantes',
    channel: 'Mandarin Click',
    level: 3,
    kind: 'video',
    minutes: 6,
    url: 'https://www.youtube.com/watch?v=iamQclBCfoY',
    why: 'Relato sobre un resfriado con texto y pinyin.',
  },
  {
    id: 'annie-listening',
    title: 'Comprensión auditiva graduada HSK 1-3',
    channel: 'Story learning Chinese with Annie',
    level: 3,
    kind: 'video',
    minutes: 11,
    url: 'https://www.youtube.com/watch?v=J3NxpO4t_aQ',
    why: 'Practica comprensión auditiva con vocabulario graduado.',
  },
];
