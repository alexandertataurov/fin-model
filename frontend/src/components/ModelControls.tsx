import type { ChangeEvent } from 'react'
import type { Currency, Snapshot } from '../types'
import Tooltip from './Tooltip'
import styles from './ModelControls.module.css'

interface Props {
  baseCurrency: Currency;
  scenario: string;
  scenarioOptions: readonly string[];
  snapshots: Snapshot[];
  theme: 'light' | 'dark';
  onChangeBaseCurrency: (currency: Currency) => void;
  onChangeScenario: (e: ChangeEvent<HTMLSelectElement>) => void;
  onAddRow: () => void;
  onExport: () => void;
  onImport: () => void;
  onSaveSnapshot: () => void;
  onLoadSnapshot: (e: ChangeEvent<HTMLSelectElement>) => void;
  onSync: () => void;
  onToggleTheme: () => void;
}

function ModelControls({
  baseCurrency,
  scenario,
  scenarioOptions,
  snapshots,
  theme,
  onChangeBaseCurrency,
  onChangeScenario,
  onAddRow,
  onExport,
  onImport,
  onSaveSnapshot,
  onLoadSnapshot,
  onSync,
  onToggleTheme,
}: Props) {
  return (
    <div className={styles.controls}>
      <label htmlFor="scenario">
        Scenario{' '}
        <Tooltip text="Select a scenario multiplier for projections">
          <span className={styles.help}>?</span>
        </Tooltip>
      </label>
      <select
        id="scenario"
        value={scenario}
        onChange={onChangeScenario}
        className="field"
      >
        {scenarioOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <label htmlFor="baseCurrency">
        Base{' '}
        <Tooltip text="Choose the currency for aggregated amounts">
          <span className={styles.help}>?</span>
        </Tooltip>
      </label>
      <select
        id="baseCurrency"
        value={baseCurrency}
        onChange={(e) => onChangeBaseCurrency(e.target.value as Currency)}
        className="field"
      >
        {['USD', 'EUR', 'GBP'].map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <button type="button" onClick={onAddRow} className="btn">
        Add Row
      </button>
      <button type="button" onClick={onExport} className="btn">
        Export CSV
      </button>
      <button type="button" onClick={onImport} className="btn">
        Import CSV
      </button>
      <button type="button" onClick={onSaveSnapshot} className="btn">
        Save Snapshot
      </button>
      <select onChange={onLoadSnapshot} className="field">
        <option value="">Snapshots...</option>
        <optgroup label="Load">
          {snapshots.map((s) => (
            <option key={`load-${s.id}`} value={`load:${s.id}`}>
              {s.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="Rename">
          {snapshots.map((s) => (
            <option key={`rename-${s.id}`} value={`rename:${s.id}`}>
              {s.name}
            </option>
          ))}
        </optgroup>
        <optgroup label="Delete">
          {snapshots.map((s) => (
            <option key={`delete-${s.id}`} value={`delete:${s.id}`}>
              {s.name}
            </option>
          ))}
        </optgroup>
      </select>
      <button type="button" onClick={onSync} className="btn">
        Sync to Cloud
      </button>
      <button type="button" onClick={onToggleTheme} className="btn">
        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
      </button>
    </div>
  );
}

export default ModelControls;
