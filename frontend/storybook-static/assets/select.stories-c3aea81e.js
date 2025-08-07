import{j as e}from"./jsx-runtime-22eea9ba.js";import{S as t,a as l,b as a,c as s,d as r}from"./select-8babf009.js";import{L as c}from"./label-c663e830.js";import{B as v}from"./button-df58ecc4.js";import{C as x,a as j,b as g,c as I,d as y}from"./card-b5d2c5ab.js";import"./storybook-vendor-bdd8b375.js";import"./index-16ad2b44.js";import"./index-745a12a1.js";import"./index-78593782.js";import"./index-fa2897fa.js";import"./Combination-f87132d5.js";import"./index-363cc9d9.js";import"./index-53087e4f.js";import"./index-c442c7b5.js";import"./utils-bbd425d4.js";import"./ui-components-36f6f75d.js";import"./cn-bbd425d4.js";const M={title:"🧩 UI Components/Select",component:t,parameters:{layout:"centered",docs:{description:{component:`
# Select Component

A dropdown select component built on Radix UI primitives with full accessibility support. Provides consistent styling and behavior for choosing from predefined options.

## Select Components

- **Select**: Root select container
- **SelectTrigger**: Button that opens the dropdown
- **SelectValue**: Displays the selected value
- **SelectContent**: Dropdown content container
- **SelectItem**: Individual selectable options

## Key Features

- **Accessible**: Full keyboard navigation and screen reader support
- **Searchable**: Type to filter options (when enabled)
- **Customizable**: Flexible styling and content options
- **Controlled**: Both controlled and uncontrolled modes
- **Multi-select**: Support for multiple selections

## Usage in FinVision

- **Parameter Categories**: Filter parameters by type
- **Time Periods**: Select reporting periods
- **Chart Types**: Choose visualization types
- **User Roles**: Admin interface selections
- **File Types**: Filter uploaded files
        `}}},argTypes:{disabled:{control:"boolean",description:"Disable the select"},defaultValue:{control:"text",description:"Default selected value"}},tags:["autodocs"]},n={render:()=>e.jsxs("div",{className:"w-80 space-y-2",children:[e.jsx(c,{children:"Choose an option"}),e.jsxs(t,{children:[e.jsx(l,{children:e.jsx(a,{placeholder:"Select an option..."})}),e.jsxs(s,{children:[e.jsx(r,{value:"option1",children:"Option 1"}),e.jsx(r,{value:"option2",children:"Option 2"}),e.jsx(r,{value:"option3",children:"Option 3"})]})]})]})},i={render:()=>e.jsxs("div",{className:"w-80 space-y-2",children:[e.jsx(c,{children:"Time Period"}),e.jsxs(t,{defaultValue:"q1",children:[e.jsx(l,{children:e.jsx(a,{})}),e.jsxs(s,{children:[e.jsx(r,{value:"q1",children:"Q1 2024"}),e.jsx(r,{value:"q2",children:"Q2 2024"}),e.jsx(r,{value:"q3",children:"Q3 2024"}),e.jsx(r,{value:"q4",children:"Q4 2024"})]})]})]}),parameters:{docs:{description:{story:"Select with a pre-selected default value."}}}},o={render:()=>e.jsxs("div",{className:"w-80 space-y-2",children:[e.jsx(c,{children:"Parameter Category"}),e.jsxs(t,{defaultValue:"all",children:[e.jsx(l,{children:e.jsx(a,{})}),e.jsxs(s,{children:[e.jsx(r,{value:"all",children:"All Categories"}),e.jsx(r,{value:"revenue",children:"Revenue Parameters"}),e.jsx(r,{value:"costs",children:"Cost Parameters"}),e.jsx(r,{value:"valuation",children:"Valuation Parameters"}),e.jsx(r,{value:"operational",children:"Operational Parameters"}),e.jsx(r,{value:"market",children:"Market Parameters"})]})]})]}),parameters:{docs:{description:{story:"Parameter category selector for filtering financial parameters."}}}},d={render:()=>e.jsxs("div",{className:"w-80 space-y-2",children:[e.jsx(c,{children:"Chart Type"}),e.jsxs(t,{defaultValue:"line",children:[e.jsx(l,{children:e.jsx(a,{})}),e.jsxs(s,{children:[e.jsx(r,{value:"line",children:"Line Chart"}),e.jsx(r,{value:"bar",children:"Bar Chart"}),e.jsx(r,{value:"pie",children:"Pie Chart"}),e.jsx(r,{value:"waterfall",children:"Waterfall Chart"}),e.jsx(r,{value:"scatter",children:"Scatter Plot"}),e.jsx(r,{value:"heatmap",children:"Heat Map"})]})]})]}),parameters:{docs:{description:{story:"Chart type selector for data visualization options."}}}},m={render:()=>e.jsxs("div",{className:"w-80 space-y-2",children:[e.jsx(c,{children:"Display Currency"}),e.jsxs(t,{defaultValue:"usd",children:[e.jsx(l,{children:e.jsx(a,{})}),e.jsxs(s,{children:[e.jsx(r,{value:"usd",children:"🇺🇸 USD - US Dollar"}),e.jsx(r,{value:"eur",children:"🇪🇺 EUR - Euro"}),e.jsx(r,{value:"gbp",children:"🇬🇧 GBP - British Pound"}),e.jsx(r,{value:"jpy",children:"🇯🇵 JPY - Japanese Yen"}),e.jsx(r,{value:"cad",children:"🇨🇦 CAD - Canadian Dollar"}),e.jsx(r,{value:"aud",children:"🇦🇺 AUD - Australian Dollar"})]})]})]}),parameters:{docs:{description:{story:"Currency selector with flags and full currency names."}}}},u={render:()=>e.jsxs("div",{className:"w-80 space-y-2",children:[e.jsx(c,{children:"User Role"}),e.jsxs(t,{children:[e.jsx(l,{children:e.jsx(a,{placeholder:"Select user role..."})}),e.jsxs(s,{children:[e.jsx(r,{value:"admin",children:"Administrator"}),e.jsx(r,{value:"analyst",children:"Financial Analyst"}),e.jsx(r,{value:"manager",children:"Manager"}),e.jsx(r,{value:"viewer",children:"Viewer"})]})]})]}),parameters:{docs:{description:{story:"User role selector for admin interface."}}}},p={render:()=>e.jsxs("div",{className:"w-80 space-y-2",children:[e.jsx(c,{children:"Disabled Select"}),e.jsxs(t,{disabled:!0,children:[e.jsx(l,{children:e.jsx(a,{placeholder:"This select is disabled"})}),e.jsxs(s,{children:[e.jsx(r,{value:"option1",children:"Option 1"}),e.jsx(r,{value:"option2",children:"Option 2"})]})]})]}),parameters:{docs:{description:{story:"Select component in disabled state."}}}},S={render:()=>e.jsxs(x,{className:"w-96",children:[e.jsxs(j,{children:[e.jsx(g,{children:"Report Configuration"}),e.jsx(I,{children:"Configure your financial report settings"})]}),e.jsxs(y,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(c,{children:"Report Type"}),e.jsxs(t,{defaultValue:"income",children:[e.jsx(l,{children:e.jsx(a,{})}),e.jsxs(s,{children:[e.jsx(r,{value:"income",children:"Income Statement"}),e.jsx(r,{value:"balance",children:"Balance Sheet"}),e.jsx(r,{value:"cashflow",children:"Cash Flow Statement"}),e.jsx(r,{value:"comprehensive",children:"Comprehensive Report"})]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(c,{children:"Time Period"}),e.jsxs(t,{defaultValue:"annual",children:[e.jsx(l,{children:e.jsx(a,{})}),e.jsxs(s,{children:[e.jsx(r,{value:"monthly",children:"Monthly"}),e.jsx(r,{value:"quarterly",children:"Quarterly"}),e.jsx(r,{value:"annual",children:"Annual"})]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(c,{children:"Export Format"}),e.jsxs(t,{defaultValue:"pdf",children:[e.jsx(l,{children:e.jsx(a,{})}),e.jsxs(s,{children:[e.jsx(r,{value:"pdf",children:"PDF Document"}),e.jsx(r,{value:"excel",children:"Excel Spreadsheet"}),e.jsx(r,{value:"csv",children:"CSV File"}),e.jsx(r,{value:"json",children:"JSON Data"})]})]})]}),e.jsx("div",{className:"pt-4",children:e.jsx(v,{className:"w-full",children:"Generate Report"})})]})]}),parameters:{docs:{description:{story:"Form example using multiple select components for report configuration."}}}},h={render:()=>e.jsxs("div",{className:"w-full max-w-4xl space-y-4",children:[e.jsxs("div",{className:"flex space-x-4",children:[e.jsxs("div",{className:"flex-1",children:[e.jsx(c,{className:"sr-only",children:"Search"}),e.jsx("input",{className:"w-full px-3 py-2 border rounded-md",placeholder:"Search parameters..."})]}),e.jsxs(t,{defaultValue:"all",children:[e.jsx(l,{className:"w-48",children:e.jsx(a,{})}),e.jsxs(s,{children:[e.jsx(r,{value:"all",children:"All Categories"}),e.jsx(r,{value:"revenue",children:"Revenue"}),e.jsx(r,{value:"costs",children:"Costs"}),e.jsx(r,{value:"valuation",children:"Valuation"})]})]}),e.jsxs(t,{defaultValue:"any",children:[e.jsx(l,{className:"w-48",children:e.jsx(a,{})}),e.jsxs(s,{children:[e.jsx(r,{value:"any",children:"Any Status"}),e.jsx(r,{value:"modified",children:"Recently Modified"}),e.jsx(r,{value:"default",children:"Default Values"}),e.jsx(r,{value:"custom",children:"Custom Values"})]})]})]}),e.jsx("div",{className:"p-4 bg-muted rounded-lg",children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Filter results would appear here based on the selected criteria."})})]}),parameters:{docs:{description:{story:"Multiple select components used together for advanced filtering."}}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-2">\r
      <Label>Choose an option</Label>\r
      <Select>\r
        <SelectTrigger>\r
          <SelectValue placeholder="Select an option..." />\r
        </SelectTrigger>\r
        <SelectContent>\r
          <SelectItem value="option1">Option 1</SelectItem>\r
          <SelectItem value="option2">Option 2</SelectItem>\r
          <SelectItem value="option3">Option 3</SelectItem>\r
        </SelectContent>\r
      </Select>\r
    </div>
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-2">\r
      <Label>Time Period</Label>\r
      <Select defaultValue="q1">\r
        <SelectTrigger>\r
          <SelectValue />\r
        </SelectTrigger>\r
        <SelectContent>\r
          <SelectItem value="q1">Q1 2024</SelectItem>\r
          <SelectItem value="q2">Q2 2024</SelectItem>\r
          <SelectItem value="q3">Q3 2024</SelectItem>\r
          <SelectItem value="q4">Q4 2024</SelectItem>\r
        </SelectContent>\r
      </Select>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Select with a pre-selected default value.'
      }
    }
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-2">\r
      <Label>Parameter Category</Label>\r
      <Select defaultValue="all">\r
        <SelectTrigger>\r
          <SelectValue />\r
        </SelectTrigger>\r
        <SelectContent>\r
          <SelectItem value="all">All Categories</SelectItem>\r
          <SelectItem value="revenue">Revenue Parameters</SelectItem>\r
          <SelectItem value="costs">Cost Parameters</SelectItem>\r
          <SelectItem value="valuation">Valuation Parameters</SelectItem>\r
          <SelectItem value="operational">Operational Parameters</SelectItem>\r
          <SelectItem value="market">Market Parameters</SelectItem>\r
        </SelectContent>\r
      </Select>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Parameter category selector for filtering financial parameters.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-2">\r
      <Label>Chart Type</Label>\r
      <Select defaultValue="line">\r
        <SelectTrigger>\r
          <SelectValue />\r
        </SelectTrigger>\r
        <SelectContent>\r
          <SelectItem value="line">Line Chart</SelectItem>\r
          <SelectItem value="bar">Bar Chart</SelectItem>\r
          <SelectItem value="pie">Pie Chart</SelectItem>\r
          <SelectItem value="waterfall">Waterfall Chart</SelectItem>\r
          <SelectItem value="scatter">Scatter Plot</SelectItem>\r
          <SelectItem value="heatmap">Heat Map</SelectItem>\r
        </SelectContent>\r
      </Select>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Chart type selector for data visualization options.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-2">\r
      <Label>Display Currency</Label>\r
      <Select defaultValue="usd">\r
        <SelectTrigger>\r
          <SelectValue />\r
        </SelectTrigger>\r
        <SelectContent>\r
          <SelectItem value="usd">🇺🇸 USD - US Dollar</SelectItem>\r
          <SelectItem value="eur">🇪🇺 EUR - Euro</SelectItem>\r
          <SelectItem value="gbp">🇬🇧 GBP - British Pound</SelectItem>\r
          <SelectItem value="jpy">🇯🇵 JPY - Japanese Yen</SelectItem>\r
          <SelectItem value="cad">🇨🇦 CAD - Canadian Dollar</SelectItem>\r
          <SelectItem value="aud">🇦🇺 AUD - Australian Dollar</SelectItem>\r
        </SelectContent>\r
      </Select>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Currency selector with flags and full currency names.'
      }
    }
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-2">\r
      <Label>User Role</Label>\r
      <Select>\r
        <SelectTrigger>\r
          <SelectValue placeholder="Select user role..." />\r
        </SelectTrigger>\r
        <SelectContent>\r
          <SelectItem value="admin">Administrator</SelectItem>\r
          <SelectItem value="analyst">Financial Analyst</SelectItem>\r
          <SelectItem value="manager">Manager</SelectItem>\r
          <SelectItem value="viewer">Viewer</SelectItem>\r
        </SelectContent>\r
      </Select>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'User role selector for admin interface.'
      }
    }
  }
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-2">\r
      <Label>Disabled Select</Label>\r
      <Select disabled>\r
        <SelectTrigger>\r
          <SelectValue placeholder="This select is disabled" />\r
        </SelectTrigger>\r
        <SelectContent>\r
          <SelectItem value="option1">Option 1</SelectItem>\r
          <SelectItem value="option2">Option 2</SelectItem>\r
        </SelectContent>\r
      </Select>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Select component in disabled state.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-96">\r
      <CardHeader>\r
        <CardTitle>Report Configuration</CardTitle>\r
        <CardDescription>\r
          Configure your financial report settings\r
        </CardDescription>\r
      </CardHeader>\r
      <CardContent className="space-y-4">\r
        <div className="space-y-2">\r
          <Label>Report Type</Label>\r
          <Select defaultValue="income">\r
            <SelectTrigger>\r
              <SelectValue />\r
            </SelectTrigger>\r
            <SelectContent>\r
              <SelectItem value="income">Income Statement</SelectItem>\r
              <SelectItem value="balance">Balance Sheet</SelectItem>\r
              <SelectItem value="cashflow">Cash Flow Statement</SelectItem>\r
              <SelectItem value="comprehensive">\r
                Comprehensive Report\r
              </SelectItem>\r
            </SelectContent>\r
          </Select>\r
        </div>\r
\r
        <div className="space-y-2">\r
          <Label>Time Period</Label>\r
          <Select defaultValue="annual">\r
            <SelectTrigger>\r
              <SelectValue />\r
            </SelectTrigger>\r
            <SelectContent>\r
              <SelectItem value="monthly">Monthly</SelectItem>\r
              <SelectItem value="quarterly">Quarterly</SelectItem>\r
              <SelectItem value="annual">Annual</SelectItem>\r
            </SelectContent>\r
          </Select>\r
        </div>\r
\r
        <div className="space-y-2">\r
          <Label>Export Format</Label>\r
          <Select defaultValue="pdf">\r
            <SelectTrigger>\r
              <SelectValue />\r
            </SelectTrigger>\r
            <SelectContent>\r
              <SelectItem value="pdf">PDF Document</SelectItem>\r
              <SelectItem value="excel">Excel Spreadsheet</SelectItem>\r
              <SelectItem value="csv">CSV File</SelectItem>\r
              <SelectItem value="json">JSON Data</SelectItem>\r
            </SelectContent>\r
          </Select>\r
        </div>\r
\r
        <div className="pt-4">\r
          <Button className="w-full">Generate Report</Button>\r
        </div>\r
      </CardContent>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'Form example using multiple select components for report configuration.'
      }
    }
  }
}`,...S.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-full max-w-4xl space-y-4">\r
      <div className="flex space-x-4">\r
        <div className="flex-1">\r
          <Label className="sr-only">Search</Label>\r
          <input className="w-full px-3 py-2 border rounded-md" placeholder="Search parameters..." />\r
        </div>\r
\r
        <Select defaultValue="all">\r
          <SelectTrigger className="w-48">\r
            <SelectValue />\r
          </SelectTrigger>\r
          <SelectContent>\r
            <SelectItem value="all">All Categories</SelectItem>\r
            <SelectItem value="revenue">Revenue</SelectItem>\r
            <SelectItem value="costs">Costs</SelectItem>\r
            <SelectItem value="valuation">Valuation</SelectItem>\r
          </SelectContent>\r
        </Select>\r
\r
        <Select defaultValue="any">\r
          <SelectTrigger className="w-48">\r
            <SelectValue />\r
          </SelectTrigger>\r
          <SelectContent>\r
            <SelectItem value="any">Any Status</SelectItem>\r
            <SelectItem value="modified">Recently Modified</SelectItem>\r
            <SelectItem value="default">Default Values</SelectItem>\r
            <SelectItem value="custom">Custom Values</SelectItem>\r
          </SelectContent>\r
        </Select>\r
      </div>\r
\r
      <div className="p-4 bg-muted rounded-lg">\r
        <p className="text-sm text-muted-foreground">\r
          Filter results would appear here based on the selected criteria.\r
        </p>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Multiple select components used together for advanced filtering.'
      }
    }
  }
}`,...h.parameters?.docs?.source}}};const q=["Default","WithDefaultValue","ParameterCategories","ChartTypes","CurrencySelector","UserRoles","DisabledState","FormExample","FilterExample"];export{d as ChartTypes,m as CurrencySelector,n as Default,p as DisabledState,h as FilterExample,S as FormExample,o as ParameterCategories,u as UserRoles,i as WithDefaultValue,q as __namedExportsOrder,M as default};
