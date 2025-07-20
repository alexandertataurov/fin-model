# 🏦 Advanced Financial Modelling App – TODO

## ✅ Done
- [x] **React + TypeScript setup with Vite**
- [x] **Basic financial grid using `ag-grid-react`**
- [x] **Editable rows with “Add Row” button**
- [x] **Pinned totals row recalculating automatically**
- [x] **Basic monospaced styling**

---

## 🔜 Next
- [x] **Persist grid data to Local Storage**
  - Load saved data on mount
  - Save changes on each edit
- [x] **Support deleting rows**
  - Add “Delete” action column
  - Update totals dynamically after delete
- [x] **Format amounts as currency**
  - Use `Intl.NumberFormat` for USD/EUR/… display
  - Maybe custom CurrencyCellRenderer
- [x] **Add additional financial metrics**
  - Gross Margin
  - EBITDA
  - ROI
  - Cash Flow

---

## 🚀 Future Enhancements
- [x] **Scenario Analysis** _(P1)_
  - Dropdown to switch between Base / Optimistic / Pessimistic cases
  - Apply multipliers (growth rate, FX impact)
- [x] **Multi-currency support** _(P1)_
  - Add currency column + live FX conversion
- [ ] **Export / Import** _(P2)_
  - Export grid to CSV/Excel
  - Import back into the grid
- [ ] **Charts & Visualization** _(P2)_
  - Add revenue/profit/cashflow charts with `recharts` or `chart.js`
- [ ] **Versioning & Snapshots** _(P3)_
  - Save different versions of the model (local snapshots)
  - Compare two snapshots side-by-side
- [ ] **Backend sync** _(P3)_
  - Integrate REST/GraphQL API for saving models remotely

---

## 🗂 Project Structure (planned)
