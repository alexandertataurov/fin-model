import{j as e}from"./radix-components-d49c0090.js";import{R as c}from"./storybook-vendor-bdd8b375.js";import{C as m,a as l,b as g,d as p}from"./card-5ec16762.js";import{B as i}from"./button-9be8cea8.js";import{B as u}from"./badge-779ce428.js";import"./utils-b168998f.js";import"./ui-components-6f35ab38.js";import"./cn-b168998f.js";const A={title:"🧪 Performance Tests",parameters:{layout:"padded",docs:{description:{component:"Performance testing stories for measuring component rendering and interaction performance."}}},tags:["autodocs","performance"]},n={render:()=>e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",children:Array.from({length:20},(o,s)=>e.jsxs(m,{className:"hover:shadow-lg transition-shadow",children:[e.jsx(l,{children:e.jsxs(g,{className:"flex items-center justify-between",children:["Component ",s+1,e.jsx(u,{variant:"secondary",children:s+1})]})}),e.jsx(p,{children:e.jsxs(i,{size:"sm",className:"w-full",children:["Action ",s+1]})})]},s))})},a={render:()=>{const[o,s]=c.useState(0),[h,d]=c.useState(Array.from({length:10},(r,t)=>t)),C=()=>{d(r=>[...r,r.length]),s(r=>r+1)},v=r=>{d(t=>t.filter((f,x)=>x!==r)),s(t=>t-1)};return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(i,{onClick:C,children:"Add Item"}),e.jsxs(u,{children:["Count: ",o]})]}),e.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",children:h.map((r,t)=>e.jsxs(m,{className:"hover:shadow-lg transition-shadow",children:[e.jsx(l,{children:e.jsxs(g,{className:"flex items-center justify-between",children:["Item ",r,e.jsx(i,{size:"sm",variant:"destructive",onClick:()=>v(t),children:"Remove"})]})}),e.jsx(p,{children:e.jsxs("p",{className:"text-sm text-muted-foreground",children:["This is item number ",r," for performance testing"]})})]},r))})]})}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">\r
      {Array.from({
      length: 20
    }, (_, i) => <Card key={i} className="hover:shadow-lg transition-shadow">\r
          <CardHeader>\r
            <CardTitle className="flex items-center justify-between">\r
              Component {i + 1}\r
              <Badge variant="secondary">{i + 1}</Badge>\r
            </CardTitle>\r
          </CardHeader>\r
          <CardContent>\r
            <Button size="sm" className="w-full">\r
              Action {i + 1}\r
            </Button>\r
          </CardContent>\r
        </Card>)}\r
    </div>
}`,...n.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [count, setCount] = React.useState(0);
    const [items, setItems] = React.useState(Array.from({
      length: 10
    }, (_, i) => i));
    const addItem = () => {
      setItems(prev => [...prev, prev.length]);
      setCount(prev => prev + 1);
    };
    const removeItem = (index: number) => {
      setItems(prev => prev.filter((_, i) => i !== index));
      setCount(prev => prev - 1);
    };
    return <div className="space-y-4">\r
        <div className="flex items-center gap-4">\r
          <Button onClick={addItem}>Add Item</Button>\r
          <Badge>Count: {count}</Badge>\r
        </div>\r
        \r
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">\r
          {items.map((item, index) => <Card key={item} className="hover:shadow-lg transition-shadow">\r
              <CardHeader>\r
                <CardTitle className="flex items-center justify-between">\r
                  Item {item}\r
                  <Button size="sm" variant="destructive" onClick={() => removeItem(index)}>\r
                    Remove\r
                  </Button>\r
                </CardTitle>\r
              </CardHeader>\r
              <CardContent>\r
                <p className="text-sm text-muted-foreground">\r
                  This is item number {item} for performance testing\r
                </p>\r
              </CardContent>\r
            </Card>)}\r
        </div>\r
      </div>;
  }
}`,...a.parameters?.docs?.source}}};const _=["LargeGrid","InteractiveTest"];export{a as InteractiveTest,n as LargeGrid,_ as __namedExportsOrder,A as default};
