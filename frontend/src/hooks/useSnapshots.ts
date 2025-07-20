import { useCallback, useEffect, useState } from 'react';
import type { Row, Snapshot } from '../types';

const STORAGE_KEY = 'snapshots';

export default function useSnapshots() {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSnapshots(JSON.parse(stored) as Snapshot[]);
      } catch {
        setSnapshots([]);
      }
    }
  }, []);

  const saveSnapshot = useCallback(
    (rows: Row[]) => {
      const snap: Snapshot = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        rows,
      };
      const updated = [...snapshots, snap];
      setSnapshots(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    },
    [snapshots],
  );

  return { snapshots, saveSnapshot } as const;
}
