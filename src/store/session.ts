import { create } from 'zustand';
import { fetchMe, fetchProviders, signOut, type SessionUser } from '../lib/api';
import { startSync, stopSync } from './sync';

type Status = 'loading' | 'anonymous' | 'authenticated';

type SessionState = {
  status: Status;
  user: SessionUser | null;
  providers: string[];
  init: () => Promise<void>;
  setUser: (user: SessionUser) => void;
  signOutUser: () => Promise<void>;
};

export const useSession = create<SessionState>()((set, get) => ({
  status: 'loading',
  user: null,
  providers: [],
  init: async () => {
    if (get().status !== 'loading') return;
    const providers = await fetchProviders();
    try {
      const user = await fetchMe();
      if (user) {
        set({ status: 'authenticated', user, providers });
        await startSync();
        return;
      }
    } catch {
      // Servidor caído: se sigue en modo invitado.
    }
    set({ status: 'anonymous', user: null, providers });
  },
  setUser: (user) => {
    set({ status: 'authenticated', user });
    void startSync();
  },
  signOutUser: async () => {
    stopSync();
    try {
      await signOut();
    } finally {
      set({ status: 'anonymous', user: null });
    }
  },
}));
