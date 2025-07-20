import type { ChangeEvent } from 'react'
import type { Currency, Scenario, Snapshot } from '../types'
import { currencyOptions } from '../types'
import Tooltip from './Tooltip'
import Button from './ui/Button'
import ThemeToggle from './ui/ThemeToggle'
import styles from './ModelControls.module.css'

interface Props {
  baseCurrency: Currency;
  scenario: Scenario;
  scenarioOptions: readonly Scenario[];
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
        {currencyOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <Button onClick={onAddRow}>Add Row</Button>
      <Button onClick={onExport}>Export CSV</Button>
      <Button onClick={onImport}>Import CSV</Button>
      <Button onClick={onSaveSnapshot}>Save Snapshot</Button>
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
      <Button onClick={onSync}>Sync to Cloud</Button>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </div>
  );
}

export default ModelControls;
