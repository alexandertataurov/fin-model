import { useEffect } from 'react';

interface Shortcuts {
  addRow: () => void;
  saveSnapshot: () => void;
  exportCsv: () => void;
  toggleTheme: () => void;
}

export default function useKeyboardShortcuts({ addRow, saveSnapshot, exportCsv, toggleTheme }: Shortcuts) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!e.ctrlKey) return;
      const key = e.key.toLowerCase();
      if (key === 'n') {
        e.preventDefault();
        addRow();
      } else if (key === 's') {
        e.preventDefault();
        saveSnapshot();
      } else if (key === 'e') {
        e.preventDefault();
        exportCsv();
      } else if (key === 't') {
        e.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [addRow, saveSnapshot, exportCsv, toggleTheme]);
}
