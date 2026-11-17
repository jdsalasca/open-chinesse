export type TransformSentence = { hanzi: string; pinyin: string; translation: string };

export type TransformOption = TransformSentence & { correct: boolean };

export type Transformation = {
  id: string;
  level: 1 | 2 | 3;
  base: TransformSentence;
  intent: string;
  options: TransformOption[];
  explain: string;
};

const opt = (
  hanzi: string,
  pinyin: string,
  translation: string,
  correct = false,
): TransformOption => ({ hanzi, pinyin, translation, correct });

export const TRANSFORMATIONS: Transformation[] = [
  {
    id: 'time-tea',
    level: 1,
    base: { hanzi: '我今天喝茶。', pinyin: 'Wǒ jīntiān hē chá.', translation: 'Hoy bebo té.' },
    intent: 'Quiero decir que beberé té mañana.',
    options: [
      opt('我明天喝茶。', 'Wǒ míngtiān hē chá.', 'Mañana bebo té.', true),
      opt('我昨天喝茶。', 'Wǒ zuótiān hē chá.', 'Ayer bebí té.'),
      opt('我今天不喝茶。', 'Wǒ jīntiān bù hē chá.', 'Hoy no bebo té.'),
    ],
    explain: 'Solo cambia el tiempo: 今天 → 明天.',
  },
  {
    id: 'school-no',
    level: 1,
    base: { hanzi: '我去学校。', pinyin: 'Wǒ qù xuéxiào.', translation: 'Voy a la escuela.' },
    intent: 'Quiero decir que no voy a la escuela.',
    options: [
      opt('我不去学校。', 'Wǒ bú qù xuéxiào.', 'No voy a la escuela.', true),
      opt('我没去学校。', 'Wǒ méi qù xuéxiào.', 'No fui a la escuela.'),
      opt('我去学校吗？', 'Wǒ qù xuéxiào ma?', '¿Voy a la escuela?'),
    ],
    explain: 'Para negar un plan uso 不: 不去.',
  },
  {
    id: 'rice-no-past',
    level: 1,
    base: { hanzi: '他吃米饭。', pinyin: 'Tā chī mǐfàn.', translation: 'Él come arroz.' },
    intent: 'Quiero decir que él no comió arroz.',
    options: [
      opt('他没吃米饭。', 'Tā méi chī mǐfàn.', 'Él no comió arroz.', true),
      opt('他不吃米饭。', 'Tā bù chī mǐfàn.', 'Él no come arroz.'),
      opt('他吃米饭了。', 'Tā chī mǐfàn le.', 'Él comió arroz.'),
    ],
    explain: 'La acción pasada que no ocurrió pide 没: 没吃.',
  },
  {
    id: 'cat-none',
    level: 1,
    base: {
      hanzi: '我家有猫。',
      pinyin: 'Wǒ jiā yǒu māo.',
      translation: 'En mi casa hay un gato.',
    },
    intent: 'Quiero decir que en mi casa no hay gato.',
    options: [
      opt('我家没有猫。', 'Wǒ jiā méiyǒu māo.', 'En mi casa no hay gato.', true),
      opt('我家不有猫。', 'Wǒ jiā bù yǒu māo.', 'En mi casa no hay gato (forma incorrecta).'),
      opt('我家有猫吗？', 'Wǒ jiā yǒu māo ma?', '¿Hay un gato en mi casa?'),
    ],
    explain: '有 siempre se niega con 没: 没有.',
  },
  {
    id: 'tea-dislike',
    level: 1,
    base: { hanzi: '她喜欢茶。', pinyin: 'Tā xǐhuan chá.', translation: 'A ella le gusta el té.' },
    intent: 'Quiero decir que a ella no le gusta el té.',
    options: [
      opt('她不喜欢茶。', 'Tā bù xǐhuan chá.', 'A ella no le gusta el té.', true),
      opt('她没喜欢茶。', 'Tā méi xǐhuan chá.', 'A ella no le gusta el té (forma incorrecta).'),
      opt('她喜欢茶吗？', 'Tā xǐhuan chá ma?', '¿Le gusta el té?'),
    ],
    explain: 'Un gusto es presente y estable: 不喜欢.',
  },
  {
    id: 'home-yesterday',
    level: 2,
    base: {
      hanzi: '我们在家吃饭。',
      pinyin: 'Wǒmen zài jiā chīfàn.',
      translation: 'Comemos en casa.',
    },
    intent: 'Quiero decir que ayer comimos en casa.',
    options: [
      opt('我们昨天在家吃饭。', 'Wǒmen zuótiān zài jiā chīfàn.', 'Ayer comimos en casa.', true),
      opt('我们明天在家吃饭。', 'Wǒmen míngtiān zài jiā chīfàn.', 'Mañana comemos en casa.'),
      opt('我们不在家吃饭。', 'Wǒmen bú zài jiā chīfàn.', 'No comemos en casa.'),
    ],
    explain: 'El tiempo va antes del lugar: 昨天在家吃饭.',
  },
  {
    id: 'plane-no-past',
    level: 3,
    base: {
      hanzi: '他坐飞机去北京。',
      pinyin: 'Tā zuò fēijī qù Běijīng.',
      translation: 'Él va a Pekín en avión.',
    },
    intent: 'Quiero decir que no fue en avión a Pekín.',
    options: [
      opt('他没坐飞机去北京。', 'Tā méi zuò fēijī qù Běijīng.', 'No fue a Pekín en avión.', true),
      opt('他不坐飞机去北京。', 'Tā bù zuò fēijī qù Běijīng.', 'No va a Pekín en avión.'),
      opt('他坐飞机不去北京。', 'Tā zuò fēijī bú qù Běijīng.', 'Va en avión y no a Pekín.'),
    ],
    explain: 'El viaje no ocurrió: 没 + verbo, no 不.',
  },
  {
    id: 'book-price',
    level: 2,
    base: {
      hanzi: '这本书二十块。',
      pinyin: 'Zhè běn shū èrshí kuài.',
      translation: 'Este libro cuesta veinte yuanes.',
    },
    intent: 'Quiero preguntar cuánto cuesta.',
    options: [
      opt('这本书多少钱？', 'Zhè běn shū duōshao qián?', '¿Cuánto cuesta este libro?', true),
      opt('这本书二十块吗？', 'Zhè běn shū èrshí kuài ma?', '¿Este libro cuesta veinte yuanes?'),
      opt(
        '这本书什么钱？',
        'Zhè běn shū shénme qián?',
        '¿Qué dinero es este libro? (forma incorrecta).',
      ),
    ],
    explain: 'Para preguntar el precio: 多少钱.',
  },
  {
    id: 'know-no',
    level: 1,
    base: { hanzi: '我认识他。', pinyin: 'Wǒ rènshi tā.', translation: 'Lo conozco.' },
    intent: 'Quiero decir que no lo conozco.',
    options: [
      opt('我不认识他。', 'Wǒ bú rènshi tā.', 'No lo conozco.', true),
      opt('我没认识他。', 'Wǒ méi rènshi tā.', 'No lo conocí (forma incorrecta).'),
      opt('我认识他吗？', 'Wǒ rènshi tā ma?', '¿Lo conozco?'),
    ],
    explain: 'Conocer es un estado presente: 不认识.',
  },
  {
    id: 'friend-no',
    level: 1,
    base: { hanzi: '她是我朋友。', pinyin: 'Tā shì wǒ péngyou.', translation: 'Ella es mi amiga.' },
    intent: 'Quiero decir que ella no es mi amiga.',
    options: [
      opt('她不是我朋友。', 'Tā bú shì wǒ péngyou.', 'Ella no es mi amiga.', true),
      opt('她没是我朋友。', 'Tā méi shì wǒ péngyou.', 'Ella no es mi amiga (forma incorrecta).'),
      opt('她是我朋友吗？', 'Tā shì wǒ péngyou ma?', '¿Es mi amiga?'),
    ],
    explain: 'La identidad se niega con 不: 不是.',
  },
  {
    id: 'hot-yesterday',
    level: 2,
    base: { hanzi: '今天很热。', pinyin: 'Jīntiān hěn rè.', translation: 'Hoy hace mucho calor.' },
    intent: 'Quiero decir que ayer no hacía calor.',
    options: [
      opt('昨天不热。', 'Zuótiān bú rè.', 'Ayer no hacía calor.', true),
      opt('昨天没热。', 'Zuótiān méi rè.', 'Ayer no hizo calor (forma incorrecta).'),
      opt('明天不热。', 'Míngtiān bú rè.', 'Mañana no hace calor.'),
    ],
    explain: 'Con adjetivos uso 不; el tiempo cambia a 昨天.',
  },
  {
    id: 'water-no-want',
    level: 1,
    base: { hanzi: '我想喝水。', pinyin: 'Wǒ xiǎng hē shuǐ.', translation: 'Quiero beber agua.' },
    intent: 'Quiero decir que no quiero beber agua.',
    options: [
      opt('我不想喝水。', 'Wǒ bù xiǎng hē shuǐ.', 'No quiero beber agua.', true),
      opt('我没想喝水。', 'Wǒ méi xiǎng hē shuǐ.', 'No quise beber agua (forma incorrecta).'),
      opt('我想不喝水。', 'Wǒ xiǎng bù hē shuǐ.', 'Quiero no beber agua (forma incorrecta).'),
    ],
    explain: 'La negación de 想 va delante: 不想.',
  },
  {
    id: 'chinese-no-can',
    level: 3,
    base: {
      hanzi: '他会说汉语。',
      pinyin: 'Tā huì shuō Hànyǔ.',
      translation: 'Él sabe hablar chino.',
    },
    intent: 'Quiero decir que él no sabe hablar chino.',
    options: [
      opt('他不会说汉语。', 'Tā bú huì shuō Hànyǔ.', 'Él no sabe hablar chino.', true),
      opt(
        '他不能说汉语。',
        'Tā bù néng shuō Hànyǔ.',
        'Él no puede hablar chino (por una circunstancia).',
      ),
      opt(
        '他没会说汉语。',
        'Tā méi huì shuō Hànyǔ.',
        'Él no sabía hablar chino (forma incorrecta).',
      ),
    ],
    explain: 'Habilidad aprendida: 不会. 不能 es no poder por una circunstancia.',
  },
  {
    id: 'apples-yesterday',
    level: 1,
    base: { hanzi: '我买苹果。', pinyin: 'Wǒ mǎi píngguǒ.', translation: 'Compro manzanas.' },
    intent: 'Quiero decir que ayer compré manzanas.',
    options: [
      opt('我昨天买了苹果。', 'Wǒ zuótiān mǎi le píngguǒ.', 'Ayer compré manzanas.', true),
      opt('我明天买苹果。', 'Wǒ míngtiān mǎi píngguǒ.', 'Mañana compro manzanas.'),
      opt('我没买苹果。', 'Wǒ méi mǎi píngguǒ.', 'No compré manzanas.'),
    ],
    explain: 'Pasado completado: 昨天 + 了.',
  },
  {
    id: 'wake-eight',
    level: 2,
    base: {
      hanzi: '我每天七点起床。',
      pinyin: 'Wǒ měitiān qī diǎn qǐchuáng.',
      translation: 'Me levanto a las siete todos los días.',
    },
    intent: 'Quiero decir que mañana me levanto a las ocho.',
    options: [
      opt(
        '明天我八点起床。',
        'Míngtiān wǒ bā diǎn qǐchuáng.',
        'Mañana me levanto a las ocho.',
        true,
      ),
      opt('昨天我八点起床。', 'Zuótiān wǒ bā diǎn qǐchuáng.', 'Ayer me levanté a las ocho.'),
      opt('明天我七点起床。', 'Míngtiān wǒ qī diǎn qǐchuáng.', 'Mañana me levanto a las siete.'),
    ],
    explain: 'Cambian dos cosas: 每天 → 明天 y 七 → 八.',
  },
  {
    id: 'clothes-no-past',
    level: 1,
    base: { hanzi: '她穿衣服。', pinyin: 'Tā chuān yīfu.', translation: 'Ella se viste.' },
    intent: 'Quiero decir que ella no se vistió.',
    options: [
      opt('她没穿衣服。', 'Tā méi chuān yīfu.', 'Ella no se vistió.', true),
      opt('她不穿衣服。', 'Tā bù chuān yīfu.', 'Ella no se viste (hábito).'),
      opt('她穿衣服了。', 'Tā chuān yīfu le.', 'Ella se vistió.'),
    ],
    explain: 'La acción pasada que no ocurrió: 没穿.',
  },
  {
    id: 'train-no-past',
    level: 3,
    base: {
      hanzi: '我们坐火车去北京。',
      pinyin: 'Wǒmen zuò huǒchē qù Běijīng.',
      translation: 'Vamos a Pekín en tren.',
    },
    intent: 'Quiero decir que no fuimos en tren a Pekín.',
    options: [
      opt(
        '我们没坐火车去北京。',
        'Wǒmen méi zuò huǒchē qù Běijīng.',
        'No fuimos a Pekín en tren.',
        true,
      ),
      opt('我们不坐火车去北京。', 'Wǒmen bú zuò huǒchē qù Běijīng.', 'No vamos a Pekín en tren.'),
      opt('我们坐火车不去北京。', 'Wǒmen zuò huǒchē bú qù Běijīng.', 'Vamos en tren y no a Pekín.'),
    ],
    explain: 'El viaje no ocurrió: 没 + verbo.',
  },
  {
    id: 'weather-cold',
    level: 2,
    base: { hanzi: '天气很好。', pinyin: 'Tiānqì hěn hǎo.', translation: 'Hace buen tiempo.' },
    intent: 'Quiero decir que mañana hará frío.',
    options: [
      opt('明天天气很冷。', 'Míngtiān tiānqì hěn lěng.', 'Mañana hará frío.', true),
      opt('昨天天气很冷。', 'Zuótiān tiānqì hěn lěng.', 'Ayer hizo frío.'),
      opt('明天天气很好。', 'Míngtiān tiānqì hěn hǎo.', 'Mañana hará buen tiempo.'),
    ],
    explain: 'Cambian el tiempo (明天) y el adjetivo (冷).',
  },
  {
    id: 'reading-yesterday',
    level: 2,
    base: { hanzi: '他在家看书。', pinyin: 'Tā zài jiā kàn shū.', translation: 'Él lee en casa.' },
    intent: 'Quiero decir que ayer leyó en casa.',
    options: [
      opt('他昨天在家看书。', 'Tā zuótiān zài jiā kàn shū.', 'Ayer leyó en casa.', true),
      opt('他明天在家看书。', 'Tā míngtiān zài jiā kàn shū.', 'Mañana leerá en casa.'),
      opt('他不在家看书。', 'Tā bú zài jiā kàn shū.', 'No lee en casa.'),
    ],
    explain: 'Añade 昨天 antes de 在家.',
  },
  {
    id: 'breakfast-none',
    level: 1,
    base: { hanzi: '我吃早饭。', pinyin: 'Wǒ chī zǎofàn.', translation: 'Desayuno.' },
    intent: 'Quiero decir que no desayuné.',
    options: [
      opt('我没吃早饭。', 'Wǒ méi chī zǎofàn.', 'No desayuné.', true),
      opt('我不吃早饭。', 'Wǒ bù chī zǎofàn.', 'No desayuno (hábito).'),
      opt('我吃早饭了。', 'Wǒ chī zǎofàn le.', 'Ya desayuné.'),
    ],
    explain: 'La acción pasada que no ocurrió: 没吃.',
  },
];
