import{j as e}from"./jsx-runtime-22eea9ba.js";import{A as r,a,b as s}from"./alert-990e9590.js";import{B as f}from"./button-df58ecc4.js";import{C as w,a as v,b as g,d as j}from"./card-b5d2c5ab.js";import{I as i,j as n,k as t,l,T as y,D as N}from"./ui-components-36f6f75d.js";import"./storybook-vendor-bdd8b375.js";import"./utils-bbd425d4.js";import"./index-fa2897fa.js";import"./cn-bbd425d4.js";const M={title:"🧩 UI Components/Alert",component:r,parameters:{layout:"centered",docs:{description:{component:`
# Alert Component

The Alert component provides contextual feedback messages with semantic styling. Built on design tokens for consistent theming across the FinVision platform.

## Key Features

- **Semantic Variants**: Success, warning, error, info, and default states
- **Accessibility**: Proper ARIA roles and attributes
- **Icon Integration**: Built-in support for status icons
- **Design System Integration**: Uses semantic colors from design tokens
- **Responsive**: Adapts to container width

## Usage in FinVision

- **Authentication**: Login/logout status messages
- **Data Processing**: Import/export status updates
- **Model Validation**: Parameter validation feedback
- **System Notifications**: General system status messages
        `}}},argTypes:{variant:{control:"select",options:["default","destructive","success","warning","info"],description:"Visual style variant"}},tags:["autodocs"]},c={render:()=>e.jsxs(r,{className:"w-96",children:[e.jsx(i,{className:"h-4 w-4"}),e.jsx(a,{children:"Information"}),e.jsx(s,{children:"This is a default alert with neutral styling."})]})},o={render:()=>e.jsxs("div",{className:"space-y-4 w-96",children:[e.jsxs(r,{children:[e.jsx(i,{className:"h-4 w-4"}),e.jsx(a,{children:"Default Alert"}),e.jsx(s,{children:"This is a default alert with neutral styling."})]}),e.jsxs(r,{variant:"success",children:[e.jsx(n,{className:"h-4 w-4"}),e.jsx(a,{children:"Success"}),e.jsx(s,{children:"Your operation completed successfully."})]}),e.jsxs(r,{variant:"warning",children:[e.jsx(t,{className:"h-4 w-4"}),e.jsx(a,{children:"Warning"}),e.jsx(s,{children:"Please review the following before proceeding."})]}),e.jsxs(r,{variant:"destructive",children:[e.jsx(l,{className:"h-4 w-4"}),e.jsx(a,{children:"Error"}),e.jsx(s,{children:"An error occurred while processing your request."})]}),e.jsxs(r,{variant:"info",children:[e.jsx(i,{className:"h-4 w-4"}),e.jsx(a,{children:"Information"}),e.jsx(s,{children:"Here's some helpful information for you."})]})]}),parameters:{docs:{description:{story:"All available alert variants with their semantic styling."}}}},d={render:()=>e.jsxs("div",{className:"space-y-4 w-96",children:[e.jsxs(r,{variant:"success",children:[e.jsx(n,{className:"h-4 w-4"}),e.jsx(s,{children:"Model calculations completed successfully."})]}),e.jsxs(r,{variant:"warning",children:[e.jsx(t,{className:"h-4 w-4"}),e.jsx(s,{children:"Some parameters may need adjustment for optimal results."})]}),e.jsxs(r,{variant:"destructive",children:[e.jsx(l,{className:"h-4 w-4"}),e.jsx(s,{children:"Connection to the data source failed. Please try again."})]})]}),parameters:{docs:{description:{story:"Alerts without titles for simpler messaging."}}}},m={render:()=>e.jsxs("div",{className:"space-y-4 w-96",children:[e.jsxs(r,{variant:"success",children:[e.jsx(n,{className:"h-4 w-4"}),e.jsx(a,{children:"Login Successful"}),e.jsx(s,{children:"Welcome back! You have been successfully logged in."})]}),e.jsxs(r,{variant:"destructive",children:[e.jsx(l,{className:"h-4 w-4"}),e.jsx(a,{children:"Login Failed"}),e.jsx(s,{children:"Invalid email or password. Please check your credentials and try again."})]}),e.jsxs(r,{variant:"warning",children:[e.jsx(t,{className:"h-4 w-4"}),e.jsx(a,{children:"Session Expiring"}),e.jsx(s,{children:"Your session will expire in 5 minutes. Please save your work."})]})]}),parameters:{docs:{description:{story:"Alert examples from authentication flows."}}}},p={render:()=>e.jsxs("div",{className:"space-y-4 w-96",children:[e.jsxs(r,{variant:"info",children:[e.jsx(i,{className:"h-4 w-4"}),e.jsx(a,{children:"Data Import In Progress"}),e.jsx(s,{children:"Processing 1,247 financial records. This may take a few minutes."})]}),e.jsxs(r,{variant:"success",children:[e.jsx(n,{className:"h-4 w-4"}),e.jsx(a,{children:"Export Complete"}),e.jsx(s,{children:"Your financial report has been exported successfully. Check your downloads folder."})]}),e.jsxs(r,{variant:"warning",children:[e.jsx(t,{className:"h-4 w-4"}),e.jsx(a,{children:"Data Quality Issues"}),e.jsx(s,{children:"23 records contain missing or invalid data. Review before proceeding."})]}),e.jsxs(r,{variant:"destructive",children:[e.jsx(l,{className:"h-4 w-4"}),e.jsx(a,{children:"Import Failed"}),e.jsx(s,{children:"Unable to process the uploaded file. Please check the format and try again."})]})]}),parameters:{docs:{description:{story:"Alert examples from data import/export processes."}}}},h={render:()=>e.jsxs("div",{className:"space-y-4 w-96",children:[e.jsxs(r,{variant:"success",children:[e.jsx(y,{className:"h-4 w-4"}),e.jsx(a,{children:"Model Validation Passed"}),e.jsx(s,{children:"All parameters are within acceptable ranges. Model is ready for analysis."})]}),e.jsxs(r,{variant:"warning",children:[e.jsx(t,{className:"h-4 w-4"}),e.jsx(a,{children:"Parameter Warning"}),e.jsx(s,{children:"Growth rate of 45% seems unusually high. Please verify this assumption."})]}),e.jsxs(r,{variant:"destructive",children:[e.jsx(l,{className:"h-4 w-4"}),e.jsx(a,{children:"Validation Error"}),e.jsx(s,{children:"Discount rate cannot be higher than growth rate. Please adjust parameters."})]}),e.jsxs(r,{variant:"info",children:[e.jsx(N,{className:"h-4 w-4"}),e.jsx(a,{children:"Calculation Note"}),e.jsx(s,{children:"Using industry average EBITDA margin of 15% for missing data points."})]})]}),parameters:{docs:{description:{story:"Alert examples from financial model validation."}}}},u={render:()=>e.jsxs("div",{className:"space-y-4 w-96",children:[e.jsxs(r,{variant:"warning",children:[e.jsx(t,{className:"h-4 w-4"}),e.jsx(a,{children:"Unsaved Changes"}),e.jsxs(s,{className:"flex flex-col gap-2",children:[e.jsx("span",{children:"You have unsaved changes in your financial model."}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(f,{size:"sm",variant:"outline",children:"Save Changes"}),e.jsx(f,{size:"sm",variant:"ghost",children:"Discard"})]})]})]}),e.jsxs(r,{variant:"info",children:[e.jsx(i,{className:"h-4 w-4"}),e.jsx(a,{children:"New Feature Available"}),e.jsxs(s,{className:"flex flex-col gap-2",children:[e.jsx("span",{children:"Try our new Monte Carlo simulation feature for risk analysis."}),e.jsx(f,{size:"sm",variant:"outline",children:"Learn More"})]})]})]}),parameters:{docs:{description:{story:"Alerts with interactive elements like buttons."}}}},A={render:()=>e.jsxs(w,{className:"w-96",children:[e.jsx(v,{children:e.jsx(g,{children:"Financial Model Parameters"})}),e.jsxs(j,{className:"space-y-4",children:[e.jsxs(r,{variant:"info",children:[e.jsx(i,{className:"h-4 w-4"}),e.jsx(s,{children:"Enter your financial assumptions below. All values should be in USD."})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("label",{className:"text-sm font-medium",children:"Revenue Growth Rate (%)"}),e.jsx("input",{className:"w-full px-3 py-2 border rounded-md",placeholder:"15.0"})]}),e.jsxs(r,{variant:"warning",children:[e.jsx(t,{className:"h-4 w-4"}),e.jsx(s,{children:"Growth rates above 30% should be carefully justified."})]}),e.jsx(f,{className:"w-full",children:"Calculate Model"})]})]}),parameters:{docs:{description:{story:"Alert used in context within a form interface."}}}},x={render:()=>e.jsxs("div",{className:"space-y-2 w-96",children:[e.jsxs(r,{className:"py-2",children:[e.jsx(n,{className:"h-4 w-4"}),e.jsx(s,{className:"text-sm",children:"Data saved successfully"})]}),e.jsxs(r,{variant:"warning",className:"py-2",children:[e.jsx(t,{className:"h-4 w-4"}),e.jsx(s,{className:"text-sm",children:"Connection unstable"})]}),e.jsxs(r,{variant:"destructive",className:"py-2",children:[e.jsx(l,{className:"h-4 w-4"}),e.jsx(s,{className:"text-sm",children:"Processing failed"})]})]}),parameters:{docs:{description:{story:"Compact alerts for toast-like notifications."}}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <Alert className="w-96">\r
      <Info className="h-4 w-4" />\r
      <AlertTitle>Information</AlertTitle>\r
      <AlertDescription>\r
        This is a default alert with neutral styling.\r
      </AlertDescription>\r
    </Alert>
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-96">\r
      <Alert>\r
        <Info className="h-4 w-4" />\r
        <AlertTitle>Default Alert</AlertTitle>\r
        <AlertDescription>\r
          This is a default alert with neutral styling.\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="success">\r
        <CheckCircle className="h-4 w-4" />\r
        <AlertTitle>Success</AlertTitle>\r
        <AlertDescription>\r
          Your operation completed successfully.\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="warning">\r
        <AlertTriangle className="h-4 w-4" />\r
        <AlertTitle>Warning</AlertTitle>\r
        <AlertDescription>\r
          Please review the following before proceeding.\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="destructive">\r
        <XCircle className="h-4 w-4" />\r
        <AlertTitle>Error</AlertTitle>\r
        <AlertDescription>\r
          An error occurred while processing your request.\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="info">\r
        <Info className="h-4 w-4" />\r
        <AlertTitle>Information</AlertTitle>\r
        <AlertDescription>\r
          Here's some helpful information for you.\r
        </AlertDescription>\r
      </Alert>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'All available alert variants with their semantic styling.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-96">\r
      <Alert variant="success">\r
        <CheckCircle className="h-4 w-4" />\r
        <AlertDescription>\r
          Model calculations completed successfully.\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="warning">\r
        <AlertTriangle className="h-4 w-4" />\r
        <AlertDescription>\r
          Some parameters may need adjustment for optimal results.\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="destructive">\r
        <XCircle className="h-4 w-4" />\r
        <AlertDescription>\r
          Connection to the data source failed. Please try again.\r
        </AlertDescription>\r
      </Alert>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Alerts without titles for simpler messaging.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-96">\r
      <Alert variant="success">\r
        <CheckCircle className="h-4 w-4" />\r
        <AlertTitle>Login Successful</AlertTitle>\r
        <AlertDescription>\r
          Welcome back! You have been successfully logged in.\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="destructive">\r
        <XCircle className="h-4 w-4" />\r
        <AlertTitle>Login Failed</AlertTitle>\r
        <AlertDescription>\r
          Invalid email or password. Please check your credentials and try again.\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="warning">\r
        <AlertTriangle className="h-4 w-4" />\r
        <AlertTitle>Session Expiring</AlertTitle>\r
        <AlertDescription>\r
          Your session will expire in 5 minutes. Please save your work.\r
        </AlertDescription>\r
      </Alert>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Alert examples from authentication flows.'
      }
    }
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-96">\r
      <Alert variant="info">\r
        <Info className="h-4 w-4" />\r
        <AlertTitle>Data Import In Progress</AlertTitle>\r
        <AlertDescription>\r
          Processing 1,247 financial records. This may take a few minutes.\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="success">\r
        <CheckCircle className="h-4 w-4" />\r
        <AlertTitle>Export Complete</AlertTitle>\r
        <AlertDescription>\r
          Your financial report has been exported successfully. Check your downloads folder.\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="warning">\r
        <AlertTriangle className="h-4 w-4" />\r
        <AlertTitle>Data Quality Issues</AlertTitle>\r
        <AlertDescription>\r
          23 records contain missing or invalid data. Review before proceeding.\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="destructive">\r
        <XCircle className="h-4 w-4" />\r
        <AlertTitle>Import Failed</AlertTitle>\r
        <AlertDescription>\r
          Unable to process the uploaded file. Please check the format and try again.\r
        </AlertDescription>\r
      </Alert>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Alert examples from data import/export processes.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-96">\r
      <Alert variant="success">\r
        <TrendingUp className="h-4 w-4" />\r
        <AlertTitle>Model Validation Passed</AlertTitle>\r
        <AlertDescription>\r
          All parameters are within acceptable ranges. Model is ready for analysis.\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="warning">\r
        <AlertTriangle className="h-4 w-4" />\r
        <AlertTitle>Parameter Warning</AlertTitle>\r
        <AlertDescription>\r
          Growth rate of 45% seems unusually high. Please verify this assumption.\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="destructive">\r
        <XCircle className="h-4 w-4" />\r
        <AlertTitle>Validation Error</AlertTitle>\r
        <AlertDescription>\r
          Discount rate cannot be higher than growth rate. Please adjust parameters.\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="info">\r
        <DollarSign className="h-4 w-4" />\r
        <AlertTitle>Calculation Note</AlertTitle>\r
        <AlertDescription>\r
          Using industry average EBITDA margin of 15% for missing data points.\r
        </AlertDescription>\r
      </Alert>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Alert examples from financial model validation.'
      }
    }
  }
}`,...h.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-4 w-96">\r
      <Alert variant="warning">\r
        <AlertTriangle className="h-4 w-4" />\r
        <AlertTitle>Unsaved Changes</AlertTitle>\r
        <AlertDescription className="flex flex-col gap-2">\r
          <span>You have unsaved changes in your financial model.</span>\r
          <div className="flex gap-2">\r
            <Button size="sm" variant="outline">\r
              Save Changes\r
            </Button>\r
            <Button size="sm" variant="ghost">\r
              Discard\r
            </Button>\r
          </div>\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="info">\r
        <Info className="h-4 w-4" />\r
        <AlertTitle>New Feature Available</AlertTitle>\r
        <AlertDescription className="flex flex-col gap-2">\r
          <span>Try our new Monte Carlo simulation feature for risk analysis.</span>\r
          <Button size="sm" variant="outline">\r
            Learn More\r
          </Button>\r
        </AlertDescription>\r
      </Alert>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Alerts with interactive elements like buttons.'
      }
    }
  }
}`,...u.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-96">\r
      <CardHeader>\r
        <CardTitle>Financial Model Parameters</CardTitle>\r
      </CardHeader>\r
      <CardContent className="space-y-4">\r
        <Alert variant="info">\r
          <Info className="h-4 w-4" />\r
          <AlertDescription>\r
            Enter your financial assumptions below. All values should be in USD.\r
          </AlertDescription>\r
        </Alert>\r
        \r
        <div className="space-y-2">\r
          <label className="text-sm font-medium">Revenue Growth Rate (%)</label>\r
          <input className="w-full px-3 py-2 border rounded-md" placeholder="15.0" />\r
        </div>\r
        \r
        <Alert variant="warning">\r
          <AlertTriangle className="h-4 w-4" />\r
          <AlertDescription>\r
            Growth rates above 30% should be carefully justified.\r
          </AlertDescription>\r
        </Alert>\r
        \r
        <Button className="w-full">Calculate Model</Button>\r
      </CardContent>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'Alert used in context within a form interface.'
      }
    }
  }
}`,...A.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="space-y-2 w-96">\r
      <Alert className="py-2">\r
        <CheckCircle className="h-4 w-4" />\r
        <AlertDescription className="text-sm">\r
          Data saved successfully\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="warning" className="py-2">\r
        <AlertTriangle className="h-4 w-4" />\r
        <AlertDescription className="text-sm">\r
          Connection unstable\r
        </AlertDescription>\r
      </Alert>\r
      \r
      <Alert variant="destructive" className="py-2">\r
        <XCircle className="h-4 w-4" />\r
        <AlertDescription className="text-sm">\r
          Processing failed\r
        </AlertDescription>\r
      </Alert>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Compact alerts for toast-like notifications.'
      }
    }
  }
}`,...x.parameters?.docs?.source}}};const B=["Default","Variants","WithoutTitle","AuthenticationExamples","DataProcessingExamples","ModelValidationExamples","InteractiveAlerts","InContextUsage","CompactVariant"];export{m as AuthenticationExamples,x as CompactVariant,p as DataProcessingExamples,c as Default,A as InContextUsage,u as InteractiveAlerts,h as ModelValidationExamples,o as Variants,d as WithoutTitle,B as __namedExportsOrder,M as default};
