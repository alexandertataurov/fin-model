import{j as e}from"./jsx-runtime-73816ce2.js";import{C as a,a as r,b as t,c as i,d as j}from"./card-ae25f609.js";import{B as s}from"./button-37efc3d8.js";import{B as h}from"./badge-c0fcd6ee.js";import{P as w}from"./progress-1c358ef7.js";import{c as f}from"./createLucideIcon-2fb9bc4c.js";import{L as C}from"./layout-dashboard-318fee8b.js";import{F as k}from"./file-text-49e3a8d0.js";import{U as S}from"./upload-ab5a8460.js";import{C as M}from"./chart-column-d107efd5.js";import{T as N}from"./trending-up-69866670.js";import{S as v}from"./settings-396b975e.js";import{D}from"./dollar-sign-98c5365d.js";import"./index-608a8126.js";import"./_commonjsHelpers-725317a4.js";import"./utils-1f7970b9.js";import"./index-0d50cb4b.js";import"./index-1916cbf8.js";import"./index-580d16ae.js";import"./index-699be9d2.js";/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],g=f("bell",L);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],R=f("calendar",H);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const B=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],P=f("users",B),ee={title:"Layout/Application Layout",parameters:{layout:"fullscreen",docs:{description:{component:`
# Application Layout Components

Core layout components that provide the structural foundation for FinVision. These components handle navigation, content organization, and responsive behavior.

## Components

- **Layout**: Main application wrapper with header and navigation
- **Sidebar**: Collapsible navigation sidebar with menu items
- **DashboardLayout**: Specialized layout for dashboard views
- **Header**: Top navigation bar with user actions
- **Content**: Main content area with proper spacing

## Key Features

- **Responsive**: Adapts to different screen sizes
- **Navigation**: Hierarchical menu structure
- **User Context**: User profile and actions
- **Notifications**: System alerts and messages
- **Breadcrumbs**: Navigation context
- **Search**: Global search functionality

## Layout Patterns

- **Dashboard**: Grid-based widget layout
- **Form**: Centered form with sidebar navigation
- **List**: Table/list view with filters
- **Detail**: Single item focus with related actions
        `}}},tags:["autodocs"]},l=()=>e.jsxs("div",{className:"w-64 h-screen bg-card border-r",children:[e.jsxs("div",{className:"p-4 border-b",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"FinVision"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Financial Modeling"})]}),e.jsxs("nav",{className:"p-4 space-y-2",children:[e.jsxs("div",{className:"space-y-1",children:[e.jsx("h3",{className:"text-xs font-medium text-muted-foreground uppercase tracking-wider",children:"Main"}),e.jsxs(s,{variant:"ghost",className:"w-full justify-start",children:[e.jsx(C,{className:"mr-2 h-4 w-4"}),"Dashboard"]}),e.jsxs(s,{variant:"ghost",className:"w-full justify-start",children:[e.jsx(k,{className:"mr-2 h-4 w-4"}),"Reports"]}),e.jsxs(s,{variant:"ghost",className:"w-full justify-start",children:[e.jsx(S,{className:"mr-2 h-4 w-4"}),"Upload Data"]})]}),e.jsxs("div",{className:"space-y-1",children:[e.jsx("h3",{className:"text-xs font-medium text-muted-foreground uppercase tracking-wider",children:"Analysis"}),e.jsxs(s,{variant:"ghost",className:"w-full justify-start",children:[e.jsx(M,{className:"mr-2 h-4 w-4"}),"Financial Charts"]}),e.jsxs(s,{variant:"ghost",className:"w-full justify-start",children:[e.jsx(N,{className:"mr-2 h-4 w-4"}),"Scenarios"]}),e.jsxs(s,{variant:"secondary",className:"w-full justify-start",children:[e.jsx(v,{className:"mr-2 h-4 w-4"}),"Parameters"]})]})]})]}),u=()=>e.jsxs("header",{className:"h-16 border-b bg-background px-6 flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx("h1",{className:"text-xl font-semibold",children:"Parameter Dashboard"}),e.jsx(h,{variant:"secondary",children:"Active Model"})]}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsx(s,{variant:"ghost",size:"icon",children:e.jsx(g,{className:"h-4 w-4"})}),e.jsx(s,{variant:"ghost",size:"icon",children:e.jsx(v,{className:"h-4 w-4"})}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("div",{className:"w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium",children:"JD"}),e.jsx("span",{className:"text-sm font-medium",children:"John Doe"})]})]})]}),b=()=>e.jsxs("div",{className:"p-6 space-y-6",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsxs(a,{children:[e.jsx(r,{className:"pb-2",children:e.jsxs(t,{className:"text-sm font-medium flex items-center",children:[e.jsx(D,{className:"mr-2 h-4 w-4"}),"Total Revenue"]})}),e.jsxs(i,{children:[e.jsx("div",{className:"text-2xl font-bold",children:"$1,234,567"}),e.jsxs("div",{className:"text-xs text-muted-foreground",children:[e.jsx(N,{className:"inline mr-1 h-3 w-3 text-green-500"}),"+12.5% from last month"]})]})]}),e.jsxs(a,{children:[e.jsx(r,{className:"pb-2",children:e.jsxs(t,{className:"text-sm font-medium flex items-center",children:[e.jsx(P,{className:"mr-2 h-4 w-4"}),"Active Parameters"]})}),e.jsxs(i,{children:[e.jsx("div",{className:"text-2xl font-bold",children:"24"}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"3 modified today"})]})]}),e.jsxs(a,{children:[e.jsx(r,{className:"pb-2",children:e.jsxs(t,{className:"text-sm font-medium flex items-center",children:[e.jsx(R,{className:"mr-2 h-4 w-4"}),"Model Status"]})}),e.jsx(i,{children:e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{children:"Calculation"}),e.jsx("span",{children:"85%"})]}),e.jsx(w,{value:85,className:"h-2"})]})})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[e.jsxs(a,{children:[e.jsxs(r,{children:[e.jsx(t,{children:"Recent Parameter Changes"}),e.jsx(j,{children:"Parameters modified in the last 24 hours"})]}),e.jsx(i,{children:e.jsx("div",{className:"space-y-3",children:[{name:"Revenue Growth Rate",old:"12%",new:"15%",time:"2 hours ago"},{name:"Discount Rate",old:"10%",new:"8%",time:"4 hours ago"},{name:"COGS Margin",old:"65%",new:"60%",time:"6 hours ago"}].map((d,y)=>e.jsxs("div",{className:"flex justify-between items-center py-2 border-b last:border-0",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium",children:d.name}),e.jsx("p",{className:"text-xs text-muted-foreground",children:d.time})]}),e.jsx("div",{className:"text-right",children:e.jsxs("p",{className:"text-sm",children:[e.jsx("span",{className:"text-muted-foreground",children:d.old}),e.jsx("span",{className:"mx-2",children:"→"}),e.jsx("span",{className:"font-medium",children:d.new})]})})]},y))})})]}),e.jsxs(a,{children:[e.jsxs(r,{children:[e.jsx(t,{children:"Model Performance"}),e.jsx(j,{children:"Key metrics and validation status"})]}),e.jsx(i,{children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm",children:"Calculation Status"}),e.jsx(h,{variant:"default",children:"Complete"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm",children:"Validation Errors"}),e.jsx(h,{variant:"destructive",children:"2"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm",children:"Last Updated"}),e.jsx("span",{className:"text-sm text-muted-foreground",children:"5 minutes ago"})]}),e.jsx("div",{className:"pt-4 border-t",children:e.jsx(s,{className:"w-full",children:"Recalculate Model"})})]})})]})]})]}),n={render:()=>e.jsxs("div",{className:"flex h-screen bg-background",children:[e.jsx(l,{}),e.jsxs("div",{className:"flex-1 flex flex-col",children:[e.jsx(u,{}),e.jsx("main",{className:"flex-1 overflow-auto",children:e.jsx(b,{})})]})]}),parameters:{docs:{description:{story:"Complete application layout with sidebar, header, and dashboard content."}}}},c={render:()=>e.jsxs("div",{className:"min-h-screen bg-background",children:[e.jsx(u,{}),e.jsxs("div",{className:"flex",children:[e.jsx(l,{}),e.jsx("main",{className:"flex-1",children:e.jsx(b,{})})]})]}),parameters:{docs:{description:{story:"Dashboard-specific layout optimized for data visualization and widgets."}}}},o={render:()=>e.jsxs("div",{className:"flex h-screen",children:[e.jsx(l,{}),e.jsx("div",{className:"flex-1 bg-muted/20 flex items-center justify-center",children:e.jsx("p",{className:"text-muted-foreground",children:"Main content area"})})]}),parameters:{docs:{description:{story:"Sidebar navigation component with menu structure."}}}},m={render:()=>e.jsxs("div",{className:"h-screen bg-background",children:[e.jsx(u,{}),e.jsx("div",{className:"h-full bg-muted/20 flex items-center justify-center",children:e.jsx("p",{className:"text-muted-foreground",children:"Content area below header"})})]}),parameters:{docs:{description:{story:"Application header with user actions and navigation."}}}},x={render:()=>e.jsxs("div",{className:"min-h-screen bg-background",children:[e.jsxs("header",{className:"lg:hidden h-16 border-b bg-background px-4 flex items-center justify-between",children:[e.jsx(s,{variant:"ghost",size:"icon",children:e.jsx("svg",{className:"h-6 w-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 6h16M4 12h16M4 18h16"})})}),e.jsx("h1",{className:"text-lg font-semibold",children:"FinVision"}),e.jsx(s,{variant:"ghost",size:"icon",children:e.jsx(g,{className:"h-4 w-4"})})]}),e.jsxs("div",{className:"flex",children:[e.jsx("div",{className:"hidden lg:block",children:e.jsx(l,{})}),e.jsxs("main",{className:"flex-1",children:[e.jsx("div",{className:"hidden lg:block",children:e.jsx(u,{})}),e.jsx("div",{className:"p-4 lg:p-6",children:e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6",children:[e.jsxs(a,{children:[e.jsx(r,{className:"pb-2",children:e.jsx(t,{className:"text-sm",children:"Revenue"})}),e.jsx(i,{children:e.jsx("div",{className:"text-xl lg:text-2xl font-bold",children:"$1.2M"})})]}),e.jsxs(a,{children:[e.jsx(r,{className:"pb-2",children:e.jsx(t,{className:"text-sm",children:"Parameters"})}),e.jsx(i,{children:e.jsx("div",{className:"text-xl lg:text-2xl font-bold",children:"24"})})]}),e.jsxs(a,{className:"sm:col-span-2 lg:col-span-1",children:[e.jsx(r,{className:"pb-2",children:e.jsx(t,{className:"text-sm",children:"Status"})}),e.jsx(i,{children:e.jsx(h,{variant:"default",children:"Active"})})]})]})})]})]})]}),parameters:{viewport:{defaultViewport:"responsive"},docs:{description:{story:"Responsive layout that adapts to different screen sizes with mobile-first approach."}}}},p={render:()=>e.jsxs("div",{className:"min-h-screen bg-background flex",children:[e.jsx("div",{className:"hidden lg:block w-64",children:e.jsx(l,{})}),e.jsx("div",{className:"flex-1 flex items-center justify-center p-4",children:e.jsxs(a,{className:"w-full max-w-md",children:[e.jsxs(r,{className:"text-center",children:[e.jsx(t,{children:"Create New Parameter"}),e.jsx(j,{children:"Add a new financial parameter to your model"})]}),e.jsxs(i,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Parameter Name"}),e.jsx("input",{className:"w-full px-3 py-2 border rounded-md",placeholder:"e.g., Revenue Growth Rate"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Category"}),e.jsxs("select",{className:"w-full px-3 py-2 border rounded-md",children:[e.jsx("option",{children:"Revenue"}),e.jsx("option",{children:"Costs"}),e.jsx("option",{children:"Valuation"})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Min Value"}),e.jsx("input",{type:"number",className:"w-full px-3 py-2 border rounded-md",placeholder:"0"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Max Value"}),e.jsx("input",{type:"number",className:"w-full px-3 py-2 border rounded-md",placeholder:"1"})]})]}),e.jsxs("div",{className:"pt-4 space-y-2",children:[e.jsx(s,{className:"w-full",children:"Create Parameter"}),e.jsx(s,{variant:"outline",className:"w-full",children:"Cancel"})]})]})]})})]}),parameters:{docs:{description:{story:"Centered form layout with sidebar navigation for focused input tasks."}}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex h-screen bg-background">\r
      <SampleSidebarContent />\r
      <div className="flex-1 flex flex-col">\r
        <SampleHeader />\r
        <main className="flex-1 overflow-auto">\r
          <SampleDashboardContent />\r
        </main>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Complete application layout with sidebar, header, and dashboard content.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-background">\r
      <SampleHeader />\r
      <div className="flex">\r
        <SampleSidebarContent />\r
        <main className="flex-1">\r
          <SampleDashboardContent />\r
        </main>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Dashboard-specific layout optimized for data visualization and widgets.'
      }
    }
  }
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex h-screen">\r
      <SampleSidebarContent />\r
      <div className="flex-1 bg-muted/20 flex items-center justify-center">\r
        <p className="text-muted-foreground">Main content area</p>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Sidebar navigation component with menu structure.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="h-screen bg-background">\r
      <SampleHeader />\r
      <div className="h-full bg-muted/20 flex items-center justify-center">\r
        <p className="text-muted-foreground">Content area below header</p>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Application header with user actions and navigation.'
      }
    }
  }
}`,...m.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-background">\r
      {/* Mobile/Tablet Header */}\r
      <header className="lg:hidden h-16 border-b bg-background px-4 flex items-center justify-between">\r
        <Button variant="ghost" size="icon">\r
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">\r
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />\r
          </svg>\r
        </Button>\r
        <h1 className="text-lg font-semibold">FinVision</h1>\r
        <Button variant="ghost" size="icon">\r
          <Bell className="h-4 w-4" />\r
        </Button>\r
      </header>\r
\r
      <div className="flex">\r
        {/* Desktop Sidebar */}\r
        <div className="hidden lg:block">\r
          <SampleSidebarContent />\r
        </div>\r
        \r
        {/* Main Content */}\r
        <main className="flex-1">\r
          {/* Desktop Header */}\r
          <div className="hidden lg:block">\r
            <SampleHeader />\r
          </div>\r
          \r
          {/* Content */}\r
          <div className="p-4 lg:p-6">\r
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">\r
              <Card>\r
                <CardHeader className="pb-2">\r
                  <CardTitle className="text-sm">Revenue</CardTitle>\r
                </CardHeader>\r
                <CardContent>\r
                  <div className="text-xl lg:text-2xl font-bold">$1.2M</div>\r
                </CardContent>\r
              </Card>\r
              \r
              <Card>\r
                <CardHeader className="pb-2">\r
                  <CardTitle className="text-sm">Parameters</CardTitle>\r
                </CardHeader>\r
                <CardContent>\r
                  <div className="text-xl lg:text-2xl font-bold">24</div>\r
                </CardContent>\r
              </Card>\r
              \r
              <Card className="sm:col-span-2 lg:col-span-1">\r
                <CardHeader className="pb-2">\r
                  <CardTitle className="text-sm">Status</CardTitle>\r
                </CardHeader>\r
                <CardContent>\r
                  <Badge variant="default">Active</Badge>\r
                </CardContent>\r
              </Card>\r
            </div>\r
          </div>\r
        </main>\r
      </div>\r
    </div>,
  parameters: {
    viewport: {
      defaultViewport: 'responsive'
    },
    docs: {
      description: {
        story: 'Responsive layout that adapts to different screen sizes with mobile-first approach.'
      }
    }
  }
}`,...x.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="min-h-screen bg-background flex">\r
      <div className="hidden lg:block w-64">\r
        <SampleSidebarContent />\r
      </div>\r
      \r
      <div className="flex-1 flex items-center justify-center p-4">\r
        <Card className="w-full max-w-md">\r
          <CardHeader className="text-center">\r
            <CardTitle>Create New Parameter</CardTitle>\r
            <CardDescription>\r
              Add a new financial parameter to your model\r
            </CardDescription>\r
          </CardHeader>\r
          <CardContent className="space-y-4">\r
            <div className="space-y-2">\r
              <label className="text-sm font-medium">Parameter Name</label>\r
              <input className="w-full px-3 py-2 border rounded-md" placeholder="e.g., Revenue Growth Rate" />\r
            </div>\r
            \r
            <div className="space-y-2">\r
              <label className="text-sm font-medium">Category</label>\r
              <select className="w-full px-3 py-2 border rounded-md">\r
                <option>Revenue</option>\r
                <option>Costs</option>\r
                <option>Valuation</option>\r
              </select>\r
            </div>\r
            \r
            <div className="grid grid-cols-2 gap-4">\r
              <div className="space-y-2">\r
                <label className="text-sm font-medium">Min Value</label>\r
                <input type="number" className="w-full px-3 py-2 border rounded-md" placeholder="0" />\r
              </div>\r
              <div className="space-y-2">\r
                <label className="text-sm font-medium">Max Value</label>\r
                <input type="number" className="w-full px-3 py-2 border rounded-md" placeholder="1" />\r
              </div>\r
            </div>\r
            \r
            <div className="pt-4 space-y-2">\r
              <Button className="w-full">Create Parameter</Button>\r
              <Button variant="outline" className="w-full">Cancel</Button>\r
            </div>\r
          </CardContent>\r
        </Card>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Centered form layout with sidebar navigation for focused input tasks.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};const se=["FullApplicationLayout","DashboardLayoutExample","SidebarOnly","HeaderOnly","ResponsiveLayout","CenteredFormLayout"];export{p as CenteredFormLayout,c as DashboardLayoutExample,n as FullApplicationLayout,m as HeaderOnly,x as ResponsiveLayout,o as SidebarOnly,se as __namedExportsOrder,ee as default};
