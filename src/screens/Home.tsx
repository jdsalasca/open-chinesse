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
  const learnedTotal = UNITS.filter((u) => done.includes(u.id)).reduce(
    (total, unit) => total + unit.words.length,
    0,
  );
  const progress = levelProgress(xp);
  const levelNumber = levelFromXp(xp);
  const lastLevel = LEVELS[LEVELS.length - 1];
  const courseRange = `${LEVEL_LABELS[LEVELS[0]]}–${LEVEL_LABELS[lastLevel]}`;

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__text">
          <p className="eyebrow">Chino mandarín · {courseRange}</p>
          <h1 className="hero__title">
            <span lang="zh-Hans">你好</span>
            <span className="hero__title-note">hola</span>
          </h1>
          <p className="hero__lead">
            {started
              ? 'Repasa lo que ya viste o sigue con la siguiente unidad. Cinco minutos cuentan.'
              : `Empieza por los saludos. ${TOTAL_WORDS} palabras con audio, pinyin y una frase real.`}
          </p>
          <div className="hero__actions">
            {queue.total > 0 && (
              <button
                type="button"
                className="button button--primary"
                onClick={() => navigate('/review')}
              >
                Repasar {queue.total} {queue.total === 1 ? 'palabra' : 'palabras'}
              </button>
            )}
            {nextUnit && (
              <button
                type="button"
                className={`button ${queue.total > 0 ? 'button--ghost' : 'button--primary'}`}
                onClick={() => navigate(`/lesson/${nextUnit.id}`)}
              >
                {started ? `Siguiente: ${nextUnit.title}` : 'Empezar la primera lección'}
              </button>
            )}
            {!nextUnit && queue.total === 0 && (
              <p className="hero__calm">
                {level === lastLevel
                  ? `Terminaste ${courseRange} sin repasos pendientes. Vuelve mañana.`
                  : 'Esta parte está al día. Cambia de nivel para seguir avanzando.'}
              </p>
            )}
          </div>
        </div>
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
            <dt>Dominadas</dt>
            <dd>{masteredCount(cards)}</dd>
          </div>
          <div>
            <dt>Aprendidas</dt>
            <dd>
              {learnedTotal}
              <small> / {TOTAL_WORDS}</small>
            </dd>
          </div>
        </dl>
      </section>

      <section className="panel-grid" aria-label="Tu progreso de hoy">
        <Card tone="mint" className="daily">
          <div className="daily__head">
            <div>
              <p className="eyebrow">Meta de hoy</p>
              <p className="daily__goal">
                {todayXp} de {dailyGoal} XP
              </p>
            </div>
            <Badge
              tone={todayXp >= dailyGoal ? 'mint' : 'amber'}
              icon={<Icon name="flame" size={14} />}
            >
              {todayXp >= dailyGoal ? 'Meta cumplida' : `${streak} días`}
            </Badge>
          </div>
          <div className="daily__body">
            <ProgressRing
              value={todayXp}
              max={Math.max(dailyGoal, todayXp)}
              label="XP de hoy"
              caption="XP hoy"
            />
            <div className="daily__level">
              <p className="daily__level-name">Nivel {levelNumber}</p>
              <div className="mini-bar" aria-hidden="true">
                <span style={{ width: `${Math.round(progress.ratio * 100)}%` }} />
              </div>
              <p className="daily__level-meta">
                {progress.current} / {progress.needed} XP para el nivel {levelNumber + 1}
              </p>
              <p className="daily__total">{xp} XP en total</p>
            </div>
          </div>
        </Card>

        <Card className="achievements">
          <div className="achievements__head">
            <h2>Logros</h2>
            <span className="achievements__count">
              {achievements.length} / {ACHIEVEMENTS.length}
            </span>
          </div>
          <ul className="achievement-row">
            {ACHIEVEMENTS.map((achievement) => {
              const earned = achievements.includes(achievement.id);
              return (
                <li
                  key={achievement.id}
                  className={`achievement${earned ? ' is-earned' : ''}`}
                  title={achievement.description}
                >
                  <Icon name={earned ? achievement.icon : 'target'} size={14} />
                  {achievement.title}
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
                .filter((u) => done.includes(u.id))
                .reduce((sum, unit) => sum + unit.words.length, 0);
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
                  <span className="level-switch__bar" aria-hidden="true">
                    <span style={{ width: `${total > 0 ? (learned / total) * 100 : 0}%` }} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <HomePath units={levelUnits} cards={cards} stars={stars} done={done} />
      </section>

      <section className="method" aria-labelledby="method-title">
        <h2 id="method-title">Cómo está diseñado</h2>
        <ul className="method__list">
          <li>
            <strong>Recuperación activa.</strong> Primero intentas recordar; la respuesta aparece
            después.
          </li>
          <li>
            <strong>Repaso espaciado FSRS.</strong> Cada palabra vuelve justo antes de que la
            olvides.
          </li>
          <li>
            <strong>Audio en todo.</strong> El tono es parte de la palabra, no un adorno.
          </li>
          <li>
            <strong>Sin presión.</strong> La racha informa, no castiga. No hay ligas ni
            notificaciones.
          </li>
        </ul>
      </section>
    </div>
  );
}
