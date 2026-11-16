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
  index: number;
  title: string;
  subtitle: string;
  words: Word[];
};

const word = (
  id: string,
  hanzi: string,
  pinyin: string,
  meaning: string,
  exHanzi: string,
  exPinyin: string,
  exTranslation: string,
): Word => ({
  id,
  hanzi,
  pinyin,
  meaning,
  example: { hanzi: exHanzi, pinyin: exPinyin, translation: exTranslation },
});

export const UNITS: Unit[] = [
  {
    id: 'saludos',
    index: 1,
    title: 'Saludos y cortesía',
    subtitle: 'Lo primero que vas a decir en chino',
    words: [
      word('u1-01', '你好', 'nǐ hǎo', 'hola', '你好，我叫安娜。', 'Nǐ hǎo, wǒ jiào Ānnà.', 'Hola, me llamo Anna.'),
      word('u1-02', '谢谢', 'xièxie', 'gracias', '谢谢你的帮助。', 'Xièxie nǐ de bāngzhù.', 'Gracias por tu ayuda.'),
      word('u1-03', '不客气', 'bú kèqi', 'de nada', '不客气，再见！', 'Bú kèqi, zàijiàn!', 'De nada, ¡adiós!'),
      word('u1-04', '对不起', 'duìbuqǐ', 'perdón', '对不起，我来晚了。', 'Duìbuqǐ, wǒ lái wǎn le.', 'Perdón, llegué tarde.'),
      word('u1-05', '没关系', 'méi guānxi', 'no pasa nada', '没关系，我们等你。', 'Méi guānxi, wǒmen děng nǐ.', 'No pasa nada, te esperamos.'),
      word('u1-06', '再见', 'zàijiàn', 'adiós', '老师，再见！', 'Lǎoshī, zàijiàn!', '¡Adiós, profesor!'),
      word('u1-07', '请', 'qǐng', 'por favor', '请坐。', 'Qǐng zuò.', 'Siéntese, por favor.'),
      word('u1-08', '是', 'shì', 'ser, sí', '我是学生。', 'Wǒ shì xuésheng.', 'Soy estudiante.'),
      word('u1-09', '不', 'bù', 'no', '我不是老师。', 'Wǒ bú shì lǎoshī.', 'No soy profesor.'),
      word('u1-10', '你好吗', 'nǐ hǎo ma', '¿cómo estás?', '你好吗？我很好。', 'Nǐ hǎo ma? Wǒ hěn hǎo.', '¿Cómo estás? Estoy muy bien.'),
      word('u1-11', '我很好', 'wǒ hěn hǎo', 'estoy muy bien', '我很好，谢谢。', 'Wǒ hěn hǎo, xièxie.', 'Estoy muy bien, gracias.'),
      word('u1-12', '名字', 'míngzi', 'nombre', '你叫什么名字？', 'Nǐ jiào shénme míngzi?', '¿Cómo te llamas?'),
    ],
  },
  {
    id: 'personas',
    index: 2,
    title: 'Personas',
    subtitle: 'Quién es quién',
    words: [
      word('u2-01', '我', 'wǒ', 'yo', '我是中国人。', 'Wǒ shì Zhōngguó rén.', 'Soy chino.'),
      word('u2-02', '你', 'nǐ', 'tú', '你是哪国人？', 'Nǐ shì nǎ guó rén?', '¿De qué país eres?'),
      word('u2-03', '他', 'tā', 'él', '他是我的朋友。', 'Tā shì wǒ de péngyou.', 'Él es mi amigo.'),
      word('u2-04', '她', 'tā', 'ella', '她很漂亮。', 'Tā hěn piàoliang.', 'Ella es muy guapa.'),
      word('u2-05', '我们', 'wǒmen', 'nosotros', '我们学习汉语。', 'Wǒmen xuéxí Hànyǔ.', 'Nosotros estudiamos chino.'),
      word('u2-06', '老师', 'lǎoshī', 'profesor', '王老师很好。', 'Wáng lǎoshī hěn hǎo.', 'El profesor Wang es muy bueno.'),
      word('u2-07', '学生', 'xuésheng', 'estudiante', '她是学生。', 'Tā shì xuésheng.', 'Ella es estudiante.'),
      word('u2-08', '人', 'rén', 'persona', '他是好人。', 'Tā shì hǎo rén.', 'Él es una buena persona.'),
      word('u2-09', '谁', 'shuí', 'quién', '他是谁？', 'Tā shì shuí?', '¿Quién es él?'),
      word('u2-10', '什么', 'shénme', 'qué', '这是什么？', 'Zhè shì shénme?', '¿Qué es esto?'),
      word('u2-11', '哪', 'nǎ', 'cuál', '你是哪国人？', 'Nǐ shì nǎ guó rén?', '¿De qué país eres?'),
      word('u2-12', '朋友', 'péngyou', 'amigo', '我们是朋友。', 'Wǒmen shì péngyou.', 'Somos amigos.'),
    ],
  },
  {
    id: 'numeros',
    index: 3,
    title: 'Números y tiempo',
    subtitle: 'Contar, saludar y ubicarse en el día',
    words: [
      word('u3-01', '一', 'yī', 'uno', '我有一个哥哥。', 'Wǒ yǒu yí ge gēge.', 'Tengo un hermano mayor.'),
      word('u3-02', '二', 'èr', 'dos', '二月很冷。', 'Èr yuè hěn lěng.', 'Febrero es muy frío.'),
      word('u3-03', '三', 'sān', 'tres', '我买了三个苹果。', 'Wǒ mǎi le sān ge píngguǒ.', 'Compré tres manzanas.'),
      word('u3-04', '四', 'sì', 'cuatro', '现在四点。', 'Xiànzài sì diǎn.', 'Son las cuatro.'),
      word('u3-05', '五', 'wǔ', 'cinco', '我有五本书。', 'Wǒ yǒu wǔ běn shū.', 'Tengo cinco libros.'),
      word('u3-06', '六', 'liù', 'seis', '他六点起床。', 'Tā liù diǎn qǐchuáng.', 'Él se levanta a las seis.'),
      word('u3-07', '七', 'qī', 'siete', '一个星期有七天。', 'Yí ge xīngqī yǒu qī tiān.', 'Una semana tiene siete días.'),
      word('u3-08', '八', 'bā', 'ocho', '我八点上班。', 'Wǒ bā diǎn shàngbān.', 'Entro a trabajar a las ocho.'),
      word('u3-09', '九', 'jiǔ', 'nueve', '九月开学。', 'Jiǔ yuè kāixué.', 'Las clases empiezan en septiembre.'),
      word('u3-10', '十', 'shí', 'diez', '十块钱。', 'Shí kuài qián.', 'Diez yuanes.'),
      word('u3-11', '今天', 'jīntiān', 'hoy', '今天很热。', 'Jīntiān hěn rè.', 'Hoy hace mucho calor.'),
      word('u3-12', '明天', 'míngtiān', 'mañana', '明天见！', 'Míngtiān jiàn!', '¡Hasta mañana!'),
    ],
  },
  {
    id: 'familia',
    index: 4,
    title: 'Familia',
    subtitle: 'Parentesco y posesión',
    words: [
      word('u4-01', '爸爸', 'bàba', 'papá', '我爸爸是医生。', 'Wǒ bàba shì yīshēng.', 'Mi papá es médico.'),
      word('u4-02', '妈妈', 'māma', 'mamá', '妈妈做饭。', 'Māma zuò fàn.', 'Mamá cocina.'),
      word('u4-03', '儿子', 'érzi', 'hijo', '他们的儿子很小。', 'Tāmen de érzi hěn xiǎo.', 'Su hijo es pequeño.'),
      word('u4-04', '女儿', 'nǚ’ér', 'hija', '我女儿三岁。', 'Wǒ nǚ’ér sān suì.', 'Mi hija tiene tres años.'),
      word('u4-05', '哥哥', 'gēge', 'hermano mayor', '我哥哥在北京。', 'Wǒ gēge zài Běijīng.', 'Mi hermano mayor está en Pekín.'),
      word('u4-06', '姐姐', 'jiějie', 'hermana mayor', '姐姐喜欢喝茶。', 'Jiějie xǐhuan hē chá.', 'A mi hermana mayor le gusta el té.'),
      word('u4-07', '弟弟', 'dìdi', 'hermano menor', '弟弟在睡觉。', 'Dìdi zài shuìjiào.', 'Mi hermano menor está durmiendo.'),
      word('u4-08', '妹妹', 'mèimei', 'hermana menor', '妹妹很可爱。', 'Mèimei hěn kě’ài.', 'Mi hermana menor es muy linda.'),
      word('u4-09', '家', 'jiā', 'casa, familia', '我家有四口人。', 'Wǒ jiā yǒu sì kǒu rén.', 'Mi familia tiene cuatro personas.'),
      word('u4-10', '有', 'yǒu', 'tener', '你有手机吗？', 'Nǐ yǒu shǒujī ma?', '¿Tienes móvil?'),
      word('u4-11', '没有', 'méiyǒu', 'no tener', '我没有钱。', 'Wǒ méiyǒu qián.', 'No tengo dinero.'),
      word('u4-12', '几', 'jǐ', 'cuántos', '你家有几口人？', 'Nǐ jiā yǒu jǐ kǒu rén?', '¿Cuántas personas hay en tu familia?'),
    ],
  },
  {
    id: 'comida',
    index: 5,
    title: 'Comida y bebida',
    subtitle: 'Pedir, agradecer y decir que está rico',
    words: [
      word('u5-01', '吃', 'chī', 'comer', '我们去吃饭吧。', 'Wǒmen qù chīfàn ba.', 'Vamos a comer.'),
      word('u5-02', '喝', 'hē', 'beber', '我想喝水。', 'Wǒ xiǎng hē shuǐ.', 'Quiero beber agua.'),
      word('u5-03', '水', 'shuǐ', 'agua', '请给我一杯水。', 'Qǐng gěi wǒ yì bēi shuǐ.', 'Dame un vaso de agua, por favor.'),
      word('u5-04', '茶', 'chá', 'té', '中国茶很好喝。', 'Zhōngguó chá hěn hǎohē.', 'El té chino es muy rico.'),
      word('u5-05', '米饭', 'mǐfàn', 'arroz cocido', '我吃米饭。', 'Wǒ chī mǐfàn.', 'Como arroz.'),
      word('u5-06', '菜', 'cài', 'plato, verdura', '这个菜好吃。', 'Zhè ge cài hǎochī.', 'Este plato está rico.'),
      word('u5-07', '苹果', 'píngguǒ', 'manzana', '苹果三块钱。', 'Píngguǒ sān kuài qián.', 'Las manzanas cuestan tres yuanes.'),
      word('u5-08', '好吃', 'hǎochī', 'delicioso', '饺子很好吃。', 'Jiǎozi hěn hǎochī.', 'Los jiaozi están deliciosos.'),
      word('u5-09', '饿', 'è', 'hambriento', '我饿了。', 'Wǒ è le.', 'Tengo hambre.'),
      word('u5-10', '渴', 'kě', 'sediento', '我渴了。', 'Wǒ kě le.', 'Tengo sed.'),
      word('u5-11', '咖啡', 'kāfēi', 'café', '我喜欢咖啡。', 'Wǒ xǐhuan kāfēi.', 'Me gusta el café.'),
      word('u5-12', '牛奶', 'niúnǎi', 'leche', '孩子喝牛奶。', 'Háizi hē niúnǎi.', 'El niño bebe leche.'),
    ],
  },
  {
    id: 'lugares',
    index: 6,
    title: 'Lugares y acciones',
    subtitle: 'Moverse y hablar de lo que haces',
    words: [
      word('u6-01', '去', 'qù', 'ir', '我去学校。', 'Wǒ qù xuéxiào.', 'Voy a la escuela.'),
      word('u6-02', '来', 'lái', 'venir', '你来我家吧。', 'Nǐ lái wǒ jiā ba.', 'Ven a mi casa.'),
      word('u6-03', '学校', 'xuéxiào', 'escuela', '学校很大。', 'Xuéxiào hěn dà.', 'La escuela es grande.'),
      word('u6-04', '中国', 'Zhōngguó', 'China', '中国很大。', 'Zhōngguó hěn dà.', 'China es grande.'),
      word('u6-05', '北京', 'Běijīng', 'Pekín', '北京是中国的首都。', 'Běijīng shì Zhōngguó de shǒudū.', 'Pekín es la capital de China.'),
      word('u6-06', '医院', 'yīyuàn', 'hospital', '医院在前面。', 'Yīyuàn zài qiánmiàn.', 'El hospital está delante.'),
      word('u6-07', '商店', 'shāngdiàn', 'tienda', '商店几点开门？', 'Shāngdiàn jǐ diǎn kāimén?', '¿A qué hora abre la tienda?'),
      word('u6-08', '看', 'kàn', 'ver, leer', '我看电视。', 'Wǒ kàn diànshì.', 'Veo la televisión.'),
      word('u6-09', '听', 'tīng', 'escuchar', '我听音乐。', 'Wǒ tīng yīnyuè.', 'Escucho música.'),
      word('u6-10', '说', 'shuō', 'hablar', '你说汉语吗？', 'Nǐ shuō Hànyǔ ma?', '¿Hablas chino?'),
      word('u6-11', '读', 'dú', 'leer', '我读书。', 'Wǒ dú shū.', 'Leo un libro.'),
      word('u6-12', '写', 'xiě', 'escribir', '我写汉字。', 'Wǒ xiě Hànzì.', 'Escribo caracteres chinos.'),
    ],
  },
];

export const ALL_WORDS: Word[] = UNITS.flatMap((unit) => unit.words);

export const WORDS_BY_ID = new Map(ALL_WORDS.map((w) => [w.id, w]));

export function unitByIndex(index: number): Unit | undefined {
  return UNITS.find((u) => u.index === index);
}

export function nextUnit(completed: string[]): Unit | undefined {
  return UNITS.find((u) => !completed.includes(u.id));
}
