import type { Line, Story } from './stories';

const say = (hanzi: string, pinyin: string, translation: string): Line => ({
  hanzi,
  pinyin,
  translation,
});

/**
 * Quince micro-lecturas, una por unidad de HSK 1. El test de graduación exige
 * que todas usen solo caracteres del vocabulario HSK 1.
 */
export const MICRO_STORIES: Story[] = [
  {
    id: 'micro-h1-01',
    unitId: 'h1-01',
    title: '你好！ · ¡Hola!',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 1 · Saludos y despedidas.',
    lines: [
      say('你好！我们是朋友。', 'Nǐ hǎo! Wǒmen shì péngyou.', '¡Hola! Somos amigos.'),
      say('谢谢你。', 'Xièxie nǐ.', 'Gracias.'),
      say('不客气。再见！', 'Bú kèqi. Zàijiàn!', 'De nada. ¡Adiós!'),
    ],
    question: {
      prompt: '¿Qué dicen al despedirse?',
      options: [
        { text: '再见', correct: true },
        { text: '谢谢', correct: false },
        { text: '对不起', correct: false },
      ],
      explain: 'La última línea termina con 再见.',
    },
  },
  {
    id: 'micro-h1-02',
    unitId: 'h1-02',
    title: '他是我朋友 · Él es mi amigo',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 2 · Personas y amistad.',
    lines: [
      say('他是我朋友。', 'Tā shì wǒ péngyou.', 'Él es mi amigo.'),
      say('她是谁？', 'Tā shì shéi?', '¿Quién es ella?'),
      say('她是你朋友。', 'Tā shì nǐ péngyou.', 'Ella es tu amiga.'),
    ],
    question: {
      prompt: '¿Qué son?',
      options: [
        { text: 'Amigos', correct: true },
        { text: 'Profesor y estudiante', correct: false },
        { text: 'Médicos', correct: false },
      ],
      explain: 'El texto repite 朋友 al presentarlos.',
    },
  },
  {
    id: 'micro-h1-03',
    unitId: 'h1-03',
    title: '一、二、三 · Uno, dos, tres',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 3 · Números del 1 al 10.',
    lines: [
      say('一，二，三，四，五。', 'Yī, èr, sān, sì, wǔ.', 'Uno, dos, tres, cuatro, cinco.'),
      say('六，七，八，九，十。', 'Liù, qī, bā, jiǔ, shí.', 'Seis, siete, ocho, nueve, diez.'),
      say(
        '十，九，八，七，六，五，四，三，二，一。',
        'Shí, jiǔ, bā, qī, liù, wǔ, sì, sān, èr, yī.',
        'Diez, nueve, ocho, siete, seis, cinco, cuatro, tres, dos, uno.',
      ),
    ],
    question: {
      prompt: '¿Hasta qué número llega en la segunda línea?',
      options: [
        { text: 'Diez', correct: true },
        { text: 'Cinco', correct: false },
        { text: 'Ocho', correct: false },
      ],
      explain: 'La segunda línea termina en 十.',
    },
  },
  {
    id: 'micro-h1-04',
    unitId: 'h1-04',
    title: '今天、明天、昨天 · Hoy, mañana, ayer',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 4 · Días y partes del día.',
    lines: [
      say(
        '昨天上午我学习汉语。',
        'Zuótiān shàngwǔ wǒ xuéxí Hànyǔ.',
        'Ayer por la mañana estudié chino.',
      ),
      say(
        '今天下午我朋友来我家。',
        'Jīntiān xiàwǔ wǒ péngyou lái wǒ jiā.',
        'Esta tarde mi amigo viene a mi casa.',
      ),
      say('明天中午我们吃饭。', 'Míngtiān zhōngwǔ wǒmen chīfàn.', 'Mañana al mediodía comemos.'),
    ],
    question: {
      prompt: '¿Cuándo viene el amigo?',
      options: [
        { text: 'Hoy por la tarde', correct: true },
        { text: 'Ayer por la mañana', correct: false },
        { text: 'Mañana al mediodía', correct: false },
      ],
      explain: 'La segunda línea dice 今天下午我朋友来我家.',
    },
  },
  {
    id: 'micro-h1-05',
    unitId: 'h1-05',
    title: '我家有四个人 · En mi casa hay cuatro personas',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 5 · Familia, edad y cantidad.',
    lines: [
      say(
        '我家有四个人。爸爸，妈妈，女儿和我。',
        'Wǒ jiā yǒu sì ge rén. Bàba, māma, nǚ’ér hé wǒ.',
        'En mi casa hay cuatro personas: papá, mamá, mi hija y yo.',
      ),
      say(
        '爸爸是医生，妈妈是老师。',
        'Bàba shì yīshēng, māma shì lǎoshī.',
        'Papá es médico; mamá, profesora.',
      ),
      say(
        '我女儿今年二十岁。',
        'Wǒ nǚ’ér jīnnián èrshí suì.',
        'Mi hija tiene veinte años este año.',
      ),
      say('你有几个朋友？', 'Nǐ yǒu jǐ ge péngyou?', '¿Cuántos amigos tienes?'),
    ],
    question: {
      prompt: '¿Cuántas personas hay en su casa?',
      options: [
        { text: 'Cuatro', correct: true },
        { text: 'Tres', correct: false },
        { text: 'Cinco', correct: false },
      ],
      explain: 'La primera línea dice 我家有四个人.',
    },
  },
  {
    id: 'micro-h1-06',
    unitId: 'h1-06',
    title: '在饭馆 · En el restaurante',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 6 · Comida y bebida.',
    lines: [
      say('我们去饭馆吃饭。', 'Wǒmen qù fànguǎn chīfàn.', 'Vamos al restaurante a comer.'),
      say(
        '我吃米饭和菜，喝一杯茶。',
        'Wǒ chī mǐfàn hé cài, hē yì bēi chá.',
        'Como arroz y verdura, y bebo una taza de té.',
      ),
      say(
        '朋友吃苹果和水果。',
        'Péngyou chī píngguǒ hé shuǐguǒ.',
        'Mi amigo come manzana y fruta.',
      ),
      say('水在桌子上。', 'Shuǐ zài zhuōzi shàng.', 'El agua está en la mesa.'),
    ],
    question: {
      prompt: '¿Qué bebe el narrador?',
      options: [
        { text: 'Una taza de té', correct: true },
        { text: 'Una taza de agua', correct: false },
        { text: 'Una manzana', correct: false },
      ],
      explain: 'La segunda línea dice 喝一杯茶.',
    },
  },
  {
    id: 'micro-h1-07',
    unitId: 'h1-07',
    title: '我的桌子 · Mi mesa',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 7 · Casa y objetos.',
    lines: [
      say(
        '我的桌子上有书和本。',
        'Wǒ de zhuōzi shàng yǒu shū hé běn.',
        'En mi mesa hay libros y cuadernos.',
      ),
      say('桌子上没有电脑。', 'Zhuōzi shàng méiyǒu diànnǎo.', 'En la mesa no hay ordenador.'),
      say('我的衣服在椅子上。', 'Wǒ de yīfu zài yǐzi shàng.', 'Mi ropa está en la silla.'),
      say(
        '电视在椅子前面。',
        'Diànshì zài yǐzi qiánmiàn.',
        'La televisión está delante de la silla.',
      ),
    ],
    question: {
      prompt: '¿Dónde está la ropa?',
      options: [
        { text: 'En la silla', correct: true },
        { text: 'En la mesa', correct: false },
        { text: 'Delante de la tele', correct: false },
      ],
      explain: 'La tercera línea dice 我的衣服在椅子上.',
    },
  },
  {
    id: 'micro-h1-08',
    unitId: 'h1-08',
    title: '北京 · Pekín',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 8 · Lugares y posiciones.',
    lines: [
      say(
        '我朋友在中国北京。',
        'Wǒ péngyou zài Zhōngguó Běijīng.',
        'Mi amigo está en Pekín, China.',
      ),
      say(
        '他在火车站后面工作。',
        'Tā zài huǒchēzhàn hòumiàn gōngzuò.',
        'Trabaja detrás de la estación de tren.',
      ),
      say(
        '前面是商店，后面是医院。',
        'Qiánmiàn shì shāngdiàn, hòumiàn shì yīyuàn.',
        'Delante hay una tienda; detrás, un hospital.',
      ),
    ],
    question: {
      prompt: '¿Dónde trabaja el amigo?',
      options: [
        { text: 'Detrás de la estación de tren', correct: true },
        { text: 'En el hospital', correct: false },
        { text: 'En la tienda', correct: false },
      ],
      explain: 'La segunda línea dice 在火车站后面工作.',
    },
  },
  {
    id: 'micro-h1-09',
    unitId: 'h1-09',
    title: '去北京 · Ir a Pekín',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 9 · Moverse y viajar.',
    lines: [
      say(
        '明天我坐飞机去北京。',
        'Míngtiān wǒ zuò fēijī qù Běijīng.',
        'Mañana voy a Pekín en avión.',
      ),
      say(
        '朋友坐出租车来火车站。',
        'Péngyou zuò chūzūchē lái huǒchēzhàn.',
        'Mi amigo viene a la estación de tren en taxi.',
      ),
      say(
        '我们回中国，住在北京。',
        'Wǒmen huí Zhōngguó, zhù zài Běijīng.',
        'Volvemos a China y vivimos en Pekín.',
      ),
      say(
        '在北京我看朋友，打电话。',
        'Zài Běijīng wǒ kàn péngyou, dǎ diànhuà.',
        'En Pekín visito a un amigo y hago una llamada.',
      ),
    ],
    question: {
      prompt: '¿Cómo va el narrador a Pekín?',
      options: [
        { text: 'En avión', correct: true },
        { text: 'En taxi', correct: false },
        { text: 'En tren', correct: false },
      ],
      explain: 'La primera línea dice 坐飞机去北京.',
    },
  },
  {
    id: 'micro-h1-10',
    unitId: 'h1-10',
    title: '我的一天 · Mi día',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 10 · Acciones diarias.',
    lines: [
      say(
        '上午我读汉语，写汉字。',
        'Shàngwǔ wǒ dú Hànyǔ, xiě Hànzì.',
        'Por la mañana leo chino y escribo caracteres.',
      ),
      say(
        '下午我去商店买东西。',
        'Xiàwǔ wǒ qù shāngdiàn mǎi dōngxi.',
        'Por la tarde voy a la tienda a comprar cosas.',
      ),
      say('现在我想睡觉。', 'Xiànzài wǒ xiǎng shuìjiào.', 'Ahora quiero dormir.'),
      say(
        '明天我买书，看书。',
        'Míngtiān wǒ mǎi shū, kàn shū.',
        'Mañana compro un libro y lo leo.',
      ),
    ],
    question: {
      prompt: '¿Qué hace por la tarde?',
      options: [
        { text: 'Va a la tienda a comprar', correct: true },
        { text: 'Duerme', correct: false },
        { text: 'Lee chino', correct: false },
      ],
      explain: 'La segunda línea dice 下午我去商店买东西.',
    },
  },
  {
    id: 'micro-h1-11',
    unitId: 'h1-11',
    title: '我的学校 · Mi escuela',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 11 · Escuela y trabajo.',
    lines: [
      say('我的学校很大。', 'Wǒ de xuéxiào hěn dà.', 'Mi escuela es grande.'),
      say(
        '老师认识学生，学生认识老师。',
        'Lǎoshī rènshi xuésheng, xuésheng rènshi lǎoshī.',
        'El profesor conoce al estudiante y el estudiante al profesor.',
      ),
      say(
        '我学习汉语，写汉字。',
        'Wǒ xuéxí Hànyǔ, xiě Hànzì.',
        'Estudio chino y escribo caracteres.',
      ),
      say(
        '我朋友在学校工作。',
        'Wǒ péngyou zài xuéxiào gōngzuò.',
        'Mi amigo trabaja en la escuela.',
      ),
    ],
    question: {
      prompt: '¿Dónde trabaja el amigo?',
      options: [
        { text: 'En la escuela', correct: true },
        { text: 'En el hospital', correct: false },
        { text: 'En la tienda', correct: false },
      ],
      explain: 'La cuarta línea dice 在学校工作.',
    },
  },
  {
    id: 'micro-h1-12',
    unitId: 'h1-12',
    title: '今天很热 · Hoy hace calor',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 12 · Describir y opinar.',
    lines: [
      say('今天天气很热。', 'Jīntiān tiānqì hěn rè.', 'Hoy hace mucho calor.'),
      say(
        '明天天气冷，我不高兴。',
        'Míngtiān tiānqì lěng, wǒ bù gāoxìng.',
        'Mañana hará frío y no estoy contento.',
      ),
      say(
        '我朋友的家很大，很漂亮。',
        'Wǒ péngyou de jiā hěn dà, hěn piàoliang.',
        'La casa de mi amigo es grande y bonita.',
      ),
      say('他家有很多书。', 'Tā jiā yǒu hěn duō shū.', 'En su casa hay muchos libros.'),
    ],
    question: {
      prompt: '¿Cómo es la casa?',
      options: [
        { text: 'Grande y bonita', correct: true },
        { text: 'Pequeña y fría', correct: false },
        { text: 'Con pocos libros', correct: false },
      ],
      explain: 'La tercera línea dice 很大，很漂亮.',
    },
  },
  {
    id: 'micro-h1-13',
    unitId: 'h1-13',
    title: '我的猫 · Mi gato',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 13 · Animales y oficios.',
    lines: [
      say('我家有猫和狗。', 'Wǒ jiā yǒu māo hé gǒu.', 'En mi casa hay un gato y un perro.'),
      say('猫很小，狗很大。', 'Māo hěn xiǎo, gǒu hěn dà.', 'El gato es pequeño; el perro, grande.'),
      say(
        '我喜欢猫，我朋友喜欢狗。',
        'Wǒ xǐhuan māo, wǒ péngyou xǐhuan gǒu.',
        'Me gustan los gatos; a mi amigo, los perros.',
      ),
      say(
        '我朋友是医生，他很好。',
        'Wǒ péngyou shì yīshēng, tā hěn hǎo.',
        'Mi amigo es médico y es muy bueno.',
      ),
    ],
    question: {
      prompt: '¿Qué animal le gusta al narrador?',
      options: [
        { text: 'El gato', correct: true },
        { text: 'El perro', correct: false },
        { text: 'Los dos', correct: false },
      ],
      explain: 'La tercera línea dice 我喜欢猫.',
    },
  },
  {
    id: 'micro-h1-14',
    unitId: 'h1-14',
    title: '下雨了 · Está lloviendo',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 14 · Tiempo y clima.',
    lines: [
      say('今天下雨，天气很冷。', 'Jīntiān xiàyǔ, tiānqì hěn lěng.', 'Hoy llueve y hace frío.'),
      say('现在三点。', 'Xiànzài sān diǎn.', 'Ahora son las tres.'),
      say('这个月天气怎么样？', 'Zhège yuè tiānqì zěnmeyàng?', '¿Qué tiempo hace este mes?'),
      say('这个月下雨，很冷。', 'Zhège yuè xiàyǔ, hěn lěng.', 'Este mes llueve y hace frío.'),
    ],
    question: {
      prompt: '¿Qué tiempo hace este mes?',
      options: [
        { text: 'Lluvia y frío', correct: true },
        { text: 'Sol y calor', correct: false },
        { text: 'Nieve', correct: false },
      ],
      explain: 'La cuarta línea dice 下雨，很冷.',
    },
  },
  {
    id: 'micro-h1-15',
    unitId: 'h1-15',
    title: '多少钱？ · ¿Cuánto cuesta?',
    level: 1,
    kind: 'micro-lectura',
    minutes: 1,
    note: 'Unidad 15 · Dinero y partículas.',
    lines: [
      say(
        '先生，那本书多少钱？',
        'Xiānsheng, nà běn shū duōshao qián?',
        'Señor, ¿cuánto cuesta ese libro?',
      ),
      say('二十块。', 'Èrshí kuài.', 'Veinte yuanes.'),
      say(
        '我有十块，朋友有十块。',
        'Wǒ yǒu shí kuài, péngyou yǒu shí kuài.',
        'Tengo diez yuanes; mi amigo, diez.',
      ),
      say('我们都说谢谢。', 'Wǒmen dōu shuō xièxie.', 'Todos decimos gracias.'),
    ],
    question: {
      prompt: '¿Cuánto cuesta el libro?',
      options: [
        { text: 'Veinte yuanes', correct: true },
        { text: 'Diez yuanes', correct: false },
        { text: 'Treinta yuanes', correct: false },
      ],
      explain: 'La segunda línea dice 二十块.',
    },
  },
];
