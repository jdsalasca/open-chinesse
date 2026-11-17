import type { Example } from './types';

export type GrammarOption = { text: string; pinyin?: string; correct: boolean };

export type GrammarItem = {
  id: string;
  prompt: string;
  pinyin: string;
  translation: string;
  options: GrammarOption[];
  explain: string;
};

export type GrammarRule = { title: string; text: string; examples: Example[] };

export type GrammarContrast = { wrong: string; right: string; why: string };

export type GrammarTopic = {
  id: string;
  level: 1 | 2 | 3;
  title: string;
  subtitle: string;
  summary: string;
  rules: GrammarRule[];
  contrasts: GrammarContrast[];
  practice: GrammarItem[];
  check: GrammarItem[];
};

const BU_MEI: GrammarTopic = {
  id: 'bu-mei',
  level: 1,
  title: '不 y 没',
  subtitle: 'La diferencia que cambia el tiempo',
  summary: '不 niega lo que es, quieres o harás; 没 niega lo que hay o pasó.',
  rules: [
    {
      title: '不 · lo que es, quieres o harás',
      text: 'Presente, gustos, identidad y planes. También acompaña a los adjetivos.',
      examples: [
        { hanzi: '我不喝咖啡。', pinyin: 'Wǒ bù hē kāfēi.', translation: 'No bebo café.' },
        { hanzi: '他不是老师。', pinyin: 'Tā bú shì lǎoshī.', translation: 'Él no es profesor.' },
        { hanzi: '明天我不去。', pinyin: 'Míngtiān wǒ bú qù.', translation: 'Mañana no voy.' },
      ],
    },
    {
      title: '没 · lo que no hay o no pasó',
      text: 'Siempre con 有. También con acciones del pasado que no ocurrieron.',
      examples: [
        { hanzi: '我没有钱。', pinyin: 'Wǒ méiyǒu qián.', translation: 'No tengo dinero.' },
        { hanzi: '我昨天没去。', pinyin: 'Wǒ zuótiān méi qù.', translation: 'Ayer no fui.' },
        { hanzi: '她没吃早饭。', pinyin: 'Tā méi chī zǎofàn.', translation: 'Ella no desayunó.' },
      ],
    },
    {
      title: '有 siempre con 没',
      text: 'Nunca digas 不有. La posesión y la existencia se niegan con 没有.',
      examples: [
        { hanzi: '我没有妹妹。', pinyin: 'Wǒ méiyǒu mèimei.', translation: 'No tengo hermanas.' },
        { hanzi: '你有书吗？', pinyin: 'Nǐ yǒu shū ma?', translation: '¿Tienes un libro?' },
      ],
    },
    {
      title: 'La prueba del tiempo',
      text: 'Puedes añadir 昨天: la acción no ocurrió → 没. Expresas un plan, un gusto o una identidad → 不.',
      examples: [
        { hanzi: '昨天没去。', pinyin: 'Zuótiān méi qù.', translation: 'Ayer no fui.' },
        { hanzi: '明天不去。', pinyin: 'Míngtiān bú qù.', translation: 'Mañana no voy.' },
      ],
    },
  ],
  contrasts: [
    {
      wrong: '我昨天不去学校。',
      right: '我昨天没去学校。',
      why: 'Ayer es pasado: la acción no ocurrió → 没.',
    },
    {
      wrong: '我不有妹妹。',
      right: '我没有妹妹。',
      why: '有 siempre se niega con 没.',
    },
    {
      wrong: '明天我没去。',
      right: '明天我不去。',
      why: 'Mañana expresa un plan → 不.',
    },
  ],
  practice: [
    {
      id: 'bu-mei-p1',
      prompt: '他 ___ 有钱。',
      pinyin: 'Tā ___ yǒu qián.',
      translation: 'Él no tiene dinero.',
      options: [
        { text: '不', pinyin: 'bù', correct: false },
        { text: '没', pinyin: 'méi', correct: true },
      ],
      explain: 'Con 有 siempre usamos 没: 他没有钱。',
    },
    {
      id: 'bu-mei-p2',
      prompt: '我 ___ 喜欢喝咖啡。',
      pinyin: 'Wǒ ___ xǐhuan hē kāfēi.',
      translation: 'No me gusta beber café.',
      options: [
        { text: '不', pinyin: 'bù', correct: true },
        { text: '没', pinyin: 'méi', correct: false },
      ],
      explain: 'Un gusto es presente y estable: 我不喜欢喝咖啡。',
    },
    {
      id: 'bu-mei-p3',
      prompt: '昨天我 ___ 去学校。',
      pinyin: 'Zuótiān wǒ ___ qù xuéxiào.',
      translation: 'Ayer no fui a la escuela.',
      options: [
        { text: '不', pinyin: 'bù', correct: false },
        { text: '没', pinyin: 'méi', correct: true },
      ],
      explain: 'La acción no ocurrió ayer: 我昨天没去学校。',
    },
    {
      id: 'bu-mei-p4',
      prompt: '明天我 ___ 去商店。',
      pinyin: 'Míngtiān wǒ ___ qù shāngdiàn.',
      translation: 'Mañana no voy a la tienda.',
      options: [
        { text: '不', pinyin: 'bù', correct: true },
        { text: '没', pinyin: 'méi', correct: false },
      ],
      explain: 'Mañana expresa un plan: 明天我不去商店。',
    },
    {
      id: 'bu-mei-p5',
      prompt: '¿Cuál es correcta?',
      pinyin: 'Elige la frase bien negada.',
      translation: 'Quiero decir: «Ayer no fui a la escuela».',
      options: [
        { text: '昨天我不去学校。', pinyin: 'Zuótiān wǒ bú qù xuéxiào.', correct: false },
        { text: '昨天我没去学校。', pinyin: 'Zuótiān wǒ méi qù xuéxiào.', correct: true },
        { text: '明天我没去学校。', pinyin: 'Míngtiān wǒ méi qù xuéxiào.', correct: false },
      ],
      explain: 'Pasado → 没; futuro → 不. Ayer: 昨天我没去学校。',
    },
    {
      id: 'bu-mei-p6',
      prompt: '她 ___ 有书。',
      pinyin: 'Tā ___ yǒu shū.',
      translation: 'Ella no tiene un libro.',
      options: [
        { text: '不', pinyin: 'bù', correct: false },
        { text: '没', pinyin: 'méi', correct: true },
      ],
      explain: '有 se niega con 没: 她没有书。',
    },
    {
      id: 'bu-mei-p7',
      prompt: '她 ___ 是老师，她是医生。',
      pinyin: 'Tā ___ shì lǎoshī, tā shì yīshēng.',
      translation: 'Ella no es profesora, es médica.',
      options: [
        { text: '不', pinyin: 'bù', correct: true },
        { text: '没', pinyin: 'méi', correct: false },
      ],
      explain: 'La identidad se niega con 不: 她不是老师。',
    },
  ],
  check: [
    {
      id: 'bu-mei-c1',
      prompt: '我每天早上 ___ 喝牛奶。',
      pinyin: 'Wǒ měitiān zǎoshang ___ hē niúnǎi.',
      translation: 'Todas las mañanas no bebo leche.',
      options: [
        { text: '不', pinyin: 'bù', correct: true },
        { text: '没', pinyin: 'méi', correct: false },
      ],
      explain: '每天 marca un hábito: 我不喝牛奶。',
    },
    {
      id: 'bu-mei-c2',
      prompt: '对不起，我 ___ 知道。',
      pinyin: 'Duìbuqǐ, wǒ ___ zhīdào.',
      translation: 'Perdón, no lo sé.',
      options: [
        { text: '不', pinyin: 'bù', correct: true },
        { text: '没', pinyin: 'méi', correct: false },
      ],
      explain: 'Frase fija: 我不知道. Nunca 我没知道.',
    },
    {
      id: 'bu-mei-c3',
      prompt: '上个月我 ___ 去北京。',
      pinyin: 'Shàng ge yuè wǒ ___ qù Běijīng.',
      translation: 'El mes pasado no fui a Pekín.',
      options: [
        { text: '不', pinyin: 'bù', correct: false },
        { text: '没', pinyin: 'méi', correct: true },
      ],
      explain: 'El mes pasado es pasado: 我上个月没去北京。',
    },
    {
      id: 'bu-mei-c4',
      prompt: '¿Cuál es correcta?',
      pinyin: 'Elige la frase bien negada.',
      translation: 'Quiero decir: «Ayer no fui a la tienda».',
      options: [
        { text: '我昨天不去商店。', pinyin: 'Wǒ zuótiān bú qù shāngdiàn.', correct: false },
        { text: '我昨天没去商店。', pinyin: 'Wǒ zuótiān méi qù shāngdiàn.', correct: true },
        { text: '我昨天没去商店了。', pinyin: 'Wǒ zuótiān méi qù shāngdiàn le.', correct: false },
      ],
      explain: 'Pasado → 没去; 了 no acompaña aquí a 没.',
    },
    {
      id: 'bu-mei-c5',
      prompt: '你 ___ 有钱吗？',
      pinyin: 'Nǐ ___ yǒu qián ma?',
      translation: '¿No tienes dinero?',
      options: [
        { text: '不', pinyin: 'bù', correct: false },
        { text: '没', pinyin: 'méi', correct: true },
      ],
      explain: 'La pregunta con 有 usa 没: 你没有钱吗？',
    },
  ],
};

export const GRAMMAR_TOPICS: GrammarTopic[] = [BU_MEI];

export function grammarTopic(id: string): GrammarTopic | undefined {
  return GRAMMAR_TOPICS.find((topic) => topic.id === id);
}
