import { Card } from './ui/Card';
import { Icon } from './ui/Icon';
import {
  allMissionsDone,
  makeMissions,
  missionProgress,
  MISSION_REWARD,
  type Mission,
} from '../lib/missions';
import { dayKey } from '../store/metrics';
import { useLearner } from '../store/useLearner';

function MissionRow({ mission, progress }: { mission: Mission; progress: number }) {
  const complete = progress >= mission.target;
  return (
    <li className={`missions__item${complete ? ' is-done' : ''}`}>
      <a className="missions__link" href={mission.href}>
        <span className="missions__icon" aria-hidden="true">
          <Icon name={mission.icon} size={16} />
        </span>
        <span className="missions__body">
          <strong>{mission.title}</strong>
          <small>{mission.detail}</small>
        </span>
        <span className="missions__count">
          {complete ? <Icon name="check" size={14} /> : `${progress}/${mission.target}`}
        </span>
      </a>
      <span className="missions__bar" aria-hidden="true">
        <span style={{ width: `${Math.round((progress / mission.target) * 100)}%` }} />
      </span>
    </li>
  );
}

function claimLabel(claimed: boolean, all: boolean): string {
  if (claimed) return 'Recompensa reclamada';
  return all ? `Reclamar +${MISSION_REWARD} XP` : 'Completa las tres';
}

function MissionList({ rows }: { rows: { mission: Mission; progress: number }[] }) {
  return (
    <ul className="missions__list">
      {rows.map(({ mission, progress }) => (
        <MissionRow key={mission.id} mission={mission} progress={progress} />
      ))}
    </ul>
  );
}

/** Tres misiones diarias derivadas de la actividad real, no de puntos inventados. */
export function MissionsCard({ now }: { now: number }) {
  const activity = useLearner((state) => state.activity);
  const claimedDate = useLearner((state) => state.missionsClaimed);
  const claim = useLearner((state) => state.claimMissions);

  const key = dayKey(now);
  const missions = makeMissions(key);
  const rows = missions.map((mission) => ({
    mission,
    progress: missionProgress(activity, mission, key),
  }));
  const all = allMissionsDone(activity, missions, key);
  const claimed = claimedDate === key;
  const done = rows.filter(({ mission, progress }) => progress >= mission.target).length;
  const label = claimLabel(claimed, all);

  return (
    <Card className="missions">
      <div className="missions__head">
        <div>
          <p className="eyebrow">Hoy</p>
          <h2>Misiones de práctica</h2>
        </div>
        <span className="missions__done">
          {done} / {missions.length}
        </span>
      </div>
      <MissionList rows={rows} />
      <button
        type="button"
        className="button button--primary missions__cta"
        disabled={!all || claimed}
        onClick={() => claim(now)}
      >
        {label}
      </button>
      <p className="missions__hint">Cuentan lo que practicas hoy, no lo que ya sabes.</p>
    </Card>
  );
}
