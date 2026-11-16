import { useCharacterView } from '../store/character-view';

export function CharacterLinks({ hanzi }: { hanzi: string }) {
  const open = useCharacterView((state) => state.open);
  const chars = [...hanzi];
  return (
    <div className="char-links">
      <span className="char-links__label">Origen</span>
      {chars.map((char) => (
        <button
          key={char}
          type="button"
          className="char-links__chip"
          onClick={() => open(char, chars)}
          aria-label={`Ver el origen del carácter ${char}`}
          lang="zh-Hans"
        >
          {char}
        </button>
      ))}
    </div>
  );
}
