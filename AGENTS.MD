# AGENTS.MD - Comprehensive Development Guidelines

## 🎯 Project Overview

**FinVision** is a comprehensive web-based financial modeling and analysis platform that transforms static Excel financial models into dynamic, interactive dashboards with real-time parameter adjustment capabilities.

### Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS + Radix UI
- **Backend**: FastAPI + Python + SQLAlchemy + PostgreSQL + Celery
- **Design System**: Custom design tokens with Storybook
- **Authentication**: JWT-based with role-based access control
- **Deployment**: Multi-environment support (Railway, Netlify, Docker)

---

## 🏗️ Project Structure

```
fin-model/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Route-level page components
│   │   ├── design-system/   # Design tokens and theme
│   │   ├── contexts/        # React contexts (Auth, Theme)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── stores/          # Zustand state management
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   └── lib/             # Third-party library configurations
│   ├── cypress/             # E2E tests
│   └── storybook-static/    # Storybook build output
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── api/             # API routes and endpoints
│   │   ├── core/            # Core configuration and security
│   │   ├── db/              # Database configuration
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic layer
│   │   ├── repositories/    # Data access layer
│   │   ├── tasks/           # Celery background tasks
│   │   └── middleware/      # Custom middleware
│   ├── alembic/             # Database migrations
│   └── tests/               # Python tests
├── config/                  # Style Dictionary configuration
├── docs/                    # Documentation
├── scripts/                 # Build and deployment scripts
└── tokens/                  # Design tokens source
```

---

## 🎨 Frontend Development Guidelines

### Component Architecture

#### 1. **Component Organization**

```typescript
// ✅ GOOD: Organized component structure
components/
├── ui/                      # Base design system components
├── features/                # Feature-specific components
├── layout/                  # Layout components
└── pages/                   # Page-level components

// Component file structure
MyComponent/
├── index.ts                 # Export barrel
├── MyComponent.tsx          # Main component
├── MyComponent.stories.tsx  # Storybook stories
├── MyComponent.test.tsx     # Unit tests
└── types.ts                 # Component-specific types
```

#### 2. **Component Patterns**

```typescript
// ✅ GOOD: Compound component pattern
export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
} as const;

// ✅ GOOD: Proper prop interfaces
interface ButtonProps {
  variant?: "primary" | "secondary" | "destructive";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

// ✅ GOOD: Forward refs for UI components
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size })}
        {...props}
      />
    );
  }
);
```

#### 3. **State Management Strategy**

```typescript
// ✅ Context for global app state
const AuthContext = React.createContext<AuthContextType | null>(null);

// ✅ Zustand for complex state logic
interface AppStore {
  theme: "light" | "dark";
  user: User | null;
  setTheme: (theme: "light" | "dark") => void;
  setUser: (user: User | null) => void;
}

// ✅ Local state for component-specific data
const [isOpen, setIsOpen] = useState(false);
```

### Code Quality Standards

#### 1. **TypeScript Usage**

```typescript
// ✅ GOOD: Strict type definitions
interface ApiResponse<T> {
  data: T;
  status: "success" | "error";
  message?: string;
}

// ✅ GOOD: Generic constraints
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
}

// ❌ BAD: Any types
const data: any = fetchData(); // Avoid this

// ✅ GOOD: Proper error handling
try {
  const result = await apiCall();
  return { success: true, data: result };
} catch (error) {
  return {
    success: false,
    error: error instanceof Error ? error.message : "Unknown error",
  };
}
```

#### 2. **Performance Optimization**

```typescript
// ✅ GOOD: Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// ✅ GOOD: Callback memoization
const handleClick = useCallback(() => {
  onItemClick(item.id);
}, [item.id, onItemClick]);

// ✅ GOOD: Lazy loading
const LazyChart = lazy(() => import("./Chart"));

// ✅ GOOD: Virtual scrolling for large lists
import { FixedSizeList as List } from "react-window";
```

## 🎨 Design System & UI Architecture

### Design System Overview

The FinVision design system is built on **Style Dictionary** for design tokens, **Tailwind CSS** for utility classes, **Radix UI** for accessible primitives, and **Storybook** for component documentation.

#### 1. **Design Tokens Structure**

```typescript
// ✅ GOOD: Design token organization
interface DesignTokens {
  colors: {
    primary: { 50: string; 100: string; /* ... */ 900: string };
    semantic: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    neutral: { 50: string; 100: string; /* ... */ 900: string };
  };
  typography: {
    fontFamilies: { sans: string; mono: string };
    fontSizes: { xs: string; sm: string; /* ... */ 4xl: string };
    fontWeights: { normal: number; medium: number; semibold: number; bold: number };
    lineHeights: { tight: string; normal: string; relaxed: string };
  };
  spacing: { xs: string; sm: string; md: string; lg: string; xl: string };
  radii: { none: string; sm: string; md: string; lg: string; full: string };
  shadows: { sm: string; md: string; lg: string; xl: string };
  breakpoints: { sm: string; md: string; lg: string; xl: string };
}

// ✅ GOOD: Token usage in components
const useDesignTokens = () => {
  const tokens = useTheme();
  return tokens;
};
```

#### 2. **Component Variants System**

```typescript
// ✅ GOOD: Class Variance Authority (CVA) usage
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
```

#### 3. **Compound Component Architecture**

```typescript
// ✅ GOOD: Compound component pattern for complex UI
const Card = {
  Root: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
        {...props}
      />
    )
  ),
  Header: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
    )
  ),
  Title: React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
      <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
    )
  ),
  Description: React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
      <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
    )
  ),
  Content: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
    )
  ),
  Footer: React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
      <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
    )
  ),
} as const;

// Usage example
<Card.Root>
  <Card.Header>
    <Card.Title>Financial Overview</Card.Title>
    <Card.Description>Your portfolio performance this month</Card.Description>
  </Card.Header>
  <Card.Content>
    <FinancialChart data={chartData} />
  </Card.Content>
  <Card.Footer>
    <Button>View Details</Button>
  </Card.Footer>
</Card.Root>
```

#### 4. **Theme Integration**

```typescript
// ✅ GOOD: Use design tokens
const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
`;

// ✅ GOOD: Responsive design
const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// ✅ GOOD: CSS-in-JS with design tokens
const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.md,
    boxShadow: theme.shadows.md,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.text.primary,
  },
}));
```

#### 5. **Icon System**

```typescript
// ✅ GOOD: Lucide React icon system
import { 
  ChevronDown, 
  User, 
  Settings, 
  BarChart3, 
  PieChart,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";

// ✅ GOOD: Icon component wrapper
interface IconProps {
  name: keyof typeof iconMap;
  size?: number;
  className?: string;
  'aria-label'?: string;
}

const iconMap = {
  chevronDown: ChevronDown,
  user: User,
  settings: Settings,
  barChart: BarChart3,
  pieChart: PieChart,
  trending: TrendingUp,
  error: AlertCircle,
  success: CheckCircle,
  warning: XCircle,
  info: Info,
} as const;

const Icon: React.FC<IconProps> = ({ name, size = 16, className, ...props }) => {
  const IconComponent = iconMap[name];
  return <IconComponent size={size} className={className} {...props} />;
};

// Usage
<Icon name="barChart" size={24} aria-label="Chart data" />
```

#### 6. **Form Components**

```typescript
// ✅ GOOD: Form field composition
const FormField = React.forwardRef<
  React.ElementRef<typeof FormFieldPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof FormFieldPrimitive.Root>
>(({ ...props }, ref) => {
  return <FormFieldPrimitive.Root ref={ref} {...props} />;
});

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { error } = useFormField();
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    );
  }
);

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});

// ✅ GOOD: Input validation states
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
```

#### 7. **Accessibility Standards**

```typescript
// ✅ GOOD: Semantic HTML and ARIA attributes
<button aria-label="Close dialog" aria-expanded={isOpen} onClick={handleClose}>
  <CloseIcon aria-hidden="true" />
</button>;

// ✅ GOOD: Focus management
const firstFocusableElement = useRef<HTMLElement>(null);
useEffect(() => {
  if (isOpen && firstFocusableElement.current) {
    firstFocusableElement.current.focus();
  }
}, [isOpen]);

// ✅ GOOD: Keyboard navigation
const useKeyboardNavigation = (items: MenuItem[]) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (activeIndex >= 0 && items[activeIndex]) {
          items[activeIndex].onClick();
        }
        break;
      case 'Escape':
        setActiveIndex(-1);
        break;
    }
  }, [items, activeIndex]);
  
  return { activeIndex, handleKeyDown };
};
```

#### 8. **Storybook Integration**

```typescript
// ✅ GOOD: Comprehensive Storybook stories
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-4 flex-wrap">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex gap-4">
      <Button>
        <Icon name="user" className="mr-2 h-4 w-4" />
        With Icon
      </Button>
      <Button variant="outline" size="icon">
        <Icon name="settings" className="h-4 w-4" />
      </Button>
    </div>
  ),
};
```

---

## 🔧 Backend Development Guidelines

### API Design Principles

#### 1. **RESTful Architecture**

```python
# ✅ GOOD: Resource-based URLs
@router.get("/financial-models/{model_id}")
@router.post("/financial-models")
@router.put("/financial-models/{model_id}")
@router.delete("/financial-models/{model_id}")

# ✅ GOOD: Nested resources
@router.get("/financial-models/{model_id}/scenarios")
@router.post("/financial-models/{model_id}/scenarios")
```

#### 2. **Schema Validation**

```python
# ✅ GOOD: Pydantic schemas with validation
class FinancialModelCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    parameters: Dict[str, Any] = Field(default_factory=dict)

    @validator('name')
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

class FinancialModelResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
```

#### 3. **Error Handling**

```python
# ✅ GOOD: Custom exception classes
class FinancialModelNotFoundError(Exception):
    def __init__(self, model_id: str):
        self.model_id = model_id
        super().__init__(f"Financial model {model_id} not found")

# ✅ GOOD: Exception handlers
@app.exception_handler(FinancialModelNotFoundError)
async def financial_model_not_found_handler(request: Request, exc: FinancialModelNotFoundError):
    return JSONResponse(
        status_code=404,
        content={"detail": f"Financial model {exc.model_id} not found"}
    )
```

### Service Layer Architecture

#### 1. **Repository Pattern**

```python
# ✅ GOOD: Abstract repository interface
class FinancialModelRepository(ABC):
    @abstractmethod
    async def create(self, model: FinancialModelCreate) -> FinancialModel:
        pass

    @abstractmethod
    async def get_by_id(self, model_id: UUID) -> Optional[FinancialModel]:
        pass

    @abstractmethod
    async def update(self, model_id: UUID, updates: FinancialModelUpdate) -> FinancialModel:
        pass

# ✅ GOOD: Concrete implementation
class SQLAlchemyFinancialModelRepository(FinancialModelRepository):
    def __init__(self, db: Session):
        self.db = db

    async def create(self, model: FinancialModelCreate) -> FinancialModel:
        db_model = FinancialModel(**model.dict())
        self.db.add(db_model)
        self.db.commit()
        self.db.refresh(db_model)
        return db_model
```

#### 2. **Service Layer**

```python
# ✅ GOOD: Business logic in services
class FinancialModelService:
    def __init__(self, repository: FinancialModelRepository):
        self.repository = repository

    async def create_model(self, model_data: FinancialModelCreate, user_id: UUID) -> FinancialModelResponse:
        # Business logic here
        if await self._model_name_exists(model_data.name, user_id):
            raise ModelNameAlreadyExistsError(model_data.name)

        model = await self.repository.create(model_data)
        return FinancialModelResponse.from_orm(model)

    async def _model_name_exists(self, name: str, user_id: UUID) -> bool:
        # Private helper method
        existing = await self.repository.get_by_name_and_user(name, user_id)
        return existing is not None
```

### Database Management

#### 1. **Migration Strategy**

```python
# ✅ GOOD: Alembic migration file structure
"""Add financial model parameters table

Revision ID: 001_add_financial_models
Revises:
Create Date: 2024-01-01 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

def upgrade() -> None:
    op.create_table('financial_models',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('parameters', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade() -> None:
    op.drop_table('financial_models')
```

---

## 🔄 Refactoring Guidelines

### When to Refactor

1. **Code Smells to Watch For:**
   - Functions longer than 50 lines
   - Deeply nested conditions (>3 levels)
   - Duplicate code blocks
   - Large component files (>300 lines)
   - Complex prop drilling
   - Inconsistent naming conventions

### Refactoring Strategies

#### 1. **Component Refactoring**

```typescript
// ❌ BAD: Monolithic component
const Dashboard = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 200+ lines of JSX and logic
  return <div>{/* Complex rendering logic */}</div>;
};

// ✅ GOOD: Broken down into smaller components
const Dashboard = () => {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <DashboardMetrics />
      <DashboardCharts />
      <DashboardActions />
    </DashboardLayout>
  );
};
```

#### 2. **Hook Extraction**

```typescript
// ✅ GOOD: Extract complex logic into custom hooks
const useFinancialData = (modelId: string) => {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await financialModelService.getData(modelId);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [modelId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
```

#### 3. **Service Layer Refactoring**

```python
# ❌ BAD: Fat controller
@router.post("/financial-models")
async def create_financial_model(model_data: dict, db: Session = Depends(get_db)):
    # Direct database operations in controller
    db_model = FinancialModel(**model_data)
    db.add(db_model)
    db.commit()
    # Business logic mixed with HTTP concerns

# ✅ GOOD: Thin controller with service injection
@router.post("/financial-models")
async def create_financial_model(
    model_data: FinancialModelCreate,
    service: FinancialModelService = Depends(get_financial_model_service)
):
    return await service.create_model(model_data)
```

### Code Breakdown Strategies

#### 1. **Feature-Based Organization**

```
src/
├── features/
│   ├── authentication/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── financial-modeling/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
```

#### 2. **Layer Separation**

```
backend/app/
├── api/                     # Presentation layer
├── services/                # Business logic layer
├── repositories/            # Data access layer
├── models/                  # Domain models
└── schemas/                 # Data transfer objects
```

---

## 🧪 Testing Strategy

### Frontend Testing

#### 1. **Component Testing**

```typescript
// ✅ GOOD: Comprehensive component test
describe("FinancialChart", () => {
  const mockData = [
    { date: "2024-01", revenue: 100000, expenses: 80000 },
    { date: "2024-02", revenue: 120000, expenses: 85000 },
  ];

  it("renders chart with provided data", () => {
    render(<FinancialChart data={mockData} />);

    expect(
      screen.getByRole("img", { name: /financial chart/i })
    ).toBeInTheDocument();
    expect(screen.getByText("100000")).toBeInTheDocument();
  });

  it("handles empty data gracefully", () => {
    render(<FinancialChart data={[]} />);

    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });

  it("updates when data changes", () => {
    const { rerender } = render(<FinancialChart data={mockData} />);

    const newData = [
      ...mockData,
      { date: "2024-03", revenue: 130000, expenses: 90000 },
    ];
    rerender(<FinancialChart data={newData} />);

    expect(screen.getByText("130000")).toBeInTheDocument();
  });
});
```

#### 2. **Hook Testing**

```typescript
// ✅ GOOD: Custom hook test
describe("useFinancialData", () => {
  it("fetches data successfully", async () => {
    const mockData = { revenue: 100000, expenses: 80000 };
    vi.mocked(financialModelService.getData).mockResolvedValue(mockData);

    const { result } = renderHook(() => useFinancialData("model-1"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual(mockData);
      expect(result.current.error).toBeNull();
    });
  });
});
```

### Backend Testing

#### 1. **API Testing**

```python
# ✅ GOOD: API endpoint test
@pytest.mark.asyncio
async def test_create_financial_model(client: TestClient, db: Session):
    model_data = {
        "name": "Test Model",
        "description": "Test description",
        "parameters": {"revenue_growth": 0.1}
    }

    response = client.post("/api/financial-models", json=model_data)

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == model_data["name"]
    assert "id" in data
    assert "created_at" in data

@pytest.mark.asyncio
async def test_create_financial_model_validation_error(client: TestClient):
    invalid_data = {"name": ""}  # Empty name should fail validation

    response = client.post("/api/financial-models", json=invalid_data)

    assert response.status_code == 422
    assert "validation error" in response.json()["detail"].lower()
```

#### 2. **Service Testing**

```python
# ✅ GOOD: Service layer test
@pytest.mark.asyncio
async def test_financial_model_service_create():
    repository = Mock(spec=FinancialModelRepository)
    service = FinancialModelService(repository)

    model_data = FinancialModelCreate(name="Test Model", parameters={})
    expected_model = FinancialModel(id=uuid4(), name="Test Model")
    repository.create.return_value = expected_model

    result = await service.create_model(model_data, uuid4())

    assert result.name == "Test Model"
    repository.create.assert_called_once_with(model_data)
```

---

## 🚀 Deployment & DevOps

### Environment Configuration

#### 1. **Environment Variables**

```typescript
// ✅ GOOD: Environment configuration
interface Config {
  apiUrl: string;
  environment: "development" | "staging" | "production";
  features: {
    enableAnalytics: boolean;
    enableBetaFeatures: boolean;
  };
}

const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
  environment:
    (import.meta.env.VITE_ENVIRONMENT as Config["environment"]) ||
    "development",
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
    enableBetaFeatures: import.meta.env.VITE_ENABLE_BETA_FEATURES === "true",
  },
};
```

#### 2. **Build Configuration**

```javascript
// vite.config.ts - Environment-specific builds
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: mode !== "production",
    minify: mode === "production" ? "esbuild" : false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          charts: ["recharts"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
        },
      },
    },
  },
}));
```

### CI/CD Pipeline

#### 1. **Build Process**

```yaml
# ✅ GOOD: GitHub Actions workflow
name: Build and Deploy
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "pnpm"

      - run: pnpm install
      - run: pnpm run type-check
      - run: pnpm run lint
      - run: pnpm run test:ci
      - run: pnpm run build
```

---

## 📋 Development Checklist

### Before Starting Development

- [ ] Read and understand the project structure
- [ ] Set up local development environment
- [ ] Review design system and component library
- [ ] Understand authentication and authorization flow
- [ ] Review API documentation and schemas

### Code Review Checklist

#### Frontend

- [ ] Components are properly typed with TypeScript
- [ ] Accessibility standards are met (ARIA labels, keyboard navigation)
- [ ] Performance optimizations are in place (memoization, lazy loading)
- [ ] Error boundaries handle edge cases
- [ ] Tests cover critical functionality
- [ ] Design system tokens are used consistently
- [ ] Responsive design works across devices

#### Backend

- [ ] API endpoints follow RESTful conventions
- [ ] Input validation is comprehensive
- [ ] Error handling is consistent
- [ ] Database queries are optimized
- [ ] Authentication and authorization are secure
- [ ] Tests cover business logic and edge cases
- [ ] Documentation is up to date

### Pre-deployment Checklist

- [ ] All tests pass (unit, integration, e2e)
- [ ] Build completes without errors or warnings
- [ ] Performance metrics are within acceptable ranges
- [ ] Security scans show no critical vulnerabilities
- [ ] Database migrations are tested
- [ ] Environment variables are configured
- [ ] Monitoring and logging are set up

---

## 🎯 Best Practices Summary

### General Principles

1. **Write self-documenting code** - Use clear, descriptive names
2. **Follow the principle of least surprise** - Code should behave as expected
3. **Optimize for readability** - Code is read more often than written
4. **Test early and often** - Write tests as you develop
5. **Refactor continuously** - Keep code clean and maintainable

### Performance Guidelines

1. **Frontend**: Lazy load components, optimize bundle size, use React.memo judiciously
2. **Backend**: Optimize database queries, implement caching, use async operations
3. **Overall**: Monitor Core Web Vitals, implement proper error tracking

### Security Guidelines

1. **Input validation** on both frontend and backend
2. **Authentication** with JWT tokens and refresh logic
3. **Authorization** with role-based access control
4. **Data protection** with proper encryption and secure headers

---

## 📚 Resources

### Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Storybook Documentation](https://storybook.js.org/docs/)

### Tools

- **Frontend**: Vite, ESLint, Prettier, Vitest, Cypress
- **Backend**: FastAPI, SQLAlchemy, Alembic, Pytest
- **Design**: Storybook, Style Dictionary, Tailwind CSS
- **Deployment**: Railway, Netlify, Docker

---

_This document should be updated regularly as the project evolves. All developers should contribute to keeping these guidelines current and comprehensive._
