import{j as e}from"./radix-components-d49c0090.js";import{C as r,a as n,b as a,c as t,d as l}from"./card-5ec16762.js";import{B as s}from"./button-9be8cea8.js";import{I as c}from"./input-3f0ff2dc.js";import{B as i}from"./badge-779ce428.js";import{C}from"./checkbox-5ac430ca.js";import{S as h}from"./switch-f620b2da.js";import{S as g,a as b,b as y,c as f,d}from"./select-f7551084.js";import{T as S,a as D,b as x,c as w}from"./tabs-965a9f58.js";import{A as j,b as u}from"./alert-d24afe45.js";import{D as B,a as P,b as H,c as I,d as z,e as k}from"./dialog-7898160f.js";import{P as E,a as O,b as A,T as F,c as V,d as L,e as R,S as v}from"./tooltip-8581df62.js";import{b as U,B as W,a as T,s as G,p as N,f as M,o as Q}from"./ui-components-6f35ab38.js";import"./storybook-vendor-bdd8b375.js";import"./utils-b168998f.js";import"./cn-b168998f.js";const ce={title:"📚 Quick Reference",parameters:{layout:"padded",docs:{description:{component:"Essential patterns, best practices, and quick solutions for common UI challenges in financial applications."}}},tags:["autodocs"]},o={render:()=>e.jsxs("div",{className:"p-8 space-y-8",children:[e.jsxs("div",{className:"text-center space-y-4",children:[e.jsx("h1",{className:"text-4xl font-bold",children:"Component Quick Reference"}),e.jsx("p",{className:"text-xl text-muted-foreground max-w-2xl mx-auto",children:"Essential components and their key properties for rapid development"})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8",children:[e.jsxs(r,{children:[e.jsxs(n,{children:[e.jsxs(a,{className:"flex items-center gap-2",children:[e.jsx(U,{className:"h-5 w-5"}),"Form Elements"]}),e.jsx(t,{children:"Core input and interaction components"})]}),e.jsxs(l,{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"font-semibold",children:"Button Variants"}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(s,{size:"sm",children:"Default"}),e.jsx(s,{variant:"secondary",size:"sm",children:"Secondary"}),e.jsx(s,{variant:"outline",size:"sm",children:"Outline"}),e.jsx(s,{variant:"ghost",size:"sm",children:"Ghost"}),e.jsx(s,{variant:"destructive",size:"sm",children:"Destructive"})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Props: variant, size, disabled, asChild"})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"font-semibold",children:"Input Types"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(c,{placeholder:"Text input"}),e.jsx(c,{type:"email",placeholder:"Email input"}),e.jsx(c,{type:"number",placeholder:"Number input"})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Props: type, placeholder, disabled, error, helperText"})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"font-semibold",children:"Selection Controls"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(C,{id:"checkbox"}),e.jsx("label",{htmlFor:"checkbox",className:"text-sm",children:"Checkbox"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(h,{id:"switch"}),e.jsx("label",{htmlFor:"switch",className:"text-sm",children:"Switch"})]})]})]})]})]}),e.jsxs(r,{children:[e.jsxs(n,{children:[e.jsxs(a,{className:"flex items-center gap-2",children:[e.jsx(W,{className:"h-5 w-5"}),"Feedback & Status"]}),e.jsx(t,{children:"Status indicators and user feedback"})]}),e.jsxs(l,{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"font-semibold",children:"Badge Variants"}),e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(i,{children:"Default"}),e.jsx(i,{variant:"secondary",children:"Secondary"}),e.jsx(i,{variant:"outline",children:"Outline"}),e.jsx(i,{variant:"destructive",children:"Destructive"}),e.jsx(i,{variant:"success",children:"Success"}),e.jsx(i,{variant:"warning",children:"Warning"})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"font-semibold",children:"Alerts"}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(j,{children:e.jsx(u,{children:"Default alert message"})}),e.jsx(j,{className:"border-destructive/50 bg-destructive/10",children:e.jsx(u,{className:"text-destructive",children:"Error alert message"})})]})]})]})]}),e.jsxs(r,{children:[e.jsxs(n,{children:[e.jsxs(a,{className:"flex items-center gap-2",children:[e.jsx(T,{className:"h-5 w-5"}),"Navigation"]}),e.jsx(t,{children:"Navigation and content organization"})]}),e.jsxs(l,{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"font-semibold",children:"Tabs"}),e.jsxs(S,{defaultValue:"tab1",className:"w-full",children:[e.jsxs(D,{className:"grid w-full grid-cols-3",children:[e.jsx(x,{value:"tab1",children:"Tab 1"}),e.jsx(x,{value:"tab2",children:"Tab 2"}),e.jsx(x,{value:"tab3",children:"Tab 3"})]}),e.jsx(w,{value:"tab1",className:"mt-2",children:e.jsx("p",{className:"text-sm",children:"Tab content 1"})})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"font-semibold",children:"Select Dropdown"}),e.jsxs(g,{children:[e.jsx(b,{children:e.jsx(y,{placeholder:"Select option"})}),e.jsxs(f,{children:[e.jsx(d,{value:"option1",children:"Option 1"}),e.jsx(d,{value:"option2",children:"Option 2"}),e.jsx(d,{value:"option3",children:"Option 3"})]})]})]})]})]}),e.jsxs(r,{children:[e.jsxs(n,{children:[e.jsxs(a,{className:"flex items-center gap-2",children:[e.jsx(G,{className:"h-5 w-5"}),"Overlays & Modals"]}),e.jsx(t,{children:"Dialog boxes and contextual overlays"})]}),e.jsxs(l,{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"font-semibold",children:"Dialog"}),e.jsxs(B,{children:[e.jsx(P,{asChild:!0,children:e.jsx(s,{size:"sm",children:"Open Dialog"})}),e.jsx(H,{children:e.jsxs(I,{children:[e.jsx(z,{children:"Dialog Title"}),e.jsx(k,{children:"Dialog description text"})]})})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"font-semibold",children:"Popover"}),e.jsxs(E,{children:[e.jsx(O,{asChild:!0,children:e.jsx(s,{variant:"outline",size:"sm",children:"Open Popover"})}),e.jsx(A,{className:"w-80",children:e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-medium",children:"Popover Content"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Contextual information"})]})})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h4",{className:"font-semibold",children:"Tooltip"}),e.jsx(F,{children:e.jsxs(V,{children:[e.jsx(L,{asChild:!0,children:e.jsx(s,{variant:"outline",size:"sm",children:"Hover me"})}),e.jsx(R,{children:e.jsx("p",{children:"Tooltip content"})})]})})]})]})]})]})]})},m={render:()=>e.jsxs("div",{className:"p-8 space-y-8",children:[e.jsxs("div",{className:"text-center space-y-4",children:[e.jsx("h1",{className:"text-4xl font-bold",children:"Component Properties"}),e.jsx("p",{className:"text-xl text-muted-foreground max-w-2xl mx-auto",children:"Key properties and variants for each component"})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8",children:[e.jsxs(r,{children:[e.jsxs(n,{children:[e.jsx(a,{children:"Button Component"}),e.jsx(t,{children:"Primary interaction component"})]}),e.jsxs(l,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-semibold",children:"Variants"}),e.jsxs("div",{className:"text-sm space-y-1",children:[e.jsxs("p",{children:[e.jsx("code",{children:"default"})," - Primary button style"]}),e.jsxs("p",{children:[e.jsx("code",{children:"secondary"})," - Secondary button style"]}),e.jsxs("p",{children:[e.jsx("code",{children:"outline"})," - Outlined button style"]}),e.jsxs("p",{children:[e.jsx("code",{children:"ghost"})," - Ghost button style"]}),e.jsxs("p",{children:[e.jsx("code",{children:"link"})," - Link button style"]}),e.jsxs("p",{children:[e.jsx("code",{children:"destructive"})," - Destructive action style"]}),e.jsxs("p",{children:[e.jsx("code",{children:"success"})," - Success action style"]}),e.jsxs("p",{children:[e.jsx("code",{children:"warning"})," - Warning action style"]}),e.jsxs("p",{children:[e.jsx("code",{children:"info"})," - Info action style"]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-semibold",children:"Sizes"}),e.jsxs("div",{className:"text-sm space-y-1",children:[e.jsxs("p",{children:[e.jsx("code",{children:"sm"})," - Small button"]}),e.jsxs("p",{children:[e.jsx("code",{children:"default"})," - Default size"]}),e.jsxs("p",{children:[e.jsx("code",{children:"lg"})," - Large button"]}),e.jsxs("p",{children:[e.jsx("code",{children:"icon"})," - Icon-only button"]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-semibold",children:"Common Props"}),e.jsxs("div",{className:"text-sm space-y-1",children:[e.jsxs("p",{children:[e.jsx("code",{children:"disabled"})," - Disable button interaction"]}),e.jsxs("p",{children:[e.jsx("code",{children:"asChild"})," - Render as child element"]}),e.jsxs("p",{children:[e.jsx("code",{children:"onClick"})," - Click handler"]})]})]})]})]}),e.jsxs(r,{children:[e.jsxs(n,{children:[e.jsx(a,{children:"Input Component"}),e.jsx(t,{children:"Text input fields"})]}),e.jsxs(l,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-semibold",children:"Types"}),e.jsxs("div",{className:"text-sm space-y-1",children:[e.jsxs("p",{children:[e.jsx("code",{children:"text"})," - Default text input"]}),e.jsxs("p",{children:[e.jsx("code",{children:"email"})," - Email input"]}),e.jsxs("p",{children:[e.jsx("code",{children:"password"})," - Password input"]}),e.jsxs("p",{children:[e.jsx("code",{children:"number"})," - Number input"]}),e.jsxs("p",{children:[e.jsx("code",{children:"search"})," - Search input"]}),e.jsxs("p",{children:[e.jsx("code",{children:"tel"})," - Telephone input"]}),e.jsxs("p",{children:[e.jsx("code",{children:"url"})," - URL input"]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-semibold",children:"Common Props"}),e.jsxs("div",{className:"text-sm space-y-1",children:[e.jsxs("p",{children:[e.jsx("code",{children:"placeholder"})," - Placeholder text"]}),e.jsxs("p",{children:[e.jsx("code",{children:"disabled"})," - Disable input"]}),e.jsxs("p",{children:[e.jsx("code",{children:"error"})," - Show error state"]}),e.jsxs("p",{children:[e.jsx("code",{children:"helperText"})," - Helper text below input"]}),e.jsxs("p",{children:[e.jsx("code",{children:"value"})," - Controlled value"]}),e.jsxs("p",{children:[e.jsx("code",{children:"onChange"})," - Change handler"]})]})]})]})]}),e.jsxs(r,{children:[e.jsxs(n,{children:[e.jsx(a,{children:"Badge Component"}),e.jsx(t,{children:"Status indicators and labels"})]}),e.jsxs(l,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-semibold",children:"Variants"}),e.jsxs("div",{className:"text-sm space-y-1",children:[e.jsxs("p",{children:[e.jsx("code",{children:"default"})," - Default badge style"]}),e.jsxs("p",{children:[e.jsx("code",{children:"secondary"})," - Secondary badge style"]}),e.jsxs("p",{children:[e.jsx("code",{children:"outline"})," - Outlined badge style"]}),e.jsxs("p",{children:[e.jsx("code",{children:"destructive"})," - Destructive badge style"]}),e.jsxs("p",{children:[e.jsx("code",{children:"success"})," - Success badge style"]}),e.jsxs("p",{children:[e.jsx("code",{children:"warning"})," - Warning badge style"]}),e.jsxs("p",{children:[e.jsx("code",{children:"info"})," - Info badge style"]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-semibold",children:"Common Props"}),e.jsxs("div",{className:"text-sm space-y-1",children:[e.jsxs("p",{children:[e.jsx("code",{children:"children"})," - Badge content"]}),e.jsxs("p",{children:[e.jsx("code",{children:"className"})," - Additional CSS classes"]})]})]})]})]}),e.jsxs(r,{children:[e.jsxs(n,{children:[e.jsx(a,{children:"Card Component"}),e.jsx(t,{children:"Content containers and panels"})]}),e.jsxs(l,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-semibold",children:"Subcomponents"}),e.jsxs("div",{className:"text-sm space-y-1",children:[e.jsxs("p",{children:[e.jsx("code",{children:"CardHeader"})," - Card header section"]}),e.jsxs("p",{children:[e.jsx("code",{children:"CardTitle"})," - Card title"]}),e.jsxs("p",{children:[e.jsx("code",{children:"CardDescription"})," - Card description"]}),e.jsxs("p",{children:[e.jsx("code",{children:"CardContent"})," - Card content area"]}),e.jsxs("p",{children:[e.jsx("code",{children:"CardFooter"})," - Card footer section"]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-semibold",children:"Common Props"}),e.jsxs("div",{className:"text-sm space-y-1",children:[e.jsxs("p",{children:[e.jsx("code",{children:"className"})," - Additional CSS classes"]}),e.jsxs("p",{children:[e.jsx("code",{children:"children"})," - Card content"]})]})]})]})]})]})]})},p={render:()=>e.jsxs("div",{className:"p-8 space-y-8",children:[e.jsxs("div",{className:"text-center space-y-4",children:[e.jsx("h1",{className:"text-4xl font-bold",children:"Common Usage Patterns"}),e.jsx("p",{className:"text-xl text-muted-foreground max-w-2xl mx-auto",children:"Typical component combinations and layouts"})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-8",children:[e.jsxs(r,{children:[e.jsxs(n,{children:[e.jsx(a,{children:"Form Pattern"}),e.jsx(t,{children:"Standard form layout with validation"})]}),e.jsxs(l,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Email"}),e.jsx(c,{type:"email",placeholder:"Enter email"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Password"}),e.jsx(c,{type:"password",placeholder:"Enter password"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(C,{id:"terms"}),e.jsx("label",{htmlFor:"terms",className:"text-sm",children:"Accept terms"})]}),e.jsx(s,{className:"w-full",children:"Submit"})]})]}),e.jsxs(r,{children:[e.jsxs(n,{children:[e.jsx(a,{children:"Dashboard Widget"}),e.jsx(t,{children:"Financial metrics display"})]}),e.jsxs(l,{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium",children:"Revenue"}),e.jsx("p",{className:"text-2xl font-bold",children:"$2.4M"}),e.jsx("p",{className:"text-sm text-green-600",children:"+12.5%"})]}),e.jsx(i,{variant:"success",children:"Active"})]}),e.jsx(v,{}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs(s,{size:"sm",variant:"outline",children:[e.jsx(T,{className:"mr-2 h-4 w-4"}),"View Details"]}),e.jsxs(s,{size:"sm",variant:"outline",children:[e.jsx(N,{className:"mr-2 h-4 w-4"}),"Export"]})]})]})]}),e.jsxs(r,{children:[e.jsxs(n,{children:[e.jsx(a,{children:"Settings Panel"}),e.jsx(t,{children:"Configuration interface"})]}),e.jsxs(l,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-sm font-medium",children:"Email notifications"}),e.jsx(h,{})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"text-sm font-medium",children:"Dark mode"}),e.jsx(h,{})]})]}),e.jsx(v,{}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Language"}),e.jsxs(g,{children:[e.jsx(b,{children:e.jsx(y,{placeholder:"Select language"})}),e.jsxs(f,{children:[e.jsx(d,{value:"en",children:"English"}),e.jsx(d,{value:"es",children:"Spanish"}),e.jsx(d,{value:"fr",children:"French"})]})]})]})]})]}),e.jsxs(r,{children:[e.jsxs(n,{children:[e.jsx(a,{children:"Data Table Header"}),e.jsx(t,{children:"Table controls and actions"})]}),e.jsxs(l,{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(c,{placeholder:"Search...",className:"w-64"}),e.jsx(s,{variant:"outline",size:"sm",children:e.jsx(M,{className:"h-4 w-4"})})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs(s,{size:"sm",children:[e.jsx(Q,{className:"mr-2 h-4 w-4"}),"Add Item"]}),e.jsxs(s,{variant:"outline",size:"sm",children:[e.jsx(N,{className:"mr-2 h-4 w-4"}),"Export"]})]})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(i,{variant:"secondary",children:"25 items"}),e.jsx(i,{variant:"outline",children:"Filtered"})]})]})]})]})]})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-8 space-y-8">\r
      <div className="text-center space-y-4">\r
        <h1 className="text-4xl font-bold">Component Quick Reference</h1>\r
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">\r
          Essential components and their key properties for rapid development\r
        </p>\r
      </div>\r
\r
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">\r
        {/* Form Elements */}\r
        <Card>\r
          <CardHeader>\r
            <CardTitle className="flex items-center gap-2">\r
              <Settings className="h-5 w-5" />\r
              Form Elements\r
            </CardTitle>\r
            <CardDescription>\r
              Core input and interaction components\r
            </CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-6">\r
            <div className="space-y-4">\r
              <h4 className="font-semibold">Button Variants</h4>\r
              <div className="flex flex-wrap gap-2">\r
                <Button size="sm">Default</Button>\r
                <Button variant="secondary" size="sm">\r
                  Secondary\r
                </Button>\r
                <Button variant="outline" size="sm">\r
                  Outline\r
                </Button>\r
                <Button variant="ghost" size="sm">\r
                  Ghost\r
                </Button>\r
                <Button variant="destructive" size="sm">\r
                  Destructive\r
                </Button>\r
              </div>\r
              <p className="text-xs text-muted-foreground">\r
                Props: variant, size, disabled, asChild\r
              </p>\r
            </div>\r
\r
            <div className="space-y-4">\r
              <h4 className="font-semibold">Input Types</h4>\r
              <div className="space-y-2">\r
                <Input placeholder="Text input" />\r
                <Input type="email" placeholder="Email input" />\r
                <Input type="number" placeholder="Number input" />\r
              </div>\r
              <p className="text-xs text-muted-foreground">\r
                Props: type, placeholder, disabled, error, helperText\r
              </p>\r
            </div>\r
\r
            <div className="space-y-4">\r
              <h4 className="font-semibold">Selection Controls</h4>\r
              <div className="flex items-center gap-4">\r
                <div className="flex items-center space-x-2">\r
                  <Checkbox id="checkbox" />\r
                  <label htmlFor="checkbox" className="text-sm">\r
                    Checkbox\r
                  </label>\r
                </div>\r
                <div className="flex items-center space-x-2">\r
                  <Switch id="switch" />\r
                  <label htmlFor="switch" className="text-sm">\r
                    Switch\r
                  </label>\r
                </div>\r
              </div>\r
            </div>\r
          </CardContent>\r
        </Card>\r
\r
        {/* Feedback Components */}\r
        <Card>\r
          <CardHeader>\r
            <CardTitle className="flex items-center gap-2">\r
              <Bell className="h-5 w-5" />\r
              Feedback & Status\r
            </CardTitle>\r
            <CardDescription>\r
              Status indicators and user feedback\r
            </CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-6">\r
            <div className="space-y-4">\r
              <h4 className="font-semibold">Badge Variants</h4>\r
              <div className="flex flex-wrap gap-2">\r
                <Badge>Default</Badge>\r
                <Badge variant="secondary">Secondary</Badge>\r
                <Badge variant="outline">Outline</Badge>\r
                <Badge variant="destructive">Destructive</Badge>\r
                <Badge variant="success">Success</Badge>\r
                <Badge variant="warning">Warning</Badge>\r
              </div>\r
            </div>\r
\r
            <div className="space-y-4">\r
              <h4 className="font-semibold">Alerts</h4>\r
              <div className="space-y-2">\r
                <Alert>\r
                  <AlertDescription>Default alert message</AlertDescription>\r
                </Alert>\r
                <Alert className="border-destructive/50 bg-destructive/10">\r
                  <AlertDescription className="text-destructive">\r
                    Error alert message\r
                  </AlertDescription>\r
                </Alert>\r
              </div>\r
            </div>\r
          </CardContent>\r
        </Card>\r
\r
        {/* Navigation */}\r
        <Card>\r
          <CardHeader>\r
            <CardTitle className="flex items-center gap-2">\r
              <BarChart3 className="h-5 w-5" />\r
              Navigation\r
            </CardTitle>\r
            <CardDescription>\r
              Navigation and content organization\r
            </CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-6">\r
            <div className="space-y-4">\r
              <h4 className="font-semibold">Tabs</h4>\r
              <Tabs defaultValue="tab1" className="w-full">\r
                <TabsList className="grid w-full grid-cols-3">\r
                  <TabsTrigger value="tab1">Tab 1</TabsTrigger>\r
                  <TabsTrigger value="tab2">Tab 2</TabsTrigger>\r
                  <TabsTrigger value="tab3">Tab 3</TabsTrigger>\r
                </TabsList>\r
                <TabsContent value="tab1" className="mt-2">\r
                  <p className="text-sm">Tab content 1</p>\r
                </TabsContent>\r
              </Tabs>\r
            </div>\r
\r
            <div className="space-y-4">\r
              <h4 className="font-semibold">Select Dropdown</h4>\r
              <Select>\r
                <SelectTrigger>\r
                  <SelectValue placeholder="Select option" />\r
                </SelectTrigger>\r
                <SelectContent>\r
                  <SelectItem value="option1">Option 1</SelectItem>\r
                  <SelectItem value="option2">Option 2</SelectItem>\r
                  <SelectItem value="option3">Option 3</SelectItem>\r
                </SelectContent>\r
              </Select>\r
            </div>\r
          </CardContent>\r
        </Card>\r
\r
        {/* Overlays */}\r
        <Card>\r
          <CardHeader>\r
            <CardTitle className="flex items-center gap-2">\r
              <User className="h-5 w-5" />\r
              Overlays & Modals\r
            </CardTitle>\r
            <CardDescription>\r
              Dialog boxes and contextual overlays\r
            </CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-6">\r
            <div className="space-y-4">\r
              <h4 className="font-semibold">Dialog</h4>\r
              <Dialog>\r
                <DialogTrigger asChild>\r
                  <Button size="sm">Open Dialog</Button>\r
                </DialogTrigger>\r
                <DialogContent>\r
                  <DialogHeader>\r
                    <DialogTitle>Dialog Title</DialogTitle>\r
                    <DialogDescription>\r
                      Dialog description text\r
                    </DialogDescription>\r
                  </DialogHeader>\r
                </DialogContent>\r
              </Dialog>\r
            </div>\r
\r
            <div className="space-y-4">\r
              <h4 className="font-semibold">Popover</h4>\r
              <Popover>\r
                <PopoverTrigger asChild>\r
                  <Button variant="outline" size="sm">\r
                    Open Popover\r
                  </Button>\r
                </PopoverTrigger>\r
                <PopoverContent className="w-80">\r
                  <div className="space-y-2">\r
                    <h4 className="font-medium">Popover Content</h4>\r
                    <p className="text-sm text-muted-foreground">\r
                      Contextual information\r
                    </p>\r
                  </div>\r
                </PopoverContent>\r
              </Popover>\r
            </div>\r
\r
            <div className="space-y-4">\r
              <h4 className="font-semibold">Tooltip</h4>\r
              <TooltipProvider>\r
                <Tooltip>\r
                  <TooltipTrigger asChild>\r
                    <Button variant="outline" size="sm">\r
                      Hover me\r
                    </Button>\r
                  </TooltipTrigger>\r
                  <TooltipContent>\r
                    <p>Tooltip content</p>\r
                  </TooltipContent>\r
                </Tooltip>\r
              </TooltipProvider>\r
            </div>\r
          </CardContent>\r
        </Card>\r
      </div>\r
    </div>
}`,...o.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-8 space-y-8">\r
      <div className="text-center space-y-4">\r
        <h1 className="text-4xl font-bold">Component Properties</h1>\r
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">\r
          Key properties and variants for each component\r
        </p>\r
      </div>\r
\r
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">\r
        {/* Button Properties */}\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Button Component</CardTitle>\r
            <CardDescription>Primary interaction component</CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-4">\r
            <div className="space-y-2">\r
              <h4 className="font-semibold">Variants</h4>\r
              <div className="text-sm space-y-1">\r
                <p>\r
                  <code>default</code> - Primary button style\r
                </p>\r
                <p>\r
                  <code>secondary</code> - Secondary button style\r
                </p>\r
                <p>\r
                  <code>outline</code> - Outlined button style\r
                </p>\r
                <p>\r
                  <code>ghost</code> - Ghost button style\r
                </p>\r
                <p>\r
                  <code>link</code> - Link button style\r
                </p>\r
                <p>\r
                  <code>destructive</code> - Destructive action style\r
                </p>\r
                <p>\r
                  <code>success</code> - Success action style\r
                </p>\r
                <p>\r
                  <code>warning</code> - Warning action style\r
                </p>\r
                <p>\r
                  <code>info</code> - Info action style\r
                </p>\r
              </div>\r
            </div>\r
\r
            <div className="space-y-2">\r
              <h4 className="font-semibold">Sizes</h4>\r
              <div className="text-sm space-y-1">\r
                <p>\r
                  <code>sm</code> - Small button\r
                </p>\r
                <p>\r
                  <code>default</code> - Default size\r
                </p>\r
                <p>\r
                  <code>lg</code> - Large button\r
                </p>\r
                <p>\r
                  <code>icon</code> - Icon-only button\r
                </p>\r
              </div>\r
            </div>\r
\r
            <div className="space-y-2">\r
              <h4 className="font-semibold">Common Props</h4>\r
              <div className="text-sm space-y-1">\r
                <p>\r
                  <code>disabled</code> - Disable button interaction\r
                </p>\r
                <p>\r
                  <code>asChild</code> - Render as child element\r
                </p>\r
                <p>\r
                  <code>onClick</code> - Click handler\r
                </p>\r
              </div>\r
            </div>\r
          </CardContent>\r
        </Card>\r
\r
        {/* Input Properties */}\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Input Component</CardTitle>\r
            <CardDescription>Text input fields</CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-4">\r
            <div className="space-y-2">\r
              <h4 className="font-semibold">Types</h4>\r
              <div className="text-sm space-y-1">\r
                <p>\r
                  <code>text</code> - Default text input\r
                </p>\r
                <p>\r
                  <code>email</code> - Email input\r
                </p>\r
                <p>\r
                  <code>password</code> - Password input\r
                </p>\r
                <p>\r
                  <code>number</code> - Number input\r
                </p>\r
                <p>\r
                  <code>search</code> - Search input\r
                </p>\r
                <p>\r
                  <code>tel</code> - Telephone input\r
                </p>\r
                <p>\r
                  <code>url</code> - URL input\r
                </p>\r
              </div>\r
            </div>\r
\r
            <div className="space-y-2">\r
              <h4 className="font-semibold">Common Props</h4>\r
              <div className="text-sm space-y-1">\r
                <p>\r
                  <code>placeholder</code> - Placeholder text\r
                </p>\r
                <p>\r
                  <code>disabled</code> - Disable input\r
                </p>\r
                <p>\r
                  <code>error</code> - Show error state\r
                </p>\r
                <p>\r
                  <code>helperText</code> - Helper text below input\r
                </p>\r
                <p>\r
                  <code>value</code> - Controlled value\r
                </p>\r
                <p>\r
                  <code>onChange</code> - Change handler\r
                </p>\r
              </div>\r
            </div>\r
          </CardContent>\r
        </Card>\r
\r
        {/* Badge Properties */}\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Badge Component</CardTitle>\r
            <CardDescription>Status indicators and labels</CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-4">\r
            <div className="space-y-2">\r
              <h4 className="font-semibold">Variants</h4>\r
              <div className="text-sm space-y-1">\r
                <p>\r
                  <code>default</code> - Default badge style\r
                </p>\r
                <p>\r
                  <code>secondary</code> - Secondary badge style\r
                </p>\r
                <p>\r
                  <code>outline</code> - Outlined badge style\r
                </p>\r
                <p>\r
                  <code>destructive</code> - Destructive badge style\r
                </p>\r
                <p>\r
                  <code>success</code> - Success badge style\r
                </p>\r
                <p>\r
                  <code>warning</code> - Warning badge style\r
                </p>\r
                <p>\r
                  <code>info</code> - Info badge style\r
                </p>\r
              </div>\r
            </div>\r
\r
            <div className="space-y-2">\r
              <h4 className="font-semibold">Common Props</h4>\r
              <div className="text-sm space-y-1">\r
                <p>\r
                  <code>children</code> - Badge content\r
                </p>\r
                <p>\r
                  <code>className</code> - Additional CSS classes\r
                </p>\r
              </div>\r
            </div>\r
          </CardContent>\r
        </Card>\r
\r
        {/* Card Properties */}\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Card Component</CardTitle>\r
            <CardDescription>Content containers and panels</CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-4">\r
            <div className="space-y-2">\r
              <h4 className="font-semibold">Subcomponents</h4>\r
              <div className="text-sm space-y-1">\r
                <p>\r
                  <code>CardHeader</code> - Card header section\r
                </p>\r
                <p>\r
                  <code>CardTitle</code> - Card title\r
                </p>\r
                <p>\r
                  <code>CardDescription</code> - Card description\r
                </p>\r
                <p>\r
                  <code>CardContent</code> - Card content area\r
                </p>\r
                <p>\r
                  <code>CardFooter</code> - Card footer section\r
                </p>\r
              </div>\r
            </div>\r
\r
            <div className="space-y-2">\r
              <h4 className="font-semibold">Common Props</h4>\r
              <div className="text-sm space-y-1">\r
                <p>\r
                  <code>className</code> - Additional CSS classes\r
                </p>\r
                <p>\r
                  <code>children</code> - Card content\r
                </p>\r
              </div>\r
            </div>\r
          </CardContent>\r
        </Card>\r
      </div>\r
    </div>
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-8 space-y-8">\r
      <div className="text-center space-y-4">\r
        <h1 className="text-4xl font-bold">Common Usage Patterns</h1>\r
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">\r
          Typical component combinations and layouts\r
        </p>\r
      </div>\r
\r
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">\r
        {/* Form Pattern */}\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Form Pattern</CardTitle>\r
            <CardDescription>\r
              Standard form layout with validation\r
            </CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-4">\r
            <div className="space-y-2">\r
              <label className="text-sm font-medium">Email</label>\r
              <Input type="email" placeholder="Enter email" />\r
            </div>\r
            <div className="space-y-2">\r
              <label className="text-sm font-medium">Password</label>\r
              <Input type="password" placeholder="Enter password" />\r
            </div>\r
            <div className="flex items-center space-x-2">\r
              <Checkbox id="terms" />\r
              <label htmlFor="terms" className="text-sm">\r
                Accept terms\r
              </label>\r
            </div>\r
            <Button className="w-full">Submit</Button>\r
          </CardContent>\r
        </Card>\r
\r
        {/* Dashboard Widget */}\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Dashboard Widget</CardTitle>\r
            <CardDescription>Financial metrics display</CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-4">\r
            <div className="flex items-center justify-between">\r
              <div>\r
                <p className="text-sm font-medium">Revenue</p>\r
                <p className="text-2xl font-bold">$2.4M</p>\r
                <p className="text-sm text-green-600">+12.5%</p>\r
              </div>\r
              <Badge variant="success">Active</Badge>\r
            </div>\r
            <Separator />\r
            <div className="flex gap-2">\r
              <Button size="sm" variant="outline">\r
                <BarChart3 className="mr-2 h-4 w-4" />\r
                View Details\r
              </Button>\r
              <Button size="sm" variant="outline">\r
                <Download className="mr-2 h-4 w-4" />\r
                Export\r
              </Button>\r
            </div>\r
          </CardContent>\r
        </Card>\r
\r
        {/* Settings Panel */}\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Settings Panel</CardTitle>\r
            <CardDescription>Configuration interface</CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-4">\r
            <div className="space-y-4">\r
              <div className="flex items-center justify-between">\r
                <label className="text-sm font-medium">\r
                  Email notifications\r
                </label>\r
                <Switch />\r
              </div>\r
              <div className="flex items-center justify-between">\r
                <label className="text-sm font-medium">Dark mode</label>\r
                <Switch />\r
              </div>\r
            </div>\r
            <Separator />\r
            <div className="space-y-2">\r
              <label className="text-sm font-medium">Language</label>\r
              <Select>\r
                <SelectTrigger>\r
                  <SelectValue placeholder="Select language" />\r
                </SelectTrigger>\r
                <SelectContent>\r
                  <SelectItem value="en">English</SelectItem>\r
                  <SelectItem value="es">Spanish</SelectItem>\r
                  <SelectItem value="fr">French</SelectItem>\r
                </SelectContent>\r
              </Select>\r
            </div>\r
          </CardContent>\r
        </Card>\r
\r
        {/* Data Table Header */}\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Data Table Header</CardTitle>\r
            <CardDescription>Table controls and actions</CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-4">\r
            <div className="flex items-center justify-between">\r
              <div className="flex items-center gap-2">\r
                <Input placeholder="Search..." className="w-64" />\r
                <Button variant="outline" size="sm">\r
                  <Search className="h-4 w-4" />\r
                </Button>\r
              </div>\r
              <div className="flex gap-2">\r
                <Button size="sm">\r
                  <Plus className="mr-2 h-4 w-4" />\r
                  Add Item\r
                </Button>\r
                <Button variant="outline" size="sm">\r
                  <Download className="mr-2 h-4 w-4" />\r
                  Export\r
                </Button>\r
              </div>\r
            </div>\r
            <div className="flex items-center gap-2">\r
              <Badge variant="secondary">25 items</Badge>\r
              <Badge variant="outline">Filtered</Badge>\r
            </div>\r
          </CardContent>\r
        </Card>\r
      </div>\r
    </div>
}`,...p.parameters?.docs?.source}}};const de=["ComponentOverview","ComponentProperties","UsagePatterns"];export{o as ComponentOverview,m as ComponentProperties,p as UsagePatterns,de as __namedExportsOrder,ce as default};
