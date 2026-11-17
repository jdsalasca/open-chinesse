import type { ListeningQuestion } from '../data/types';
import { MICRO_STORIES } from './micro.ts';

export type Line = { hanzi: string; pinyin: string; translation: string };

export type Story = {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  kind: 'historia' | 'conversación' | 'micro-lectura';
  minutes: number;
  note: string;
  lines: Line[];
  question?: ListeningQuestion;
  unitId?: string;
};

const say = (hanzi: string, pinyin: string, translation: string): Line => ({
  hanzi,
  pinyin,
  translation,
});

/** Textos cortos con vocabulario del curso. Cada línea tiene audio propio. */
const BASE_STORIES: Story[] = [
  {
    id: 'mi-dia',
    title: '我的一天 · Mi día',
    level: 2,
    kind: 'historia',
    minutes: 2,
    note: 'Rutina diaria: repasa HSK 1 con palabras de HSK 2.',
    lines: [
      say(
        '我早上七点起床。',
        'Wǒ zǎoshang qī diǎn qǐchuáng.',
        'Me levanto a las siete de la mañana.',
      ),
      say('我喝茶，吃米饭。', 'Wǒ hē chá, chī mǐfàn.', 'Bebo té y como arroz.'),
      say('我去学校。', 'Wǒ qù xuéxiào.', 'Voy a la escuela.'),
      say('学校很大。', 'Xuéxiào hěn dà.', 'La escuela es grande.'),
      say(
        '下午我和朋友打篮球。',
        'Xiàwǔ wǒ hé péngyou dǎ lánqiú.',
        'Por la tarde juego al baloncesto con un amigo.',
      ),
      say('晚上我看书。', 'Wǎnshang wǒ kàn shū.', 'Por la noche leo.'),
      say('十点我睡觉。', 'Shí diǎn wǒ shuìjiào.', 'A las diez duermo.'),
    ],
    question: {
      prompt: '¿Qué hace por la tarde?',
      options: [
        { text: 'Juega al baloncesto con un amigo', correct: true },
        { text: 'Va a la escuela', correct: false },
        { text: 'Duerme en casa', correct: false },
      ],
      explain: 'La quinta línea dice 下午我和朋友打篮球.',
    },
  },
  {
    id: 'parque',
    title: '周末去公园 · Fin de semana en el parque',
    level: 3,
    kind: 'historia',
    minutes: 3,
    note: 'Una salida tranquila; repasa tiempo, familia y comida.',
    lines: [
      say('周末天气很好。', 'Zhōumò tiānqì hěn hǎo.', 'El fin de semana hizo buen tiempo.'),
      say('我和妹妹去公园。', 'Wǒ hé mèimei qù gōngyuán.', 'Fui al parque con mi hermana menor.'),
      say('公园里有很多花。', 'Gōngyuán lǐ yǒu hěn duō huā.', 'En el parque había muchas flores.'),
      say('妹妹要喝水。', 'Mèimei yào hē shuǐ.', 'Mi hermana quería beber agua.'),
      say('我们坐在树下。', 'Wǒmen zuò zài shù xià.', 'Nos sentamos bajo el árbol.'),
      say('下午下雨了。', 'Xiàwǔ xià yǔ le.', 'Por la tarde empezó a llover.'),
      say(
        '我们回家，妈妈做了面条。',
        'Wǒmen huí jiā, māma zuò le miàntiáo.',
        'Volvimos a casa y mamá hizo fideos.',
      ),
    ],
  },
  {
    id: 'beijing',
    title: '我去北京 · Viaje a Pekín',
    level: 3,
    kind: 'historia',
    minutes: 3,
    note: 'Viaje corto con transporte, hotel y compras.',
    lines: [
      say('上个月我去了北京。', 'Shàng gè yuè wǒ qù le Běijīng.', 'El mes pasado fui a Pekín.'),
      say(
        '北京很大，人很多。',
        'Běijīng hěn dà, rén hěn duō.',
        'Pekín es grande y hay mucha gente.',
      ),
      say('我们坐地铁去宾馆。', 'Wǒmen zuò dìtiě qù bīnguǎn.', 'Fuimos en metro al hotel.'),
      say(
        '宾馆旁边有一家饭馆。',
        'Bīnguǎn pángbiān yǒu yì jiā fànguǎn.',
        'Junto al hotel hay un restaurante.',
      ),
      say(
        '那家饭馆的菜很好吃。',
        'Nà jiā fànguǎn de cài hěn hǎochī.',
        'La comida de ese restaurante está buenísima.',
      ),
      say(
        '我买了一个礼物给妹妹。',
        'Wǒ mǎi le yí gè lǐwù gěi mèimei.',
        'Compré un regalo para mi hermana menor.',
      ),
      say('下次我想再去。', 'Xià cì wǒ xiǎng zài qù.', 'La próxima vez quiero volver.'),
    ],
  },
  {
    id: 'supermercado',
    title: '在超市 · En el supermercado',
    level: 2,
    kind: 'conversación',
    minutes: 2,
    note: 'Comprar fruta: preguntar, elegir y pagar.',
    lines: [
      say('你好，你要什么？', 'Nǐ hǎo, nǐ yào shénme?', 'Hola, ¿qué deseas?'),
      say('我要买水果。', 'Wǒ yào mǎi shuǐguǒ.', 'Quiero comprar fruta.'),
      say('苹果很好吃。', 'Píngguǒ hěn hǎochī.', 'Las manzanas están buenísimas.'),
      say('好的，我买三个苹果。', 'Hǎo de, wǒ mǎi sān gè píngguǒ.', 'Vale, compro tres manzanas.'),
      say('十二块，谢谢。', 'Shí’èr kuài, xièxie.', 'Doce yuanes, gracias.'),
      say('谢谢，再见！', 'Xièxie, zàijiàn!', '¡Gracias, adiós!'),
    ],
  },
  {
    id: 'direcciones',
    title: '问路 · Preguntar el camino',
    level: 3,
    kind: 'conversación',
    minutes: 2,
    note: 'Direcciones y distancias.',
    lines: [
      say(
        '请问，地铁站在哪儿？',
        'Qǐngwèn, dìtiě zhàn zài nǎr?',
        'Perdón, ¿dónde está la estación de metro?',
      ),
      say('一直走，前面就是。', 'Yìzhí zǒu, qiánmiàn jiù shì.', 'Sigue recto, está justo delante.'),
      say('远吗？', 'Yuǎn ma?', '¿Está lejos?'),
      say('不远，走五分钟。', 'Bù yuǎn, zǒu wǔ fēnzhōng.', 'No, cinco minutos andando.'),
      say('谢谢！', 'Xièxie!', '¡Gracias!'),
      say('不客气。', 'Bú kèqi.', 'De nada.'),
    ],
    question: {
      prompt: '¿Dónde está la estación de metro?',
      options: [
        { text: 'Justo delante, siguiendo recto', correct: true },
        { text: 'Muy lejos, a una hora', correct: false },
        { text: 'No hay estación de metro', correct: false },
      ],
      explain: 'La segunda línea dice 一直走，前面就是.',
    },
  },
  {
    id: 'restaurante',
    title: '在饭馆 · En el restaurante',
    level: 2,
    kind: 'conversación',
    minutes: 2,
    note: 'Pedir comida y bebida, y entender el total.',
    lines: [
      say('你好，你想吃什么？', 'Nǐ hǎo, nǐ xiǎng chī shénme?', 'Hola, ¿qué quieres comer?'),
      say('我想吃米饭和菜。', 'Wǒ xiǎng chī mǐfàn hé cài.', 'Quiero arroz y verdura.'),
      say('你要喝什么？', 'Nǐ yào hē shénme?', '¿Qué quieres beber?'),
      say('我要一杯茶。', 'Wǒ yào yì bēi chá.', 'Quiero una taza de té.'),
      say('好的，一共二十块。', 'Hǎo de, yígòng èrshí kuài.', 'Vale, son veinte yuanes en total.'),
      say('给你钱，谢谢！', 'Gěi nǐ qián, xièxie!', 'Aquí tienes, ¡gracias!'),
    ],
    question: {
      prompt: '¿Cuánto cuesta en total?',
      options: [
        { text: 'Veinte yuanes', correct: true },
        { text: 'Diez yuanes', correct: false },
        { text: 'Cincuenta yuanes', correct: false },
      ],
      explain: 'La quinta línea dice 一共二十块.',
    },
  },
  {
    id: 'dia-de-lluvia',
    title: '下雨的一天 · Un día de lluvia',
    level: 3,
    kind: 'historia',
    minutes: 3,
    note: 'Tiempo, planes en casa y una visita.',
    lines: [
      say('昨天天气不好。', 'Zuótiān tiānqì bù hǎo.', 'Ayer hizo mal tiempo.'),
      say('下午下雨了。', 'Xiàwǔ xià yǔ le.', 'Por la tarde llovió.'),
      say('我在家看书。', 'Wǒ zài jiā kàn shū.', 'Leí en casa.'),
      say(
        '朋友来了，我们一起做饭。',
        'Péngyou lái le, wǒmen yìqǐ zuò fàn.',
        'Vino un amigo y cocinamos juntos.',
      ),
      say('晚上我们看电影。', 'Wǎnshang wǒmen kàn diànyǐng.', 'Por la noche vimos una película.'),
      say('今天天气很好。', 'Jīntiān tiānqì hěn hǎo.', 'Hoy hace buen tiempo.'),
    ],
  },
];

/** Las micro-lecturas HSK 1 van primero: una por unidad. */
export const STORIES: Story[] = [...MICRO_STORIES, ...BASE_STORIES];
