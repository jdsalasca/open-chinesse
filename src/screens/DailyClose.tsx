import { useState } from 'react';
import { AudioButton } from '../components/AudioButton';
import { Pinyin } from '../components/Pinyin';
import { SessionHeader } from '../components/SessionHeader';
import { SessionNext } from '../components/SessionNext';
import { Card } from '../components/ui/Card';
import { UNITS, type Unit } from '../data/curriculum';
import { getCharacterSheetData, type CharacterSheetData } from '../data/character-sheet';
import { audioUrl } from '../lib/audio';
import { makeCharacterQuiz, type CharacterQuestion } from '../lib/character-quiz';
import {
  dailyCharacter,
  dailyPhrase,
  dailyPrompt,
  type DailyCharacter,
  type DailyPhrase,
  type DailyPrompt,
} from '../lib/daily';
import { navigate } from '../lib/router';
import { dayKey } from '../store/metrics';
import { useDailySession } from '../store/daily-session';
import { useLearner } from '../store/useLearner';

function MiniQuiz({ quiz }: { quiz: CharacterQuestion }) {
  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked === quiz.answer;
  return (
    <div className="close__mini">
      <p className="close__prompt">{quiz.prompt}</p>
      <div className="quiz__options">
        {quiz.options.map((option) => {
          const state =
            picked === null
              ? ''
              : option === quiz.answer
                ? ' is-correct'
                : option === picked
                  ? ' is-wrong'
                  : ' is-muted';
          return (
            <button
              key={option}
              type="button"
              className={`option${state}`}
              disabled={picked !== null}
              onClick={() => setPicked(option)}
              lang="zh-Hans"
            >
              {option}
            </button>
          );
        })}
      </div>
      {picked && (
        <p className={`choice__feedback ${correct ? 'is-correct' : 'is-wrong'}`} role="status">
          {correct ? 'Correcto. ' : 'Casi. '}
          {quiz.explain}
        </p>
      )}
    </div>
  );
}

function CharacterOfDay({ daily, data }: { daily: DailyCharacter; data: CharacterSheetData }) {
  const quiz = makeCharacterQuiz(data);
  return (
    <Card className="close__card">
      <p className="eyebrow">El carácter de hoy</p>
      <div className="close__char-head">
        <span className="close__hanzi" lang="zh-Hans">
          {daily.char}
        </span>
        <div>
          {data.reading && <p className="close__reading">{data.reading}</p>}
          {data.meaning && <p className="close__meaning">{data.meaning}</p>}
        </div>
      </div>
      <p className="close__story">{daily.story.idea}</p>
      <p className="close__memory">Para recordarlo: {daily.story.mnemonic}</p>
      {quiz && <MiniQuiz quiz={quiz} />}
      <a className="link" href={`#/caracter/${encodeURIComponent(daily.char)}`}>
        Abrir la ficha completa →
      </a>
    </Card>
  );
}

function PhraseOptions({
  daily,
  picked,
  onPick,
}: {
  daily: DailyPhrase;
  picked: string | null;
  onPick: (option: string) => void;
}) {
  return (
    <div className="quiz__options">
      {daily.options.map((option) => {
        const state =
          picked === null
            ? ''
            : option === daily.word.hanzi
              ? ' is-correct'
              : option === picked
                ? ' is-wrong'
                : ' is-muted';
        return (
          <button
            key={option}
            type="button"
            className={`option${state}`}
            disabled={picked !== null}
            onClick={() => onPick(option)}
            lang="zh-Hans"
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function SentenceModel({
  hanzi,
  pinyin,
  translation,
}: {
  hanzi: string;
  pinyin: string;
  translation: string;
}) {
  return (
    <div className="example">
      <p className="example__hanzi" lang="zh-Hans">
        {hanzi}
      </p>
      <p className="example__pinyin">
        <Pinyin pinyin={pinyin} />
      </p>
      <p className="example__translation">{translation}</p>
    </div>
  );
}

function PhraseOfDay({ daily }: { daily: DailyPhrase }) {
  const [picked, setPicked] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const correct = picked === daily.word.hanzi;
  return (
    <Card className="close__card">
      <p className="eyebrow">La frase de hoy</p>
      <h2 className="close__subtitle">Escucha y elige la palabra que oyes</h2>
      <div className="close__audio">
        <AudioButton
          text={daily.example.hanzi}
          label="la frase del día"
          src={audioUrl('examples', daily.word.id)}
        />
        <span className="close__hint">Puedes repetirla las veces que quieras.</span>
      </div>
      <PhraseOptions daily={daily} picked={picked} onPick={setPicked} />
      {picked && (
        <p className={`choice__feedback ${correct ? 'is-correct' : 'is-wrong'}`} role="status">
          {correct ? 'Eso es. ' : `Era ${daily.word.hanzi}. `}
          {daily.word.pinyin}: {daily.word.meaning}
        </p>
      )}
      {picked && !revealed && (
        <button type="button" className="link" onClick={() => setRevealed(true)}>
          Ver la frase completa
        </button>
      )}
      {revealed && (
        <SentenceModel
          hanzi={daily.example.hanzi}
          pinyin={daily.example.pinyin}
          translation={daily.example.translation}
        />
      )}
    </Card>
  );
}

function WordChips({ words }: { words: DailyPrompt['words'] }) {
  return (
    <ul className="close__words">
      {words.map((word) => (
        <li key={word.id} className="close__word">
          <span className="close__word-hanzi" lang="zh-Hans">
            {word.hanzi}
          </span>
          <Pinyin pinyin={word.pinyin} className="close__word-pinyin" />
          <span className="close__word-meaning">{word.meaning}</span>
          <AudioButton
            text={word.hanzi}
            label={word.hanzi}
            src={audioUrl('words', word.id)}
            compact
          />
        </li>
      ))}
    </ul>
  );
}

function SelfCheck({ onDone }: { onDone: (ok: boolean) => void }) {
  return (
    <div className="close__self">
      <button type="button" className="button button--primary" onClick={() => onDone(true)}>
        Me salió
      </button>
      <button type="button" className="button button--ghost" onClick={() => onDone(false)}>
        Quiero repasar
      </button>
    </div>
  );
}

function PhraseInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <>
      <label className="close__label" htmlFor="close-phrase">
        Escribe tu frase en hanzi o pinyin
      </label>
      <textarea
        id="close-phrase"
        className="close__input"
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Por ejemplo: 我喜欢茶。"
      />
    </>
  );
}

function YourPhrase({ daily, onDone }: { daily: DailyPrompt; onDone: (ok: boolean) => void }) {
  const [typed, setTyped] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [sent, setSent] = useState(false);
  const finish = (ok: boolean) => {
    if (sent) return;
    setSent(true);
    onDone(ok);
  };
  return (
    <Card className="close__card">
      <p className="eyebrow">Tu frase</p>
      <h2 className="close__subtitle">Usa una de estas palabras</h2>
      <WordChips words={daily.words} />
      <PhraseInput value={typed} onChange={setTyped} />
      {!revealed ? (
        <button type="button" className="button button--primary" onClick={() => setRevealed(true)}>
          Ver una frase modelo
        </button>
      ) : (
        <SentenceModel hanzi={daily.model} pinyin={daily.pinyin} translation={daily.translation} />
      )}
      {revealed && !sent && <SelfCheck onDone={finish} />}
      {sent && (
        <p className="close__done" role="status">
          Cierre guardado. No hay nota: la frase vuelve en el repaso cuando toque.
        </p>
      )}
    </Card>
  );
}

function CloseHeader({ unit, onExit }: { unit: Unit; onExit: () => void }) {
  return (
    <>
      <SessionHeader label="Cierre de la sesión" count={`HSK ${unit.level}`} onExit={onExit} />
      <h1 className="close__title">Cierra el día</h1>
      <p className="close__lead">
        Un carácter, una frase y una frase tuya. Sin nota: una idea que se queda.
      </p>
    </>
  );
}

function CloseFooter({ onHome }: { onHome: () => void }) {
  return (
    <div className="close__actions">
      <SessionNext from="close" />
      <button type="button" className="button button--ghost" onClick={onHome}>
        Volver al inicio
      </button>
    </div>
  );
}

function useCloseData() {
  const unitId = useDailySession((state) => state.unitId);
  const stars = useLearner((state) => state.stars);
  const unit =
    UNITS.find((candidate) => candidate.id === unitId) ??
    UNITS.find((candidate) => !stars[candidate.id]) ??
    UNITS[0];
  const dateKey = dayKey(Date.now());
  const character = dailyCharacter(unit, dateKey);
  return {
    unit,
    character,
    data: getCharacterSheetData(character.char),
    phrase: dailyPhrase(unit, dateKey),
    prompt: dailyPrompt(unit, dateKey),
  };
}

export function DailyClose() {
  const { unit, character, data, phrase, prompt } = useCloseData();
  const logActivity = useLearner((state) => state.logActivity);
  const [done, setDone] = useState<'ok' | 'review' | null>(null);
  const finish = (ok: boolean) => {
    setDone(ok ? 'ok' : 'review');
    logActivity('close', ok);
  };
  return (
    <div className="close">
      <CloseHeader unit={unit} onExit={() => navigate('/')} />
      <CharacterOfDay daily={character} data={data} />
      <PhraseOfDay daily={phrase} />
      <YourPhrase daily={prompt} onDone={finish} />
      {done && (
        <p className="close__finish" role="status">
          {done === 'ok'
            ? 'Buen cierre: produjiste una frase con lo de hoy.'
            : 'Cierre guardado. Mañana lo retomas sin prisa.'}
        </p>
      )}
      <CloseFooter onHome={() => navigate('/')} />
    </div>
  );
}
