import{j as e}from"./jsx-runtime-22eea9ba.js";import{C as r,a,b as s,c as d,d as t,e as i,f as h}from"./card-b5d2c5ab.js";import{B as n}from"./button-df58ecc4.js";import{B as f}from"./badge-a2f02113.js";import{P as j}from"./progress-0dd52e2f.js";import{r as N,D as g,T as v,F as C,b as w}from"./ui-components-36f6f75d.js";import"./storybook-vendor-bdd8b375.js";import"./utils-bbd425d4.js";import"./index-fa2897fa.js";import"./cn-bbd425d4.js";import"./index-78593782.js";import"./index-363cc9d9.js";const U={title:"🧩 UI Components/Card",component:r,parameters:{layout:"centered",docs:{description:{component:`
# Card Component

A flexible card component system built with composition in mind. Cards are the primary content containers in FinVision, used for dashboards, reports, and data visualization.

## Card Components

- **Card**: Main container with border and background
- **CardHeader**: Header section with title and optional actions
- **CardTitle**: Semantic title with customizable heading level
- **CardDescription**: Subtitle or description text
- **CardContent**: Main content area
- **CardFooter**: Footer section for actions or metadata
- **CardAction**: Action buttons in the header area

## Key Features

- **Composable**: Mix and match card components as needed
- **Semantic**: Proper heading hierarchy support
- **Interactive**: Built-in hover and focus states
- **Accessible**: Screen reader friendly structure

## Usage in FinVision

- **Dashboard Widgets**: KPI cards, charts, and metrics
- **Report Cards**: Financial statement summaries
- **Parameter Groups**: Organized parameter editing
- **File Upload**: Progress and status cards
        `}}},argTypes:{interactive:{control:"boolean",description:"Enable interactive hover states"},hover:{control:"boolean",description:"Enable hover effects"}},tags:["autodocs"]},o={render:()=>e.jsxs(r,{className:"w-80",children:[e.jsxs(a,{children:[e.jsx(s,{children:"Card Title"}),e.jsx(d,{children:"This is a description of what this card contains."})]}),e.jsx(t,{children:e.jsx("p",{children:"Card content goes here."})}),e.jsx(i,{children:e.jsx(n,{children:"Action"})})]})},c={render:()=>e.jsxs(r,{className:"w-80",children:[e.jsxs(a,{children:[e.jsx(s,{children:"Financial Overview"}),e.jsx(d,{children:"Summary of key financial metrics"}),e.jsx(h,{children:e.jsx(n,{variant:"ghost",size:"icon",children:e.jsx(N,{className:"h-4 w-4"})})})]}),e.jsx(t,{children:e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"Revenue"}),e.jsx("span",{className:"font-medium",children:"$1.2M"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"Profit"}),e.jsx("span",{className:"font-medium text-green-600",children:"$240K"})]})]})})]}),parameters:{docs:{description:{story:"Card with action button in the header area."}}}},l={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl",children:[e.jsxs(r,{children:[e.jsxs(a,{className:"pb-2",children:[e.jsx(s,{className:"text-sm font-medium",children:"Total Revenue"}),e.jsx("div",{className:"flex items-center space-x-2",children:e.jsx(g,{className:"h-4 w-4 text-muted-foreground"})})]}),e.jsxs(t,{children:[e.jsx("div",{className:"text-2xl font-bold",children:"$1,234,567"}),e.jsxs("div",{className:"flex items-center space-x-2 text-xs text-muted-foreground",children:[e.jsx(v,{className:"h-3 w-3 text-green-500"}),e.jsx("span",{className:"text-green-500",children:"+12.5%"}),e.jsx("span",{children:"from last month"})]})]})]}),e.jsxs(r,{children:[e.jsx(a,{className:"pb-2",children:e.jsx(s,{className:"text-sm font-medium",children:"Report Generation"})}),e.jsx(t,{children:e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{children:"Processing..."}),e.jsx("span",{children:"75%"})]}),e.jsx(j,{value:75,className:"h-2"})]})}),e.jsx(i,{className:"pt-2",children:e.jsx(f,{variant:"secondary",children:"In Progress"})})]}),e.jsxs(r,{children:[e.jsxs(a,{className:"pb-2",children:[e.jsxs(s,{className:"text-sm font-medium flex items-center space-x-2",children:[e.jsx(C,{className:"h-4 w-4"}),e.jsx("span",{children:"Q4 Financial Report"})]}),e.jsx(d,{children:"Last updated 2 hours ago"})]}),e.jsx(t,{children:e.jsx("p",{className:"text-sm text-muted-foreground",children:"Comprehensive quarterly analysis with key metrics and forecasts."})}),e.jsxs(i,{className:"space-x-2",children:[e.jsx(n,{size:"sm",variant:"outline",children:"View"}),e.jsx(n,{size:"sm",children:"Download"})]})]})]}),parameters:{docs:{description:{story:"Various dashboard widget examples showing different card patterns."}}}},m={render:()=>e.jsxs(r,{className:"w-96",children:[e.jsxs(a,{children:[e.jsx(s,{children:"Revenue Parameters"}),e.jsx(d,{children:"Adjust revenue growth assumptions"}),e.jsx(h,{children:e.jsx(n,{variant:"ghost",size:"icon",children:e.jsx(w,{className:"h-4 w-4"})})})]}),e.jsx(t,{children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Growth Rate"}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx("input",{type:"range",min:"0",max:"0.5",step:"0.01",defaultValue:"0.15",className:"flex-1"}),e.jsx("span",{className:"text-sm font-mono",children:"15%"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Base Amount"}),e.jsx("input",{type:"number",defaultValue:"1000000",className:"w-full px-3 py-1 border rounded text-sm"})]})]})}),e.jsxs(i,{className:"space-x-2",children:[e.jsx(n,{variant:"outline",size:"sm",children:"Reset"}),e.jsx(n,{size:"sm",children:"Apply"})]})]}),parameters:{docs:{description:{story:"Example parameter group card from the financial modeling interface."}}}},p={render:()=>e.jsxs(r,{className:"w-96",children:[e.jsxs(a,{children:[e.jsx(s,{children:"Upload Financial Data"}),e.jsx(d,{children:"Upload Excel files for analysis"})]}),e.jsx(t,{children:e.jsxs("div",{className:"border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center",children:[e.jsx(C,{className:"h-8 w-8 mx-auto mb-2 text-muted-foreground"}),e.jsx("p",{className:"text-sm text-muted-foreground mb-2",children:"Drag and drop your files here, or click to browse"}),e.jsx(n,{variant:"outline",size:"sm",children:"Browse Files"})]})}),e.jsx(i,{children:e.jsx("p",{className:"text-xs text-muted-foreground",children:"Supports .xlsx, .xls, .csv files up to 10MB"})})]}),parameters:{docs:{description:{story:"File upload card example from the data import workflow."}}}},x={render:()=>e.jsx(r,{className:"w-80",children:e.jsx(t,{children:e.jsx("p",{children:"A simple card with just content."})})}),parameters:{docs:{description:{story:"Minimal card with only content area."}}}},u={render:()=>e.jsx(r,{className:"w-80",children:e.jsxs(a,{children:[e.jsx(s,{children:"Header Only Card"}),e.jsx(d,{children:"Sometimes you just need a header"})]})}),parameters:{docs:{description:{story:"Card with only header section."}}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-80">\r
      <CardHeader>\r
        <CardTitle>Card Title</CardTitle>\r
        <CardDescription>\r
          This is a description of what this card contains.\r
        </CardDescription>\r
      </CardHeader>\r
      <CardContent>\r
        <p>Card content goes here.</p>\r
      </CardContent>\r
      <CardFooter>\r
        <Button>Action</Button>\r
      </CardFooter>\r
    </Card>
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-80">\r
      <CardHeader>\r
        <CardTitle>Financial Overview</CardTitle>\r
        <CardDescription>Summary of key financial metrics</CardDescription>\r
        <CardAction>\r
          <Button variant="ghost" size="icon">\r
            <MoreHorizontal className="h-4 w-4" />\r
          </Button>\r
        </CardAction>\r
      </CardHeader>\r
      <CardContent>\r
        <div className="space-y-2">\r
          <div className="flex justify-between">\r
            <span>Revenue</span>\r
            <span className="font-medium">$1.2M</span>\r
          </div>\r
          <div className="flex justify-between">\r
            <span>Profit</span>\r
            <span className="font-medium text-green-600">$240K</span>\r
          </div>\r
        </div>\r
      </CardContent>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'Card with action button in the header area.'
      }
    }
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl">\r
      {/* KPI Card */}\r
      <Card>\r
        <CardHeader className="pb-2">\r
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>\r
          <div className="flex items-center space-x-2">\r
            <DollarSign className="h-4 w-4 text-muted-foreground" />\r
          </div>\r
        </CardHeader>\r
        <CardContent>\r
          <div className="text-2xl font-bold">$1,234,567</div>\r
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">\r
            <TrendingUp className="h-3 w-3 text-green-500" />\r
            <span className="text-green-500">+12.5%</span>\r
            <span>from last month</span>\r
          </div>\r
        </CardContent>\r
      </Card>\r
\r
      {/* Progress Card */}\r
      <Card>\r
        <CardHeader className="pb-2">\r
          <CardTitle className="text-sm font-medium">\r
            Report Generation\r
          </CardTitle>\r
        </CardHeader>\r
        <CardContent>\r
          <div className="space-y-2">\r
            <div className="flex justify-between text-sm">\r
              <span>Processing...</span>\r
              <span>75%</span>\r
            </div>\r
            <Progress value={75} className="h-2" />\r
          </div>\r
        </CardContent>\r
        <CardFooter className="pt-2">\r
          <Badge variant="secondary">In Progress</Badge>\r
        </CardFooter>\r
      </Card>\r
\r
      {/* File Card */}\r
      <Card>\r
        <CardHeader className="pb-2">\r
          <CardTitle className="text-sm font-medium flex items-center space-x-2">\r
            <FileText className="h-4 w-4" />\r
            <span>Q4 Financial Report</span>\r
          </CardTitle>\r
          <CardDescription>Last updated 2 hours ago</CardDescription>\r
        </CardHeader>\r
        <CardContent>\r
          <p className="text-sm text-muted-foreground">\r
            Comprehensive quarterly analysis with key metrics and forecasts.\r
          </p>\r
        </CardContent>\r
        <CardFooter className="space-x-2">\r
          <Button size="sm" variant="outline">\r
            View\r
          </Button>\r
          <Button size="sm">Download</Button>\r
        </CardFooter>\r
      </Card>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Various dashboard widget examples showing different card patterns.'
      }
    }
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-96">\r
      <CardHeader>\r
        <CardTitle>Revenue Parameters</CardTitle>\r
        <CardDescription>Adjust revenue growth assumptions</CardDescription>\r
        <CardAction>\r
          <Button variant="ghost" size="icon">\r
            <Settings className="h-4 w-4" />\r
          </Button>\r
        </CardAction>\r
      </CardHeader>\r
      <CardContent>\r
        <div className="space-y-4">\r
          <div className="space-y-2">\r
            <label className="text-sm font-medium">Growth Rate</label>\r
            <div className="flex items-center space-x-2">\r
              <input type="range" min="0" max="0.5" step="0.01" defaultValue="0.15" className="flex-1" />\r
              <span className="text-sm font-mono">15%</span>\r
            </div>\r
          </div>\r
          <div className="space-y-2">\r
            <label className="text-sm font-medium">Base Amount</label>\r
            <input type="number" defaultValue="1000000" className="w-full px-3 py-1 border rounded text-sm" />\r
          </div>\r
        </div>\r
      </CardContent>\r
      <CardFooter className="space-x-2">\r
        <Button variant="outline" size="sm">\r
          Reset\r
        </Button>\r
        <Button size="sm">Apply</Button>\r
      </CardFooter>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'Example parameter group card from the financial modeling interface.'
      }
    }
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-96">\r
      <CardHeader>\r
        <CardTitle>Upload Financial Data</CardTitle>\r
        <CardDescription>Upload Excel files for analysis</CardDescription>\r
      </CardHeader>\r
      <CardContent>\r
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">\r
          <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />\r
          <p className="text-sm text-muted-foreground mb-2">\r
            Drag and drop your files here, or click to browse\r
          </p>\r
          <Button variant="outline" size="sm">\r
            Browse Files\r
          </Button>\r
        </div>\r
      </CardContent>\r
      <CardFooter>\r
        <p className="text-xs text-muted-foreground">\r
          Supports .xlsx, .xls, .csv files up to 10MB\r
        </p>\r
      </CardFooter>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'File upload card example from the data import workflow.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-80">\r
      <CardContent>\r
        <p>A simple card with just content.</p>\r
      </CardContent>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'Minimal card with only content area.'
      }
    }
  }
}`,...x.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-80">\r
      <CardHeader>\r
        <CardTitle>Header Only Card</CardTitle>\r
        <CardDescription>Sometimes you just need a header</CardDescription>\r
      </CardHeader>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'Card with only header section.'
      }
    }
  }
}`,...u.parameters?.docs?.source}}};const M=["Default","WithAction","DashboardWidgets","ParameterGroup","FileUploadCard","Simple","HeaderOnly"];export{l as DashboardWidgets,o as Default,p as FileUploadCard,u as HeaderOnly,m as ParameterGroup,x as Simple,c as WithAction,M as __namedExportsOrder,U as default};
