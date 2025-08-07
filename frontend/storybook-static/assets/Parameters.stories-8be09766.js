import{j as e}from"./jsx-runtime-73816ce2.js";import{C as t,a as d,b as c,d as m,c as i}from"./card-ae25f609.js";import{B as s}from"./button-37efc3d8.js";import{B as r}from"./badge-c0fcd6ee.js";import{S as n}from"./slider-6d11c166.js";import{I as N}from"./input-6247f6e0.js";import{L as l}from"./label-4f136fa2.js";import{S as y,a as w,b as C,c as b,d as o}from"./select-1d597410.js";import{T as f}from"./trending-up-69866670.js";import{S as j}from"./settings-396b975e.js";import{c as S}from"./createLucideIcon-2fb9bc4c.js";import{D as _}from"./dollar-sign-98c5365d.js";import{S as B}from"./search-b1cf231f.js";import{S as P}from"./square-pen-b42d9127.js";import"./index-608a8126.js";import"./_commonjsHelpers-725317a4.js";import"./utils-1f7970b9.js";import"./index-0d50cb4b.js";import"./Combination-582fdfc0.js";import"./index-580d16ae.js";import"./index-699be9d2.js";import"./index-1916cbf8.js";/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=[["rect",{width:"16",height:"20",x:"4",y:"2",rx:"2",key:"1nb95v"}],["line",{x1:"8",x2:"16",y1:"6",y2:"6",key:"x4nwl0"}],["line",{x1:"16",x2:"16",y1:"14",y2:"18",key:"wjye3r"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M8 18h.01",key:"lrp35t"}]],k=S("calculator",R),Z={title:"Features/Parameter Management",parameters:{layout:"padded",docs:{description:{component:`
# Parameter Management Components

Interactive components for managing financial model parameters in FinVision. These components allow users to adjust assumptions, view impact analysis, and organize parameters into logical groups.

## Components

- **ParameterControl**: Individual parameter controls (sliders, inputs, dropdowns)
- **ParameterGroup**: Organized collections of related parameters
- **ParameterSearch**: Search and filter parameters
- **BulkParameterEdit**: Edit multiple parameters simultaneously
- **ParameterHistory**: Track parameter changes over time
- **ParameterTemplates**: Save and load parameter presets

## Key Features

- **Real-time Updates**: Live model recalculation as parameters change
- **Impact Analysis**: Visual feedback on parameter sensitivity
- **Validation**: Input validation with error states
- **Templates**: Save common parameter configurations
- **History**: Track and revert parameter changes

## Parameter Types

- **Growth Rates**: Revenue, expense growth assumptions
- **Financial Ratios**: Margins, returns, efficiency metrics
- **Market Data**: Interest rates, market multiples
- **Operational**: Capacity, productivity factors
        `}}},tags:["autodocs"]},g=[{id:"revenue_growth",name:"Revenue Growth Rate",description:"Annual revenue growth assumption",type:"percentage",category:"Revenue",value:.15,default_value:.1,min_value:0,max_value:.5,control_type:"slider",display_format:"percentage",step_size:.01,is_editable:!0},{id:"cost_of_goods_sold",name:"Cost of Goods Sold",description:"COGS as percentage of revenue",type:"percentage",category:"Costs",value:.6,default_value:.65,min_value:.4,max_value:.8,control_type:"slider",display_format:"percentage",step_size:.01,is_editable:!0},{id:"discount_rate",name:"Discount Rate",description:"Weighted average cost of capital",type:"percentage",category:"Valuation",value:.08,default_value:.1,min_value:.05,max_value:.15,control_type:"input",display_format:"percentage",step_size:.001,is_editable:!0}],p={render:()=>e.jsxs(t,{className:"w-96",children:[e.jsxs(d,{children:[e.jsxs(c,{className:"flex items-center space-x-2",children:[e.jsx(f,{className:"h-5 w-5"}),e.jsx("span",{children:"Revenue Growth Rate"})]}),e.jsx(m,{children:"Annual revenue growth assumption for financial projections"})]}),e.jsxs(i,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx(l,{children:"Growth Rate"}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(r,{variant:"secondary",children:"15.0%"}),e.jsx(s,{variant:"ghost",size:"icon",className:"h-6 w-6",children:e.jsx(j,{className:"h-3 w-3"})})]})]}),e.jsx(n,{value:[15],min:0,max:50,step:.1,className:"w-full"}),e.jsxs("div",{className:"flex justify-between text-xs text-muted-foreground",children:[e.jsx("span",{children:"0%"}),e.jsx("span",{children:"25%"}),e.jsx("span",{children:"50%"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-muted-foreground",children:"Current:"}),e.jsx("span",{className:"font-medium",children:"15.0%"})]}),e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-muted-foreground",children:"Default:"}),e.jsx("span",{children:"10.0%"})]}),e.jsxs("div",{className:"flex justify-between text-sm",children:[e.jsx("span",{className:"text-muted-foreground",children:"Range:"}),e.jsx("span",{children:"0% - 50%"})]})]}),e.jsx("div",{className:"pt-2 border-t",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-muted-foreground",children:"Impact"}),e.jsxs("div",{className:"flex items-center space-x-1",children:[e.jsx("span",{className:"text-sm text-green-600",children:"+$2.1M"}),e.jsx(f,{className:"h-3 w-3 text-green-600"})]})]})})]})]}),parameters:{docs:{description:{story:"Parameter control with slider input and impact analysis."}}}},u={render:()=>e.jsxs(t,{className:"w-96",children:[e.jsxs(d,{children:[e.jsxs(c,{className:"flex items-center space-x-2",children:[e.jsx(k,{className:"h-5 w-5"}),e.jsx("span",{children:"Discount Rate"})]}),e.jsx(m,{children:"Weighted average cost of capital for valuation"})]}),e.jsxs(i,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(l,{htmlFor:"discount-rate",children:"Rate (%)"}),e.jsxs("div",{className:"relative",children:[e.jsx(N,{id:"discount-rate",type:"number",value:"8.0",step:"0.1",min:"5.0",max:"15.0",className:"pr-8"}),e.jsx("span",{className:"absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground",children:"%"})]}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Range: 5.0% - 15.0%"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-muted-foreground",children:"Current"}),e.jsx("p",{className:"font-medium",children:"8.0%"})]}),e.jsxs("div",{children:[e.jsx("span",{className:"text-muted-foreground",children:"Default"}),e.jsx("p",{children:"10.0%"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm",children:"Sensitivity"}),e.jsx(r,{variant:"outline",children:"High"})]}),e.jsx("div",{className:"text-xs text-muted-foreground",children:"1% change = $1.5M valuation impact"})]})]})]}),parameters:{docs:{description:{story:"Parameter control with numeric input and sensitivity analysis."}}}},x={render:()=>e.jsxs(t,{className:"w-full max-w-2xl",children:[e.jsxs(d,{children:[e.jsxs(c,{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(_,{className:"h-5 w-5"}),e.jsx("span",{children:"Revenue Parameters"})]}),e.jsxs("div",{className:"flex items-center space-x-2",children:[e.jsx(r,{variant:"secondary",children:"3 parameters"}),e.jsx(s,{variant:"ghost",size:"icon",children:e.jsx(j,{className:"h-4 w-4"})})]})]}),e.jsx(m,{children:"Revenue growth assumptions and pricing parameters"})]}),e.jsxs(i,{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx(l,{className:"text-sm font-medium",children:"Revenue Growth Rate"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Annual growth assumption"})]}),e.jsx(r,{variant:"secondary",children:"15.0%"})]}),e.jsx(n,{value:[15],min:0,max:50,step:.1})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx(l,{className:"text-sm font-medium",children:"Price Elasticity"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Demand sensitivity to price"})]}),e.jsx(r,{variant:"secondary",children:"-1.2"})]}),e.jsx(n,{value:[1.2],min:.5,max:3,step:.1})]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx(l,{className:"text-sm font-medium",children:"Market Share"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Target market penetration"})]}),e.jsx(r,{variant:"secondary",children:"12.5%"})]}),e.jsx(n,{value:[12.5],min:0,max:50,step:.5})]}),e.jsxs("div",{className:"pt-4 border-t flex justify-between items-center",children:[e.jsxs("div",{className:"text-sm",children:[e.jsx("span",{className:"text-muted-foreground",children:"Combined Impact:"}),e.jsx("span",{className:"ml-2 font-medium text-green-600",children:"+$3.2M Revenue"})]}),e.jsxs("div",{className:"space-x-2",children:[e.jsx(s,{variant:"outline",size:"sm",children:"Reset"}),e.jsx(s,{size:"sm",children:"Apply"})]})]})]})]}),parameters:{docs:{description:{story:"Parameter group with multiple related controls and combined impact."}}}},v={render:()=>e.jsxs("div",{className:"w-full max-w-4xl space-y-4",children:[e.jsx(t,{children:e.jsx(i,{className:"pt-6",children:e.jsxs("div",{className:"flex space-x-4",children:[e.jsxs("div",{className:"flex-1 relative",children:[e.jsx(B,{className:"absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"}),e.jsx(N,{placeholder:"Search parameters...",className:"pl-10"})]}),e.jsxs(y,{defaultValue:"all",children:[e.jsx(w,{className:"w-48",children:e.jsx(C,{})}),e.jsxs(b,{children:[e.jsx(o,{value:"all",children:"All Categories"}),e.jsx(o,{value:"revenue",children:"Revenue"}),e.jsx(o,{value:"costs",children:"Costs"}),e.jsx(o,{value:"valuation",children:"Valuation"})]})]}),e.jsxs(s,{variant:"outline",children:[e.jsx(P,{className:"mr-2 h-4 w-4"}),"Bulk Edit"]})]})})}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:g.map(a=>e.jsxs(t,{children:[e.jsx(d,{className:"pb-3",children:e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsxs("div",{children:[e.jsx(c,{className:"text-base",children:a.name}),e.jsx(m,{className:"text-sm",children:a.description})]}),e.jsx(r,{variant:"outline",children:a.category})]})}),e.jsx(i,{children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-sm text-muted-foreground",children:"Current Value"}),e.jsx(r,{variant:"secondary",children:a.display_format==="percentage"?`${(a.value*100).toFixed(1)}%`:a.value})]}),a.control_type==="slider"&&e.jsx(n,{value:[a.value*100],min:a.min_value*100,max:a.max_value*100,step:a.step_size*100}),a.control_type==="input"&&e.jsx(N,{type:"number",value:a.value,min:a.min_value,max:a.max_value,step:a.step_size})]})})]},a.id))})]}),parameters:{docs:{description:{story:"Parameter search and filtering interface with multiple parameter types."}}}},h={render:()=>e.jsxs(t,{className:"w-full max-w-3xl",children:[e.jsxs(d,{children:[e.jsx(c,{children:"Bulk Parameter Edit"}),e.jsx(m,{children:"Edit multiple parameters simultaneously"})]}),e.jsxs(i,{className:"space-y-6",children:[e.jsxs("div",{className:"flex justify-between items-center p-3 bg-muted rounded-lg",children:[e.jsx("span",{className:"text-sm font-medium",children:"3 parameters selected"}),e.jsxs("div",{className:"space-x-2",children:[e.jsx(s,{variant:"outline",size:"sm",children:"Select All"}),e.jsx(s,{variant:"outline",size:"sm",children:"Clear"})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground",children:[e.jsx("div",{className:"col-span-1",children:"Select"}),e.jsx("div",{className:"col-span-4",children:"Parameter"}),e.jsx("div",{className:"col-span-2",children:"Category"}),e.jsx("div",{className:"col-span-2",children:"Current"}),e.jsx("div",{className:"col-span-3",children:"New Value"})]}),g.map(a=>e.jsxs("div",{className:"grid grid-cols-12 gap-4 items-center p-2 border rounded",children:[e.jsx("div",{className:"col-span-1",children:e.jsx("input",{type:"checkbox",className:"h-4 w-4",defaultChecked:!0})}),e.jsx("div",{className:"col-span-4",children:e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-medium",children:a.name}),e.jsx("p",{className:"text-xs text-muted-foreground",children:a.description})]})}),e.jsx("div",{className:"col-span-2",children:e.jsx(r,{variant:"outline",className:"text-xs",children:a.category})}),e.jsx("div",{className:"col-span-2",children:e.jsx("span",{className:"text-sm",children:a.display_format==="percentage"?`${(a.value*100).toFixed(1)}%`:a.value})}),e.jsx("div",{className:"col-span-3",children:e.jsx(N,{type:"number",defaultValue:a.value,min:a.min_value,max:a.max_value,step:a.step_size,className:"h-8"})})]},a.id))]}),e.jsxs("div",{className:"flex justify-between items-center pt-4 border-t",children:[e.jsx("div",{className:"text-sm text-muted-foreground",children:"Changes will update 3 parameters"}),e.jsxs("div",{className:"space-x-2",children:[e.jsx(s,{variant:"outline",children:"Preview Changes"}),e.jsx(s,{children:"Apply All"})]})]})]})]}),parameters:{docs:{description:{story:"Bulk parameter editing interface for efficient parameter management."}}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-96">\r
      <CardHeader>\r
        <CardTitle className="flex items-center space-x-2">\r
          <TrendingUp className="h-5 w-5" />\r
          <span>Revenue Growth Rate</span>\r
        </CardTitle>\r
        <CardDescription>\r
          Annual revenue growth assumption for financial projections\r
        </CardDescription>\r
      </CardHeader>\r
      <CardContent className="space-y-4">\r
        <div className="space-y-2">\r
          <div className="flex justify-between items-center">\r
            <Label>Growth Rate</Label>\r
            <div className="flex items-center space-x-2">\r
              <Badge variant="secondary">15.0%</Badge>\r
              <Button variant="ghost" size="icon" className="h-6 w-6">\r
                <Settings className="h-3 w-3" />\r
              </Button>\r
            </div>\r
          </div>\r
          <Slider value={[15]} min={0} max={50} step={0.1} className="w-full" />\r
          <div className="flex justify-between text-xs text-muted-foreground">\r
            <span>0%</span>\r
            <span>25%</span>\r
            <span>50%</span>\r
          </div>\r
        </div>\r
        \r
        <div className="space-y-2">\r
          <div className="flex justify-between text-sm">\r
            <span className="text-muted-foreground">Current:</span>\r
            <span className="font-medium">15.0%</span>\r
          </div>\r
          <div className="flex justify-between text-sm">\r
            <span className="text-muted-foreground">Default:</span>\r
            <span>10.0%</span>\r
          </div>\r
          <div className="flex justify-between text-sm">\r
            <span className="text-muted-foreground">Range:</span>\r
            <span>0% - 50%</span>\r
          </div>\r
        </div>\r
\r
        <div className="pt-2 border-t">\r
          <div className="flex justify-between items-center">\r
            <span className="text-sm text-muted-foreground">Impact</span>\r
            <div className="flex items-center space-x-1">\r
              <span className="text-sm text-green-600">+$2.1M</span>\r
              <TrendingUp className="h-3 w-3 text-green-600" />\r
            </div>\r
          </div>\r
        </div>\r
      </CardContent>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'Parameter control with slider input and impact analysis.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-96">\r
      <CardHeader>\r
        <CardTitle className="flex items-center space-x-2">\r
          <Calculator className="h-5 w-5" />\r
          <span>Discount Rate</span>\r
        </CardTitle>\r
        <CardDescription>\r
          Weighted average cost of capital for valuation\r
        </CardDescription>\r
      </CardHeader>\r
      <CardContent className="space-y-4">\r
        <div className="space-y-2">\r
          <Label htmlFor="discount-rate">Rate (%)</Label>\r
          <div className="relative">\r
            <Input id="discount-rate" type="number" value="8.0" step="0.1" min="5.0" max="15.0" className="pr-8" />\r
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">\r
              %\r
            </span>\r
          </div>\r
          <p className="text-xs text-muted-foreground">\r
            Range: 5.0% - 15.0%\r
          </p>\r
        </div>\r
\r
        <div className="grid grid-cols-2 gap-4 text-sm">\r
          <div>\r
            <span className="text-muted-foreground">Current</span>\r
            <p className="font-medium">8.0%</p>\r
          </div>\r
          <div>\r
            <span className="text-muted-foreground">Default</span>\r
            <p>10.0%</p>\r
          </div>\r
        </div>\r
\r
        <div className="space-y-2">\r
          <div className="flex justify-between items-center">\r
            <span className="text-sm">Sensitivity</span>\r
            <Badge variant="outline">High</Badge>\r
          </div>\r
          <div className="text-xs text-muted-foreground">\r
            1% change = $1.5M valuation impact\r
          </div>\r
        </div>\r
      </CardContent>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'Parameter control with numeric input and sensitivity analysis.'
      }
    }
  }
}`,...u.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-full max-w-2xl">\r
      <CardHeader>\r
        <CardTitle className="flex items-center justify-between">\r
          <div className="flex items-center space-x-2">\r
            <DollarSign className="h-5 w-5" />\r
            <span>Revenue Parameters</span>\r
          </div>\r
          <div className="flex items-center space-x-2">\r
            <Badge variant="secondary">3 parameters</Badge>\r
            <Button variant="ghost" size="icon">\r
              <Settings className="h-4 w-4" />\r
            </Button>\r
          </div>\r
        </CardTitle>\r
        <CardDescription>\r
          Revenue growth assumptions and pricing parameters\r
        </CardDescription>\r
      </CardHeader>\r
      <CardContent className="space-y-6">\r
        {/* Revenue Growth */}\r
        <div className="space-y-3">\r
          <div className="flex justify-between items-center">\r
            <div>\r
              <Label className="text-sm font-medium">Revenue Growth Rate</Label>\r
              <p className="text-xs text-muted-foreground">Annual growth assumption</p>\r
            </div>\r
            <Badge variant="secondary">15.0%</Badge>\r
          </div>\r
          <Slider value={[15]} min={0} max={50} step={0.1} />\r
        </div>\r
\r
        {/* Price Elasticity */}\r
        <div className="space-y-3">\r
          <div className="flex justify-between items-center">\r
            <div>\r
              <Label className="text-sm font-medium">Price Elasticity</Label>\r
              <p className="text-xs text-muted-foreground">Demand sensitivity to price</p>\r
            </div>\r
            <Badge variant="secondary">-1.2</Badge>\r
          </div>\r
          <Slider value={[1.2]} min={0.5} max={3.0} step={0.1} />\r
        </div>\r
\r
        {/* Market Share */}\r
        <div className="space-y-3">\r
          <div className="flex justify-between items-center">\r
            <div>\r
              <Label className="text-sm font-medium">Market Share</Label>\r
              <p className="text-xs text-muted-foreground">Target market penetration</p>\r
            </div>\r
            <Badge variant="secondary">12.5%</Badge>\r
          </div>\r
          <Slider value={[12.5]} min={0} max={50} step={0.5} />\r
        </div>\r
\r
        <div className="pt-4 border-t flex justify-between items-center">\r
          <div className="text-sm">\r
            <span className="text-muted-foreground">Combined Impact:</span>\r
            <span className="ml-2 font-medium text-green-600">+$3.2M Revenue</span>\r
          </div>\r
          <div className="space-x-2">\r
            <Button variant="outline" size="sm">Reset</Button>\r
            <Button size="sm">Apply</Button>\r
          </div>\r
        </div>\r
      </CardContent>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'Parameter group with multiple related controls and combined impact.'
      }
    }
  }
}`,...x.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div className="w-full max-w-4xl space-y-4">\r
      {/* Search Header */}\r
      <Card>\r
        <CardContent className="pt-6">\r
          <div className="flex space-x-4">\r
            <div className="flex-1 relative">\r
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />\r
              <Input placeholder="Search parameters..." className="pl-10" />\r
            </div>\r
            <Select defaultValue="all">\r
              <SelectTrigger className="w-48">\r
                <SelectValue />\r
              </SelectTrigger>\r
              <SelectContent>\r
                <SelectItem value="all">All Categories</SelectItem>\r
                <SelectItem value="revenue">Revenue</SelectItem>\r
                <SelectItem value="costs">Costs</SelectItem>\r
                <SelectItem value="valuation">Valuation</SelectItem>\r
              </SelectContent>\r
            </Select>\r
            <Button variant="outline">\r
              <Edit className="mr-2 h-4 w-4" />\r
              Bulk Edit\r
            </Button>\r
          </div>\r
        </CardContent>\r
      </Card>\r
\r
      {/* Parameter List */}\r
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">\r
        {sampleParameters.map(param => <Card key={param.id}>\r
            <CardHeader className="pb-3">\r
              <div className="flex justify-between items-start">\r
                <div>\r
                  <CardTitle className="text-base">{param.name}</CardTitle>\r
                  <CardDescription className="text-sm">\r
                    {param.description}\r
                  </CardDescription>\r
                </div>\r
                <Badge variant="outline">{param.category}</Badge>\r
              </div>\r
            </CardHeader>\r
            <CardContent>\r
              <div className="space-y-3">\r
                <div className="flex justify-between items-center">\r
                  <span className="text-sm text-muted-foreground">Current Value</span>\r
                  <Badge variant="secondary">\r
                    {param.display_format === 'percentage' ? \`\${(param.value * 100).toFixed(1)}%\` : param.value}\r
                  </Badge>\r
                </div>\r
                \r
                {param.control_type === 'slider' && <Slider value={[param.value * 100]} min={param.min_value! * 100} max={param.max_value! * 100} step={param.step_size! * 100} />}\r
                \r
                {param.control_type === 'input' && <Input type="number" value={param.value} min={param.min_value} max={param.max_value} step={param.step_size} />}\r
              </div>\r
            </CardContent>\r
          </Card>)}\r
      </div>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Parameter search and filtering interface with multiple parameter types.'
      }
    }
  }
}`,...v.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-full max-w-3xl">\r
      <CardHeader>\r
        <CardTitle>Bulk Parameter Edit</CardTitle>\r
        <CardDescription>\r
          Edit multiple parameters simultaneously\r
        </CardDescription>\r
      </CardHeader>\r
      <CardContent className="space-y-6">\r
        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">\r
          <span className="text-sm font-medium">3 parameters selected</span>\r
          <div className="space-x-2">\r
            <Button variant="outline" size="sm">Select All</Button>\r
            <Button variant="outline" size="sm">Clear</Button>\r
          </div>\r
        </div>\r
\r
        <div className="space-y-4">\r
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">\r
            <div className="col-span-1">Select</div>\r
            <div className="col-span-4">Parameter</div>\r
            <div className="col-span-2">Category</div>\r
            <div className="col-span-2">Current</div>\r
            <div className="col-span-3">New Value</div>\r
          </div>\r
\r
          {sampleParameters.map(param => <div key={param.id} className="grid grid-cols-12 gap-4 items-center p-2 border rounded">\r
              <div className="col-span-1">\r
                <input type="checkbox" className="h-4 w-4" defaultChecked />\r
              </div>\r
              <div className="col-span-4">\r
                <div>\r
                  <p className="text-sm font-medium">{param.name}</p>\r
                  <p className="text-xs text-muted-foreground">{param.description}</p>\r
                </div>\r
              </div>\r
              <div className="col-span-2">\r
                <Badge variant="outline" className="text-xs">{param.category}</Badge>\r
              </div>\r
              <div className="col-span-2">\r
                <span className="text-sm">\r
                  {param.display_format === 'percentage' ? \`\${(param.value * 100).toFixed(1)}%\` : param.value}\r
                </span>\r
              </div>\r
              <div className="col-span-3">\r
                <Input type="number" defaultValue={param.value} min={param.min_value} max={param.max_value} step={param.step_size} className="h-8" />\r
              </div>\r
            </div>)}\r
        </div>\r
\r
        <div className="flex justify-between items-center pt-4 border-t">\r
          <div className="text-sm text-muted-foreground">\r
            Changes will update 3 parameters\r
          </div>\r
          <div className="space-x-2">\r
            <Button variant="outline">Preview Changes</Button>\r
            <Button>Apply All</Button>\r
          </div>\r
        </div>\r
      </CardContent>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'Bulk parameter editing interface for efficient parameter management.'
      }
    }
  }
}`,...h.parameters?.docs?.source}}};const ee=["ParameterSlider","ParameterInput","ParameterGroupExample","ParameterSearchExample","BulkEditExample"];export{h as BulkEditExample,x as ParameterGroupExample,u as ParameterInput,v as ParameterSearchExample,p as ParameterSlider,ee as __namedExportsOrder,Z as default};
