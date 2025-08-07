import{j as e}from"./jsx-runtime-4b09fb65.js";import{B as a}from"./badge-1f4d170d.js";import{C as o,a as m,b as u,d as x}from"./card-a3ebd736.js";import{C as p}from"./circle-check-big-e1c54a13.js";import{c as h}from"./createLucideIcon-659e5064.js";import{T as N}from"./triangle-alert-de632850.js";import{T as f}from"./trending-up-ad1f9f6b.js";import{X as v}from"./x-c9d843c6.js";import"./index-a1f2f578.js";import"./_commonjsHelpers-367561ec.js";import"./index-ab6e0fe6.js";import"./index-5825bf51.js";import"./bundle-mjs-ade4b237.js";import"./cn-12644f8e.js";import"./utils-12644f8e.js";/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],g=h("clock",j);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M16 17h6v-6",key:"t6n2it"}],["path",{d:"m22 17-8.5-8.5-5 5L2 7",key:"x473p"}]],w=h("trending-down",b),F={title:"🧩 UI Components/Badge",component:a,parameters:{layout:"centered",docs:{description:{component:`
# Badge Component

Small status indicators built with Class Variance Authority for type-safe variant management. Used throughout FinVision to communicate status, categories, and quick information.

## Badge Variants

- **default**: Primary brand color for standard status
- **secondary**: Muted background for supplementary information
- **destructive**: Red color for errors and warnings
- **outline**: Bordered style for subtle emphasis

## Key Features

- **Semantic Colors**: Status-appropriate color coding
- **Consistent Sizing**: Uniform height and padding
- **Icon Support**: Works well with small icons
- **Accessibility**: Proper contrast ratios
- **Flexible Content**: Text, numbers, or icons

## Usage in FinVision

- **Parameter Status**: Modified, default, validation states
- **Model Health**: Calculation status, error indicators
- **User Roles**: Permission levels and access
- **Data Categories**: Financial statement types
- **Progress Indicators**: Completion states
        `}}},argTypes:{variant:{control:"select",options:["default","secondary","destructive","outline"],description:"Visual style variant"},children:{control:"text",description:"Badge content"}},tags:["autodocs"]},r={args:{children:"Badge"}},s={render:()=>e.jsxs("div",{className:"flex gap-4 flex-wrap",children:[e.jsx(a,{variant:"default",children:"Default"}),e.jsx(a,{variant:"secondary",children:"Secondary"}),e.jsx(a,{variant:"destructive",children:"Destructive"}),e.jsx(a,{variant:"outline",children:"Outline"})]}),parameters:{docs:{description:{story:"All available badge variants with their visual styles."}}}},t={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium mb-2",children:"Model Status"}),e.jsxs("div",{className:"flex gap-2 flex-wrap",children:[e.jsxs(a,{variant:"default",className:"bg-green-700 text-white",children:[e.jsx(p,{className:"mr-1 h-3 w-3"}),"Complete"]}),e.jsxs(a,{variant:"secondary",children:[e.jsx(g,{className:"mr-1 h-3 w-3"}),"Processing"]}),e.jsxs(a,{variant:"destructive",children:[e.jsx(N,{className:"mr-1 h-3 w-3"}),"Error"]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium mb-2",children:"Parameter Status"}),e.jsxs("div",{className:"flex gap-2 flex-wrap",children:[e.jsx(a,{variant:"outline",children:"Default Value"}),e.jsx(a,{variant:"default",children:"Modified"}),e.jsx(a,{variant:"secondary",children:"Calculated"}),e.jsx(a,{variant:"destructive",children:"Invalid"})]})]})]}),parameters:{docs:{description:{story:"Status indicators for different system states."}}}},i={render:()=>e.jsxs("div",{className:"flex gap-4 flex-wrap",children:[e.jsxs(a,{variant:"default",children:[e.jsx(f,{className:"mr-1 h-3 w-3"}),"Growing"]}),e.jsxs(a,{variant:"destructive",children:[e.jsx(w,{className:"mr-1 h-3 w-3"}),"Declining"]}),e.jsxs(a,{variant:"secondary",children:[e.jsx(g,{className:"mr-1 h-3 w-3"}),"Pending"]}),e.jsxs(a,{variant:"outline",children:[e.jsx(p,{className:"mr-1 h-3 w-3"}),"Verified"]})]}),parameters:{docs:{description:{story:"Badges with icons for enhanced visual communication."}}}},d={render:()=>e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium mb-2",children:"Counts and Metrics"}),e.jsxs("div",{className:"flex gap-2 flex-wrap",children:[e.jsx(a,{variant:"default",children:"24"}),e.jsx(a,{variant:"secondary",children:"3 Modified"}),e.jsx(a,{variant:"outline",children:"15.2%"}),e.jsx(a,{variant:"destructive",children:"2 Errors"})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"text-sm font-medium mb-2",children:"Performance Indicators"}),e.jsxs("div",{className:"flex gap-2 flex-wrap",children:[e.jsx(a,{variant:"default",className:"bg-green-700 text-white",children:"+12.5%"}),e.jsx(a,{variant:"destructive",children:"-3.2%"}),e.jsx(a,{variant:"secondary",children:"$1.2M"}),e.jsx(a,{variant:"outline",children:"Q4 2024"})]})]})]}),parameters:{docs:{description:{story:"Badges displaying numerical data and performance metrics."}}}},n={render:()=>e.jsxs("div",{className:"flex gap-2 flex-wrap",children:[e.jsxs(a,{variant:"default",className:"pr-1",children:["Filter: Revenue",e.jsx("button",{className:"ml-1 hover:bg-white/20 rounded-full p-0.5",children:e.jsx(v,{className:"h-3 w-3"})})]}),e.jsxs(a,{variant:"secondary",className:"pr-1",children:["Modified Today",e.jsx("button",{className:"ml-1 hover:bg-black/20 rounded-full p-0.5",children:e.jsx(v,{className:"h-3 w-3"})})]}),e.jsxs(a,{variant:"outline",className:"pr-1",children:["Q1 2024",e.jsx("button",{className:"ml-1 hover:bg-muted rounded-full p-0.5",children:e.jsx(v,{className:"h-3 w-3"})})]})]}),parameters:{docs:{description:{story:"Dismissable badges for filters and temporary selections."}}}},l={render:()=>e.jsxs(o,{className:"w-80",children:[e.jsx(m,{className:"pb-3",children:e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsx(u,{className:"text-base",children:"Revenue Growth Rate"}),e.jsxs("div",{className:"flex gap-1",children:[e.jsx(a,{variant:"outline",children:"Revenue"}),e.jsx(a,{variant:"default",children:"Modified"})]})]})}),e.jsx(x,{children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm",children:"Current Value"}),e.jsx(a,{variant:"secondary",className:"font-mono",children:"15.0%"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm",children:"Default Value"}),e.jsx(a,{variant:"outline",className:"font-mono",children:"10.0%"})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm",children:"Impact"}),e.jsxs(a,{variant:"default",className:"bg-green-700 text-white",children:[e.jsx(f,{className:"mr-1 h-3 w-3"}),"+$2.1M"]})]})]})})]}),parameters:{docs:{description:{story:"Parameter card using badges to show category, status, and impact."}}}},c={render:()=>e.jsx("div",{className:"w-full max-w-4xl space-y-4",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs(o,{children:[e.jsx(m,{className:"pb-2",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx(u,{className:"text-sm",children:"Model Status"}),e.jsxs(a,{variant:"default",className:"bg-green-700 text-white",children:[e.jsx(p,{className:"mr-1 h-3 w-3"}),"Active"]})]})}),e.jsx(x,{children:e.jsx("div",{className:"text-2xl font-bold",children:"FinModel v2.1"})})]}),e.jsxs(o,{children:[e.jsx(m,{className:"pb-2",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx(u,{className:"text-sm",children:"Parameters"}),e.jsxs("div",{className:"flex gap-1",children:[e.jsx(a,{variant:"secondary",children:"24 Total"}),e.jsx(a,{variant:"default",children:"3 Modified"})]})]})}),e.jsx(x,{children:e.jsx("div",{className:"text-2xl font-bold",children:"21 Valid"})})]}),e.jsxs(o,{children:[e.jsx(m,{className:"pb-2",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx(u,{className:"text-sm",children:"Last Update"}),e.jsxs(a,{variant:"outline",children:[e.jsx(g,{className:"mr-1 h-3 w-3"}),"5 min ago"]})]})}),e.jsx(x,{children:e.jsx("div",{className:"text-2xl font-bold",children:"Auto-sync"})})]})]})}),parameters:{docs:{description:{story:"Dashboard example showing badges in context with cards and metrics."}}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Badge'
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4 flex-wrap">\r
      <Badge variant="default">Default</Badge>\r
      <Badge variant="secondary">Secondary</Badge>\r
      <Badge variant="destructive">Destructive</Badge>\r
      <Badge variant="outline">Outline</Badge>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available badge variants with their visual styles.'
      }
    }
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">\r
      <div>\r
        <h3 className="text-sm font-medium mb-2">Model Status</h3>\r
        <div className="flex gap-2 flex-wrap">\r
          <Badge variant="default" className="bg-green-700 text-white">\r
            <CheckCircle className="mr-1 h-3 w-3" />\r
            Complete\r
          </Badge>\r
          <Badge variant="secondary">\r
            <Clock className="mr-1 h-3 w-3" />\r
            Processing\r
          </Badge>\r
          <Badge variant="destructive">\r
            <AlertTriangle className="mr-1 h-3 w-3" />\r
            Error\r
          </Badge>\r
        </div>\r
      </div>\r
\r
      <div>\r
        <h3 className="text-sm font-medium mb-2">Parameter Status</h3>\r
        <div className="flex gap-2 flex-wrap">\r
          <Badge variant="outline">Default Value</Badge>\r
          <Badge variant="default">Modified</Badge>\r
          <Badge variant="secondary">Calculated</Badge>\r
          <Badge variant="destructive">Invalid</Badge>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Status indicators for different system states.'
      }
    }
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-4 flex-wrap">\r
      <Badge variant="default">\r
        <TrendingUp className="mr-1 h-3 w-3" />\r
        Growing\r
      </Badge>\r
      <Badge variant="destructive">\r
        <TrendingDown className="mr-1 h-3 w-3" />\r
        Declining\r
      </Badge>\r
      <Badge variant="secondary">\r
        <Clock className="mr-1 h-3 w-3" />\r
        Pending\r
      </Badge>\r
      <Badge variant="outline">\r
        <CheckCircle className="mr-1 h-3 w-3" />\r
        Verified\r
      </Badge>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Badges with icons for enhanced visual communication.'
      }
    }
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4">\r
      <div>\r
        <h3 className="text-sm font-medium mb-2">Counts and Metrics</h3>\r
        <div className="flex gap-2 flex-wrap">\r
          <Badge variant="default">24</Badge>\r
          <Badge variant="secondary">3 Modified</Badge>\r
          <Badge variant="outline">15.2%</Badge>\r
          <Badge variant="destructive">2 Errors</Badge>\r
        </div>\r
      </div>\r
\r
      <div>\r
        <h3 className="text-sm font-medium mb-2">Performance Indicators</h3>\r
        <div className="flex gap-2 flex-wrap">\r
          <Badge variant="default" className="bg-green-700 text-white">\r
            +12.5%\r
          </Badge>\r
          <Badge variant="destructive">-3.2%</Badge>\r
          <Badge variant="secondary">$1.2M</Badge>\r
          <Badge variant="outline">Q4 2024</Badge>\r
        </div>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Badges displaying numerical data and performance metrics.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex gap-2 flex-wrap">\r
      <Badge variant="default" className="pr-1">\r
        Filter: Revenue\r
        <button className="ml-1 hover:bg-white/20 rounded-full p-0.5">\r
          <X className="h-3 w-3" />\r
        </button>\r
      </Badge>\r
      <Badge variant="secondary" className="pr-1">\r
        Modified Today\r
        <button className="ml-1 hover:bg-black/20 rounded-full p-0.5">\r
          <X className="h-3 w-3" />\r
        </button>\r
      </Badge>\r
      <Badge variant="outline" className="pr-1">\r
        Q1 2024\r
        <button className="ml-1 hover:bg-muted rounded-full p-0.5">\r
          <X className="h-3 w-3" />\r
        </button>\r
      </Badge>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Dismissable badges for filters and temporary selections.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-80">\r
      <CardHeader className="pb-3">\r
        <div className="flex justify-between items-start">\r
          <CardTitle className="text-base">Revenue Growth Rate</CardTitle>\r
          <div className="flex gap-1">\r
            <Badge variant="outline">Revenue</Badge>\r
            <Badge variant="default">Modified</Badge>\r
          </div>\r
        </div>\r
      </CardHeader>\r
      <CardContent>\r
        <div className="space-y-3">\r
          <div className="flex justify-between items-center">\r
            <span className="text-sm">Current Value</span>\r
            <Badge variant="secondary" className="font-mono">\r
              15.0%\r
            </Badge>\r
          </div>\r
          <div className="flex justify-between items-center">\r
            <span className="text-sm">Default Value</span>\r
            <Badge variant="outline" className="font-mono">\r
              10.0%\r
            </Badge>\r
          </div>\r
          <div className="flex justify-between items-center">\r
            <span className="text-sm">Impact</span>\r
            <Badge variant="default" className="bg-green-700 text-white">\r
              <TrendingUp className="mr-1 h-3 w-3" />\r
              +$2.1M\r
            </Badge>\r
          </div>\r
        </div>\r
      </CardContent>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'Parameter card using badges to show category, status, and impact.'
      }
    }
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-full max-w-4xl space-y-4">\r
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">\r
        <Card>\r
          <CardHeader className="pb-2">\r
            <div className="flex justify-between items-center">\r
              <CardTitle className="text-sm">Model Status</CardTitle>\r
              <Badge variant="default" className="bg-green-700 text-white">\r
                <CheckCircle className="mr-1 h-3 w-3" />\r
                Active\r
              </Badge>\r
            </div>\r
          </CardHeader>\r
          <CardContent>\r
            <div className="text-2xl font-bold">FinModel v2.1</div>\r
          </CardContent>\r
        </Card>\r
\r
        <Card>\r
          <CardHeader className="pb-2">\r
            <div className="flex justify-between items-center">\r
              <CardTitle className="text-sm">Parameters</CardTitle>\r
              <div className="flex gap-1">\r
                <Badge variant="secondary">24 Total</Badge>\r
                <Badge variant="default">3 Modified</Badge>\r
              </div>\r
            </div>\r
          </CardHeader>\r
          <CardContent>\r
            <div className="text-2xl font-bold">21 Valid</div>\r
          </CardContent>\r
        </Card>\r
\r
        <Card>\r
          <CardHeader className="pb-2">\r
            <div className="flex justify-between items-center">\r
              <CardTitle className="text-sm">Last Update</CardTitle>\r
              <Badge variant="outline">\r
                <Clock className="mr-1 h-3 w-3" />5 min ago\r
              </Badge>\r
            </div>\r
          </CardHeader>\r
          <CardContent>\r
            <div className="text-2xl font-bold">Auto-sync</div>\r
          </CardContent>\r
        </Card>\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Dashboard example showing badges in context with cards and metrics.'
      }
    }
  }
}`,...c.parameters?.docs?.source}}};const E=["Default","Variants","StatusIndicators","WithIcons","NumberBadges","DismissableBadges","ParameterCard","DashboardExample"];export{c as DashboardExample,r as Default,n as DismissableBadges,d as NumberBadges,l as ParameterCard,t as StatusIndicators,s as Variants,i as WithIcons,E as __namedExportsOrder,F as default};
