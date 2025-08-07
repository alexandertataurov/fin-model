import{j as e}from"./jsx-runtime-22eea9ba.js";import{T as m,a as p,b as r,c as s}from"./tabs-7f7e09aa.js";import{C as a,a as n,b as t,c as i,d as l}from"./card-b5d2c5ab.js";import{a as u,F as x,T as h,b as v}from"./ui-components-36f6f75d.js";import"./storybook-vendor-bdd8b375.js";import"./index-16ad2b44.js";import"./index-78593782.js";import"./index-745a12a1.js";import"./index-fa2897fa.js";import"./index-53087e4f.js";import"./index-363cc9d9.js";import"./index-436ee938.js";import"./utils-bbd425d4.js";const S={title:"🧩 UI Components/Tabs",component:m,parameters:{layout:"centered",docs:{description:{component:`
# Tabs Component

A tabs component built with Radix UI primitives for organizing content into logical sections with consistent styling and accessibility.

## Key Features

- **Accessibility**: Built-in focus management and ARIA attributes
- **Keyboard Navigation**: Full keyboard support for tab switching
- **Responsive**: Adapts to different screen sizes
- **Customizable**: Flexible styling and content organization
- **Icon Support**: Works well with icon components

## Usage in FinVision

- **Financial Reports**: Organize different report sections
- **Dashboard Views**: Switch between different dashboard panels
- **Model Parameters**: Group related parameters into tabs
- **Settings Pages**: Organize settings into logical categories
        `}}},argTypes:{defaultValue:{control:"text",description:"Default active tab"},orientation:{control:"select",options:["horizontal","vertical"],description:"Tab orientation"}},tags:["autodocs"]},d={render:()=>e.jsxs(m,{defaultValue:"account",className:"w-[400px]",children:[e.jsxs(p,{className:"grid w-full grid-cols-2",children:[e.jsx(r,{value:"account",children:"Account"}),e.jsx(r,{value:"password",children:"Password"})]}),e.jsx(s,{value:"account",children:e.jsxs(a,{children:[e.jsxs(n,{children:[e.jsx(t,{children:"Account"}),e.jsx(i,{children:"Make changes to your account here. Click save when you're done."})]}),e.jsxs(l,{className:"space-y-2",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{htmlFor:"name",children:"Name"}),e.jsx("input",{id:"name",defaultValue:"Pedro Duarte"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{htmlFor:"username",children:"Username"}),e.jsx("input",{id:"username",defaultValue:"@peduarte"})]})]})]})}),e.jsx(s,{value:"password",children:e.jsxs(a,{children:[e.jsxs(n,{children:[e.jsx(t,{children:"Password"}),e.jsx(i,{children:"Change your password here. After saving, you'll be logged out."})]}),e.jsxs(l,{className:"space-y-2",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{htmlFor:"current",children:"Current password"}),e.jsx("input",{id:"current",type:"password"})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("label",{htmlFor:"new",children:"New password"}),e.jsx("input",{id:"new",type:"password"})]})]})]})})]})},c={render:()=>e.jsxs(m,{defaultValue:"overview",className:"w-[600px]",children:[e.jsxs(p,{className:"grid w-full grid-cols-4",children:[e.jsxs(r,{value:"overview",className:"flex items-center gap-2",children:[e.jsx(u,{className:"h-4 w-4"}),"Overview"]}),e.jsxs(r,{value:"reports",className:"flex items-center gap-2",children:[e.jsx(x,{className:"h-4 w-4"}),"Reports"]}),e.jsxs(r,{value:"analysis",className:"flex items-center gap-2",children:[e.jsx(h,{className:"h-4 w-4"}),"Analysis"]}),e.jsxs(r,{value:"settings",className:"flex items-center gap-2",children:[e.jsx(v,{className:"h-4 w-4"}),"Settings"]})]}),e.jsx(s,{value:"overview",children:e.jsxs(a,{children:[e.jsxs(n,{children:[e.jsx(t,{children:"Financial Overview"}),e.jsx(i,{children:"Key metrics and performance indicators"})]}),e.jsx(l,{children:e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"Revenue"}),e.jsx("p",{className:"text-2xl font-bold",children:"$2.4M"}),e.jsx("p",{className:"text-xs text-green-600",children:"+12.5% vs last year"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-sm font-medium",children:"Profit Margin"}),e.jsx("p",{className:"text-2xl font-bold",children:"18.2%"}),e.jsx("p",{className:"text-xs text-green-600",children:"+2.1% vs last year"})]})]})})]})}),e.jsx(s,{value:"reports",children:e.jsxs(a,{children:[e.jsxs(n,{children:[e.jsx(t,{children:"Financial Reports"}),e.jsx(i,{children:"Generate and view financial reports"})]}),e.jsx(l,{children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between p-3 border rounded",children:[e.jsxs("div",{children:[e.jsx("p",{className:"font-medium",children:"Income Statement"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Q4 2024"})]}),e.jsx("button",{className:"text-sm text-blue-600",children:"View"})]}),e.jsxs("div",{className:"flex items-center justify-between p-3 border rounded",children:[e.jsxs("div",{children:[e.jsx("p",{className:"font-medium",children:"Balance Sheet"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Q4 2024"})]}),e.jsx("button",{className:"text-sm text-blue-600",children:"View"})]})]})})]})}),e.jsx(s,{value:"analysis",children:e.jsxs(a,{children:[e.jsxs(n,{children:[e.jsx(t,{children:"Financial Analysis"}),e.jsx(i,{children:"Advanced analysis and forecasting tools"})]}),e.jsx(l,{children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"p-4 border rounded",children:[e.jsx("h4",{className:"font-medium mb-2",children:"Trend Analysis"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Analyze revenue and expense trends over time"})]}),e.jsxs("div",{className:"p-4 border rounded",children:[e.jsx("h4",{className:"font-medium mb-2",children:"Scenario Planning"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Model different business scenarios and outcomes"})]})]})})]})}),e.jsx(s,{value:"settings",children:e.jsxs(a,{children:[e.jsxs(n,{children:[e.jsx(t,{children:"Dashboard Settings"}),e.jsx(i,{children:"Customize your dashboard preferences"})]}),e.jsx(l,{children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-sm",children:"Auto-refresh"}),e.jsx("input",{type:"checkbox",defaultChecked:!0})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-sm",children:"Show alerts"}),e.jsx("input",{type:"checkbox",defaultChecked:!0})]})]})})]})})]})},o={render:()=>e.jsxs(m,{defaultValue:"overview",orientation:"vertical",className:"w-[600px]",children:[e.jsxs(p,{className:"grid w-40 grid-cols-1",children:[e.jsx(r,{value:"overview",children:"Overview"}),e.jsx(r,{value:"reports",children:"Reports"}),e.jsx(r,{value:"analysis",children:"Analysis"})]}),e.jsx(s,{value:"overview",className:"ml-6",children:e.jsxs(a,{children:[e.jsxs(n,{children:[e.jsx(t,{children:"Overview"}),e.jsx(i,{children:"High-level financial summary"})]}),e.jsx(l,{children:e.jsx("p",{children:"Overview content goes here..."})})]})}),e.jsx(s,{value:"reports",className:"ml-6",children:e.jsxs(a,{children:[e.jsxs(n,{children:[e.jsx(t,{children:"Reports"}),e.jsx(i,{children:"Financial reporting tools"})]}),e.jsx(l,{children:e.jsx("p",{children:"Reports content goes here..."})})]})}),e.jsx(s,{value:"analysis",className:"ml-6",children:e.jsxs(a,{children:[e.jsxs(n,{children:[e.jsx(t,{children:"Analysis"}),e.jsx(i,{children:"Advanced analysis tools"})]}),e.jsx(l,{children:e.jsx("p",{children:"Analysis content goes here..."})})]})})]})};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="account" className="w-[400px]">\r
      <TabsList className="grid w-full grid-cols-2">\r
        <TabsTrigger value="account">Account</TabsTrigger>\r
        <TabsTrigger value="password">Password</TabsTrigger>\r
      </TabsList>\r
      <TabsContent value="account">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Account</CardTitle>\r
            <CardDescription>\r
              Make changes to your account here. Click save when you're done.\r
            </CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-2">\r
            <div className="space-y-1">\r
              <label htmlFor="name">Name</label>\r
              <input id="name" defaultValue="Pedro Duarte" />\r
            </div>\r
            <div className="space-y-1">\r
              <label htmlFor="username">Username</label>\r
              <input id="username" defaultValue="@peduarte" />\r
            </div>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
      <TabsContent value="password">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Password</CardTitle>\r
            <CardDescription>\r
              Change your password here. After saving, you'll be logged out.\r
            </CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-2">\r
            <div className="space-y-1">\r
              <label htmlFor="current">Current password</label>\r
              <input id="current" type="password" />\r
            </div>\r
            <div className="space-y-1">\r
              <label htmlFor="new">New password</label>\r
              <input id="new" type="password" />\r
            </div>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
    </Tabs>
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="overview" className="w-[600px]">\r
      <TabsList className="grid w-full grid-cols-4">\r
        <TabsTrigger value="overview" className="flex items-center gap-2">\r
          <BarChart3 className="h-4 w-4" />\r
          Overview\r
        </TabsTrigger>\r
        <TabsTrigger value="reports" className="flex items-center gap-2">\r
          <FileText className="h-4 w-4" />\r
          Reports\r
        </TabsTrigger>\r
        <TabsTrigger value="analysis" className="flex items-center gap-2">\r
          <TrendingUp className="h-4 w-4" />\r
          Analysis\r
        </TabsTrigger>\r
        <TabsTrigger value="settings" className="flex items-center gap-2">\r
          <Settings className="h-4 w-4" />\r
          Settings\r
        </TabsTrigger>\r
      </TabsList>\r
      <TabsContent value="overview">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Financial Overview</CardTitle>\r
            <CardDescription>\r
              Key metrics and performance indicators\r
            </CardDescription>\r
          </CardHeader>\r
          <CardContent>\r
            <div className="grid grid-cols-2 gap-4">\r
              <div className="space-y-2">\r
                <p className="text-sm font-medium">Revenue</p>\r
                <p className="text-2xl font-bold">$2.4M</p>\r
                <p className="text-xs text-green-600">+12.5% vs last year</p>\r
              </div>\r
              <div className="space-y-2">\r
                <p className="text-sm font-medium">Profit Margin</p>\r
                <p className="text-2xl font-bold">18.2%</p>\r
                <p className="text-xs text-green-600">+2.1% vs last year</p>\r
              </div>\r
            </div>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
      <TabsContent value="reports">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Financial Reports</CardTitle>\r
            <CardDescription>\r
              Generate and view financial reports\r
            </CardDescription>\r
          </CardHeader>\r
          <CardContent>\r
            <div className="space-y-4">\r
              <div className="flex items-center justify-between p-3 border rounded">\r
                <div>\r
                  <p className="font-medium">Income Statement</p>\r
                  <p className="text-sm text-muted-foreground">Q4 2024</p>\r
                </div>\r
                <button className="text-sm text-blue-600">View</button>\r
              </div>\r
              <div className="flex items-center justify-between p-3 border rounded">\r
                <div>\r
                  <p className="font-medium">Balance Sheet</p>\r
                  <p className="text-sm text-muted-foreground">Q4 2024</p>\r
                </div>\r
                <button className="text-sm text-blue-600">View</button>\r
              </div>\r
            </div>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
      <TabsContent value="analysis">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Financial Analysis</CardTitle>\r
            <CardDescription>\r
              Advanced analysis and forecasting tools\r
            </CardDescription>\r
          </CardHeader>\r
          <CardContent>\r
            <div className="space-y-4">\r
              <div className="p-4 border rounded">\r
                <h4 className="font-medium mb-2">Trend Analysis</h4>\r
                <p className="text-sm text-muted-foreground">\r
                  Analyze revenue and expense trends over time\r
                </p>\r
              </div>\r
              <div className="p-4 border rounded">\r
                <h4 className="font-medium mb-2">Scenario Planning</h4>\r
                <p className="text-sm text-muted-foreground">\r
                  Model different business scenarios and outcomes\r
                </p>\r
              </div>\r
            </div>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
      <TabsContent value="settings">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Dashboard Settings</CardTitle>\r
            <CardDescription>\r
              Customize your dashboard preferences\r
            </CardDescription>\r
          </CardHeader>\r
          <CardContent>\r
            <div className="space-y-4">\r
              <div className="flex items-center justify-between">\r
                <span className="text-sm">Auto-refresh</span>\r
                <input type="checkbox" defaultChecked />\r
              </div>\r
              <div className="flex items-center justify-between">\r
                <span className="text-sm">Show alerts</span>\r
                <input type="checkbox" defaultChecked />\r
              </div>\r
            </div>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
    </Tabs>
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Tabs defaultValue="overview" orientation="vertical" className="w-[600px]">\r
      <TabsList className="grid w-40 grid-cols-1">\r
        <TabsTrigger value="overview">Overview</TabsTrigger>\r
        <TabsTrigger value="reports">Reports</TabsTrigger>\r
        <TabsTrigger value="analysis">Analysis</TabsTrigger>\r
      </TabsList>\r
      <TabsContent value="overview" className="ml-6">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Overview</CardTitle>\r
            <CardDescription>High-level financial summary</CardDescription>\r
          </CardHeader>\r
          <CardContent>\r
            <p>Overview content goes here...</p>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
      <TabsContent value="reports" className="ml-6">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Reports</CardTitle>\r
            <CardDescription>Financial reporting tools</CardDescription>\r
          </CardHeader>\r
          <CardContent>\r
            <p>Reports content goes here...</p>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
      <TabsContent value="analysis" className="ml-6">\r
        <Card>\r
          <CardHeader>\r
            <CardTitle>Analysis</CardTitle>\r
            <CardDescription>Advanced analysis tools</CardDescription>\r
          </CardHeader>\r
          <CardContent>\r
            <p>Analysis content goes here...</p>\r
          </CardContent>\r
        </Card>\r
      </TabsContent>\r
    </Tabs>
}`,...o.parameters?.docs?.source}}};const V=["Default","FinancialDashboard","VerticalTabs"];export{d as Default,c as FinancialDashboard,o as VerticalTabs,V as __namedExportsOrder,S as default};
