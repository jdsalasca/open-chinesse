const KEY = (unitId: string): string => `open-chinesse:lesson-part:${unitId}`;

/** Parte 1-3 en la que se quedó la lección; 1 si no hay nada guardado. */
export function loadLessonPart(unitId: string): number {
  try {
    const value = Number(localStorage.getItem(KEY(unitId)));
    return value === 2 || value === 3 ? value : 1;
  } catch {
    return 1;
  }
}

export function saveLessonPart(unitId: string, part: number): void {
  try {
    if (part > 1 && part <= 3) localStorage.setItem(KEY(unitId), String(part));
  } catch {
    // Sin almacenamiento: la lección sigue funcionando, solo no recuerda la parte.
  }
}

export function clearLessonPart(unitId: string): void {
  try {
    localStorage.removeItem(KEY(unitId));
  } catch {
    // Sin almacenamiento no hay nada que limpiar.
  }
}
