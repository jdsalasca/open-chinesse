import { Card } from './ui/Card';
import { Icon } from './ui/Icon';
import { missionStreak, weekActivity, type DayActivity } from '../lib/missions';
import { dayKey } from '../store/metrics';
import { useLearner } from '../store/useLearner';

function WeekChart({
  week,
  today,
  peak,
  label,
}: {
  week: DayActivity[];
  today: string;
  peak: number;
  label: string;
}) {
  return (
    <div className="weekly__bars" role="img" aria-label={label}>
      {week.map((day) => (
        <div key={day.key} className={`weekly__day${day.key === today ? ' is-today' : ''}`}>
          <span className="weekly__bar" aria-hidden="true">
            <span
              style={{
                height: `${day.count === 0 ? 0 : Math.max(10, Math.round((day.count / peak) * 100))}%`,
              }}
            />
          </span>
          <span className="weekly__label">{day.label}</span>
          <span className="weekly__count">{day.count}</span>
        </div>
      ))}
    </div>
  );
}

/** Resumen de los últimos siete días: actividad, aciertos y racha de misiones. */
export function WeeklyRecap({ now }: { now: number }) {
  const activity = useLearner((state) => state.activity);
  const missionDays = useLearner((state) => state.missionDays);

  const today = dayKey(now);
  const week = weekActivity(activity, today);
  const streak = missionStreak(missionDays, today);
  const total = week.reduce((sum, day) => sum + day.count, 0);
  const correct = week.reduce((sum, day) => sum + day.correct, 0);
  const peak = Math.max(1, ...week.map((day) => day.count));

  return (
    <Card className="weekly">
      <div className="weekly__head">
        <div>
          <p className="eyebrow">Tu semana</p>
          <h2>Siete días de práctica</h2>
        </div>
        <span className="weekly__streak">
          <Icon name="flame" size={14} /> Racha de misiones: {streak}
        </span>
      </div>
      <WeekChart
        week={week}
        today={today}
        peak={peak}
        label={`Actividad de los últimos siete días: ${total} acciones y ${correct} aciertos`}
      />
      <p className="weekly__summary">
        {total} acciones · {correct} aciertos · {streak} días con las tres misiones
      </p>
    </Card>
  );
}
