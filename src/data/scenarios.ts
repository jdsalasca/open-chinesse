export type Speaker = 'otro' | 'yo';

export type ScenarioLine = {
  id: string;
  speaker: Speaker;
  hanzi: string;
  pinyin: string;
  translation: string;
};

export type ScenarioOption = {
  hanzi: string;
  pinyin: string;
  translation: string;
  correct: boolean;
  feedback: string;
};

export type ScenarioStep =
  | { kind: 'line'; line: ScenarioLine }
  | { kind: 'choice'; prompt: ScenarioLine; options: ScenarioOption[] };

export type Scenario = {
  id: string;
  title: string;
  place: string;
  level: 1 | 2 | 3;
  goal: string;
  minutes: number;
  steps: ScenarioStep[];
};

const line = (id: string, hanzi: string, pinyin: string, translation: string): ScenarioLine => ({
  id,
  speaker: 'otro',
  hanzi,
  pinyin,
  translation,
});

const say = (value: ScenarioLine): ScenarioStep => ({ kind: 'line', line: value });

const ask = (prompt: ScenarioLine, options: ScenarioOption[]): ScenarioStep => ({
  kind: 'choice',
  prompt,
  options,
});

const right = (
  hanzi: string,
  pinyin: string,
  translation: string,
  feedback: string,
): ScenarioOption => ({ hanzi, pinyin, translation, correct: true, feedback });

const wrong = (
  hanzi: string,
  pinyin: string,
  translation: string,
  feedback: string,
): ScenarioOption => ({ hanzi, pinyin, translation, correct: false, feedback });

/** Diálogos con una decisión por escena. El nivel se verifica con test. */
export const SCENARIOS: Scenario[] = [
  {
    id: 'primer-contacto',
    title: 'Primer contacto',
    place: 'En la universidad',
    level: 1,
    goal: 'Presentarte y responder sobre ti',
    minutes: 3,
    steps: [
      say(
        line(
          'l01',
          '你好！我是你的朋友。',
          'Nǐ hǎo! Wǒ shì nǐ de péngyou.',
          '¡Hola! Soy tu amigo.',
        ),
      ),
      ask(line('p01', '你叫什么名字？', 'Nǐ jiào shénme míngzi?', '¿Cómo te llamas?'), [
        right(
          '我叫月月。',
          'Wǒ jiào Yuèyue.',
          'Me llamo Yueyue.',
          '«我叫…» es la fórmula para decir tu nombre.',
        ),
        wrong(
          '我很好。',
          'Wǒ hěn hǎo.',
          'Estoy bien.',
          'Eso responde a «¿cómo estás?», no a un nombre.',
        ),
        wrong(
          '谢谢你。',
          'Xièxie nǐ.',
          'Gracias.',
          'Un nombre no se agradece: responde con «我叫…».',
        ),
      ]),
      say(
        line(
          'l02',
          '很高兴认识你。你是学生吗？',
          'Hěn gāoxìng rènshi nǐ. Nǐ shì xuéshēng ma?',
          'Mucho gusto. ¿Eres estudiante?',
        ),
      ),
      ask(line('p02', '你是学生吗？', 'Nǐ shì xuéshēng ma?', '¿Eres estudiante?'), [
        right(
          '是，我是学生。',
          'Shì, wǒ shì xuéshēng.',
          'Sí, soy estudiante.',
          '«是» confirma y repite la información.',
        ),
        wrong(
          '我叫月月。',
          'Wǒ jiào Yuèyue.',
          'Me llamo Yueyue.',
          'Ya dijiste tu nombre; ahora toca responder sí o no.',
        ),
        wrong(
          '很高兴。',
          'Hěn gāoxìng.',
          'Muy contento.',
          'La pregunta pide un sí o un no sobre ser estudiante.',
        ),
      ]),
      say(
        line(
          'l03',
          '我是学生。认识你很高兴，再见！',
          'Wǒ shì xuéshēng. Rènshi nǐ hěn gāoxìng, zàijiàn!',
          'Soy estudiante. Mucho gusto, ¡adiós!',
        ),
      ),
      ask(
        line(
          'p03',
          '认识你很高兴，再见！',
          'Rènshi nǐ hěn gāoxìng, zàijiàn!',
          'Mucho gusto, ¡adiós!',
        ),
        [
          right(
            '认识你很高兴，再见！',
            'Rènshi nǐ hěn gāoxìng, zàijiàn!',
            'Mucho gusto, ¡adiós!',
            'Devolver el saludo cierra la conversación.',
          ),
          wrong(
            '我不是学生。',
            'Wǒ bú shì xuéshēng.',
            'No soy estudiante.',
            'No hay nada que saber: es una despedida.',
          ),
          wrong(
            '我是老师。',
            'Wǒ shì lǎoshī.',
            'Soy profesor.',
            'La situación es una despedida, no una presentación.',
          ),
        ],
      ),
    ],
  },
  {
    id: 'cafeteria',
    title: 'En la cafetería',
    place: 'Una cafetería',
    level: 2,
    goal: 'Pedir una bebida y pagar',
    minutes: 4,
    steps: [
      say(line('l01', '你好，你要什么？', 'Nǐ hǎo, nǐ yào shénme?', 'Hola, ¿qué deseas?')),
      ask(line('p01', '你要喝什么？', 'Nǐ yào hē shénme?', '¿Qué quieres beber?'), [
        right(
          '我要一杯茶。',
          'Wǒ yào yì bēi chá.',
          'Quiero una taza de té.',
          '«一杯茶» usa el clasificador 杯 para bebidas.',
        ),
        wrong(
          '我要一个茶。',
          'Wǒ yào yí gè chá.',
          'Quiero un té.',
          'El té se cuenta con 杯, no con 个.',
        ),
        wrong(
          '我不喝茶。',
          'Wǒ bù hē chá.',
          'No bebo té.',
          'Es una frase válida, pero no pide nada.',
        ),
      ]),
      ask(
        line(
          'p02',
          '好的，一杯茶。你还要别的吗？',
          'Hǎo de, yì bēi chá. Nǐ hái yào bié de ma?',
          'Vale, una taza de té. ¿Algo más?',
        ),
        [
          right(
            '不要了，谢谢。',
            'Bú yào le, xièxie.',
            'No, gracias.',
            '«不要了» cierra el pedido con cortesía.',
          ),
          wrong(
            '我是学生。',
            'Wǒ shì xuéshēng.',
            'Soy estudiante.',
            'Eso no responde a si quieres algo más.',
          ),
          wrong(
            '我不知道。',
            'Wǒ bù zhīdào.',
            'No lo sé.',
            'Aquí sí sabes lo que quieres: responde al pedido.',
          ),
        ],
      ),
      ask(line('p03', '一共十二块。', 'Yígòng shí’èr kuài.', 'Son doce yuanes en total.'), [
        right(
          '好的，给你钱。',
          'Hǎo de, gěi nǐ qián.',
          'Vale, aquí tienes.',
          'Pagas y cierras la compra.',
        ),
        wrong(
          '太贵了，我不买。',
          'Tài guì le, wǒ bù mǎi.',
          'Es muy caro, no lo compro.',
          'Puedes negociar, pero ya pediste la bebida.',
        ),
        wrong('再见。', 'Zàijiàn.', 'Adiós.', 'Antes de irte hay que pagar.'),
      ]),
      say(line('l02', '谢谢，再见！', 'Xièxie, zàijiàn!', '¡Gracias, adiós!')),
    ],
  },
  {
    id: 'fruteria',
    title: 'En la frutería',
    place: 'Un puesto de fruta',
    level: 2,
    goal: 'Comprar fruta y entender el precio',
    minutes: 3,
    steps: [
      say(
        line(
          'l01',
          '你好，你想买什么？',
          'Nǐ hǎo, nǐ xiǎng mǎi shénme?',
          'Hola, ¿qué quieres comprar?',
        ),
      ),
      ask(line('p01', '你想买什么？', 'Nǐ xiǎng mǎi shénme?', '¿Qué quieres comprar?'), [
        right(
          '我想买水果。',
          'Wǒ xiǎng mǎi shuǐguǒ.',
          'Quiero comprar fruta.',
          '«想买» expresa lo que quieres comprar.',
        ),
        wrong(
          '我想喝水。',
          'Wǒ xiǎng hē shuǐ.',
          'Quiero beber agua.',
          'En una frutería se compra fruta, no se pide agua.',
        ),
        wrong(
          '我想回家。',
          'Wǒ xiǎng huí jiā.',
          'Quiero ir a casa.',
          'Eso termina la conversación sin comprar nada.',
        ),
      ]),
      ask(line('p02', '你要几个苹果？', 'Nǐ yào jǐ gè píngguǒ?', '¿Cuántas manzanas quieres?'), [
        right(
          '我要三个苹果。',
          'Wǒ yào sān gè píngguǒ.',
          'Quiero tres manzanas.',
          'Cantidad + clasificador 个 + sustantivo.',
        ),
        wrong(
          '我要三杯苹果。',
          'Wǒ yào sān bēi píngguǒ.',
          'Quiero tres tazas de manzana.',
          'Las manzanas se cuentan con 个, no con 杯.',
        ),
        wrong(
          '我要三个水果。',
          'Wǒ yào sān gè shuǐguǒ.',
          'Quiero tres frutas.',
          'La pregunta concreta son manzanas: responde «苹果».',
        ),
      ]),
      ask(
        line('p03', '三个苹果九块。', 'Sān gè píngguǒ jiǔ kuài.', 'Tres manzanas, nueve yuanes.'),
        [
          right(
            '好的，我买。',
            'Hǎo de, wǒ mǎi.',
            'Vale, las compro.',
            'Aceptas y cierras la compra.',
          ),
          wrong(
            '太贵了，我不买。',
            'Tài guì le, wǒ bù mǎi.',
            'Es muy caro, no las compro.',
            'Es una respuesta posible, pero la meta era comprar.',
          ),
          wrong(
            '我不知道。',
            'Wǒ bù zhīdào.',
            'No lo sé.',
            'Ya sabes el precio: decide si compras o no.',
          ),
        ],
      ),
      say(
        line(
          'l02',
          '好的，给你。谢谢！',
          'Hǎo de, gěi nǐ. Xièxie!',
          'Vale, aquí tienes. ¡Gracias!',
        ),
      ),
    ],
  },
  {
    id: 'metro',
    title: 'Perdido en el metro',
    place: 'Una calle cerca del metro',
    level: 3,
    goal: 'Preguntar cómo llegar y despedirte',
    minutes: 4,
    steps: [
      say(line('l01', '你怎么了？', 'Nǐ zěnme le?', '¿Qué te pasa?')),
      ask(line('p01', '你怎么了？', 'Nǐ zěnme le?', '¿Qué te pasa?'), [
        right(
          '我找不到地铁站。',
          'Wǒ zhǎo bú dào dìtiě zhàn.',
          'No encuentro la estación de metro.',
          '«找不到» explica el problema con claridad.',
        ),
        wrong(
          '我很高兴。',
          'Wǒ hěn gāoxìng.',
          'Estoy muy contento.',
          'Si estás perdido, no suele ser el momento de alegría.',
        ),
        wrong(
          '我要喝茶。',
          'Wǒ yào hē chá.',
          'Quiero beber té.',
          'La otra persona pregunta qué te pasa, no qué quieres tomar.',
        ),
      ]),
      say(
        line(
          'l02',
          '一直走，前面就是。',
          'Yìzhí zǒu, qiánmiàn jiù shì.',
          'Sigue recto, está justo delante.',
        ),
      ),
      ask(
        line(
          'p02',
          '一直走，前面就是。',
          'Yìzhí zǒu, qiánmiàn jiù shì.',
          'Sigue recto, está justo delante.',
        ),
        [
          right(
            '走路要多久？',
            'Zǒulù yào duōjiǔ?',
            '¿Cuánto se tarda andando?',
            'Preguntas el tiempo antes de irte: una respuesta natural.',
          ),
          wrong(
            '你叫什么名字？',
            'Nǐ jiào shénme míngzi?',
            '¿Cómo te llamas?',
            'No hace falta el nombre para llegar al metro.',
          ),
          wrong(
            '地铁站大不大？',
            'Dìtiě zhàn dà bú dà?',
            '¿Es grande la estación?',
            'La dirección ya está clara; lo útil es el tiempo.',
          ),
        ],
      ),
      say(line('l03', '走路十分钟。', 'Zǒulù shí fēnzhōng.', 'Andando, unos diez minutos.')),
      ask(line('p03', '走路十分钟。', 'Zǒulù shí fēnzhōng.', 'Andando, unos diez minutos.'), [
        right(
          '谢谢你的帮助！',
          'Xièxie nǐ de bāngzhù!',
          '¡Gracias por tu ayuda!',
          'Agradeces y cierras el intercambio.',
        ),
        wrong(
          '我不知道。',
          'Wǒ bù zhīdào.',
          'No lo sé.',
          'La otra persona ya te dio la información; agradece.',
        ),
        wrong(
          '再见，老师。',
          'Zàijiàn, lǎoshī.',
          'Adiós, profesor.',
          'No es tu profesor: es un desconocido que te ayuda.',
        ),
      ]),
      say(line('l04', '不客气，再见！', 'Bú kèqi, zàijiàn!', 'De nada, ¡adiós!')),
    ],
  },
];
