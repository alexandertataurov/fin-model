import{j as e}from"./jsx-runtime-4b09fb65.js";import{C as s}from"./checkbox-9a737444.js";import{L as r}from"./label-c2e17347.js";import"./index-a1f2f578.js";import"./_commonjsHelpers-367561ec.js";import"./index-ab6e0fe6.js";import"./index-64446581.js";import"./index-5f79304f.js";import"./index-03b0901d.js";import"./index-961febce.js";import"./index-adf576dc.js";import"./index-66371234.js";import"./utils-12644f8e.js";import"./bundle-mjs-ade4b237.js";import"./check-c9bd5d7c.js";import"./createLucideIcon-659e5064.js";const F={title:"🧩 UI Components/Checkbox",component:s,parameters:{layout:"centered",docs:{description:{component:`
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
        `}}},argTypes:{checked:{control:"boolean",description:"Checked state"},disabled:{control:"boolean",description:"Disable the checkbox"},id:{control:"text",description:"Unique identifier"}},tags:["autodocs"]},a={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"terms"}),e.jsx(r,{htmlFor:"terms",children:"Accept terms and conditions"})]})},t={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"newsletter",defaultChecked:!0}),e.jsx(r,{htmlFor:"newsletter",children:"Subscribe to newsletter"})]})},n={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"disabled-unchecked",disabled:!0}),e.jsx(r,{htmlFor:"disabled-unchecked",children:"Disabled unchecked"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"disabled-checked",disabled:!0,defaultChecked:!0}),e.jsx(r,{htmlFor:"disabled-checked",children:"Disabled checked"})]})]})},i={render:()=>e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"option1"}),e.jsx(r,{htmlFor:"option1",children:"Include revenue projections"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"option2"}),e.jsx(r,{htmlFor:"option2",children:"Include expense breakdown"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"option3"}),e.jsx(r,{htmlFor:"option3",children:"Include cash flow analysis"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"option4"}),e.jsx(r,{htmlFor:"option4",children:"Include sensitivity analysis"})]})]})},c={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-start space-x-2",children:[e.jsx(s,{id:"advanced",className:"mt-1"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(r,{htmlFor:"advanced",children:"Advanced mode"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Enable advanced features including Monte Carlo simulations and scenario analysis"})]})]}),e.jsxs("div",{className:"flex items-start space-x-2",children:[e.jsx(s,{id:"export",className:"mt-1"}),e.jsxs("div",{className:"space-y-1",children:[e.jsx(r,{htmlFor:"export",children:"Export data"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Include raw data in export files for external analysis"})]})]})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-2">\r
      <Checkbox id="terms" />\r
      <Label htmlFor="terms">Accept terms and conditions</Label>\r
    </div>
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};const L=["Default","Checked","Disabled","MultipleOptions","WithDescription"];export{t as Checked,a as Default,n as Disabled,i as MultipleOptions,c as WithDescription,L as __namedExportsOrder,F as default};
