import { CharacterSheet } from '../components/CharacterSheet';
import { getCharacterSheetData } from '../data/character-sheet';
import { navigate } from '../lib/router';

export function Character({ char }: { char: string }) {
  return (
    <section className="character">
      <button
        type="button"
        className="link character__back"
        onClick={() => (window.history.length > 1 ? window.history.back() : navigate('/'))}
      >
        ← Volver
      </button>
      <CharacterSheet data={getCharacterSheetData(char)} />
    </section>
  );
}
