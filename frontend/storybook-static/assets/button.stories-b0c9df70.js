import{j as e}from"./jsx-runtime-4b09fb65.js";import{B as s}from"./button-32c66a90.js";import{P as l}from"./plus-7b0a9808.js";import{D as c}from"./download-aa40163d.js";import{T as d}from"./trash-2-3f88d4eb.js";import{S as m}from"./square-pen-647a2b07.js";import"./index-a1f2f578.js";import"./_commonjsHelpers-367561ec.js";import"./index-ab6e0fe6.js";import"./index-5825bf51.js";import"./bundle-mjs-ade4b237.js";import"./cn-12644f8e.js";import"./createLucideIcon-659e5064.js";const E={title:"🧩 UI Components/Button",component:s,parameters:{layout:"centered",docs:{description:{component:`
# Button Component

The Button component is built on top of Radix UI's Slot primitive and uses Class Variance Authority (CVA) for type-safe variant management. It provides consistent styling and behavior across the FinVision platform.

## Key Features

- **Polymorphic**: Can render as any element using \`asChild\` prop
- **Type-safe variants**: Compile-time validation of variant combinations
- **Accessibility**: Built-in focus management and ARIA attributes
- **Icon support**: Automatic icon sizing and spacing
- **Loading states**: Built-in loading state support

## Usage in FinVision

- **Login Component**: Primary CTA for authentication
- **Reports Component**: Template creation, report generation, export actions
- **Dashboard**: Quick actions and navigation
        `}}},argTypes:{variant:{control:"select",options:["default","destructive","outline","secondary","ghost","link","success","warning","info"],description:"Visual style variant"},size:{control:"select",options:["default","sm","lg","icon"],description:"Size variant"},asChild:{control:"boolean",description:"Render as child element (polymorphic)"},disabled:{control:"boolean",description:"Disable button interaction"}},tags:["autodocs"]},r={args:{children:"Button"}},t={render:()=>e.jsxs("div",{className:"flex gap-4 flex-wrap",children:[e.jsx(s,{variant:"default",children:"Default"}),e.jsx(s,{variant:"secondary",children:"Secondary"}),e.jsx(s,{variant:"outline",children:"Outline"}),e.jsx(s,{variant:"ghost",children:"Ghost"}),e.jsx(s,{variant:"link",children:"Link"}),e.jsx(s,{variant:"destructive",children:"Destructive"}),e.jsx(s,{variant:"success",children:"Success"}),e.jsx(s,{variant:"warning",children:"Warning"}),e.jsx(s,{variant:"info",children:"Info"})]}),parameters:{docs:{description:{story:"All available button variants with their visual styles."}}}},a={render:()=>e.jsxs("div",{className:"flex gap-4 items-center",children:[e.jsx(s,{size:"sm",children:"Small"}),e.jsx(s,{size:"default",children:"Default"}),e.jsx(s,{size:"lg",children:"Large"}),e.jsx(s,{size:"icon",children:e.jsx(l,{className:"h-4 w-4"})})]})},n={render:()=>e.jsxs("div",{className:"flex gap-4 flex-wrap",children:[e.jsxs(s,{children:[e.jsx(l,{className:"mr-2 h-4 w-4"}),"Create"]}),e.jsxs(s,{variant:"outline",children:[e.jsx(c,{className:"mr-2 h-4 w-4"}),"Download"]}),e.jsxs(s,{variant:"destructive",children:[e.jsx(d,{className:"mr-2 h-4 w-4"}),"Delete"]}),e.jsxs(s,{variant:"secondary",children:[e.jsx(m,{className:"mr-2 h-4 w-4"}),"Edit"]})]}),parameters:{docs:{description:{story:"Buttons with icons following the FinVision icon guidelines."}}}},o={render:()=>e.jsxs("div",{className:"w-80 space-y-4 p-6 border rounded-lg",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Login Form Example"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Email"}),e.jsx("input",{className:"w-full px-3 py-2 border rounded-md",placeholder:"Enter email"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Password"}),e.jsx("input",{type:"password",className:"w-full px-3 py-2 border rounded-md",placeholder:"Enter password"})]}),e.jsx(s,{className:"w-full",size:"lg",children:"Sign In"})]})]}),parameters:{docs:{description:{story:"Example usage from the Login component showing the primary CTA button."}}}},i={render:()=>e.jsxs("div",{className:"space-y-4 p-6 border rounded-lg",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Report Templates"}),e.jsxs(s,{children:[e.jsx(l,{className:"mr-2 h-4 w-4"}),"Create Template"]})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs(s,{variant:"outline",size:"sm",children:[e.jsx(c,{className:"mr-2 h-4 w-4"}),"Export"]}),e.jsxs(s,{variant:"secondary",size:"sm",children:[e.jsx(m,{className:"mr-2 h-4 w-4"}),"Edit"]}),e.jsxs(s,{variant:"destructive",size:"sm",children:[e.jsx(d,{className:"mr-2 h-4 w-4"}),"Delete"]})]})]}),parameters:{docs:{description:{story:"Example usage from the Reports component showing various button patterns."}}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4 flex-wrap">\r
      <Button variant="default">Default</Button>\r
      <Button variant="secondary">Secondary</Button>\r
      <Button variant="outline">Outline</Button>\r
      <Button variant="ghost">Ghost</Button>\r
      <Button variant="link">Link</Button>\r
      <Button variant="destructive">Destructive</Button>\r
      <Button variant="success">Success</Button>\r
      <Button variant="warning">Warning</Button>\r
      <Button variant="info">Info</Button>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available button variants with their visual styles.'
      }
    }
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4 items-center">\r
      <Button size="sm">Small</Button>\r
      <Button size="default">Default</Button>\r
      <Button size="lg">Large</Button>\r
      <Button size="icon">\r
        <Plus className="h-4 w-4" />\r
      </Button>\r
    </div>
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4 flex-wrap">\r
      <Button>\r
        <Plus className="mr-2 h-4 w-4" />\r
        Create\r
      </Button>\r
      <Button variant="outline">\r
        <Download className="mr-2 h-4 w-4" />\r
        Download\r
      </Button>\r
      <Button variant="destructive">\r
        <Trash2 className="mr-2 h-4 w-4" />\r
        Delete\r
      </Button>\r
      <Button variant="secondary">\r
        <Edit className="mr-2 h-4 w-4" />\r
        Edit\r
      </Button>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Buttons with icons following the FinVision icon guidelines.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-4 p-6 border rounded-lg">\r
      <h3 className="text-lg font-semibold">Login Form Example</h3>\r
      <div className="space-y-4">\r
        <div className="space-y-2">\r
          <label className="text-sm font-medium">Email</label>\r
          <input className="w-full px-3 py-2 border rounded-md" placeholder="Enter email" />\r
        </div>\r
        <div className="space-y-2">\r
          <label className="text-sm font-medium">Password</label>\r
          <input type="password" className="w-full px-3 py-2 border rounded-md" placeholder="Enter password" />\r
        </div>\r
        <Button className="w-full" size="lg">\r
          Sign In\r
        </Button>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Example usage from the Login component showing the primary CTA button.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 p-6 border rounded-lg">\r
      <div className="flex justify-between items-center">\r
        <h3 className="text-lg font-semibold">Report Templates</h3>\r
        <Button>\r
          <Plus className="mr-2 h-4 w-4" />\r
          Create Template\r
        </Button>\r
      </div>\r
      <div className="flex gap-2">\r
        <Button variant="outline" size="sm">\r
          <Download className="mr-2 h-4 w-4" />\r
          Export\r
        </Button>\r
        <Button variant="secondary" size="sm">\r
          <Edit className="mr-2 h-4 w-4" />\r
          Edit\r
        </Button>\r
        <Button variant="destructive" size="sm">\r
          <Trash2 className="mr-2 h-4 w-4" />\r
          Delete\r
        </Button>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Example usage from the Reports component showing various button patterns.'
      }
    }
  }
}`,...i.parameters?.docs?.source}}};const z=["Default","Variants","Sizes","WithIcons","LoginExample","ReportsExample"];export{r as Default,o as LoginExample,i as ReportsExample,a as Sizes,t as Variants,n as WithIcons,z as __namedExportsOrder,E as default};
