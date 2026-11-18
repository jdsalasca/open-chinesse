const RATES = [0.75, 1, 1.25];

export function SpeedControl({
  rate,
  onChange,
  label = 'Velocidad de reproducción',
}: {
  rate: number;
  onChange: (rate: number) => void;
  label?: string;
}) {
  return (
    <div className="speed-control" role="group" aria-label={label}>
      <span className="speed-control__label">Velocidad</span>
      {RATES.map((value) => (
        <button
          key={value}
          type="button"
          className={`speed-control__button${rate === value ? ' is-active' : ''}`}
          aria-pressed={rate === value}
          onClick={() => onChange(value)}
        >
          {value}×
        </button>
      ))}
    </div>
  );
}
