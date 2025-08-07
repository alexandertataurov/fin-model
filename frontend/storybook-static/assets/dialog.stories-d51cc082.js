import{j as e}from"./jsx-runtime-22eea9ba.js";import{D as t,a as s,b as o,c as l,d as n,e as d,f as c}from"./dialog-3ce4a10d.js";import{B as r}from"./button-df58ecc4.js";import{I as i}from"./input-12282d11.js";import{L as a}from"./label-c663e830.js";import{q as D,k as j,o as f,b as v}from"./ui-components-36f6f75d.js";import"./storybook-vendor-bdd8b375.js";import"./index-16ad2b44.js";import"./index-fa2897fa.js";import"./index-78593782.js";import"./index-53087e4f.js";import"./Combination-f87132d5.js";import"./index-363cc9d9.js";import"./index-436ee938.js";import"./utils-bbd425d4.js";import"./cn-bbd425d4.js";const I={title:"🧩 UI Components/Dialog",component:t,parameters:{layout:"centered",docs:{description:{component:`
# Dialog Component

A modal dialog component built on Radix UI primitives with full accessibility support. Used throughout FinVision for confirmations, forms, and detailed views.

## Dialog Components

- **Dialog**: Root dialog container
- **DialogTrigger**: Button or element that opens the dialog
- **DialogContent**: Main dialog content with backdrop
- **DialogHeader**: Header section with title and description
- **DialogTitle**: Dialog title (required for accessibility)
- **DialogDescription**: Optional description text
- **DialogFooter**: Footer section for action buttons

## Key Features

- **Accessible**: Full keyboard navigation and screen reader support
- **Focus Management**: Automatic focus trapping and restoration
- **Backdrop**: Click outside to close (optional)
- **Responsive**: Adapts to different screen sizes
- **Customizable**: Flexible styling and layout options

## Usage in FinVision

- **Confirmations**: Delete confirmations, data loss warnings
- **Forms**: Parameter editing, user settings
- **Details**: Expanded views of charts or data
- **Workflows**: Multi-step processes like file upload
        `}}},tags:["autodocs"]},m={render:()=>e.jsxs(t,{children:[e.jsx(s,{asChild:!0,children:e.jsx(r,{children:"Open Dialog"})}),e.jsxs(o,{children:[e.jsxs(l,{children:[e.jsx(n,{children:"Dialog Title"}),e.jsx(d,{children:"This is a description of what this dialog does. It provides context for the user."})]}),e.jsx("div",{className:"py-4",children:e.jsx("p",{children:"Dialog content goes here."})}),e.jsxs(c,{children:[e.jsx(r,{variant:"outline",children:"Cancel"}),e.jsx(r,{children:"Confirm"})]})]})]})},p={render:()=>e.jsxs(t,{children:[e.jsx(s,{asChild:!0,children:e.jsxs(r,{variant:"destructive",children:[e.jsx(D,{className:"mr-2 h-4 w-4"}),"Delete Report"]})}),e.jsxs(o,{children:[e.jsxs(l,{children:[e.jsxs(n,{className:"flex items-center space-x-2",children:[e.jsx(j,{className:"h-5 w-5 text-destructive"}),e.jsx("span",{children:"Confirm Deletion"})]}),e.jsx(d,{children:'Are you sure you want to delete "Q4 Financial Report"? This action cannot be undone.'})]}),e.jsx("div",{className:"py-4",children:e.jsxs("div",{className:"bg-muted p-4 rounded-lg",children:[e.jsx("p",{className:"text-sm font-medium",children:"Report Details:"}),e.jsxs("ul",{className:"text-sm text-muted-foreground mt-2 space-y-1",children:[e.jsx("li",{children:"• Created: December 15, 2023"}),e.jsx("li",{children:"• Last modified: January 10, 2024"}),e.jsx("li",{children:"• File size: 2.4 MB"})]})]})}),e.jsxs(c,{children:[e.jsx(r,{variant:"outline",children:"Cancel"}),e.jsx(r,{variant:"destructive",children:"Delete Report"})]})]})]}),parameters:{docs:{description:{story:"Confirmation dialog for destructive actions with warning styling."}}}},u={render:()=>e.jsxs(t,{children:[e.jsx(s,{asChild:!0,children:e.jsxs(r,{children:[e.jsx(f,{className:"mr-2 h-4 w-4"}),"Create Parameter"]})}),e.jsxs(o,{className:"sm:max-w-md",children:[e.jsxs(l,{children:[e.jsx(n,{children:"Create New Parameter"}),e.jsx(d,{children:"Add a new financial parameter to your model."})]}),e.jsxs("div",{className:"space-y-4 py-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"param-name",children:"Parameter Name"}),e.jsx(i,{id:"param-name",placeholder:"e.g., Revenue Growth Rate"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"param-description",children:"Description"}),e.jsx(i,{id:"param-description",placeholder:"Brief description of the parameter"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"param-min",children:"Min Value"}),e.jsx(i,{id:"param-min",type:"number",placeholder:"0"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"param-max",children:"Max Value"}),e.jsx(i,{id:"param-max",type:"number",placeholder:"1"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"param-default",children:"Default Value"}),e.jsx(i,{id:"param-default",type:"number",placeholder:"0.15",step:"0.01"})]})]}),e.jsxs(c,{children:[e.jsx(r,{variant:"outline",children:"Cancel"}),e.jsx(r,{children:"Create Parameter"})]})]})]}),parameters:{docs:{description:{story:"Form dialog for creating new financial parameters."}}}},g={render:()=>e.jsxs(t,{children:[e.jsx(s,{asChild:!0,children:e.jsxs(r,{variant:"outline",children:[e.jsx(v,{className:"mr-2 h-4 w-4"}),"Settings"]})}),e.jsxs(o,{className:"sm:max-w-lg",children:[e.jsxs(l,{children:[e.jsx(n,{children:"User Settings"}),e.jsx(d,{children:"Manage your account settings and preferences."})]}),e.jsxs("div",{className:"space-y-6 py-4",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"text-sm font-medium",children:"Profile Information"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"display-name",children:"Display Name"}),e.jsx(i,{id:"display-name",defaultValue:"John Doe"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"email",children:"Email"}),e.jsx(i,{id:"email",type:"email",defaultValue:"john.doe@company.com"})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"text-sm font-medium",children:"Preferences"}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx(a,{children:"Email Notifications"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Receive email notifications for reports"})]}),e.jsx("input",{type:"checkbox",defaultChecked:!0,className:"h-4 w-4"})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx(a,{children:"Dark Mode"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Use dark theme"})]}),e.jsx("input",{type:"checkbox",className:"h-4 w-4"})]})]})]}),e.jsxs(c,{children:[e.jsx(r,{variant:"outline",children:"Cancel"}),e.jsx(r,{children:"Save Changes"})]})]})]}),parameters:{docs:{description:{story:"Settings dialog with multiple sections and form controls."}}}},h={render:()=>e.jsxs(t,{children:[e.jsx(s,{asChild:!0,children:e.jsx(r,{variant:"outline",children:"View Chart Details"})}),e.jsxs(o,{className:"sm:max-w-4xl",children:[e.jsxs(l,{children:[e.jsx(n,{children:"Revenue Analysis Chart"}),e.jsx(d,{children:"Detailed view of revenue trends and projections."})]}),e.jsxs("div",{className:"py-4",children:[e.jsx("div",{className:"bg-muted rounded-lg p-6 min-h-80 flex items-center justify-center",children:e.jsx("p",{className:"text-muted-foreground",children:"Chart visualization would appear here"})}),e.jsxs("div",{className:"mt-4 grid grid-cols-3 gap-4",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"text-2xl font-bold",children:"$1.2M"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Current Quarter"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"text-2xl font-bold text-green-600",children:"+15%"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Growth Rate"})]}),e.jsxs("div",{className:"text-center",children:[e.jsx("p",{className:"text-2xl font-bold",children:"$1.4M"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Projected"})]})]})]}),e.jsxs(c,{children:[e.jsx(r,{variant:"outline",children:"Export Data"}),e.jsx(r,{children:"Close"})]})]})]}),parameters:{docs:{description:{story:"Large dialog for detailed chart views and data visualization."}}}},x={render:()=>e.jsxs(t,{children:[e.jsx(s,{asChild:!0,children:e.jsx(r,{variant:"outline",children:"Simple Confirm"})}),e.jsxs(o,{className:"sm:max-w-sm",children:[e.jsxs(l,{children:[e.jsx(n,{children:"Confirm Action"}),e.jsx(d,{children:"Are you sure you want to proceed?"})]}),e.jsxs(c,{children:[e.jsx(r,{variant:"outline",children:"Cancel"}),e.jsx(r,{children:"Confirm"})]})]})]}),parameters:{docs:{description:{story:"Simple confirmation dialog with minimal content."}}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>\r
      <DialogTrigger asChild>\r
        <Button>Open Dialog</Button>\r
      </DialogTrigger>\r
      <DialogContent>\r
        <DialogHeader>\r
          <DialogTitle>Dialog Title</DialogTitle>\r
          <DialogDescription>\r
            This is a description of what this dialog does. It provides context\r
            for the user.\r
          </DialogDescription>\r
        </DialogHeader>\r
        <div className="py-4">\r
          <p>Dialog content goes here.</p>\r
        </div>\r
        <DialogFooter>\r
          <Button variant="outline">Cancel</Button>\r
          <Button>Confirm</Button>\r
        </DialogFooter>\r
      </DialogContent>\r
    </Dialog>
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>\r
      <DialogTrigger asChild>\r
        <Button variant="destructive">\r
          <Trash2 className="mr-2 h-4 w-4" />\r
          Delete Report\r
        </Button>\r
      </DialogTrigger>\r
      <DialogContent>\r
        <DialogHeader>\r
          <DialogTitle className="flex items-center space-x-2">\r
            <AlertTriangle className="h-5 w-5 text-destructive" />\r
            <span>Confirm Deletion</span>\r
          </DialogTitle>\r
          <DialogDescription>\r
            Are you sure you want to delete "Q4 Financial Report"? This action\r
            cannot be undone.\r
          </DialogDescription>\r
        </DialogHeader>\r
        <div className="py-4">\r
          <div className="bg-muted p-4 rounded-lg">\r
            <p className="text-sm font-medium">Report Details:</p>\r
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">\r
              <li>• Created: December 15, 2023</li>\r
              <li>• Last modified: January 10, 2024</li>\r
              <li>• File size: 2.4 MB</li>\r
            </ul>\r
          </div>\r
        </div>\r
        <DialogFooter>\r
          <Button variant="outline">Cancel</Button>\r
          <Button variant="destructive">Delete Report</Button>\r
        </DialogFooter>\r
      </DialogContent>\r
    </Dialog>,
  parameters: {
    docs: {
      description: {
        story: 'Confirmation dialog for destructive actions with warning styling.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>\r
      <DialogTrigger asChild>\r
        <Button>\r
          <Plus className="mr-2 h-4 w-4" />\r
          Create Parameter\r
        </Button>\r
      </DialogTrigger>\r
      <DialogContent className="sm:max-w-md">\r
        <DialogHeader>\r
          <DialogTitle>Create New Parameter</DialogTitle>\r
          <DialogDescription>\r
            Add a new financial parameter to your model.\r
          </DialogDescription>\r
        </DialogHeader>\r
        <div className="space-y-4 py-4">\r
          <div className="space-y-2">\r
            <Label htmlFor="param-name">Parameter Name</Label>\r
            <Input id="param-name" placeholder="e.g., Revenue Growth Rate" />\r
          </div>\r
          <div className="space-y-2">\r
            <Label htmlFor="param-description">Description</Label>\r
            <Input id="param-description" placeholder="Brief description of the parameter" />\r
          </div>\r
          <div className="grid grid-cols-2 gap-4">\r
            <div className="space-y-2">\r
              <Label htmlFor="param-min">Min Value</Label>\r
              <Input id="param-min" type="number" placeholder="0" />\r
            </div>\r
            <div className="space-y-2">\r
              <Label htmlFor="param-max">Max Value</Label>\r
              <Input id="param-max" type="number" placeholder="1" />\r
            </div>\r
          </div>\r
          <div className="space-y-2">\r
            <Label htmlFor="param-default">Default Value</Label>\r
            <Input id="param-default" type="number" placeholder="0.15" step="0.01" />\r
          </div>\r
        </div>\r
        <DialogFooter>\r
          <Button variant="outline">Cancel</Button>\r
          <Button>Create Parameter</Button>\r
        </DialogFooter>\r
      </DialogContent>\r
    </Dialog>,
  parameters: {
    docs: {
      description: {
        story: 'Form dialog for creating new financial parameters.'
      }
    }
  }
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>\r
      <DialogTrigger asChild>\r
        <Button variant="outline">\r
          <Settings className="mr-2 h-4 w-4" />\r
          Settings\r
        </Button>\r
      </DialogTrigger>\r
      <DialogContent className="sm:max-w-lg">\r
        <DialogHeader>\r
          <DialogTitle>User Settings</DialogTitle>\r
          <DialogDescription>\r
            Manage your account settings and preferences.\r
          </DialogDescription>\r
        </DialogHeader>\r
        <div className="space-y-6 py-4">\r
          <div className="space-y-4">\r
            <h4 className="text-sm font-medium">Profile Information</h4>\r
            <div className="space-y-2">\r
              <Label htmlFor="display-name">Display Name</Label>\r
              <Input id="display-name" defaultValue="John Doe" />\r
            </div>\r
            <div className="space-y-2">\r
              <Label htmlFor="email">Email</Label>\r
              <Input id="email" type="email" defaultValue="john.doe@company.com" />\r
            </div>\r
          </div>\r
\r
          <div className="space-y-4">\r
            <h4 className="text-sm font-medium">Preferences</h4>\r
            <div className="flex items-center justify-between">\r
              <div>\r
                <Label>Email Notifications</Label>\r
                <p className="text-sm text-muted-foreground">\r
                  Receive email notifications for reports\r
                </p>\r
              </div>\r
              <input type="checkbox" defaultChecked className="h-4 w-4" />\r
            </div>\r
            <div className="flex items-center justify-between">\r
              <div>\r
                <Label>Dark Mode</Label>\r
                <p className="text-sm text-muted-foreground">Use dark theme</p>\r
              </div>\r
              <input type="checkbox" className="h-4 w-4" />\r
            </div>\r
          </div>\r
        </div>\r
        <DialogFooter>\r
          <Button variant="outline">Cancel</Button>\r
          <Button>Save Changes</Button>\r
        </DialogFooter>\r
      </DialogContent>\r
    </Dialog>,
  parameters: {
    docs: {
      description: {
        story: 'Settings dialog with multiple sections and form controls.'
      }
    }
  }
}`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>\r
      <DialogTrigger asChild>\r
        <Button variant="outline">View Chart Details</Button>\r
      </DialogTrigger>\r
      <DialogContent className="sm:max-w-4xl">\r
        <DialogHeader>\r
          <DialogTitle>Revenue Analysis Chart</DialogTitle>\r
          <DialogDescription>\r
            Detailed view of revenue trends and projections.\r
          </DialogDescription>\r
        </DialogHeader>\r
        <div className="py-4">\r
          <div className="bg-muted rounded-lg p-6 min-h-80 flex items-center justify-center">\r
            <p className="text-muted-foreground">\r
              Chart visualization would appear here\r
            </p>\r
          </div>\r
          <div className="mt-4 grid grid-cols-3 gap-4">\r
            <div className="text-center">\r
              <p className="text-2xl font-bold">$1.2M</p>\r
              <p className="text-sm text-muted-foreground">Current Quarter</p>\r
            </div>\r
            <div className="text-center">\r
              <p className="text-2xl font-bold text-green-600">+15%</p>\r
              <p className="text-sm text-muted-foreground">Growth Rate</p>\r
            </div>\r
            <div className="text-center">\r
              <p className="text-2xl font-bold">$1.4M</p>\r
              <p className="text-sm text-muted-foreground">Projected</p>\r
            </div>\r
          </div>\r
        </div>\r
        <DialogFooter>\r
          <Button variant="outline">Export Data</Button>\r
          <Button>Close</Button>\r
        </DialogFooter>\r
      </DialogContent>\r
    </Dialog>,
  parameters: {
    docs: {
      description: {
        story: 'Large dialog for detailed chart views and data visualization.'
      }
    }
  }
}`,...h.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog>\r
      <DialogTrigger asChild>\r
        <Button variant="outline">Simple Confirm</Button>\r
      </DialogTrigger>\r
      <DialogContent className="sm:max-w-sm">\r
        <DialogHeader>\r
          <DialogTitle>Confirm Action</DialogTitle>\r
          <DialogDescription>\r
            Are you sure you want to proceed?\r
          </DialogDescription>\r
        </DialogHeader>\r
        <DialogFooter>\r
          <Button variant="outline">Cancel</Button>\r
          <Button>Confirm</Button>\r
        </DialogFooter>\r
      </DialogContent>\r
    </Dialog>,
  parameters: {
    docs: {
      description: {
        story: 'Simple confirmation dialog with minimal content.'
      }
    }
  }
}`,...x.parameters?.docs?.source}}};const V=["Default","ConfirmationDialog","FormDialog","SettingsDialog","LargeContentDialog","SimpleConfirm"];export{p as ConfirmationDialog,m as Default,u as FormDialog,h as LargeContentDialog,g as SettingsDialog,x as SimpleConfirm,V as __namedExportsOrder,I as default};
