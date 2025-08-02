# 20 - Reports Component Radix UI Migration

**Purpose:**  
Migrate the Reports component from Material-UI to Radix UI primitives, establishing it as the reference implementation for complex tabbed interfaces and data management patterns.

**Complexity:** ⭐⭐⭐ HIGH  
**Estimated Time:** 25–35 hours

## Background

The current Reports component (`frontend/src/pages/Reports.tsx`) uses Material-UI components extensively. This task migrates it to use Radix UI primitives while maintaining all existing functionality and enhancing the user experience.

## Current State Analysis

### Existing Material-UI Usage

```typescript
// Components to migrate from Material-UI
-Container,
  Grid,
  Card,
  CardContent,
  CardHeader - Button,
  Typography,
  Box,
  Tabs,
  Tab - Dialog,
  DialogTitle,
  DialogContent,
  DialogActions - TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem - Chip,
  IconButton,
  Tooltip,
  Alert - List,
  ListItem,
  ListItemText,
  Paper - Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow - CircularProgress;
```

### Current Features to Preserve

- ✅ Three-tab interface (Generate Reports, Templates, Export History)
- ✅ Template management (create, edit, delete)
- ✅ Report generation with multiple formats (PDF, Excel, CSV)
- ✅ Export history with status tracking
- ✅ Real-time status updates using React Query
- ✅ Modal dialogs for template creation and report generation
- ✅ Data tables with sorting and filtering capabilities

## Functional Requirements

### Phase 1: Core Layout Migration (8-12 hours)

- **Container System**: Replace Material-UI Container with custom layout components
- **Grid System**: Implement responsive grid using Tailwind CSS Grid
- **Card Components**: Migrate to Radix-based Card components with consistent styling
- **Typography**: Standardize typography using Tailwind typography scale
- **Spacing**: Implement consistent spacing using design tokens

### Phase 2: Navigation & Interaction (8-10 hours)

- **Tabs Interface**: Migrate to `@radix-ui/react-tabs` with enhanced keyboard navigation
- **Buttons**: Standardize all buttons using CVA variants
- **Dialog System**: Migrate modals to `@radix-ui/react-dialog` with proper focus management
- **Form Components**: Replace Material-UI form components with Radix equivalents
- **Selection Controls**: Implement Radix Select components with consistent styling

### Phase 3: Data Display (6-8 hours)

- **Data Tables**: Create enhanced DataTable component using Radix primitives
- **Status Indicators**: Implement consistent status displays using Badge and Progress
- **Loading States**: Enhance loading indicators with Radix primitives
- **Empty States**: Create consistent empty state patterns
- **Toast Notifications**: Implement toast system for user feedback

### Phase 4: Advanced Features (3-5 hours)

- **Tooltip System**: Migrate to `@radix-ui/react-tooltip` with consistent positioning
- **Context Menus**: Add right-click context menus for enhanced UX
- **Keyboard Shortcuts**: Implement keyboard shortcuts for common actions
- **Accessibility**: Enhance ARIA labels and screen reader support

## Technical Implementation

### Enhanced Reports Layout

```typescript
// Migrated Reports component structure
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";

const Reports: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Export</h1>
        <p className="text-muted-foreground">
          Generate financial reports, manage templates, and export data
        </p>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Reports
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Template className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Export History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <ReportGenerationPanel />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <TemplateManagementPanel />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <ExportHistoryPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

### Enhanced Template Management Panel

```typescript
import { useState } from "react";
import { Plus, Edit, Trash2, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TemplateManagementPanel = () => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Report Templates
          </h2>
          <p className="text-muted-foreground">
            Create and manage reusable report templates
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="relative group">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => generateFromTemplate(template.id)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Generate Report
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => editTemplate(template.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Template
                    </DropdownMenuItem>
                    {!template.is_system && (
                      <DropdownMenuItem
                        onClick={() => deleteTemplate(template.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Template
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {template.report_type.replace("_", " ")}
                </Badge>
                {template.is_system && (
                  <Badge variant="secondary">System</Badge>
                )}
                {template.is_active && <Badge variant="default">Active</Badge>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CreateTemplateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
};
```

### Enhanced Data Table for Export History

```typescript
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface ExportHistoryItem {
  id: number;
  name: string;
  export_format: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  file_path?: string;
  file_size?: number;
  processing_duration_seconds?: number;
  error_message?: string;
  created_at: string;
  expires_at?: string;
}

const columns: ColumnDef<ExportHistoryItem>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "export_format",
    header: "Format",
    cell: ({ row }) => (
      <Badge variant="outline">{row.getValue("export_format")}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          {status === "PROCESSING" && (
            <Progress value={65} className="w-16 h-2" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "file_size",
    header: "Size",
    cell: ({ row }) => {
      const size = row.getValue("file_size") as number;
      return size ? formatFileSize(size) : "N/A";
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.getValue("created_at"))}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ExportActions export={row.original} />,
  },
];

const ExportHistoryPanel = () => {
  const { data: exports, isLoading } = useQuery({
    queryKey: ["report-exports"],
    queryFn: fetchReportExports,
  });

  if (isLoading) {
    return <DataTableSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Export History
          </h2>
          <p className="text-muted-foreground">
            Track and manage your report exports
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={exports || []}
        searchKey="name"
        filterOptions={[
          {
            key: "status",
            title: "Status",
            options: [
              { label: "All", value: "all" },
              { label: "Completed", value: "COMPLETED" },
              { label: "Processing", value: "PROCESSING" },
              { label: "Failed", value: "FAILED" },
            ],
          },
          {
            key: "export_format",
            title: "Format",
            options: [
              { label: "All", value: "all" },
              { label: "PDF", value: "PDF" },
              { label: "Excel", value: "EXCEL" },
              { label: "CSV", value: "CSV" },
            ],
          },
        ]}
      />
    </div>
  );
};
```

### Enhanced Dialog Components

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const templateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  report_type: z.enum([
    "FINANCIAL_SUMMARY",
    "PROFIT_LOSS",
    "BALANCE_SHEET",
    "CASH_FLOW",
    "CUSTOM",
  ]),
});

const CreateTemplateDialog = ({ open, onOpenChange }: DialogProps) => {
  const form = useForm<z.infer<typeof templateSchema>>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: "",
      description: "",
      report_type: "FINANCIAL_SUMMARY",
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      onOpenChange(false);
      form.reset();
      queryClient.invalidateQueries(["report-templates"]);
      toast({
        title: "Template created",
        description: "Your report template has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error creating template",
        description: error.message,
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Report Template</DialogTitle>
          <DialogDescription>
            Create a reusable template for generating reports.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(createTemplateMutation.mutate)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter template name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this template (optional)"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="report_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Report Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FINANCIAL_SUMMARY">
                        Financial Summary
                      </SelectItem>
                      <SelectItem value="PROFIT_LOSS">Profit & Loss</SelectItem>
                      <SelectItem value="BALANCE_SHEET">
                        Balance Sheet
                      </SelectItem>
                      <SelectItem value="CASH_FLOW">Cash Flow</SelectItem>
                      <SelectItem value="CUSTOM">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createTemplateMutation.isPending}>
                {createTemplateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Template"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
```

## Testing Strategy

### Unit Tests

```typescript
describe("Reports Component Migration", () => {
  it("renders all tabs correctly", () => {
    render(<Reports />);

    expect(
      screen.getByRole("tab", { name: /generate reports/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /templates/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /export history/i })
    ).toBeInTheDocument();
  });

  it("handles template creation flow", async () => {
    render(<Reports />);

    await user.click(screen.getByRole("tab", { name: /templates/i }));
    await user.click(screen.getByRole("button", { name: /create template/i }));

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();

    await user.type(screen.getByLabelText(/template name/i), "Test Template");
    await user.selectOptions(
      screen.getByLabelText(/report type/i),
      "PROFIT_LOSS"
    );
    await user.click(screen.getByRole("button", { name: /create template/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("displays export history with proper status indicators", async () => {
    const mockExports = [
      { id: 1, name: "Q4 Report", status: "COMPLETED", export_format: "PDF" },
      {
        id: 2,
        name: "Monthly Analysis",
        status: "PROCESSING",
        export_format: "EXCEL",
      },
    ];

    mockQuery("report-exports", mockExports);
    render(<Reports />);

    await user.click(screen.getByRole("tab", { name: /export history/i }));

    expect(screen.getByText("Q4 Report")).toBeInTheDocument();
    expect(screen.getByText("Monthly Analysis")).toBeInTheDocument();
    expect(screen.getByText("PDF")).toBeInTheDocument();
    expect(screen.getByText("EXCEL")).toBeInTheDocument();
  });
});
```

### E2E Tests

```typescript
describe("Reports E2E Flow", () => {
  it("completes full report generation workflow", () => {
    cy.visit("/reports");

    // Navigate to generate tab
    cy.get('[data-testid="generate-tab"]').click();

    // Select report type
    cy.get('[data-testid="report-type-financial-summary"]').click();
    cy.get('[data-testid="generate-report-button"]').click();

    // Fill generation dialog
    cy.get('[data-testid="report-name"]').type("Test Financial Report");
    cy.get('[data-testid="export-format"]').select("PDF");
    cy.get('[data-testid="confirm-generate"]').click();

    // Verify navigation to history
    cy.get('[data-testid="history-tab"]').should("be.visible");
    cy.get('[data-testid="history-tab"]').click();

    // Verify report appears in history
    cy.contains("Test Financial Report").should("be.visible");
    cy.get('[data-testid="status-badge"]').should("contain", "PROCESSING");
  });
});
```

## Acceptance Criteria

### UI Migration Complete

- [ ] All Material-UI components replaced with Radix UI equivalents
- [ ] Consistent styling using Tailwind CSS and design tokens
- [ ] All existing functionality preserved and enhanced
- [ ] Responsive design maintained across all breakpoints

### Enhanced User Experience

- [ ] Improved keyboard navigation throughout all interfaces
- [ ] Enhanced focus management in dialogs and forms
- [ ] Smooth animations for state transitions
- [ ] Better loading states and progress indicators
- [ ] Contextual menus for enhanced productivity

### Accessibility Improvements

- [ ] All components meet WCAG 2.1 AA standards
- [ ] Screen reader announcements for dynamic content
- [ ] Proper ARIA labels for all interactive elements
- [ ] High contrast mode support maintained

### Performance Optimization

- [ ] Reduced bundle size through Material-UI removal
- [ ] Efficient data table rendering for large datasets
- [ ] Optimized re-renders through proper memoization
- [ ] Fast tab switching and navigation

### Code Quality

- [ ] TypeScript types for all new components
- [ ] Comprehensive unit test coverage (>90%)
- [ ] E2E test coverage for critical user flows
- [ ] Consistent code patterns following design system guidelines

## Dependencies

This task depends on:

- **Task 18**: Radix UI Design System Migration (for base components)
- **Enhanced DataTable component** with sorting/filtering
- **Form validation** system (React Hook Form + Zod)
- **Toast notification** system

## Risk Mitigation

- **Data Loss**: Ensure all existing functionality works during migration
- **Performance Regression**: Monitor table rendering performance with large datasets
- **Accessibility Regression**: Comprehensive accessibility testing throughout migration
- **User Training**: Document changes in interface patterns

This migration establishes the Reports component as the flagship example of complex data management interfaces using Radix UI, demonstrating best practices for tabbed interfaces, data tables, and form management across the FinVision platform.
