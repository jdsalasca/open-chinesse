import { useEffect, useMemo, useRef, useState } from 'react';
import { AudioButton } from '../components/AudioButton';
import { CharacterLinks } from '../components/CharacterLinks';
import { MissPicker } from '../components/MissPicker';
import { OrderExercise } from '../components/OrderExercise';
import { Pinyin } from '../components/Pinyin';
import { Confetti } from '../components/ui/Confetti';
import { Icon } from '../components/ui/Icon';
import { ALL_WORDS, LEVEL_LABELS, UNITS } from '../data/curriculum';
import { starsForScore, xpForLesson } from '../gamification/xp';
import { makeQuiz } from '../lib/quiz';
import { audioUrl } from '../lib/audio';
import { navigate } from '../lib/router';
import { useLearner } from '../store/useLearner';

export function Lesson({ unitId }: { unitId: string }) {
  const unit = UNITS.find((u) => u.id === unitId);
  const introduceUnit = useLearner((s) => s.introduceUnit);
  const recordLesson = useLearner((s) => s.recordLesson);
  const noteMiss = useLearner((s) => s.noteMiss);
  const recorded = useRef(false);
  const [phase, setPhase] = useState<'learn' | 'quiz' | 'done'>('learn');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const quiz = useMemo(() => (unit ? makeQuiz(unit) : []), [unit]);

  useEffect(() => {
    if (unit) introduceUnit(unit.id);
  }, [unit, introduceUnit]);

  useEffect(() => {
    if (phase !== 'done' || !unit || recorded.current) return;
    recorded.current = true;
    recordLesson(unit.id, answers.filter(Boolean).length, Math.max(answers.length, 1));
  }, [phase, unit, answers, recordLesson]);

  if (!unit) {
    return (
      <section className="panel">
        <h1>Unidad no encontrada</h1>
        <button type="button" className="button button--primary" onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </section>
    );
  }

  const word = unit.words[index];
  const question = quiz[index];
  const questionWord = question ? ALL_WORDS.find((w) => w.id === question.wordId) : undefined;

  const finish = (correct: boolean) => {
    if (!correct && quiz[index]?.mode === 'order') noteMiss(quiz[index].wordId, 'order');
    setAnswers((prev) => [...prev, correct]);
    setSelected(null);
    if (index + 1 < quiz.length) return setIndex(index + 1);
    setPhase('done');
  };

  const next = () => {
    if (phase === 'learn') {
      if (index + 1 < unit.words.length) return setIndex(index + 1);
      setIndex(0);
      return setPhase('quiz');
    }
    if (phase === 'quiz') {
      if (selected === null) return;
      finish(selected === questionWord?.meaning);
    }
  };

  const choose = (option: string) => {
    if (selected !== null) return;
    setSelected(option);
  };

  if (phase === 'learn') {
    return (
      <div className="lesson">
        <div className="lesson__bar">
          <span className="lesson__label">
            {LEVEL_LABELS[unit.level]} · {unit.title}
          </span>
          <span className="lesson__count">
            {index + 1} / {unit.words.length}
          </span>
        </div>
        <div className="progress" aria-hidden="true">
          <span style={{ width: `${((index + 1) / unit.words.length) * 100}%` }} />
        </div>

        <article className="flashcard" aria-live="polite">
          <div className="flashcard__hanzi" lang="zh-Hans">
            {word.hanzi}
          </div>
          <div className="flashcard__row">
            <Pinyin pinyin={word.pinyin} className="flashcard__pinyin" showToneNumber />
            <AudioButton text={word.hanzi} label={word.hanzi} src={audioUrl('words', word.id)} />
          </div>
          <p className="flashcard__meaning">{word.meaning}</p>
          <div className="example">
            <div className="example__head">
              <span className="example__label">En contexto</span>
              <AudioButton
                text={word.example.hanzi}
                label="la frase de ejemplo"
                src={audioUrl('examples', word.id)}
                compact
              />
            </div>
            <p className="example__hanzi" lang="zh-Hans">
              {word.example.hanzi}
            </p>
            <p className="example__pinyin">
              <Pinyin pinyin={word.example.pinyin} />
            </p>
            <p className="example__translation">{word.example.translation}</p>
          </div>
          <CharacterLinks hanzi={word.hanzi} />
        </article>

        <div className="lesson__actions">
          <button type="button" className="button button--primary" onClick={next} autoFocus>
            {index + 1 === unit.words.length ? 'Pasar a la práctica' : 'Siguiente'}
          </button>
          <span className="hint">
            Enter avanza · clic derecho: origen · el audio no es opcional
          </span>
        </div>
      </div>
    );
  }

  if (phase === 'quiz' && question && questionWord) {
    return (
      <div className="lesson">
        <div className="lesson__bar">
          <span className="lesson__label">Práctica · {LEVEL_LABELS[unit.level]}</span>
          <span className="lesson__count">
            {index + 1} / {quiz.length}
          </span>
        </div>
        <div className="progress" aria-hidden="true">
          <span style={{ width: `${((index + 1) / quiz.length) * 100}%` }} />
        </div>

        <section className="quiz" aria-live="polite">
          {question.mode === 'order' ? (
            <>
              <div className="quiz__prompt">
                <span className="quiz__prompt-label">Ordena la frase</span>
              </div>
              <OrderExercise
                key={question.wordId}
                chunks={question.options}
                sentence={questionWord.example.hanzi}
                translation={questionWord.example.translation}
                last={index + 1 === quiz.length}
                onNext={finish}
              />
            </>
          ) : (
            <>
              <div className="quiz__prompt">
                <span className="quiz__prompt-label">
                  {question.mode === 'listen' ? 'Escucha y elige' : '¿Qué significa?'}
                </span>
                {question.mode === 'listen' ? (
                  <div className="quiz__prompt-audio">
                    <AudioButton
                      text={questionWord.hanzi}
                      label="la palabra"
                      src={audioUrl('words', questionWord.id)}
                    />
                    <span className="quiz__dots" aria-hidden="true">
                      ••••
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="quiz__hanzi" lang="zh-Hans">
                      {questionWord.hanzi}
                    </div>
                    <div className="quiz__audio">
                      <AudioButton
                        text={questionWord.hanzi}
                        label={questionWord.hanzi}
                        src={audioUrl('words', questionWord.id)}
                      />
                      <Pinyin pinyin={questionWord.pinyin} />
                    </div>
                  </>
                )}
              </div>
              <div className="quiz__options" role="group" aria-label="Opciones">
                {question.options.map((option) => {
                  const isRight = option === questionWord.meaning;
                  const state =
                    selected === null
                      ? ''
                      : isRight
                        ? ' is-correct'
                        : option === selected
                          ? ' is-wrong'
                          : ' is-muted';
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`option${state}`}
                      onClick={() => choose(option)}
                      disabled={selected !== null}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {selected !== null && (
                <div className="quiz__feedback">
                  <p>
                    {selected === questionWord.meaning
                      ? 'Correcto.'
                      : `Era: ${questionWord.meaning}.`}
                  </p>
                  {selected !== questionWord.meaning && (
                    <MissPicker
                      key={question.wordId}
                      onPick={(reason) => noteMiss(questionWord.id, reason)}
                    />
                  )}
                  <button type="button" className="button button--primary" onClick={next} autoFocus>
                    {index + 1 === quiz.length ? 'Terminar' : 'Siguiente'}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    );
  }

  const correct = answers.filter(Boolean).length;
  const stars = starsForScore(correct, Math.max(answers.length, 1));
  const earnedXp = xpForLesson(correct);
  return (
    <div className="lesson">
      <section className="summary" aria-live="polite">
        {stars === 3 && <Confetti />}
        <p className="eyebrow">
          {LEVEL_LABELS[unit.level]} · {unit.title}
        </p>
        <div className="summary__stars" aria-label={`${stars} de 3 estrellas`}>
          {[1, 2, 3].map((star) => (
            <Icon key={star} name="star" size={30} filled={star <= stars} />
          ))}
        </div>
        <h1 className="summary__title">
          {correct} de {answers.length} correctas
        </h1>
        <p className="summary__xp">+{earnedXp} XP</p>
        <p className="summary__text">
          {correct === answers.length
            ? 'Reconociste todas. Ahora el repaso espaciado hará el resto.'
            : 'El error es parte del proceso: esas palabras volverán antes.'}
        </p>
        <div className="summary__actions">
          <button
            type="button"
            className="button button--primary"
            onClick={() => navigate('/review')}
          >
            Repasar las {unit.words.length} palabras
          </button>
          <button type="button" className="button button--ghost" onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </section>
    </div>
  );
}
