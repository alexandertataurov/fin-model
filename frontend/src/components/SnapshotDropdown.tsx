import type { ChangeEvent } from 'react';
import type { Snapshot } from '../types';
import { Select } from './ui/Field';

interface Props {
  snapshots: Snapshot[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function SnapshotDropdown({ snapshots, onChange }: Props) {
  return (
    <Select onChange={onChange}>
      <option value="">Snapshots...</option>
      <optgroup label="Load">
        {snapshots.map((s) => (
          <option key={`load-${s.id}`} value={`load:${s.id}`}>{s.name}</option>
        ))}
      </optgroup>
      <optgroup label="Rename">
        {snapshots.map((s) => (
          <option key={`rename-${s.id}`} value={`rename:${s.id}`}>{s.name}</option>
        ))}
      </optgroup>
      <optgroup label="Delete">
        {snapshots.map((s) => (
          <option key={`delete-${s.id}`} value={`delete:${s.id}`}>{s.name}</option>
        ))}
      </optgroup>
    </Select>
  );
}
