import { withKeys } from '../lib/keys';
import { useCharacterView } from '../store/character-view';

export function CharacterLinks({ hanzi }: { hanzi: string }) {
  const open = useCharacterView((state) => state.open);
  const chars = [...hanzi];
  return (
    <div className="char-links">
      <span className="char-links__label">Origen</span>
      {withKeys(chars, (char) => char).map(({ item: char, key }) => (
        <button
          key={key}
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
