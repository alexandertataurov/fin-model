import React, { useState } from 'react';
import {
  CreateTemplateRequest,
  GenerateReportRequest,
} from '../services/reportApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DataTable } from '@/components/ui/DataTable';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Download,
  Trash2,
  Edit,
  FileText,
  MoreVertical,
  RefreshCw,
  Loader2,
  History,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'axios';

// Types
interface ReportTemplate {
  id: number;
  name: string;
  description?: string;
  report_type: string;
  is_system: boolean;
  is_active: boolean;
  template_config?: Record<string, unknown>;
  branding_config?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

interface ReportExport {
  id: number;
  name: string;
  export_format: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  file_path?: string;
  file_size?: number;
  processing_duration_seconds?: number;
  error_message?: string;
  created_at: string;
  expires_at?: string;
}

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState('generate');
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ReportTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    report_type: 'FINANCIAL_SUMMARY',
    export_format: 'PDF',
    source_file_ids: [] as number[],
    custom_config: {},
  });

  const queryClient = useQueryClient();

  // Fetch report templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['report-templates'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/reports/templates');
      return response.data;
    },
  });

  // Fetch report exports
  const { data: exports, isLoading: exportsLoading } = useQuery({
    queryKey: ['report-exports'],
    queryFn: async () => {
      const response = await axios.get('/api/v1/reports/exports?limit=50');
      return response.data;
    },
  });

  // Create template mutation
  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: CreateTemplateRequest) => {
      const response = await axios.post(
        '/api/v1/reports/templates',
        templateData
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-templates'] });
      setTemplateDialogOpen(false);
      resetFormData();
    },
  });

  // Generate report mutation
  const generateReportMutation = useMutation({
    mutationFn: async (reportData: GenerateReportRequest) => {
      const response = await axios.post('/api/v1/reports/generate', reportData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-exports'] });
      setGenerateDialogOpen(false);
      resetFormData();
    },
  });

  // Delete export mutation
  const deleteExportMutation = useMutation({
    mutationFn: async (exportId: number) => {
      await axios.delete(`/api/v1/reports/exports/${exportId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report-exports'] });
    },
  });

  const resetFormData = () => {
    setFormData({
      name: '',
      description: '',
      report_type: 'FINANCIAL_SUMMARY',
      export_format: 'PDF',
      source_file_ids: [],
      custom_config: {},
    });
    setSelectedTemplate(null);
  };

  const handleTextFieldChange =
    (field: string) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateTemplate = () => {
    createTemplateMutation.mutate({
      name: formData.name,
      description: formData.description,
      report_type: formData.report_type,
      template_config: formData.custom_config,
    });
  };

  const handleGenerateReport = () => {
    generateReportMutation.mutate({
      template_id: selectedTemplate?.id,
      export_format: formData.export_format as 'PDF' | 'EXCEL' | 'CSV',
      name: formData.name || `Report_${new Date().toISOString().split('T')[0]}`,
      source_file_ids: formData.source_file_ids,
      custom_config: formData.custom_config,
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    const mb = kb / 1024;
    if (mb >= 1) return `${mb.toFixed(2)} MB`;
    return `${kb.toFixed(2)} KB`;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'default';
      case 'PROCESSING':
      case 'PENDING':
        return 'secondary';
      case 'FAILED':
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports & Export</h1>
        <p className="text-muted-foreground">
          Generate financial reports, manage templates, and export data
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Reports
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Export History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Quick Report Generation</CardTitle>
                    <CardDescription>
                      Select a template and generate a comprehensive financial
                      report.
                    </CardDescription>
                  </div>
                  <Button onClick={() => setGenerateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Available Report Types
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        type: 'FINANCIAL_SUMMARY',
                        name: 'Financial Summary',
                        desc: 'Complete overview',
                      },
                      {
                        type: 'PROFIT_LOSS',
                        name: 'P&L Report',
                        desc: 'Revenue and expenses',
                      },
                      {
                        type: 'BALANCE_SHEET',
                        name: 'Balance Sheet',
                        desc: 'Assets and liabilities',
                      },
                      {
                        type: 'CASH_FLOW',
                        name: 'Cash Flow',
                        desc: 'Cash movement analysis',
                      },
                    ].map(reportType => (
                      <div
                        key={reportType.type}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            report_type: reportType.type,
                          }));
                          setGenerateDialogOpen(true);
                        }}
                      >
                        <div className="font-medium">{reportType.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {reportType.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
                <CardDescription>
                  Export charts and data in various formats for presentations
                  and analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Supported Formats
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        title: 'PDF Reports',
                        desc: 'Professional reports with charts and tables',
                        popular: true,
                      },
                      {
                        title: 'Excel Workbooks',
                        desc: 'Interactive spreadsheets with formulas',
                      },
                      {
                        title: 'CSV Data',
                        desc: 'Raw data for further analysis',
                      },
                      {
                        title: 'Chart Images',
                        desc: 'PNG/SVG charts for presentations',
                      },
                    ].map((format, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2"
                      >
                        <div>
                          <div className="font-medium">{format.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {format.desc}
                          </div>
                        </div>
                        {format.popular && (
                          <Badge variant="default">Most Popular</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Report Templates
              </h2>
              <p className="text-muted-foreground">
                Create and manage reusable report templates
              </p>
            </div>
            <Button onClick={() => setTemplateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </div>

          {templatesLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {templates?.map((template: ReportTemplate) => (
                <Card key={template.id} className="relative group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">
                          {template.name}
                        </CardTitle>
                        <CardDescription>
                          {template.description || 'No description available'}
                        </CardDescription>
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
                            onClick={() => {
                              setSelectedTemplate(template);
                              setGenerateDialogOpen(true);
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Generate Report
                          </DropdownMenuItem>
                          {!template.is_system && (
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Template
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">
                        {template.report_type.replace('_', ' ')}
                      </Badge>
                      {template.is_system && (
                        <Badge variant="secondary">System</Badge>
                      )}
                      {template.is_active && (
                        <Badge variant="default">Active</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Export History
              </h2>
              <p className="text-muted-foreground">
                Track and manage your report exports
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ['report-exports'] })
              }
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {exportsLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <DataTable
              columns={[
                {
                  id: 'name',
                  label: 'Name',
                  sortable: true,
                  format: value => (
                    <div className="font-medium">{String(value)}</div>
                  ),
                },
                {
                  id: 'export_format',
                  label: 'Format',
                  filterable: true,
                  filterType: 'select',
                  filterOptions: ['PDF', 'EXCEL', 'CSV'],
                  format: value => (
                    <Badge variant="outline">{String(value)}</Badge>
                  ),
                },
                {
                  id: 'status',
                  label: 'Status',
                  filterable: true,
                  filterType: 'select',
                  filterOptions: [
                    'COMPLETED',
                    'PROCESSING',
                    'PENDING',
                    'FAILED',
                    'CANCELLED',
                  ],
                  format: (value, row) => (
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(String(value))}>
                        {String(value)}
                      </Badge>
                      {value === 'PROCESSING' && (
                        <Progress value={65} className="w-16 h-2" />
                      )}
                    </div>
                  ),
                },
                {
                  id: 'file_size',
                  label: 'Size',
                  sortable: true,
                  format: value => formatFileSize(Number(value)),
                },
                {
                  id: 'created_at',
                  label: 'Created',
                  sortable: true,
                  format: value => (
                    <div className="text-sm text-muted-foreground">
                      {new Date(String(value)).toLocaleDateString()}
                    </div>
                  ),
                },
                {
                  id: 'processing_duration_seconds',
                  label: 'Duration',
                  format: value => (value ? `${value}s` : 'N/A'),
                },
              ]}
              data={exports || []}
              actions={row => (
                <div className="flex items-center gap-1">
                  {row.status === 'COMPLETED' && row.file_path && (
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteExportMutation.mutate(Number(row.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              searchable
              exportable
            />
          )}
        </TabsContent>

        <Dialog open={generateDialogOpen} onOpenChange={setGenerateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generate Report</DialogTitle>
              <DialogDescription>
                Create a new report with your selected configuration.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  value={formData.name}
                  onChange={handleTextFieldChange('name')}
                  placeholder="Enter report name"
                />
              </div>

              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select
                  value={formData.export_format}
                  onValueChange={handleSelectChange('export_format')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF Report</SelectItem>
                    <SelectItem value="EXCEL">Excel Workbook</SelectItem>
                    <SelectItem value="CSV">CSV Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedTemplate && (
                <Alert>
                  <AlertDescription>
                    Using template: <strong>{selectedTemplate.name}</strong>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setGenerateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateReport}
                disabled={generateReportMutation.isPending}
              >
                {generateReportMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Report Template</DialogTitle>
              <DialogDescription>
                Create a reusable template for generating reports.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={formData.name}
                  onChange={handleTextFieldChange('name')}
                  placeholder="Enter template name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template-description">Description</Label>
                <Textarea
                  id="template-description"
                  value={formData.description}
                  onChange={handleTextFieldChange('description')}
                  placeholder="Describe this template (optional)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select
                  value={formData.report_type}
                  onValueChange={handleSelectChange('report_type')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FINANCIAL_SUMMARY">
                      Financial Summary
                    </SelectItem>
                    <SelectItem value="PROFIT_LOSS">Profit & Loss</SelectItem>
                    <SelectItem value="BALANCE_SHEET">Balance Sheet</SelectItem>
                    <SelectItem value="CASH_FLOW">Cash Flow</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setTemplateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTemplate}
                disabled={createTemplateMutation.isPending || !formData.name}
              >
                {createTemplateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Template'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Tabs>
    </div>
  );
};

export default Reports;
