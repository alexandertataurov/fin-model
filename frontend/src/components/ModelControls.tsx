import type { ChangeEvent } from 'react'
import type { Currency, Scenario, Snapshot } from '../types'
import { currencyOptions } from '../types'
import Tooltip from './Tooltip'
import Button from './ui/Button'
import ThemeToggle from './ui/ThemeToggle'
import { Select } from './ui/Field'
import SnapshotDropdown from './SnapshotDropdown'
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
      <fieldset>
        <legend>Scenario</legend>
        <Tooltip text="Select a scenario multiplier for projections">
          <span className={styles.help}>?</span>
        </Tooltip>
        <Select id="scenario" value={scenario} onChange={onChangeScenario}>
          {scenarioOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      </fieldset>
      <fieldset>
        <legend>Base</legend>
        <Tooltip text="Choose the currency for aggregated amounts">
          <span className={styles.help}>?</span>
        </Tooltip>
        <Select
          id="baseCurrency"
          value={baseCurrency}
          onChange={(e) => onChangeBaseCurrency(e.target.value as Currency)}
        >
          {currencyOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      </fieldset>
      <Button onClick={onAddRow}>Add Row</Button>
      <Button onClick={onExport}>Export CSV</Button>
      <Button onClick={onImport}>Import CSV</Button>
      <Button onClick={onSaveSnapshot}>Save Snapshot</Button>
      <SnapshotDropdown snapshots={snapshots} onChange={onLoadSnapshot} />
      <Button onClick={onSync}>Sync to Cloud</Button>
      <ThemeToggle theme={theme} onToggle={onToggleTheme} />
    </div>
  );
}

export default ModelControls;
