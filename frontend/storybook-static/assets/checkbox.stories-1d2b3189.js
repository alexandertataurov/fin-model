import{j as e}from"./radix-components-d49c0090.js";import{C as s}from"./checkbox-5ac430ca.js";import{L as a}from"./label-a9c1062e.js";import"./storybook-vendor-bdd8b375.js";import"./utils-b168998f.js";import"./ui-components-6f35ab38.js";const h={title:"🧩 UI Components/Checkbox",component:s,parameters:{layout:"centered",docs:{description:{component:`
# Checkbox Component

A checkbox component built with Radix UI primitives for consistent styling and accessibility across the FinVision platform.

## Key Features

- **Accessibility**: Built-in focus management and ARIA attributes
- **Controlled/Uncontrolled**: Supports both controlled and uncontrolled usage
- **Label Integration**: Works seamlessly with Label component
- **Disabled States**: Visual feedback for disabled state
- **Indeterminate State**: Support for indeterminate checkbox state

## Usage in FinVision

- **Parameter Selection**: Enable/disable model parameters
- **Report Options**: Select report sections to include
- **User Preferences**: Toggle user settings and preferences
- **Data Filtering**: Filter data tables and charts
        `}}},argTypes:{checked:{control:"boolean",description:"Checked state"},disabled:{control:"boolean",description:"Disable the checkbox"},id:{control:"text",description:"Unique identifier"}},tags:["autodocs"]},r={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"terms"}),e.jsx(a,{htmlFor:"terms",children:"Accept terms and conditions"})]})},t={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"newsletter",defaultChecked:!0}),e.jsx(a,{htmlFor:"newsletter",children:"Subscribe to newsletter"})]})},n={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"disabled-unchecked",disabled:!0}),e.jsx(a,{htmlFor:"disabled-unchecked",children:"Disabled unchecked"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"disabled-checked",disabled:!0,defaultChecked:!0}),e.jsx(a,{htmlFor:"disabled-checked",children:"Disabled checked"})]})]})},c={render:()=>e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"option1"}),e.jsx(a,{htmlFor:"option1",children:"Include revenue projections"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"option2"}),e.jsx(a,{htmlFor:"option2",children:"Include expense breakdown"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"option3"}),e.jsx(a,{htmlFor:"option3",children:"Include cash flow analysis"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"option4"}),e.jsx(a,{htmlFor:"option4",children:"Include sensitivity analysis"})]})]})},i={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-start space-x-2",children:[e.jsx(s,{id:"advanced",className:"mt-1"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(a,{htmlFor:"advanced",children:"Advanced mode"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Enable advanced features including Monte Carlo simulations and scenario analysis"})]})]}),e.jsxs("div",{className:"flex items-start space-x-2",children:[e.jsx(s,{id:"export",className:"mt-1"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(a,{htmlFor:"export",children:"Export data"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Include raw data in export files for external analysis"})]})]})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-2">\r
      <Checkbox id="terms" />\r
      <Label htmlFor="terms">Accept terms and conditions</Label>\r
    </div>
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-2">\r
      <Checkbox id="newsletter" defaultChecked />\r
      <Label htmlFor="newsletter">Subscribe to newsletter</Label>\r
    </div>
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">\r
      <div className="flex items-center space-x-2">\r
        <Checkbox id="disabled-unchecked" disabled />\r
        <Label htmlFor="disabled-unchecked">Disabled unchecked</Label>\r
      </div>\r
      <div className="flex items-center space-x-2">\r
        <Checkbox id="disabled-checked" disabled defaultChecked />\r
        <Label htmlFor="disabled-checked">Disabled checked</Label>\r
      </div>\r
    </div>
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-3">\r
      <div className="flex items-center space-x-2">\r
        <Checkbox id="option1" />\r
        <Label htmlFor="option1">Include revenue projections</Label>\r
      </div>\r
      <div className="flex items-center space-x-2">\r
        <Checkbox id="option2" />\r
        <Label htmlFor="option2">Include expense breakdown</Label>\r
      </div>\r
      <div className="flex items-center space-x-2">\r
        <Checkbox id="option3" />\r
        <Label htmlFor="option3">Include cash flow analysis</Label>\r
      </div>\r
      <div className="flex items-center space-x-2">\r
        <Checkbox id="option4" />\r
        <Label htmlFor="option4">Include sensitivity analysis</Label>\r
      </div>\r
    </div>
}`,...c.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">\r
      <div className="flex items-start space-x-2">\r
        <Checkbox id="advanced" className="mt-1" />\r
        <div className="space-y-1">\r
          <Label htmlFor="advanced">Advanced mode</Label>\r
          <p className="text-sm text-muted-foreground">\r
            Enable advanced features including Monte Carlo simulations and\r
            scenario analysis\r
          </p>\r
        </div>\r
      </div>\r
      <div className="flex items-start space-x-2">\r
        <Checkbox id="export" className="mt-1" />\r
        <div className="space-y-1">\r
          <Label htmlFor="export">Export data</Label>\r
          <p className="text-sm text-muted-foreground">\r
            Include raw data in export files for external analysis\r
          </p>\r
        </div>\r
      </div>\r
    </div>
}`,...i.parameters?.docs?.source}}};const b=["Default","Checked","Disabled","MultipleOptions","WithDescription"];export{t as Checked,r as Default,n as Disabled,c as MultipleOptions,i as WithDescription,b as __namedExportsOrder,h as default};
