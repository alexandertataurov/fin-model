import { useMemo, type CSSProperties } from "react";
import { AgGridReact } from "ag-grid-react";
import type { CellValueChangedEvent, ColDef } from "ag-grid-community";
import {
  ModuleRegistry,
  AllCommunityModule,
  themeAlpine,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);
const gridTheme = themeAlpine.withParams({
  fontFamily: ['Roboto Mono', 'monospace'],
});
import type { Currency, Row } from "../types";
import { currencyOptions } from "../types";

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
        headerName: "Account",
        field: "account",
        editable: true,
      },
      {
        headerName: "Currency",
        field: "currency",
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: currencyOptions },
      },
      {
        headerName: "Amount",
        field: "amount",
        editable: true,
        type: "numericColumn",
        cellClass: (params) => {
          const baseClass =
            (params.data?.amount ?? 0) >= 0
              ? 'text-[var(--positive-color)]'
              : 'text-[var(--negative-color)]';
          return errors[params.data?.id ?? ""]
            ? `${baseClass} border border-red-500 bg-red-50 dark:bg-red-900`
            : baseClass;
        },
      },
      {
        headerName: `Amount (${baseCurrency})`,
        valueGetter: (p) =>
          (p.data?.amount ?? 0) /
          (fxRates[p.data?.currency ?? baseCurrency] ?? 1),
        valueFormatter: (p) => fmt(p.value as number, baseCurrency),
        cellClass: (params) =>
          (params.data?.amount ?? 0) >= 0
            ? 'text-[var(--positive-color)]'
            : 'text-[var(--negative-color)]',
      },
      {
        headerName: "",
        field: "id",
        cellRenderer: () =>
          `<button class="px-2 py-0.5 text-xs text-white rounded bg-[var(--negative-color)] hover:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--negative-color)]">Delete</button>`,
        editable: false,
        width: 90,
      },
    ],
    [baseCurrency, fxRates, fmt],
  );

  const onCellValueChanged = (e: CellValueChangedEvent<Row>) => {
    const { data, colDef } = e;
    if (!data) return;
    if (colDef.field === "account") onAccountChange(data.id, data.account);
    else if (colDef.field === "currency")
      onCurrencyChange(data.id, data.currency as Currency);
    else if (colDef.field === "amount")
      onAmountChange(data.id, String(data.amount));
  };

  const onCellClicked = (e: any) => {
    if (e.colDef.field === "id" && e.data) onDeleteRow(e.data.id);
  };

  return (
    <div className="h-[300px] w-full" role="grid" style={{ '--ag-font-family': 'Roboto Mono, monospace' } as CSSProperties}>
      <AgGridReact
        theme={gridTheme}
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
