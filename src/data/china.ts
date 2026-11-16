import type { Line } from './stories';

export type ChinaLine = Line & {
  /** Qué mirar en la frase: gramática, partícula o palabra clave. */
  explain: string;
};

export type ChinaQuestion = {
  prompt: string;
  options: { text: string; correct: boolean }[];
  explain: string;
};

export type ChinaText = {
  id: string;
  title: string;
  era: string;
  level: 3;
  minutes: number;
  note: string;
  lines: ChinaLine[];
  question: ChinaQuestion;
};

const say = (hanzi: string, pinyin: string, translation: string, explain: string): ChinaLine => ({
  hanzi,
  pinyin,
  translation,
  explain,
});

/** Lecturas de cultura china con vocabulario del curso y una pregunta final. */
export const CHINA_TEXTS: ChinaText[] = [
  {
    id: 'te',
    title: '一杯茶 · Una taza de té',
    era: 'Vida cotidiana',
    level: 3,
    minutes: 4,
    note: 'Por qué el té acompaña casi todas las conversaciones.',
    lines: [
      say(
        '中国人很喜欢喝茶。',
        'Zhōngguó rén hěn xǐhuan hē chá.',
        'A los chinos les gusta mucho el té.',
        '«中国人» es el pueblo chino; «很喜欢» intensifica el gusto.',
      ),
      say(
        '早上、中午、晚上，都可以喝茶。',
        'Zǎoshang, zhōngwǔ, wǎnshang, dōu kěyǐ hē chá.',
        'Por la mañana, al mediodía y por la noche se puede tomar té.',
        '«都» incluye los tres momentos; «可以» expresa posibilidad.',
      ),
      say(
        '客人来家里，我们先给他一杯茶。',
        'Kèrén lái jiālǐ, wǒmen xiān gěi tā yì bēi chá.',
        'Cuando un invitado viene a casa, primero le damos una taza de té.',
        '«先» marca el primer paso. «给他» es darle a él.',
      ),
      say(
        '茶不甜，但是很好。',
        'Chá bù tián, dànshì hěn hǎo.',
        'El té no es dulce, pero está muy bueno.',
        '«但是» contrasta dos ideas: no dulce, pero bueno.',
      ),
      say(
        '中国有很多茶。',
        'Zhōngguó yǒu hěn duō chá.',
        'En China hay muchos tipos de té.',
        '«很多» indica cantidad; el verbo 有 va antes del objeto.',
      ),
      say(
        '有的茶是黑的，有的茶是白的。',
        'Yǒude chá shì hēi de, yǒude chá shì bái de.',
        'Algunos tés son negros y otros son blancos.',
        '«有的… 有的…» presenta dos grupos distintos.',
      ),
      say(
        '喝茶的时候，大家说话、笑。',
        'Hē chá de shíhou, dàjiā shuōhuà, xiào.',
        'Mientras se toma té, todos hablan y se ríen.',
        '«的时候» significa cuando o mientras. «大家» es todos.',
      ),
      say(
        '一杯茶，就是一个很好的下午。',
        'Yì bēi chá, jiùshì yí gè hěn hǎo de xiàwǔ.',
        'Una taza de té es una buena tarde.',
        '«就是» acerca dos ideas: el té y la tarde.',
      ),
    ],
    question: {
      prompt: '¿Cuándo se puede tomar té según el texto?',
      options: [
        { text: 'Solo por la mañana', correct: false },
        { text: 'Por la mañana, al mediodía y por la noche', correct: true },
        { text: 'Solo cuando hay invitados', correct: false },
      ],
      explain: 'La segunda línea dice 早上、中午、晚上，都可以喝茶.',
    },
  },
  {
    id: 'manana',
    title: '北京的早上 · Una mañana en Pekín',
    era: 'Ciudad',
    level: 3,
    minutes: 4,
    note: 'Parques, bicicletas y café antes del trabajo.',
    lines: [
      say(
        '北京的早上人很多。',
        'Běijīng de zǎoshang rén hěn duō.',
        'Por la mañana hay mucha gente en Pekín.',
        '«北京的早上» sitúa la escena; «人多» describe la calle.',
      ),
      say(
        '老人去公园。',
        'Lǎorén qù gōngyuán.',
        'Los mayores van al parque.',
        '«老人» son las personas mayores; «公园» es parque.',
      ),
      say(
        '他们跑步、跳舞。',
        'Tāmen pǎobù, tiàowǔ.',
        'Corren y bailan.',
        'Dos verbos seguidos describen las actividades de la mañana.',
      ),
      say(
        '有的人去买咖啡。',
        'Yǒude rén qù mǎi kāfēi.',
        'Algunos van a comprar café.',
        '«有的人» es alguna gente; «买» es comprar.',
      ),
      say(
        '孩子去学校。',
        'Háizi qù xuéxiào.',
        'Los niños van a la escuela.',
        '«孩子» puede ser niño o hijos; el contexto decide.',
      ),
      say(
        '路上有很多自行车。',
        'Lùshang yǒu hěn duō zìxíngchē.',
        'En la calle hay muchas bicicletas.',
        '«路上» es en la calle; «自行车» es bicicleta.',
      ),
      say(
        '大家都很忙，但是很高兴。',
        'Dàjiā dōu hěn máng, dànshì hěn gāoxìng.',
        'Todos están ocupados, pero contentos.',
        '«都» incluye a todos; «但是» introduce el contraste.',
      ),
      say(
        '北京的一天开始了。',
        'Běijīng de yì tiān kāishǐ le.',
        'Empieza un día en Pekín.',
        '«一天» es un día completo; «开始了» marca el comienzo.',
      ),
    ],
    question: {
      prompt: '¿Qué hacen los mayores por la mañana?',
      options: [
        { text: 'Corren y bailan en el parque', correct: true },
        { text: 'Compran café', correct: false },
        { text: 'Van a la escuela', correct: false },
      ],
      explain: 'El texto dice 老人去公园。他们跑步、跳舞。',
    },
  },
  {
    id: 'familia',
    title: '一家人的晚上 · Una noche en familia',
    era: 'Familia',
    level: 3,
    minutes: 4,
    note: 'La mesa, la comida y el té que cierra el día.',
    lines: [
      say(
        '中国人的家很大。',
        'Zhōngguó rén de jiā hěn dà.',
        'La casa de una familia china es grande.',
        '«中国人的家» puede ser la casa o la familia; aquí es el hogar.',
      ),
      say(
        '家里有爸爸、妈妈、孩子。',
        'Jiālǐ yǒu bàba, māma, háizi.',
        'En casa están papá, mamá y los niños.',
        '«家里» es dentro de casa; se enumeran los miembros.',
      ),
      say(
        '周末，大家在一起吃饭。',
        'Zhōumò, dàjiā zài yìqǐ chīfàn.',
        'El fin de semana, todos comen juntos.',
        '«周末» es el fin de semana; «在一起» es juntos.',
      ),
      say(
        '桌子上有很多菜。',
        'Zhuōzi shang yǒu hěn duō cài.',
        'En la mesa hay muchos platos.',
        '«桌子上» es sobre la mesa; «菜» son los platos.',
      ),
      say(
        '老人坐在旁边，孩子跑来跑去。',
        'Lǎorén zuò zài pángbiān, háizi pǎolái pǎoqù.',
        'Los mayores se sientan al lado; los niños corren de aquí para allá.',
        '«跑来跑去» repite el verbo para dar sensación de movimiento.',
      ),
      say(
        '大家说话、笑，很高兴。',
        'Dàjiā shuōhuà, xiào, hěn gāoxìng.',
        'Todos hablan, se ríen y están contentos.',
        'Varios verbos en serie describen el ambiente.',
      ),
      say(
        '吃完饭，一起喝茶。',
        'Chī wán fàn, yìqǐ hē chá.',
        'Después de comer, toman té juntos.',
        '«吃完饭» usa 完 para indicar que la acción termina.',
      ),
      say(
        '我们都爱家。',
        'Wǒmen dōu ài jiā.',
        'Todos queremos a la familia.',
        '«都» refuerza que incluye a todos; 爱 es amar.',
      ),
    ],
    question: {
      prompt: '¿Qué hacen después de comer?',
      options: [
        { text: 'Ven televisión', correct: false },
        { text: 'Toman té juntos', correct: true },
        { text: 'Van al parque', correct: false },
      ],
      explain: 'La última parte dice 吃完饭，一起喝茶。',
    },
  },
];
