import{j as e}from"./radix-components-d49c0090.js";import{B as t,C as x,a as p,b as v,c as g}from"./Card-e924d6de.js";import{o as n,z as f,p as B,M as j,b as h,s as N,g as y,q as m,f as b,r as S,j as I,k as w,I as z,D as C,T as D,i as A,F as P,G as T}from"./ui-components-6f35ab38.js";import"./storybook-vendor-bdd8b375.js";import"./cn-b168998f.js";const R={title:"🎨 Design System/Components/Button",component:t,parameters:{layout:"padded",docs:{description:{component:`
# Button Component

A versatile button component built with modern design principles and comprehensive accessibility support. The Button component is the primary interaction element in the FinVision design system.

## Key Features

- **🎨 Multiple Variants**: Default, secondary, outline, ghost, link, and semantic variants
- **📏 Flexible Sizing**: XS, SM, MD, LG, XL sizes with icon-only options
- **⚡ Interactive States**: Loading, disabled, hover, focus, and active states
- **🎯 Icon Support**: Left/right icons with automatic sizing and spacing
- **♿ Accessibility**: Full keyboard navigation and screen reader support
- **🎭 Polymorphic**: Can render as any element using the \`asChild\` prop
- **🎨 Design System**: Consistent with design tokens and theming

## Usage

\`\`\`tsx
import { Button } from '@/design-system';

// Basic usage
<Button>Click me</Button>

// With variants and sizes
<Button variant="outline" size="lg">
  Large Outline Button
</Button>

// With icons
<Button leftIcon={<Plus />} rightIcon={<ArrowRight />}>
  Add Item
</Button>

// Loading state
<Button loading>Processing...</Button>

// Icon only
<Button size="icon" variant="outline">
  <Settings />
</Button>
\`\`\`

## Design Principles

1. **Consistency**: All buttons follow the same design patterns
2. **Clarity**: Clear visual hierarchy and purpose
3. **Feedback**: Immediate visual feedback for all interactions
4. **Accessibility**: Inclusive design for all users
5. **Performance**: Optimized rendering and minimal bundle impact
        `}}},argTypes:{variant:{control:"select",options:["default","secondary","outline","ghost","link","destructive","success","warning","info"],description:"Visual style variant",table:{type:{summary:"string"},defaultValue:{summary:"default"}}},size:{control:"select",options:["xs","sm","md","lg","xl"],description:"Size variant",table:{type:{summary:"string"},defaultValue:{summary:"md"}}},loading:{control:"boolean",description:"Show loading spinner and disable interaction",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},disabled:{control:"boolean",description:"Disable button interaction",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}},leftIcon:{control:!1,description:"Icon to display before the button text",table:{type:{summary:"ReactNode"}}},rightIcon:{control:!1,description:"Icon to display after the button text",table:{type:{summary:"ReactNode"}}},asChild:{control:"boolean",description:"Render as child element (polymorphic)",table:{type:{summary:"boolean"},defaultValue:{summary:"false"}}}},tags:["autodocs"]},a={args:{children:"Button"}},s={render:()=>e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Button Variants"}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(t,{variant:"default",children:"Default"}),e.jsx(t,{variant:"secondary",children:"Secondary"}),e.jsx(t,{variant:"outline",children:"Outline"}),e.jsx(t,{variant:"ghost",children:"Ghost"}),e.jsx(t,{variant:"link",children:"Link"}),e.jsx(t,{variant:"destructive",children:"Destructive"}),e.jsx(t,{variant:"success",children:"Success"}),e.jsx(t,{variant:"warning",children:"Warning"}),e.jsx(t,{variant:"info",children:"Info"})]})]})})},r={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Button Sizes"}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(t,{size:"xs",children:"Extra Small"}),e.jsx(t,{size:"sm",children:"Small"}),e.jsx(t,{size:"md",children:"Medium"}),e.jsx(t,{size:"lg",children:"Large"}),e.jsx(t,{size:"xl",children:"Extra Large"})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Icon Button Sizes"}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(t,{size:"icon",variant:"outline",children:e.jsx(n,{className:"size-3"})}),e.jsx(t,{size:"icon",variant:"outline",children:e.jsx(n,{className:"size-4"})}),e.jsx(t,{size:"icon",variant:"outline",children:e.jsx(n,{className:"size-4"})}),e.jsx(t,{size:"icon",variant:"outline",children:e.jsx(n,{className:"size-5"})}),e.jsx(t,{size:"icon",variant:"outline",children:e.jsx(n,{className:"size-6"})})]})]})]})},i={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Buttons with Icons"}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(t,{leftIcon:e.jsx(n,{}),children:"Add Item"}),e.jsx(t,{rightIcon:e.jsx(f,{}),children:"Continue"}),e.jsx(t,{leftIcon:e.jsx(B,{}),rightIcon:e.jsx(f,{}),children:"Download & Install"}),e.jsx(t,{leftIcon:e.jsx(j,{}),children:"Send Email"}),e.jsx(t,{leftIcon:e.jsx(h,{}),children:"Settings"}),e.jsx(t,{leftIcon:e.jsx(N,{}),children:"Profile"})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Icon Only Buttons"}),e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(t,{size:"icon",variant:"outline","aria-label":"Add item",children:e.jsx(n,{})}),e.jsx(t,{size:"icon",variant:"outline","aria-label":"Edit",children:e.jsx(y,{})}),e.jsx(t,{size:"icon",variant:"outline","aria-label":"Delete",children:e.jsx(m,{})}),e.jsx(t,{size:"icon",variant:"outline","aria-label":"Search",children:e.jsx(b,{})}),e.jsx(t,{size:"icon",variant:"outline","aria-label":"Settings",children:e.jsx(h,{})}),e.jsx(t,{size:"icon",variant:"outline","aria-label":"More options",children:e.jsx(S,{})})]})]})]})},l={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Button States"}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(t,{children:"Normal"}),e.jsx(t,{disabled:!0,children:"Disabled"}),e.jsx(t,{loading:!0,children:"Loading"}),e.jsx(t,{variant:"outline",disabled:!0,children:"Disabled Outline"}),e.jsx(t,{variant:"ghost",loading:!0,children:"Loading Ghost"})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Interactive States"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Hover, focus, and active states are automatically handled by the component."}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(t,{variant:"outline",children:"Hover me"}),e.jsx(t,{variant:"ghost",children:"Focus me"}),e.jsx(t,{variant:"secondary",children:"Click me"})]})]})]})},o={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Semantic Variants"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Use semantic variants to convey meaning through color and styling."}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(t,{variant:"success",leftIcon:e.jsx(I,{}),children:"Success Action"}),e.jsx(t,{variant:"warning",leftIcon:e.jsx(w,{}),children:"Warning Action"}),e.jsx(t,{variant:"destructive",leftIcon:e.jsx(m,{}),children:"Delete Item"}),e.jsx(t,{variant:"info",leftIcon:e.jsx(z,{}),children:"Information"})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Contextual Usage"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs(x,{children:[e.jsx(p,{children:e.jsxs(v,{className:"flex items-center gap-2",children:[e.jsx(C,{className:"size-5"}),"Financial Action"]})}),e.jsxs(g,{className:"space-y-3",children:[e.jsx(t,{variant:"success",className:"w-full",leftIcon:e.jsx(D,{}),children:"Approve Transaction"}),e.jsx(t,{variant:"outline",className:"w-full",leftIcon:e.jsx(A,{}),children:"View Details"})]})]}),e.jsxs(x,{children:[e.jsx(p,{children:e.jsxs(v,{className:"flex items-center gap-2",children:[e.jsx(P,{className:"size-5"}),"Document Action"]})}),e.jsxs(g,{className:"space-y-3",children:[e.jsx(t,{variant:"default",className:"w-full",leftIcon:e.jsx(B,{}),children:"Download Report"}),e.jsx(t,{variant:"destructive",className:"w-full",leftIcon:e.jsx(m,{}),children:"Delete Document"})]})]})]})]})]})},c={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Loading States"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Loading states automatically show a spinner and disable interaction."}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(t,{loading:!0,children:"Processing..."}),e.jsx(t,{variant:"outline",loading:!0,children:"Loading..."}),e.jsx(t,{variant:"ghost",loading:!0,children:"Please wait..."}),e.jsx(t,{size:"icon",loading:!0,children:e.jsx(h,{})})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Interactive Example"}),e.jsxs("div",{className:"space-y-3",children:[e.jsx(t,{onClick:()=>alert("Button clicked!"),leftIcon:e.jsx(T,{}),children:"Start Process"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Click the button above to see the interaction. In a real application, you would typically manage the loading state with React state."})]})]})]})},d={render:()=>e.jsx("div",{className:"space-y-6",children:e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Polymorphic Buttons"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Use the \\`asChild\\` prop to render buttons as different elements while maintaining styling."}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(t,{asChild:!0,children:e.jsx("a",{href:"#polymorphic",children:"Link Button"})}),e.jsx(t,{asChild:!0,variant:"outline",children:e.jsx("button",{type:"submit",children:"Submit Button"})}),e.jsx(t,{asChild:!0,variant:"ghost",children:e.jsx("span",{children:"Span Button"})})]})]})})},u={render:()=>e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Accessibility Features"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"All buttons include proper accessibility attributes and keyboard navigation."}),e.jsxs("div",{className:"space-y-3",children:[e.jsx(t,{"aria-label":"Add new item to the list",children:e.jsx(n,{})}),e.jsx(t,{"aria-describedby":"delete-description",children:e.jsx(m,{})}),e.jsx("p",{id:"delete-description",className:"text-sm text-muted-foreground",children:"This will permanently delete the selected item"})]})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsx("h3",{className:"text-lg font-semibold",children:"Keyboard Navigation"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:"Try using Tab to navigate between buttons and Enter/Space to activate them."}),e.jsxs("div",{className:"flex flex-wrap gap-3",children:[e.jsx(t,{variant:"outline",children:"First Button"}),e.jsx(t,{variant:"outline",children:"Second Button"}),e.jsx(t,{variant:"outline",children:"Third Button"})]})]})]})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Button'
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">\r
      <div className="space-y-4">\r
        <h3 className="text-lg font-semibold">Button Variants</h3>\r
        <div className="flex flex-wrap gap-3">\r
          <Button variant="default">Default</Button>\r
          <Button variant="secondary">Secondary</Button>\r
          <Button variant="outline">Outline</Button>\r
          <Button variant="ghost">Ghost</Button>\r
          <Button variant="link">Link</Button>\r
          <Button variant="destructive">Destructive</Button>\r
          <Button variant="success">Success</Button>\r
          <Button variant="warning">Warning</Button>\r
          <Button variant="info">Info</Button>\r
        </div>\r
      </div>\r
    </div>
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">\r
      <div className="space-y-4">\r
        <h3 className="text-lg font-semibold">Button Sizes</h3>\r
        <div className="flex items-center gap-3">\r
          <Button size="xs">Extra Small</Button>\r
          <Button size="sm">Small</Button>\r
          <Button size="md">Medium</Button>\r
          <Button size="lg">Large</Button>\r
          <Button size="xl">Extra Large</Button>\r
        </div>\r
      </div>\r
\r
      <div className="space-y-4">\r
        <h3 className="text-lg font-semibold">Icon Button Sizes</h3>\r
        <div className="flex items-center gap-3">\r
          <Button size="icon" variant="outline">\r
            <Plus className="size-3" />\r
          </Button>\r
          <Button size="icon" variant="outline">\r
            <Plus className="size-4" />\r
          </Button>\r
          <Button size="icon" variant="outline">\r
            <Plus className="size-4" />\r
          </Button>\r
          <Button size="icon" variant="outline">\r
            <Plus className="size-5" />\r
          </Button>\r
          <Button size="icon" variant="outline">\r
            <Plus className="size-6" />\r
          </Button>\r
        </div>\r
      </div>\r
    </div>
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">\r
      <div className="space-y-4">\r
        <h3 className="text-lg font-semibold">Buttons with Icons</h3>\r
        <div className="flex flex-wrap gap-3">\r
          <Button leftIcon={<Plus />}>Add Item</Button>\r
          <Button rightIcon={<ArrowRight />}>Continue</Button>\r
          <Button leftIcon={<Download />} rightIcon={<ArrowRight />}>\r
            Download & Install\r
          </Button>\r
          <Button leftIcon={<Mail />}>Send Email</Button>\r
          <Button leftIcon={<Settings />}>Settings</Button>\r
          <Button leftIcon={<User />}>Profile</Button>\r
        </div>\r
      </div>\r
\r
      <div className="space-y-4">\r
        <h3 className="text-lg font-semibold">Icon Only Buttons</h3>\r
        <div className="flex items-center gap-3">\r
          <Button size="icon" variant="outline" aria-label="Add item">\r
            <Plus />\r
          </Button>\r
          <Button size="icon" variant="outline" aria-label="Edit">\r
            <Edit />\r
          </Button>\r
          <Button size="icon" variant="outline" aria-label="Delete">\r
            <Trash2 />\r
          </Button>\r
          <Button size="icon" variant="outline" aria-label="Search">\r
            <Search />\r
          </Button>\r
          <Button size="icon" variant="outline" aria-label="Settings">\r
            <Settings />\r
          </Button>\r
          <Button size="icon" variant="outline" aria-label="More options">\r
            <MoreHorizontal />\r
          </Button>\r
        </div>\r
      </div>\r
    </div>
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">\r
      <div className="space-y-4">\r
        <h3 className="text-lg font-semibold">Button States</h3>\r
        <div className="flex flex-wrap gap-3">\r
          <Button>Normal</Button>\r
          <Button disabled>Disabled</Button>\r
          <Button loading>Loading</Button>\r
          <Button variant="outline" disabled>\r
            Disabled Outline\r
          </Button>\r
          <Button variant="ghost" loading>\r
            Loading Ghost\r
          </Button>\r
        </div>\r
      </div>\r
\r
      <div className="space-y-4">\r
        <h3 className="text-lg font-semibold">Interactive States</h3>\r
        <p className="text-sm text-muted-foreground">\r
          Hover, focus, and active states are automatically handled by the\r
          component.\r
        </p>\r
        <div className="flex flex-wrap gap-3">\r
          <Button variant="outline">Hover me</Button>\r
          <Button variant="ghost">Focus me</Button>\r
          <Button variant="secondary">Click me</Button>\r
        </div>\r
      </div>\r
    </div>
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">\r
      <div className="space-y-4">\r
        <h3 className="text-lg font-semibold">Semantic Variants</h3>\r
        <p className="text-sm text-muted-foreground">\r
          Use semantic variants to convey meaning through color and styling.\r
        </p>\r
        <div className="flex flex-wrap gap-3">\r
          <Button variant="success" leftIcon={<CheckCircle />}>\r
            Success Action\r
          </Button>\r
          <Button variant="warning" leftIcon={<AlertTriangle />}>\r
            Warning Action\r
          </Button>\r
          <Button variant="destructive" leftIcon={<Trash2 />}>\r
            Delete Item\r
          </Button>\r
          <Button variant="info" leftIcon={<Info />}>\r
            Information\r
          </Button>\r
        </div>\r
      </div>\r
\r
      <div className="space-y-4">\r
        <h3 className="text-lg font-semibold">Contextual Usage</h3>\r
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">\r
          <Card>\r
            <CardHeader>\r
              <CardTitle className="flex items-center gap-2">\r
                <DollarSign className="size-5" />\r
                Financial Action\r
              </CardTitle>\r
            </CardHeader>\r
            <CardContent className="space-y-3">\r
              <Button variant="success" className="w-full" leftIcon={<TrendingUp />}>\r
                Approve Transaction\r
              </Button>\r
              <Button variant="outline" className="w-full" leftIcon={<Eye />}>\r
                View Details\r
              </Button>\r
            </CardContent>\r
          </Card>\r
\r
          <Card>\r
            <CardHeader>\r
              <CardTitle className="flex items-center gap-2">\r
                <FileText className="size-5" />\r
                Document Action\r
              </CardTitle>\r
            </CardHeader>\r
            <CardContent className="space-y-3">\r
              <Button variant="default" className="w-full" leftIcon={<Download />}>\r
                Download Report\r
              </Button>\r
              <Button variant="destructive" className="w-full" leftIcon={<Trash2 />}>\r
                Delete Document\r
              </Button>\r
            </CardContent>\r
          </Card>\r
        </div>\r
      </div>\r
    </div>
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">\r
      <div className="space-y-4">\r
        <h3 className="text-lg font-semibold">Loading States</h3>\r
        <p className="text-sm text-muted-foreground">\r
          Loading states automatically show a spinner and disable interaction.\r
        </p>\r
        <div className="flex flex-wrap gap-3">\r
          <Button loading>Processing...</Button>\r
          <Button variant="outline" loading>\r
            Loading...\r
          </Button>\r
          <Button variant="ghost" loading>\r
            Please wait...\r
          </Button>\r
          <Button size="icon" loading>\r
            <Settings />\r
          </Button>\r
        </div>\r
      </div>\r
\r
      <div className="space-y-4">\r
        <h3 className="text-lg font-semibold">Interactive Example</h3>\r
        <div className="space-y-3">\r
          <Button onClick={() => alert('Button clicked!')} leftIcon={<Play />}>\r
            Start Process\r
          </Button>\r
          <p className="text-sm text-muted-foreground">\r
            Click the button above to see the interaction. In a real\r
            application, you would typically manage the loading state with React\r
            state.\r
          </p>\r
        </div>\r
      </div>\r
    </div>
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">\r
      <div className="space-y-4">\r
        <h3 className="text-lg font-semibold">Polymorphic Buttons</h3>\r
        <p className="text-sm text-muted-foreground">\r
          Use the \\\`asChild\\\` prop to render buttons as different elements while\r
          maintaining styling.\r
        </p>\r
        <div className="flex flex-wrap gap-3">\r
          <Button asChild>\r
            <a href="#polymorphic">Link Button</a>\r
          </Button>\r
          <Button asChild variant="outline">\r
            <button type="submit">Submit Button</button>\r
          </Button>\r
          <Button asChild variant="ghost">\r
            <span>Span Button</span>\r
          </Button>\r
        </div>\r
      </div>\r
    </div>
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-6">\r
      <div className="space-y-4">\r
        <h3 className="text-lg font-semibold">Accessibility Features</h3>\r
        <p className="text-sm text-muted-foreground">\r
          All buttons include proper accessibility attributes and keyboard\r
          navigation.\r
        </p>\r
        <div className="space-y-3">\r
          <Button aria-label="Add new item to the list">\r
            <Plus />\r
          </Button>\r
          <Button aria-describedby="delete-description">\r
            <Trash2 />\r
          </Button>\r
          <p id="delete-description" className="text-sm text-muted-foreground">\r
            This will permanently delete the selected item\r
          </p>\r
        </div>\r
      </div>\r
\r
      <div className="space-y-4">\r
        <h3 className="text-lg font-semibold">Keyboard Navigation</h3>\r
        <p className="text-sm text-muted-foreground">\r
          Try using Tab to navigate between buttons and Enter/Space to activate\r
          them.\r
        </p>\r
        <div className="flex flex-wrap gap-3">\r
          <Button variant="outline">First Button</Button>\r
          <Button variant="outline">Second Button</Button>\r
          <Button variant="outline">Third Button</Button>\r
        </div>\r
      </div>\r
    </div>
}`,...u.parameters?.docs?.source}}};const M=["Default","Variants","Sizes","WithIcons","States","SemanticVariants","LoadingStates","Polymorphic","Accessibility"];export{u as Accessibility,a as Default,c as LoadingStates,d as Polymorphic,o as SemanticVariants,r as Sizes,l as States,s as Variants,i as WithIcons,M as __namedExportsOrder,R as default};
