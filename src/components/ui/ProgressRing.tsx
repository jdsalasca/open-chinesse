type Props = {
  value: number;
  max: number;
  label: string;
  caption?: string;
  size?: number;
  stroke?: number;
};

/** Anillo de progreso con el número dentro y descripción accesible. */
export function ProgressRing({ value, max, label, caption, size = 118, stroke = 10 }: Props) {
  const safeMax = Math.max(max, 1);
  const ratio = Math.min(1, Math.max(0, value / safeMax));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - ratio);

  return (
    <div
      className="ring"
      role="img"
      aria-label={`${label}: ${value} de ${max}`}
      style={{ width: size, height: size }}
    >
      <svg className="ring__svg" width={size} height={size} aria-hidden="true">
        <circle
          className="ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
        />
        <circle
          className="ring__value"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="ring__label">
        <span className="ring__number">{Math.round(value)}</span>
        <span className="ring__caption">{caption ?? label}</span>
      </span>
    </div>
  );
}
