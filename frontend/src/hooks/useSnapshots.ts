import { useCallback } from 'react';
import type { Row, Snapshot } from '../types';
import useLocalStorage from './useLocalStorage';

const STORAGE_KEY = 'snapshots';

export default function useSnapshots() {
  const [snapshots, setSnapshots] = useLocalStorage<Snapshot[]>(STORAGE_KEY, []);

  const saveSnapshot = useCallback(
    (rows: Row[], name: string) => {
      const timestamp = new Date().toISOString();
      const snap: Snapshot = {
        id: crypto.randomUUID(),
        timestamp,
        name,
        rows,
      };
      const updated = [...snapshots, snap];
      setSnapshots(updated);
    },
    [snapshots],
  );

  const renameSnapshot = useCallback(
    (id: string, name: string) => {
      const updated = snapshots.map((s) =>
        s.id === id ? { ...s, name } : s,
      );
      setSnapshots(updated);
    },
    [snapshots],
  );

  const deleteSnapshot = useCallback(
    (id: string) => {
      const updated = snapshots.filter((s) => s.id !== id);
      setSnapshots(updated);
    },
    [snapshots],
  );

  return { snapshots, saveSnapshot, renameSnapshot, deleteSnapshot } as const;
}
