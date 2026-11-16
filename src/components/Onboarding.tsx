import { useState } from 'react';
import { Card } from './ui/Card';
import { navigate } from '../lib/router';
import { useLearner } from '../store/useLearner';

const GOALS = [
  { minutes: 5, xp: 20, label: 'Cinco minutos' },
  { minutes: 10, xp: 30, label: 'Diez minutos' },
  { minutes: 15, xp: 50, label: 'Quince minutos' },
];

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <Card className="onboarding__card">
      <p className="eyebrow">Bienvenido</p>
      <h1 className="onboarding__title">
        你好<span>hola</span>
      </h1>
      <p className="onboarding__lead">
        Un curso gratuito de chino mandarín con audio real, historias cortas y repaso que se adapta
        a tu memoria. Sin ligas, sin anuncios, sin castigos.
      </p>
      <ul className="onboarding__list">
        <li>601 palabras de HSK 1, 2 y 3, cada una con frase y voz.</li>
        <li>Repaso espaciado FSRS: vuelve justo antes de que se te olvide.</li>
        <li>Ficha de cada carácter: de dónde viene y cómo se construye.</li>
      </ul>
      <button type="button" className="button button--primary" onClick={onNext}>
        Empezar
      </button>
    </Card>
  );
}

function Goal({ onPick }: { onPick: (xp: number) => void }) {
  return (
    <Card className="onboarding__card">
      <p className="eyebrow">Tu ritmo</p>
      <h1 className="onboarding__title onboarding__title--small">¿Cuánto tiempo al día?</h1>
      <p className="onboarding__lead">
        Puedes cambiarlo cuando quieras. Mejor cinco minutos todos los días que una hora un domingo.
      </p>
      <div className="onboarding__goals">
        {GOALS.map((goal) => (
          <button
            key={goal.minutes}
            type="button"
            className="onboarding__goal"
            onClick={() => onPick(goal.xp)}
          >
            <strong>{goal.label}</strong>
            <span>{goal.xp} XP al día</span>
          </button>
        ))}
      </div>
    </Card>
  );
}

/** Primera pantalla: sin progreso, nadie debería ver una portada vacía. */
export function Onboarding() {
  const complete = useLearner((state) => state.completeOnboarding);
  const [step, setStep] = useState(0);

  if (step === 0) return <Welcome onNext={() => setStep(1)} />;

  return (
    <Goal
      onPick={(xp) => {
        complete(xp);
        navigate('/lesson/h1-01');
      }}
    />
  );
}
