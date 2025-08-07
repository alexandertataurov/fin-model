import{j as e}from"./jsx-runtime-73816ce2.js";import{B as s}from"./button-37efc3d8.js";import{I as r}from"./input-6247f6e0.js";import{L as a}from"./label-4f136fa2.js";import{C as t,a as o,b as i,d as c,c as n}from"./card-ae25f609.js";import{r as y}from"./index-608a8126.js";import{M as f}from"./mail-e8a52895.js";import{c as N}from"./createLucideIcon-2fb9bc4c.js";import{E as g,a as j}from"./eye-cadf4284.js";import"./index-0d50cb4b.js";import"./index-580d16ae.js";import"./index-699be9d2.js";import"./_commonjsHelpers-725317a4.js";import"./utils-1f7970b9.js";/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],w=N("arrow-left",C);/**
 * @license lucide-react v0.533.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]],P=N("lock",b),O={title:"Auth/Authentication Forms",parameters:{layout:"centered",docs:{description:{component:`
# Authentication Components

A comprehensive set of authentication components for the FinVision platform. These components handle user registration, login, password management, and account verification.

## Components

- **LoginForm**: Primary authentication interface
- **RegisterForm**: New user registration
- **ForgotPasswordForm**: Password reset initiation
- **ResetPasswordForm**: Password reset completion
- **EmailVerification**: Account email verification
- **BiometricLogin**: Biometric authentication (when supported)

## Key Features

- **Security**: Input validation and secure handling
- **Accessibility**: Full keyboard navigation and screen readers
- **Responsive**: Works on all device sizes
- **Error Handling**: Clear validation messages
- **Progressive Enhancement**: Graceful fallbacks

## Usage in FinVision

Authentication is required for accessing financial data and modeling features.
        `}}},tags:["autodocs"]},d={render:function(){const[h,v]=y.useState(!1);return e.jsxs(t,{className:"w-96",children:[e.jsxs(o,{className:"text-center",children:[e.jsx(i,{className:"text-2xl",children:"Welcome Back"}),e.jsx(c,{children:"Sign in to your FinVision account"})]}),e.jsxs(n,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"email",children:"Email"}),e.jsxs("div",{className:"relative",children:[e.jsx(f,{className:"absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"}),e.jsx(r,{id:"email",type:"email",placeholder:"Enter your email",className:"pl-10"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"password",children:"Password"}),e.jsxs("div",{className:"relative",children:[e.jsx(P,{className:"absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"}),e.jsx(r,{id:"password",type:h?"text":"password",placeholder:"Enter your password",className:"pl-10 pr-10"}),e.jsx("button",{type:"button",onClick:()=>v(!h),className:"absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground",children:h?e.jsx(g,{className:"h-4 w-4"}):e.jsx(j,{className:"h-4 w-4"})})]})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("label",{className:"flex items-center space-x-2 text-sm",children:[e.jsx("input",{type:"checkbox",className:"h-4 w-4"}),e.jsx("span",{children:"Remember me"})]}),e.jsx(s,{variant:"link",className:"p-0 h-auto text-sm",children:"Forgot password?"})]}),e.jsx(s,{className:"w-full",size:"lg",children:"Sign In"}),e.jsxs("div",{className:"text-center text-sm text-muted-foreground",children:["Don't have an account?"," ",e.jsx(s,{variant:"link",className:"p-0 h-auto",children:"Sign up"})]})]})]})},parameters:{docs:{description:{story:"Complete login form with email, password, and remember me functionality."}}}},l={render:()=>e.jsxs(t,{className:"w-96",children:[e.jsxs(o,{className:"text-center",children:[e.jsx(i,{className:"text-2xl",children:"Create Account"}),e.jsx(c,{children:"Get started with FinVision today"})]}),e.jsxs(n,{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"firstName",children:"First Name"}),e.jsx(r,{id:"firstName",placeholder:"John"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"lastName",children:"Last Name"}),e.jsx(r,{id:"lastName",placeholder:"Doe"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"company",children:"Company"}),e.jsx(r,{id:"company",placeholder:"Your company name"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"email",children:"Email"}),e.jsx(r,{id:"email",type:"email",placeholder:"john.doe@company.com"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"password",children:"Password"}),e.jsx(r,{id:"password",type:"password",placeholder:"Create a strong password"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Must be at least 8 characters with uppercase, lowercase, and numbers"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"confirmPassword",children:"Confirm Password"}),e.jsx(r,{id:"confirmPassword",type:"password",placeholder:"Confirm your password"})]}),e.jsxs("div",{className:"flex items-start space-x-2",children:[e.jsx("input",{type:"checkbox",className:"h-4 w-4 mt-1"}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["I agree to the"," ",e.jsx(s,{variant:"link",className:"p-0 h-auto text-sm",children:"Terms of Service"})," ","and"," ",e.jsx(s,{variant:"link",className:"p-0 h-auto text-sm",children:"Privacy Policy"})]})]}),e.jsx(s,{className:"w-full",size:"lg",children:"Create Account"}),e.jsxs("div",{className:"text-center text-sm text-muted-foreground",children:["Already have an account?"," ",e.jsx(s,{variant:"link",className:"p-0 h-auto",children:"Sign in"})]})]})]}),parameters:{docs:{description:{story:"User registration form with validation and terms acceptance."}}}},m={render:()=>e.jsxs(t,{className:"w-96",children:[e.jsxs(o,{className:"text-center",children:[e.jsx(i,{className:"text-xl",children:"Reset Password"}),e.jsx(c,{children:"Enter your email to receive a password reset link"})]}),e.jsxs(n,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"resetEmail",children:"Email Address"}),e.jsx(r,{id:"resetEmail",type:"email",placeholder:"Enter your email"})]}),e.jsx(s,{className:"w-full",children:"Send Reset Link"}),e.jsx("div",{className:"text-center",children:e.jsxs(s,{variant:"link",className:"text-sm",children:[e.jsx(w,{className:"mr-2 h-4 w-4"}),"Back to Sign In"]})})]})]}),parameters:{docs:{description:{story:"Forgot password form for initiating password reset."}}}},p={render:()=>e.jsxs(t,{className:"w-96",children:[e.jsxs(o,{className:"text-center",children:[e.jsx(i,{className:"text-xl",children:"Set New Password"}),e.jsx(c,{children:"Choose a strong password for your account"})]}),e.jsxs(n,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"newPassword",children:"New Password"}),e.jsx(r,{id:"newPassword",type:"password",placeholder:"Enter new password"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"confirmNewPassword",children:"Confirm New Password"}),e.jsx(r,{id:"confirmNewPassword",type:"password",placeholder:"Confirm new password"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-xs text-muted-foreground",children:"Password requirements:"}),e.jsxs("ul",{className:"text-xs text-muted-foreground space-y-1",children:[e.jsxs("li",{className:"flex items-center space-x-2",children:[e.jsx("span",{className:"w-2 h-2 bg-green-500 rounded-full"}),e.jsx("span",{children:"At least 8 characters"})]}),e.jsxs("li",{className:"flex items-center space-x-2",children:[e.jsx("span",{className:"w-2 h-2 bg-green-500 rounded-full"}),e.jsx("span",{children:"One uppercase letter"})]}),e.jsxs("li",{className:"flex items-center space-x-2",children:[e.jsx("span",{className:"w-2 h-2 bg-muted rounded-full"}),e.jsx("span",{children:"One number"})]})]})]}),e.jsx(s,{className:"w-full",children:"Update Password"})]})]}),parameters:{docs:{description:{story:"Password reset form with requirements validation."}}}},u={render:()=>e.jsxs(t,{className:"w-96",children:[e.jsxs(o,{className:"text-center",children:[e.jsx(i,{className:"text-xl",children:"Verify Your Email"}),e.jsx(c,{children:"We sent a verification code to john.doe@company.com"})]}),e.jsxs(n,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(a,{htmlFor:"verificationCode",children:"Verification Code"}),e.jsx(r,{id:"verificationCode",placeholder:"Enter 6-digit code",maxLength:6,className:"text-center text-lg font-mono"})]}),e.jsx(s,{className:"w-full",children:"Verify Email"}),e.jsxs("div",{className:"text-center text-sm text-muted-foreground",children:["Didn't receive the code?"," ",e.jsx(s,{variant:"link",className:"p-0 h-auto",children:"Resend"})]}),e.jsx("div",{className:"text-center",children:e.jsxs(s,{variant:"link",className:"text-sm",children:[e.jsx(w,{className:"mr-2 h-4 w-4"}),"Back to Sign In"]})})]})]}),parameters:{docs:{description:{story:"Email verification form with resend functionality."}}}},x={render:()=>e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl",children:[e.jsxs(t,{children:[e.jsx(o,{className:"text-center",children:e.jsx(i,{children:"Signing In..."})}),e.jsxs(n,{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{value:"john.doe@company.com",disabled:!0}),e.jsx(r,{type:"password",value:"password",disabled:!0})]}),e.jsxs(s,{className:"w-full",disabled:!0,children:[e.jsx("div",{className:"w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"}),"Signing In..."]})]})]}),e.jsxs(t,{children:[e.jsx(o,{className:"text-center",children:e.jsx(i,{children:"Sign In"})}),e.jsxs(n,{className:"space-y-4",children:[e.jsx("div",{className:"p-3 bg-destructive/10 border border-destructive/20 rounded-md",children:e.jsx("p",{className:"text-sm text-destructive",children:"Invalid email or password. Please try again."})}),e.jsxs("div",{className:"space-y-2",children:[e.jsx(r,{value:"john.doe@company.com",className:"border-destructive focus-visible:ring-destructive/20"}),e.jsx(r,{type:"password",placeholder:"Password",className:"border-destructive focus-visible:ring-destructive/20"})]}),e.jsx(s,{className:"w-full",children:"Sign In"})]})]})]}),parameters:{docs:{description:{story:"Authentication forms in loading and error states."}}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: function LoginFormStory() {
    const [showPassword, setShowPassword] = useState(false);
    return <Card className="w-96">\r
        <CardHeader className="text-center">\r
          <CardTitle className="text-2xl">Welcome Back</CardTitle>\r
          <CardDescription>Sign in to your FinVision account</CardDescription>\r
        </CardHeader>\r
        <CardContent className="space-y-4">\r
          <div className="space-y-2">\r
            <Label htmlFor="email">Email</Label>\r
            <div className="relative">\r
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />\r
              <Input id="email" type="email" placeholder="Enter your email" className="pl-10" />\r
            </div>\r
          </div>\r
\r
          <div className="space-y-2">\r
            <Label htmlFor="password">Password</Label>\r
            <div className="relative">\r
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />\r
              <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="pl-10 pr-10" />\r
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground">\r
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}\r
              </button>\r
            </div>\r
          </div>\r
\r
          <div className="flex items-center justify-between">\r
            <label className="flex items-center space-x-2 text-sm">\r
              <input type="checkbox" className="h-4 w-4" />\r
              <span>Remember me</span>\r
            </label>\r
            <Button variant="link" className="p-0 h-auto text-sm">\r
              Forgot password?\r
            </Button>\r
          </div>\r
\r
          <Button className="w-full" size="lg">\r
            Sign In\r
          </Button>\r
\r
          <div className="text-center text-sm text-muted-foreground">\r
            Don't have an account?{' '}\r
            <Button variant="link" className="p-0 h-auto">\r
              Sign up\r
            </Button>\r
          </div>\r
        </CardContent>\r
      </Card>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete login form with email, password, and remember me functionality.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-96">\r
      <CardHeader className="text-center">\r
        <CardTitle className="text-2xl">Create Account</CardTitle>\r
        <CardDescription>Get started with FinVision today</CardDescription>\r
      </CardHeader>\r
      <CardContent className="space-y-4">\r
        <div className="grid grid-cols-2 gap-4">\r
          <div className="space-y-2">\r
            <Label htmlFor="firstName">First Name</Label>\r
            <Input id="firstName" placeholder="John" />\r
          </div>\r
          <div className="space-y-2">\r
            <Label htmlFor="lastName">Last Name</Label>\r
            <Input id="lastName" placeholder="Doe" />\r
          </div>\r
        </div>\r
\r
        <div className="space-y-2">\r
          <Label htmlFor="company">Company</Label>\r
          <Input id="company" placeholder="Your company name" />\r
        </div>\r
\r
        <div className="space-y-2">\r
          <Label htmlFor="email">Email</Label>\r
          <Input id="email" type="email" placeholder="john.doe@company.com" />\r
        </div>\r
\r
        <div className="space-y-2">\r
          <Label htmlFor="password">Password</Label>\r
          <Input id="password" type="password" placeholder="Create a strong password" />\r
          <p className="text-xs text-muted-foreground">\r
            Must be at least 8 characters with uppercase, lowercase, and numbers\r
          </p>\r
        </div>\r
\r
        <div className="space-y-2">\r
          <Label htmlFor="confirmPassword">Confirm Password</Label>\r
          <Input id="confirmPassword" type="password" placeholder="Confirm your password" />\r
        </div>\r
\r
        <div className="flex items-start space-x-2">\r
          <input type="checkbox" className="h-4 w-4 mt-1" />\r
          <p className="text-sm text-muted-foreground">\r
            I agree to the{' '}\r
            <Button variant="link" className="p-0 h-auto text-sm">\r
              Terms of Service\r
            </Button>{' '}\r
            and{' '}\r
            <Button variant="link" className="p-0 h-auto text-sm">\r
              Privacy Policy\r
            </Button>\r
          </p>\r
        </div>\r
\r
        <Button className="w-full" size="lg">\r
          Create Account\r
        </Button>\r
\r
        <div className="text-center text-sm text-muted-foreground">\r
          Already have an account?{' '}\r
          <Button variant="link" className="p-0 h-auto">\r
            Sign in\r
          </Button>\r
        </div>\r
      </CardContent>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'User registration form with validation and terms acceptance.'
      }
    }
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-96">\r
      <CardHeader className="text-center">\r
        <CardTitle className="text-xl">Reset Password</CardTitle>\r
        <CardDescription>\r
          Enter your email to receive a password reset link\r
        </CardDescription>\r
      </CardHeader>\r
      <CardContent className="space-y-4">\r
        <div className="space-y-2">\r
          <Label htmlFor="resetEmail">Email Address</Label>\r
          <Input id="resetEmail" type="email" placeholder="Enter your email" />\r
        </div>\r
\r
        <Button className="w-full">Send Reset Link</Button>\r
\r
        <div className="text-center">\r
          <Button variant="link" className="text-sm">\r
            <ArrowLeft className="mr-2 h-4 w-4" />\r
            Back to Sign In\r
          </Button>\r
        </div>\r
      </CardContent>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'Forgot password form for initiating password reset.'
      }
    }
  }
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-96">\r
      <CardHeader className="text-center">\r
        <CardTitle className="text-xl">Set New Password</CardTitle>\r
        <CardDescription>\r
          Choose a strong password for your account\r
        </CardDescription>\r
      </CardHeader>\r
      <CardContent className="space-y-4">\r
        <div className="space-y-2">\r
          <Label htmlFor="newPassword">New Password</Label>\r
          <Input id="newPassword" type="password" placeholder="Enter new password" />\r
        </div>\r
\r
        <div className="space-y-2">\r
          <Label htmlFor="confirmNewPassword">Confirm New Password</Label>\r
          <Input id="confirmNewPassword" type="password" placeholder="Confirm new password" />\r
        </div>\r
\r
        <div className="space-y-2">\r
          <p className="text-xs text-muted-foreground">\r
            Password requirements:\r
          </p>\r
          <ul className="text-xs text-muted-foreground space-y-1">\r
            <li className="flex items-center space-x-2">\r
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>\r
              <span>At least 8 characters</span>\r
            </li>\r
            <li className="flex items-center space-x-2">\r
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>\r
              <span>One uppercase letter</span>\r
            </li>\r
            <li className="flex items-center space-x-2">\r
              <span className="w-2 h-2 bg-muted rounded-full"></span>\r
              <span>One number</span>\r
            </li>\r
          </ul>\r
        </div>\r
\r
        <Button className="w-full">Update Password</Button>\r
      </CardContent>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'Password reset form with requirements validation.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <Card className="w-96">\r
      <CardHeader className="text-center">\r
        <CardTitle className="text-xl">Verify Your Email</CardTitle>\r
        <CardDescription>\r
          We sent a verification code to john.doe@company.com\r
        </CardDescription>\r
      </CardHeader>\r
      <CardContent className="space-y-4">\r
        <div className="space-y-2">\r
          <Label htmlFor="verificationCode">Verification Code</Label>\r
          <Input id="verificationCode" placeholder="Enter 6-digit code" maxLength={6} className="text-center text-lg font-mono" />\r
        </div>\r
\r
        <Button className="w-full">Verify Email</Button>\r
\r
        <div className="text-center text-sm text-muted-foreground">\r
          Didn't receive the code?{' '}\r
          <Button variant="link" className="p-0 h-auto">\r
            Resend\r
          </Button>\r
        </div>\r
\r
        <div className="text-center">\r
          <Button variant="link" className="text-sm">\r
            <ArrowLeft className="mr-2 h-4 w-4" />\r
            Back to Sign In\r
          </Button>\r
        </div>\r
      </CardContent>\r
    </Card>,
  parameters: {
    docs: {
      description: {
        story: 'Email verification form with resend functionality.'
      }
    }
  }
}`,...u.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">\r
      {/* Loading State */}\r
      <Card>\r
        <CardHeader className="text-center">\r
          <CardTitle>Signing In...</CardTitle>\r
        </CardHeader>\r
        <CardContent className="space-y-4">\r
          <div className="space-y-2">\r
            <Input value="john.doe@company.com" disabled />\r
            <Input type="password" value="password" disabled />\r
          </div>\r
          <Button className="w-full" disabled>\r
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>\r
            Signing In...\r
          </Button>\r
        </CardContent>\r
      </Card>\r
\r
      {/* Error State */}\r
      <Card>\r
        <CardHeader className="text-center">\r
          <CardTitle>Sign In</CardTitle>\r
        </CardHeader>\r
        <CardContent className="space-y-4">\r
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">\r
            <p className="text-sm text-destructive">\r
              Invalid email or password. Please try again.\r
            </p>\r
          </div>\r
          <div className="space-y-2">\r
            <Input value="john.doe@company.com" className="border-destructive focus-visible:ring-destructive/20" />\r
            <Input type="password" placeholder="Password" className="border-destructive focus-visible:ring-destructive/20" />\r
          </div>\r
          <Button className="w-full">Sign In</Button>\r
        </CardContent>\r
      </Card>\r
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Authentication forms in loading and error states.'
      }
    }
  }
}`,...x.parameters?.docs?.source}}};const _=["LoginForm","RegisterForm","ForgotPasswordStory","ResetPasswordStory","EmailVerificationStory","AuthStates"];export{x as AuthStates,u as EmailVerificationStory,m as ForgotPasswordStory,d as LoginForm,l as RegisterForm,p as ResetPasswordStory,_ as __namedExportsOrder,O as default};
