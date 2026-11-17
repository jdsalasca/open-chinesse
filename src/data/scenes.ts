export type SceneOption = { text: string; correct: boolean };

export type SceneQuestion = {
  id: string;
  storyId: string;
  prompt: string;
  options: SceneOption[];
  /** Índice de la línea que justifica la respuesta. */
  evidence: number;
  explain: string;
};

export const SCENE_QUESTIONS: SceneQuestion[] = [
  {
    id: 'hello-bye',
    storyId: 'micro-h1-01',
    prompt: '¿Qué hacen al final de la conversación?',
    options: [
      { text: 'Se despiden.', correct: true },
      { text: 'Se van a comer.', correct: false },
    ],
    evidence: 2,
    explain: 'La última línea dice 不客气。再见！',
  },
  {
    id: 'present-friend',
    storyId: 'micro-h1-02',
    prompt: '¿Qué hace el narrador?',
    options: [
      { text: 'Presenta a una amiga.', correct: true },
      { text: 'Busca a un médico.', correct: false },
    ],
    evidence: 0,
    explain: 'La primera línea dice 他是我朋友。',
  },
  {
    id: 'count-ten',
    storyId: 'micro-h1-03',
    prompt: '¿Qué hace el narrador?',
    options: [
      { text: 'Cuenta del uno al diez y vuelve.', correct: true },
      { text: 'Compra diez manzanas.', correct: false },
    ],
    evidence: 2,
    explain: 'La tercera línea recorre 十，九，八… hasta 一.',
  },
  {
    id: 'friend-afternoon',
    storyId: 'micro-h1-04',
    prompt: '¿Cuándo viene el amigo?',
    options: [
      { text: 'Hoy por la tarde.', correct: true },
      { text: 'Mañana al mediodía.', correct: false },
    ],
    evidence: 1,
    explain: 'La segunda línea dice 今天下午我朋友来我家。',
  },
  {
    id: 'dad-doctor',
    storyId: 'micro-h1-05',
    prompt: '¿Quién es médico?',
    options: [
      { text: 'El padre.', correct: true },
      { text: 'La madre.', correct: false },
    ],
    evidence: 1,
    explain: 'La segunda línea dice 爸爸是医生。',
  },
  {
    id: 'tea-drink',
    storyId: 'micro-h1-06',
    prompt: '¿Qué bebe el narrador?',
    options: [
      { text: 'Una taza de té.', correct: true },
      { text: 'Una taza de agua.', correct: false },
    ],
    evidence: 1,
    explain: 'La segunda línea dice 喝一杯茶。',
  },
  {
    id: 'clothes-chair',
    storyId: 'micro-h1-07',
    prompt: '¿Dónde está la ropa?',
    options: [
      { text: 'En la silla.', correct: true },
      { text: 'En la mesa.', correct: false },
    ],
    evidence: 2,
    explain: 'La tercera línea dice 我的衣服在椅子上。',
  },
  {
    id: 'work-behind-station',
    storyId: 'micro-h1-08',
    prompt: '¿Dónde trabaja el amigo?',
    options: [
      { text: 'Detrás de la estación de tren.', correct: true },
      { text: 'En el hospital.', correct: false },
    ],
    evidence: 1,
    explain: 'La segunda línea dice 在火车站后面工作。',
  },
  {
    id: 'plane-beijing',
    storyId: 'micro-h1-09',
    prompt: '¿Cómo va el narrador a Pekín?',
    options: [
      { text: 'En avión.', correct: true },
      { text: 'En tren.', correct: false },
    ],
    evidence: 0,
    explain: 'La primera línea dice 坐飞机去北京。',
  },
  {
    id: 'tomorrow-book',
    storyId: 'micro-h1-10',
    prompt: '¿Qué hará mañana?',
    options: [
      { text: 'Comprar y leer un libro.', correct: true },
      { text: 'Dormir todo el día.', correct: false },
    ],
    evidence: 3,
    explain: 'La cuarta línea dice 明天我买书，看书。',
  },
  {
    id: 'work-school',
    storyId: 'micro-h1-11',
    prompt: '¿Dónde trabaja el amigo?',
    options: [
      { text: 'En la escuela.', correct: true },
      { text: 'En la tienda.', correct: false },
    ],
    evidence: 3,
    explain: 'La cuarta línea dice 我朋友在学校工作。',
  },
  {
    id: 'cold-tomorrow',
    storyId: 'micro-h1-12',
    prompt: '¿Cómo estará el tiempo mañana?',
    options: [
      { text: 'Frío.', correct: true },
      { text: 'Caluroso.', correct: false },
    ],
    evidence: 1,
    explain: 'La segunda línea dice 明天天气冷。',
  },
  {
    id: 'friend-dog',
    storyId: 'micro-h1-13',
    prompt: '¿Qué animal prefiere el amigo?',
    options: [
      { text: 'El perro.', correct: true },
      { text: 'El gato.', correct: false },
    ],
    evidence: 2,
    explain: 'La tercera línea dice 我朋友喜欢狗。',
  },
  {
    id: 'month-rain-cold',
    storyId: 'micro-h1-14',
    prompt: '¿Qué tiempo hace este mes?',
    options: [
      { text: 'Lluvia y frío.', correct: true },
      { text: 'Sol y calor.', correct: false },
    ],
    evidence: 3,
    explain: 'La cuarta línea dice 这个月下雨，很冷。',
  },
  {
    id: 'buy-together',
    storyId: 'micro-h1-15',
    prompt: '¿Pueden comprar el libro entre los dos?',
    options: [
      { text: 'Sí: tienen veinte yuanes.', correct: true },
      { text: 'No: solo tienen diez.', correct: false },
    ],
    evidence: 2,
    explain: 'La tercera línea dice 我有十块，朋友有十块: entre los dos, veinte.',
  },
];
