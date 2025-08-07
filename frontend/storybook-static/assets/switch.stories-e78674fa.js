import{j as e}from"./jsx-runtime-4b09fb65.js";import{S as s}from"./switch-7631f551.js";import{L as a}from"./label-c2e17347.js";import"./index-a1f2f578.js";import"./_commonjsHelpers-367561ec.js";import"./index-5f79304f.js";import"./index-ab6e0fe6.js";import"./index-64446581.js";import"./index-03b0901d.js";import"./index-adf576dc.js";import"./index-66371234.js";import"./cn-12644f8e.js";import"./bundle-mjs-ade4b237.js";import"./utils-12644f8e.js";const w={title:"🧩 UI Components/Switch",component:s,parameters:{layout:"centered",docs:{description:{component:`
# Switch Component

A toggle switch component built with Radix UI primitives for consistent styling and accessibility across the FinVision platform.

## Key Features

- **Accessibility**: Built-in focus management and ARIA attributes
- **Controlled/Uncontrolled**: Supports both controlled and uncontrolled usage
- **Label Integration**: Works seamlessly with Label component
- **Disabled States**: Visual feedback for disabled state
- **Smooth Animations**: Smooth transitions between states

## Usage in FinVision

- **Feature Toggles**: Enable/disable advanced features
- **User Preferences**: Toggle user settings and notifications
- **Model Parameters**: Quick on/off parameters
- **Display Options**: Toggle chart and table display options
        `}}},argTypes:{checked:{control:"boolean",description:"Checked state"},disabled:{control:"boolean",description:"Disable the switch"},id:{control:"text",description:"Unique identifier"}},tags:["autodocs"]},t={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"airplane-mode"}),e.jsx(a,{htmlFor:"airplane-mode",children:"Airplane mode"})]})},i={render:()=>e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"notifications",defaultChecked:!0}),e.jsx(a,{htmlFor:"notifications",children:"Notifications"})]})},r={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"disabled-off",disabled:!0}),e.jsx(a,{htmlFor:"disabled-off",children:"Disabled off"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(s,{id:"disabled-on",disabled:!0,defaultChecked:!0}),e.jsx(a,{htmlFor:"disabled-on",children:"Disabled on"})]})]})},n={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(a,{htmlFor:"auto-save",children:"Auto-save"}),e.jsx(s,{id:"auto-save",defaultChecked:!0})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(a,{htmlFor:"dark-mode",children:"Dark mode"}),e.jsx(s,{id:"dark-mode"})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(a,{htmlFor:"notifications",children:"Email notifications"}),e.jsx(s,{id:"notifications",defaultChecked:!0})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx(a,{htmlFor:"analytics",children:"Analytics tracking"}),e.jsx(s,{id:"analytics"})]})]})},d={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(a,{htmlFor:"advanced-mode",children:"Advanced mode"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Enable advanced financial modeling features"})]}),e.jsx(s,{id:"advanced-mode",className:"mt-1"})]}),e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx(a,{htmlFor:"real-time",children:"Real-time updates"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Update model calculations in real-time"})]}),e.jsx(s,{id:"real-time",className:"mt-1",defaultChecked:!0})]})]})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-2">\r
      <Switch id="airplane-mode" />\r
      <Label htmlFor="airplane-mode">Airplane mode</Label>\r
    </div>
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center space-x-2">\r
      <Switch id="notifications" defaultChecked />\r
      <Label htmlFor="notifications">Notifications</Label>\r
    </div>
}`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">\r
      <div className="flex items-center space-x-2">\r
        <Switch id="disabled-off" disabled />\r
        <Label htmlFor="disabled-off">Disabled off</Label>\r
      </div>\r
      <div className="flex items-center space-x-2">\r
        <Switch id="disabled-on" disabled defaultChecked />\r
        <Label htmlFor="disabled-on">Disabled on</Label>\r
      </div>\r
    </div>
}`,...r.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">\r
      <div className="flex items-center justify-between">\r
        <Label htmlFor="auto-save">Auto-save</Label>\r
        <Switch id="auto-save" defaultChecked />\r
      </div>\r
      <div className="flex items-center justify-between">\r
        <Label htmlFor="dark-mode">Dark mode</Label>\r
        <Switch id="dark-mode" />\r
      </div>\r
      <div className="flex items-center justify-between">\r
        <Label htmlFor="notifications">Email notifications</Label>\r
        <Switch id="notifications" defaultChecked />\r
      </div>\r
      <div className="flex items-center justify-between">\r
        <Label htmlFor="analytics">Analytics tracking</Label>\r
        <Switch id="analytics" />\r
      </div>\r
    </div>
}`,...n.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">\r
      <div className="flex items-start justify-between">\r
        <div className="space-y-1">\r
          <Label htmlFor="advanced-mode">Advanced mode</Label>\r
          <p className="text-sm text-muted-foreground">\r
            Enable advanced financial modeling features\r
          </p>\r
        </div>\r
        <Switch id="advanced-mode" className="mt-1" />\r
      </div>\r
      <div className="flex items-start justify-between">\r
        <div className="space-y-1">\r
          <Label htmlFor="real-time">Real-time updates</Label>\r
          <p className="text-sm text-muted-foreground">\r
            Update model calculations in real-time\r
          </p>\r
        </div>\r
        <Switch id="real-time" className="mt-1" defaultChecked />\r
      </div>\r
    </div>
}`,...d.parameters?.docs?.source}}};const g=["Default","Checked","Disabled","MultipleSwitches","WithDescription"];export{i as Checked,t as Default,r as Disabled,n as MultipleSwitches,d as WithDescription,g as __namedExportsOrder,w as default};
