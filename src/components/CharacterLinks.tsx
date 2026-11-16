import { navigate } from '../lib/router';

export function CharacterLinks({ hanzi }: { hanzi: string }) {
  return (
    <div className="char-links">
      <span className="char-links__label">Origen</span>
      {[...hanzi].map((char) => (
        <button
          key={char}
          type="button"
          className="char-links__chip"
          onClick={() => navigate(`/caracter/${encodeURIComponent(char)}`)}
          aria-label={`Ver el origen del carácter ${char}`}
          lang="zh-Hans"
        >
          {char}
        </button>
      ))}
    </div>
  );
}
