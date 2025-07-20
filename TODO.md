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
- [ ] **Scenario Analysis**
  - Dropdown to switch between Base / Optimistic / Pessimistic cases
  - Apply multipliers (growth rate, FX impact)
- [ ] **Versioning & Snapshots**
  - Save different versions of the model (local snapshots)
  - Compare two snapshots side-by-side
- [ ] **Charts & Visualization**
  - Add revenue/profit/cashflow charts with `recharts` or `chart.js`
- [ ] **Export / Import**
  - Export grid to CSV/Excel
  - Import back into the grid
- [ ] **Multi-currency support**
  - Add currency column + live FX conversion
- [ ] **Backend sync**
  - Integrate REST/GraphQL API for saving models remotely

---

## 🗂 Project Structure (planned)
