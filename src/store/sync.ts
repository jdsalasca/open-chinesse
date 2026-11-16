import { fetchProgress, pushProgress } from '../lib/api';
import { exportPayload, useLearner } from './useLearner';

type SyncState = {
  enabled: boolean;
  timer: number | null;
  applying: boolean;
};

const state: SyncState = { enabled: false, timer: null, applying: false };

const DEBOUNCE_MS = 2500;

async function push(): Promise<void> {
  const { lastEditAt } = useLearner.getState();
  if (state.applying || lastEditAt === 0) return;
  await pushProgress(exportPayload(), new Date(lastEditAt).toISOString());
}

function schedule(): void {
  if (!state.enabled || state.applying) return;
  if (state.timer !== null) window.clearTimeout(state.timer);
  state.timer = window.setTimeout(() => {
    state.timer = null;
    push().catch(() => undefined);
  }, DEBOUNCE_MS);
}

let unsubscribe: (() => void) | null = null;

/** Activa la sincronización: al entrar, gana el progreso más reciente. */
export async function startSync(): Promise<void> {
  if (state.enabled) return;
  state.enabled = true;
  unsubscribe = useLearner.subscribe(schedule);
  try {
    const server = await fetchProgress();
    const local = useLearner.getState();
    if (!server) {
      await push();
      return;
    }
    const serverTime = Date.parse(server.updatedAt);
    if (serverTime > local.lastEditAt) {
      state.applying = true;
      local.hydrate(server.payload);
      state.applying = false;
    } else if (local.lastEditAt > serverTime) {
      await push();
    }
  } catch {
    // Sin conexión el progreso local sigue funcionando; se reintenta al editar.
  }
}

export function stopSync(): void {
  state.enabled = false;
  if (state.timer !== null) window.clearTimeout(state.timer);
  state.timer = null;
  unsubscribe?.();
  unsubscribe = null;
}
