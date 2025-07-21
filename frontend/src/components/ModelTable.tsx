import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { CellValueChangedEvent, ColDef } from 'ag-grid-community';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

ModuleRegistry.registerModules([AllCommunityModule]);
import type { Currency, Row } from '../types';
import { currencyOptions } from '../types';
import styles from './ModelTable.module.css';

interface PinnedRow {
  account: string;
  amount: number;
}

interface Props {
  rows: Row[];
  errors: Record<string, boolean>;
  baseCurrency: Currency;
  fxRates: Record<string, number>;
  pinnedBottomRowData: PinnedRow[];
  onAccountChange: (id: string, value: string) => void;
  onCurrencyChange: (id: string, currency: Currency) => void;
  onAmountChange: (id: string, value: string) => void;
  onDeleteRow: (id: string) => void;
  fmt: (value: number, currency: Currency) => string;
}

export default function ModelTable({
  rows,
  errors,
  baseCurrency,
  fxRates,
  pinnedBottomRowData,
  onAccountChange,
  onCurrencyChange,
  onAmountChange,
  onDeleteRow,
  fmt,
}: Props) {
  const columnDefs = useMemo<ColDef<Row>[]>(
    () => [
      {
        headerName: 'Account',
        field: 'account',
        editable: true,
      },
      {
        headerName: 'Currency',
        field: 'currency',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: { values: currencyOptions },
      },
      {
        headerName: 'Amount',
        field: 'amount',
        editable: true,
        type: 'numericColumn',
        cellClass: (params) => {
          const baseClass =
            (params.data?.amount ?? 0) >= 0 ? styles.positive : styles.negative
          return errors[params.data?.id ?? '']
            ? `${baseClass} ${styles.inputError}`
            : baseClass
        },
      },
      {
        headerName: `Amount (${baseCurrency})`,
        valueGetter: (p) =>
          (p.data?.amount ?? 0) / (fxRates[p.data?.currency ?? baseCurrency] ?? 1),
        valueFormatter: (p) => fmt(p.value as number, baseCurrency),
        cellClass: (params) =>
          (params.data?.amount ?? 0) >= 0 ? styles.positive : styles.negative,
      },
      {
        headerName: '',
        field: 'id',
        cellRenderer: () => `<button class="${styles.deleteButton}">Delete</button>`,
        editable: false,
        width: 90,
      },
    ],
    [baseCurrency, fxRates, fmt],
  );

  const onCellValueChanged = (e: CellValueChangedEvent<Row>) => {
    const { data, colDef } = e
    if (!data) return
    if (colDef.field === 'account') onAccountChange(data.id, data.account)
    else if (colDef.field === 'currency')
      onCurrencyChange(data.id, data.currency as Currency)
    else if (colDef.field === 'amount') onAmountChange(data.id, String(data.amount))
  }

  const onCellClicked = (e: any) => {
    if (e.colDef.field === 'id' && e.data) onDeleteRow(e.data.id)
  }

  return (
    <div className={`ag-theme-alpine ${styles.grid}`} role="grid">
      <AgGridReact
        rowData={rows}
        columnDefs={columnDefs}
        onCellValueChanged={onCellValueChanged}
        onCellClicked={onCellClicked}
        pinnedBottomRowData={pinnedBottomRowData}
        suppressMovableColumns
        stopEditingWhenCellsLoseFocus
      />
    </div>
  );
}
