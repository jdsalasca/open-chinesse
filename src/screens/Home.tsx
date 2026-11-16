import { useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Icon } from '../components/ui/Icon';
import { ProgressRing } from '../components/ui/ProgressRing';
import {
  LEVELS,
  LEVEL_LABELS,
  LEVEL_TITLES,
  TOTAL_WORDS,
  UNITS,
  unitsForLevel,
  wordsForLevel,
  type Level,
} from '../data/curriculum';
import { ACHIEVEMENTS, levelFromXp, levelProgress } from '../gamification/xp';
import { HomePath } from './HomePath';
import { Onboarding } from '../components/Onboarding';
import { useDailySession } from '../store/daily-session';
import { navigate } from '../lib/router';
import { buildQueue } from '../srs/queue';
import { masteredCount, streakDays } from '../store/metrics';
import { completedUnits, useLearner } from '../store/useLearner';

export function Home() {
  const cards = useLearner((s) => s.cards);
  const log = useLearner((s) => s.log);
  const xp = useLearner((s) => s.xp);
  const todayXp = useLearner((s) => s.todayXp);
  const dailyGoal = useLearner((s) => s.dailyGoal);
  const stars = useLearner((s) => s.stars);
  const achievements = useLearner((s) => s.achievements);
  const onboarded = useLearner((s) => s.onboarded);
  const now = Date.now();

  const done = completedUnits(cards);
  const [level, setLevel] = useState<Level>(() => {
    const pending = UNITS.find((u) => !done.includes(u.id));
    return pending?.level ?? LEVELS[LEVELS.length - 1];
  });

  const queue = buildQueue(cards, now);
  const streak = streakDays(log, now);
  const levelUnits = unitsForLevel(level);
  const nextUnit = levelUnits.find((u) => !done.includes(u.id));
  const started = Object.keys(cards).length > 0;
  const reviewed = new Set(log.map((entry) => entry.wordId));
  const learnedTotal = reviewed.size;
  const allDone = done.length === UNITS.length;
  const progress = levelProgress(xp);
  const levelNumber = levelFromXp(xp);
  const lastLevel = LEVELS[LEVELS.length - 1];
  const courseRange = `${LEVEL_LABELS[LEVELS[0]]}–${LEVEL_LABELS[lastLevel]}`;
  const goalRatio = dailyGoal === 0 ? 1 : Math.min(1, todayXp / dailyGoal);

  if (!onboarded && !started) {
    return <Onboarding />;
  }

  const startSession = () => {
    useDailySession.getState().start();
    if (queue.total > 0) return navigate('/review');
    if (nextUnit) return navigate(`/lesson/${nextUnit.id}`);
    navigate('/tonos');
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__copy">
          <p className="hero__eyebrow">Chino mandarín · {courseRange}</p>
          <h1 className="hero__title">
            <span className="hero__hanzi" lang="zh-Hans">
              你好
            </span>
            <span className="hero__note">hola</span>
          </h1>
          <p className="hero__lead">
            {started
              ? 'Repasa lo que ya viste o sigue con la siguiente unidad. Cinco minutos cuentan.'
              : `Empieza por los saludos. ${TOTAL_WORDS} palabras con audio, pinyin y una frase real.`}
          </p>
          <div className="hero__actions">
            {queue.total > 0 && (
              <button type="button" className="hero__cta" onClick={startSession}>
                Repasar {queue.total} {queue.total === 1 ? 'palabra' : 'palabras'}
                <Icon name="arrow" size={18} />
              </button>
            )}
            {nextUnit && (
              <button
                type="button"
                className={`hero__ghost${queue.total > 0 ? '' : ' hero__cta'}`}
                onClick={() => navigate(`/lesson/${nextUnit.id}`)}
              >
                {started ? `Siguiente: ${nextUnit.title}` : 'Empezar la primera lección'}
              </button>
            )}
            {!nextUnit && queue.total === 0 && (
              <p className="hero__calm">
                {allDone
                  ? `Terminaste ${courseRange} sin repasos pendientes. Vuelve mañana.`
                  : 'Esta parte está al día. Cambia de nivel para seguir avanzando.'}
              </p>
            )}
          </div>
        </div>
        <span className="hero__watermark" lang="zh-Hans" aria-hidden="true">
          学
        </span>
        <dl className="hero__stats">
          <div>
            <dt>Racha</dt>
            <dd>
              {streak}
              <small> {streak === 1 ? 'día' : 'días'}</small>
            </dd>
          </div>
          <div>
            <dt>Pendientes</dt>
            <dd>{queue.total}</dd>
          </div>
          <div>
            <dt>Estudiadas</dt>
            <dd>
              {learnedTotal}
              <small> / {TOTAL_WORDS}</small>
            </dd>
          </div>
        </dl>
      </section>

      <section className="session" aria-labelledby="session-title">
        <div className="session__head">
          <div>
            <p className="eyebrow">Tu sesión de hoy</p>
            <h2 id="session-title" className="session__title">
              Tres pasos, cero prisa
            </h2>
          </div>
          <span className="session__goal">
            {todayXp} <span>/ {dailyGoal} XP</span>
          </span>
        </div>
        <ol className="session__steps">
          <li className={`session__step${queue.total > 0 ? ' is-next' : ''}`}>
            <span className="session__icon" aria-hidden="true">
              <Icon name="target" size={18} />
            </span>
            <div>
              <strong>Repaso</strong>
              <span>{queue.total > 0 ? `${queue.total} palabras pendientes` : 'al día'}</span>
            </div>
          </li>
          <li className={`session__step${queue.total === 0 && nextUnit ? ' is-next' : ''}`}>
            <span className="session__icon" aria-hidden="true">
              <Icon name="book" size={18} />
            </span>
            <div>
              <strong>Lección</strong>
              <span>{nextUnit ? nextUnit.title : 'nivel completo'}</span>
            </div>
          </li>
          <li className="session__step">
            <span className="session__icon" aria-hidden="true">
              <Icon name="speaker" size={18} />
            </span>
            <div>
              <strong>Tonos</strong>
              <span>diez palabras de oído</span>
            </div>
          </li>
        </ol>
        <div className="session__footer">
          <div className="session__meter" aria-hidden="true">
            <span style={{ width: `${Math.round(goalRatio * 100)}%` }} />
          </div>
          <button type="button" className="button button--primary" onClick={startSession}>
            {queue.total > 0
              ? `Empezar · ${queue.total} ${queue.total === 1 ? 'repaso' : 'repasos'}`
              : nextUnit
                ? 'Empezar la lección'
                : 'Entrenar tonos'}
          </button>
        </div>
      </section>

      <section className="panel-grid" aria-label="Tu progreso">
        <Card className="progress-card">
          <div className="progress-card__head">
            <div>
              <p className="eyebrow">Meta de hoy</p>
              <h2 className="progress-card__title">
                {todayXp} de {dailyGoal} XP
              </h2>
            </div>
            <Badge
              tone={todayXp >= dailyGoal ? 'mint' : 'amber'}
              icon={<Icon name="flame" size={14} />}
            >
              {todayXp >= dailyGoal ? 'Meta cumplida' : `${streak} días`}
            </Badge>
          </div>
          <div className="progress-card__body">
            <ProgressRing
              value={todayXp}
              max={Math.max(dailyGoal, todayXp)}
              label="XP de hoy"
              caption="XP hoy"
            />
            <div className="progress-card__level">
              <p className="progress-card__level-name">Nivel {levelNumber}</p>
              <div className="mini-bar" aria-hidden="true">
                <span style={{ width: `${Math.round(progress.ratio * 100)}%` }} />
              </div>
              <p className="progress-card__meta">
                {progress.current} / {progress.needed} XP para el nivel {levelNumber + 1}
              </p>
              <p className="progress-card__total">{xp} XP en total</p>
            </div>
          </div>
          <dl className="progress-card__stats">
            <div>
              <dt>Dominadas</dt>
              <dd>{masteredCount(cards)}</dd>
            </div>
            <div>
              <dt>Estudiadas</dt>
              <dd>
                {learnedTotal} <span>/ {TOTAL_WORDS}</span>
              </dd>
            </div>
          </dl>
        </Card>
        <Card className="achievements">
          <div className="achievements__head">
            <h2>Logros</h2>
            <span className="achievements__count">
              {achievements.length} / {ACHIEVEMENTS.length}
            </span>
          </div>
          <ul className="achievement-grid">
            {ACHIEVEMENTS.map((achievement) => {
              const earned = achievements.includes(achievement.id);
              return (
                <li
                  key={achievement.id}
                  className={`achievement-tile${earned ? ' is-earned' : ' is-locked'}`}
                >
                  <span className="achievement__icon" aria-hidden="true">
                    <Icon name={achievement.icon} size={16} />
                  </span>
                  <span className="achievement__text">
                    <strong>{achievement.title}</strong>
                    <small>{achievement.description}</small>
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="achievements__hint">Sin comparaciones ni ligas: cada logro es tuyo.</p>
        </Card>
      </section>

      <section className="units" aria-labelledby="units-title">
        <div className="section-head">
          <div>
            <p className="eyebrow">Curso</p>
            <h2 id="units-title">Tu ruta</h2>
            <p>
              {TOTAL_WORDS} palabras en {UNITS.length} unidades: de {LEVEL_LABELS[LEVELS[0]]} a{' '}
              {LEVEL_LABELS[lastLevel]}. Sin orden obligatorio.
            </p>
          </div>
          <div className="level-switch" role="tablist" aria-label="Nivel">
            {LEVELS.map((item) => {
              const total = wordsForLevel(item);
              const learned = unitsForLevel(item)
                .flatMap((unit) => unit.words)
                .filter((word) => reviewed.has(word.id)).length;
              return (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={level === item}
                  className={`level-switch__tab${level === item ? ' is-active' : ''}`}
                  onClick={() => setLevel(item)}
                >
                  <span className="level-switch__name">{LEVEL_LABELS[item]}</span>
                  <span className="level-switch__meta">
                    {LEVEL_TITLES[item]} · {learned}/{total}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <HomePath units={levelUnits} cards={cards} stars={stars} done={done} />
      </section>

      <section className="how" aria-labelledby="method-title">
        <div className="how__head">
          <p className="eyebrow">Método</p>
          <h2 id="method-title">Cómo funciona</h2>
        </div>
        <ul className="how__grid">
          <li>
            <Icon name="target" size={18} />
            <strong>Recuperación activa</strong>
            <span>Primero intentas recordar; la respuesta aparece después.</span>
          </li>
          <li>
            <Icon name="clock" size={18} />
            <strong>Repaso espaciado</strong>
            <span>Cada palabra vuelve cuando toca repasarla, no cuando ya la has olvidado.</span>
          </li>
          <li>
            <Icon name="speaker" size={18} />
            <strong>Audio en todo</strong>
            <span>El tono es parte de la palabra, no un adorno.</span>
          </li>
          <li>
            <Icon name="check" size={18} />
            <strong>Sin presión</strong>
            <span>La racha informa, no castiga. No hay ligas ni notificaciones.</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
