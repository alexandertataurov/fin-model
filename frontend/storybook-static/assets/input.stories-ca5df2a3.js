import{j as e}from"./jsx-runtime-22eea9ba.js";import{I as r}from"./input-12282d11.js";import{L as s}from"./label-c663e830.js";import{r as h}from"./storybook-vendor-bdd8b375.js";import{f as y,M as x,E as v,i as b}from"./ui-components-36f6f75d.js";import"./cn-bbd425d4.js";import"./index-363cc9d9.js";import"./index-fa2897fa.js";import"./utils-bbd425d4.js";const P={title:"🧩 UI Components/Input",component:r,parameters:{layout:"centered",docs:{description:{component:`
# Input Component

A flexible input component built with accessibility and form integration in mind. Supports error states, helper text, and various input types.

## Key Features

- **Accessibility**: Built-in focus management and ARIA attributes
- **Error States**: Visual feedback for validation errors
- **Helper Text**: Additional context for users
- **Icon Integration**: Works well with icon components
- **Type Safety**: Full TypeScript support

## Usage in FinVision

- **Login/Register Forms**: Email and password inputs
- **Parameter Forms**: Numeric inputs for financial parameters
- **Search**: Search functionality across the platform
- **File Upload**: Filename and metadata inputs
        `}}},argTypes:{type:{control:"select",options:["text","email","password","number","search","tel","url"],description:"HTML input type"},placeholder:{control:"text",description:"Placeholder text"},disabled:{control:"boolean",description:"Disable the input"},error:{control:"boolean",description:"Show error state"},helperText:{control:"text",description:"Helper text below input"}},tags:["autodocs"]},a={args:{placeholder:"Enter text..."}},t={render:()=>e.jsxs("div",{className:"w-80 space-y-2",children:[e.jsx(s,{htmlFor:"email",children:"Email Address"}),e.jsx(r,{id:"email",type:"email",placeholder:"Enter your email"})]})},l={render:()=>e.jsxs("div",{className:"w-80 space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{htmlFor:"error-input",children:"Email Address"}),e.jsx(r,{id:"error-input",type:"email",placeholder:"Enter your email",error:!0,helperText:"Please enter a valid email address"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{htmlFor:"helper-input",children:"Username"}),e.jsx(r,{id:"helper-input",placeholder:"Enter username",helperText:"Must be 3-20 characters long"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{htmlFor:"disabled-input",children:"Disabled Field"}),e.jsx(r,{id:"disabled-input",disabled:!0,placeholder:"This field is disabled",helperText:"This field cannot be edited"})]})]}),parameters:{docs:{description:{story:"Input with error state and validation message."}}}},i={render:()=>e.jsxs("div",{className:"w-80 space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{children:"Text Input"}),e.jsx(r,{type:"text",placeholder:"Enter text"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{children:"Email Input"}),e.jsx(r,{type:"email",placeholder:"Enter email"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{children:"Password Input"}),e.jsx(r,{type:"password",placeholder:"Enter password"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{children:"Number Input"}),e.jsx(r,{type:"number",placeholder:"Enter number"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{children:"Search Input"}),e.jsx(r,{type:"search",placeholder:"Search..."})]})]})},o={render:()=>e.jsxs("div",{className:"w-80 space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{children:"Search"}),e.jsxs("div",{className:"relative",children:[e.jsx(y,{className:"absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"}),e.jsx(r,{type:"search",placeholder:"Search financial data...",className:"pl-10"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{children:"Email"}),e.jsxs("div",{className:"relative",children:[e.jsx(x,{className:"absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"}),e.jsx(r,{type:"email",placeholder:"Enter your email",className:"pl-10"})]})]})]}),parameters:{docs:{description:{story:"Inputs with icon integration for better UX."}}}},d={render:function(){const[m,u]=h.useState(!1);return e.jsxs("div",{className:"w-80 space-y-2",children:[e.jsx(s,{children:"Password"}),e.jsxs("div",{className:"relative",children:[e.jsx(r,{type:m?"text":"password",placeholder:"Enter your password",className:"pr-10"}),e.jsx("button",{type:"button",onClick:()=>u(!m),className:"absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground",children:m?e.jsx(v,{className:"h-4 w-4"}):e.jsx(b,{className:"h-4 w-4"})})]})]})},parameters:{docs:{description:{story:"Password input with visibility toggle functionality."}}}},n={render:()=>e.jsxs("div",{className:"w-80 space-y-4 p-6 border rounded-lg",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Login Form"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{htmlFor:"login-email",children:"Email"}),e.jsx(r,{id:"login-email",type:"email",placeholder:"Enter your email"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{htmlFor:"login-password",children:"Password"}),e.jsx(r,{id:"login-password",type:"password",placeholder:"Enter your password"})]})]})]}),parameters:{docs:{description:{story:"Example usage from the FinVision login form."}}}},c={render:()=>e.jsxs("div",{className:"w-80 space-y-4 p-6 border rounded-lg",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Financial Parameters"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{htmlFor:"revenue",children:"Revenue Growth Rate"}),e.jsx(r,{id:"revenue",type:"number",placeholder:"0.00",step:"0.01",min:"0",max:"1"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Enter as decimal (e.g., 0.15 for 15%)"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{htmlFor:"discount",children:"Discount Rate"}),e.jsx(r,{id:"discount",type:"number",placeholder:"0.00",step:"0.001",min:"0",max:"1"})]})]})]}),parameters:{docs:{description:{story:"Example usage for financial parameter inputs in the modeling interface."}}}},p={render:()=>e.jsxs("div",{className:"w-80 space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{children:"Default Border"}),e.jsx(r,{placeholder:"Default input styling"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{children:"Focused State"}),e.jsx(r,{placeholder:"Focus to see ring effect",autoFocus:!0})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{children:"Error State"}),e.jsx(r,{placeholder:"Error state with red border","aria-invalid":"true"}),e.jsx("p",{className:"text-sm text-destructive",children:"This field has an error"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(s,{children:"Disabled State"}),e.jsx(r,{placeholder:"Disabled input",disabled:!0})]})]}),parameters:{docs:{description:{story:"Demonstration of improved border styling with consistent focus states and error indicators."}}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Enter text...'
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-2">\r
      <Label htmlFor="email">Email Address</Label>\r
      <Input id="email" type="email" placeholder="Enter your email" />\r
    </div>
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-4">\r
      <div className="space-y-2">\r
        <Label htmlFor="error-input">Email Address</Label>\r
        <Input id="error-input" type="email" placeholder="Enter your email" error helperText="Please enter a valid email address" />\r
      </div>\r
      \r
      <div className="space-y-2">\r
        <Label htmlFor="helper-input">Username</Label>\r
        <Input id="helper-input" placeholder="Enter username" helperText="Must be 3-20 characters long" />\r
      </div>\r
      \r
      <div className="space-y-2">\r
        <Label htmlFor="disabled-input">Disabled Field</Label>\r
        <Input id="disabled-input" disabled placeholder="This field is disabled" helperText="This field cannot be edited" />\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Input with error state and validation message.'
      }
    }
  }
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-4">\r
      <div className="space-y-2">\r
        <Label>Text Input</Label>\r
        <Input type="text" placeholder="Enter text" />\r
      </div>\r
      <div className="space-y-2">\r
        <Label>Email Input</Label>\r
        <Input type="email" placeholder="Enter email" />\r
      </div>\r
      <div className="space-y-2">\r
        <Label>Password Input</Label>\r
        <Input type="password" placeholder="Enter password" />\r
      </div>\r
      <div className="space-y-2">\r
        <Label>Number Input</Label>\r
        <Input type="number" placeholder="Enter number" />\r
      </div>\r
      <div className="space-y-2">\r
        <Label>Search Input</Label>\r
        <Input type="search" placeholder="Search..." />\r
      </div>\r
    </div>
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-4">\r
      <div className="space-y-2">\r
        <Label>Search</Label>\r
        <div className="relative">\r
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />\r
          <Input type="search" placeholder="Search financial data..." className="pl-10" />\r
        </div>\r
      </div>\r
      <div className="space-y-2">\r
        <Label>Email</Label>\r
        <div className="relative">\r
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />\r
          <Input type="email" placeholder="Enter your email" className="pl-10" />\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Inputs with icon integration for better UX.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: function PasswordWithToggleStory() {
    const [showPassword, setShowPassword] = useState(false);
    return <div className="w-80 space-y-2">\r
        <Label>Password</Label>\r
        <div className="relative">\r
          <Input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="pr-10" />\r
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground">\r
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}\r
          </button>\r
        </div>\r
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Password input with visibility toggle functionality.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-4 p-6 border rounded-lg">\r
      <h3 className="text-lg font-semibold">Login Form</h3>\r
      <div className="space-y-4">\r
        <div className="space-y-2">\r
          <Label htmlFor="login-email">Email</Label>\r
          <Input id="login-email" type="email" placeholder="Enter your email" />\r
        </div>\r
        <div className="space-y-2">\r
          <Label htmlFor="login-password">Password</Label>\r
          <Input id="login-password" type="password" placeholder="Enter your password" />\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Example usage from the FinVision login form.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-4 p-6 border rounded-lg">\r
      <h3 className="text-lg font-semibold">Financial Parameters</h3>\r
      <div className="space-y-4">\r
        <div className="space-y-2">\r
          <Label htmlFor="revenue">Revenue Growth Rate</Label>\r
          <Input id="revenue" type="number" placeholder="0.00" step="0.01" min="0" max="1" />\r
          <p className="text-xs text-muted-foreground">\r
            Enter as decimal (e.g., 0.15 for 15%)\r
          </p>\r
        </div>\r
        <div className="space-y-2">\r
          <Label htmlFor="discount">Discount Rate</Label>\r
          <Input id="discount" type="number" placeholder="0.00" step="0.001" min="0" max="1" />\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Example usage for financial parameter inputs in the modeling interface.'
      }
    }
  }
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-80 space-y-4">\r
      <div className="space-y-2">\r
        <Label>Default Border</Label>\r
        <Input placeholder="Default input styling" />\r
      </div>\r
      <div className="space-y-2">\r
        <Label>Focused State</Label>\r
        <Input placeholder="Focus to see ring effect" autoFocus />\r
      </div>\r
      <div className="space-y-2">\r
        <Label>Error State</Label>\r
        <Input placeholder="Error state with red border" aria-invalid="true" />\r
        <p className="text-sm text-destructive">This field has an error</p>\r
      </div>\r
      <div className="space-y-2">\r
        <Label>Disabled State</Label>\r
        <Input placeholder="Disabled input" disabled />\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of improved border styling with consistent focus states and error indicators.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};const T=["Default","WithLabel","WithError","Types","WithIcons","PasswordWithToggle","LoginFormExample","ParameterInputExample","BorderStyling"];export{p as BorderStyling,a as Default,n as LoginFormExample,c as ParameterInputExample,d as PasswordWithToggle,i as Types,l as WithError,o as WithIcons,t as WithLabel,T as __namedExportsOrder,P as default};
