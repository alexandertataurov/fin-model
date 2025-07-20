import { useCallback, useEffect, useState } from 'react';
import type { Row, Snapshot } from '../types';

const STORAGE_KEY = 'snapshots';

export default function useSnapshots() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Snapshot[];
        parsed.forEach((s) => {
          if (!s.name) {
            s.name = new Date(s.timestamp).toLocaleString();
          }
        });
        setSnapshots(parsed);
      } catch {
        setSnapshots([]);
      }
    }
  }, []);

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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [snapshots],
  );

  const renameSnapshot = useCallback(
    (id: string, name: string) => {
      const updated = snapshots.map((s) =>
        s.id === id ? { ...s, name } : s,
      );
      setSnapshots(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [snapshots],
  );

  const deleteSnapshot = useCallback(
    (id: string) => {
      const updated = snapshots.filter((s) => s.id !== id);
      setSnapshots(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [snapshots],
  );

  return { snapshots, saveSnapshot, renameSnapshot, deleteSnapshot } as const;
}
