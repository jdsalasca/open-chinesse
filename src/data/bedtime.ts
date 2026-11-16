import type { Line } from './stories';

export type BedtimeLine = Line & {
  /** Qué mirar en la frase: gramática, partícula o palabra clave. */
  explain: string;
};

export type BedtimeStory = {
  id: string;
  title: string;
  level: 1 | 2;
  minutes: number;
  note: string;
  lines: BedtimeLine[];
};

const say = (hanzi: string, pinyin: string, translation: string, explain: string): BedtimeLine => ({
  hanzi,
  pinyin,
  translation,
  explain,
});

/** Cuentos lentos, con vocabulario del curso y una explicación por línea. */
export const BEDTIME_STORIES: BedtimeStory[] = [
  {
    id: 'gatito',
    title: '小猫和我 · El gatito y yo',
    level: 1,
    minutes: 3,
    note: 'Un gatito, una taza de té y la hora de dormir.',
    lines: [
      say(
        '我有一个朋友。',
        'Wǒ yǒu yí gè péngyou.',
        'Tengo un amigo.',
        '«有» expresa posesión. «一个» usa el clasificador 个 delante del sustantivo.',
      ),
      say(
        '朋友是小猫。',
        'Péngyou shì xiǎo māo.',
        'El amigo es un gatito.',
        'La estructura A 是 B identifica. En chino no hace falta artículo antes de 小猫.',
      ),
      say(
        '小猫在我家。',
        'Xiǎo māo zài wǒ jiā.',
        'El gatito está en mi casa.',
        '«在 + lugar» indica dónde está. «我家» es mi casa, sin 的.',
      ),
      say(
        '小猫喝茶。',
        'Xiǎo māo hē chá.',
        'El gatito toma té.',
        'El verbo 喝 va antes del objeto 茶. El orden es sujeto + verbo + objeto.',
      ),
      say(
        '我们看书。',
        'Wǒmen kàn shū.',
        'Leemos.',
        '«看书» es leer, literalmente mirar un libro. «我们» es nosotros.',
      ),
      say(
        '小猫很高兴。',
        'Xiǎo māo hěn gāoxìng.',
        'El gatito está contento.',
        '«很 + adjetivo» describe el estado: 很高兴, muy contento.',
      ),
      say(
        '十点，小猫睡觉。',
        'Shí diǎn, xiǎo māo shuìjiào.',
        'A las diez, el gatito duerme.',
        'La hora se dice con 点: 十点, las diez. «睡觉» es dormir.',
      ),
      say(
        '我睡觉。',
        'Wǒ shuìjiào.',
        'Yo duermo.',
        'Frase mínima de sujeto y verbo. El cuento termina cuando todos duermen.',
      ),
    ],
  },
  {
    id: 'te',
    title: '妈妈的茶 · El té de mamá',
    level: 2,
    minutes: 3,
    note: 'Una tarde de lluvia, un libro y dos tazas de té.',
    lines: [
      say(
        '下午，妈妈在家里喝茶。',
        'Xiàwǔ, māma zài jiālǐ hē chá.',
        'Por la tarde, mamá toma té en casa.',
        '«下午» es la tarde. «喝茶» es tomar té; el verbo 喝 va antes de 茶.',
      ),
      say(
        '我坐在妈妈旁边。',
        'Wǒ zuò zài māma pángbiān.',
        'Me siento al lado de mamá.',
        '«坐在» combina el verbo 坐 con 在 para indicar el lugar. «旁边» es al lado.',
      ),
      say(
        '我给妈妈一本书。',
        'Wǒ gěi māma yì běn shū.',
        'Le doy un libro a mamá.',
        '«给» es dar. «一本书» usa el clasificador 本 para libros.',
      ),
      say(
        '妈妈笑了。',
        'Māma xiào le.',
        'Mamá se ríe.',
        '«笑了» indica que la acción de reír ocurre y cambia el ambiente.',
      ),
      say(
        '她说：“谢谢你。”',
        'Tā shuō: “Xièxie nǐ.”',
        'Ella dice: «Gracias».',
        '«说» es decir. Las comillas en chino usan “ ” y el contenido va tal cual.',
      ),
      say(
        '我们一起看书。',
        'Wǒmen yìqǐ kàn shū.',
        'Leemos juntos.',
        '«一起» es juntos; «看书» es leer, literalmente mirar un libro.',
      ),
      say(
        '外面下雨了。',
        'Wàimiàn xià yǔ le.',
        'Fuera empieza a llover.',
        '«下雨» es llover. «了» marca que la lluvia acaba de empezar.',
      ),
      say(
        '家里很好，我们很高兴。',
        'Jiālǐ hěn hǎo, wǒmen hěn gāoxìng.',
        'En casa se está bien; estamos contentos.',
        'Dos frases con 很: una para describir el lugar y otra para el estado de ánimo.',
      ),
    ],
  },
  {
    id: 'noche',
    title: '一个很好的晚上 · Una noche tranquila',
    level: 2,
    minutes: 3,
    note: 'Leer, beber té y mirar el cielo antes de dormir.',
    lines: [
      say(
        '晚上，我坐在门外。',
        'Wǎnshang, wǒ zuò zài mén wài.',
        'Por la noche, me siento fuera de la puerta.',
        '«门外» es fuera de la puerta. 在 indica el lugar donde ocurre la acción.',
      ),
      say(
        '天上很黑。',
        'Tiānshàng hěn hēi.',
        'El cielo está oscuro.',
        '«天上» es en el cielo. El adjetivo 黑 describe la noche.',
      ),
      say(
        '我喝一杯茶。',
        'Wǒ hē yì bēi chá.',
        'Bebo una taza de té.',
        '«一杯茶»: 杯 es el clasificador de tazas y vasos.',
      ),
      say(
        '我看一本书。',
        'Wǒ kàn yì běn shū.',
        'Leo un libro.',
        '«一本» usa 本, el clasificador de libros. 看 puede ser mirar o leer.',
      ),
      say(
        '书里有很多字。',
        'Shū lǐ yǒu hěn duō zì.',
        'En el libro hay muchos caracteres.',
        '«里» es dentro. «很多» es muchos; el verbo 有 indica existencia.',
      ),
      say(
        '我看得很高兴。',
        'Wǒ kàn de hěn gāoxìng.',
        'Leo muy contento.',
        'La estructura «verbo + 得 + adjetivo» describe cómo se hace la acción.',
      ),
      say(
        '十点，我睡觉。',
        'Shí diǎn, wǒ shuìjiào.',
        'A las diez, me voy a dormir.',
        'La hora se dice con 点: 十点, las diez en punto.',
      ),
      say(
        '晚上很好。',
        'Wǎnshang hěn hǎo.',
        'La noche es agradable.',
        'Una despedida sencilla: el adjetivo 好 cierra el cuento.',
      ),
    ],
  },
];
