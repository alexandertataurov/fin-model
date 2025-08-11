import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import FileUploadDropzone from '../FileUpload/FileUploadDropzone';
import FileList from '../FileUpload/FileList';
import FilePreview from '../FileUpload/FilePreview';
import ProcessingProgress from '../FileUpload/ProcessingProgress';
import StatementSelector from '../FileUpload/StatementSelector';
import ExcelProcessingWorkflow from '../FileUpload/ExcelProcessingWorkflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';

const meta: Meta<typeof FileUploadDropzone> = {
  title: 'Components/FileUpload',
  component: FileUploadDropzone,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'File upload components for handling Excel files and financial data processing.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    maxFiles: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum number of files allowed',
    },
    maxSize: {
      control: { type: 'number', min: 1024, max: 100 * 1024 * 1024 },
      description: 'Maximum file size in bytes',
    },
    accept: {
      control: { type: 'object' },
      description: 'Accepted file types',
    },
    onUploadComplete: {
      action: 'upload complete',
      description: 'Callback when upload completes',
    },
    onUploadError: {
      action: 'upload error',
      description: 'Callback when upload fails',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Mock data for stories
const mockFiles = [
  {
    id: '1',
    name: 'financial_data_2024.xlsx',
    size: 2048576,
    status: 'completed',
    uploaded_at: '2024-01-15T10:30:00Z',
    file_type: 'excel',
    processing_status: 'completed',
  },
  {
    id: '2',
    name: 'quarterly_report.xlsx',
    size: 1536000,
    status: 'processing',
    uploaded_at: '2024-01-15T11:00:00Z',
    file_type: 'excel',
    processing_status: 'processing',
  },
  {
    id: '3',
    name: 'annual_statements.xlsx',
    size: 5120000,
    status: 'error',
    uploaded_at: '2024-01-15T09:15:00Z',
    file_type: 'excel',
    processing_status: 'failed',
    error_message: 'Invalid file format',
  },
];

const mockSheetInfo = [
  {
    name: 'Income Statement',
    row_count: 150,
    column_count: 12,
    columns: ['Period', 'Revenue', 'Cost of Sales', 'Gross Profit', 'Operating Expenses', 'Operating Income', 'Net Income'],
  },
  {
    name: 'Balance Sheet',
    row_count: 200,
    column_count: 8,
    columns: ['Assets', 'Current Assets', 'Cash', 'Accounts Receivable', 'Inventory', 'Fixed Assets', 'Liabilities', 'Equity'],
  },
  {
    name: 'Cash Flow',
    row_count: 100,
    column_count: 10,
    columns: ['Operating Activities', 'Net Income', 'Depreciation', 'Working Capital Changes', 'Investing Activities', 'Financing Activities'],
  },
];

const mockDetectedStatements = [
  {
    sheet_name: 'Income Statement',
    statement_type: 'PROFIT_LOSS' as const,
    confidence: 0.95,
  },
  {
    sheet_name: 'Balance Sheet',
    statement_type: 'BALANCE_SHEET' as const,
    confidence: 0.92,
  },
  {
    sheet_name: 'Cash Flow',
    statement_type: 'CASH_FLOW' as const,
    confidence: 0.88,
  },
];

// FileUploadDropzone stories
export const Dropzone: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Upload Financial Files</CardTitle>
      </CardHeader>
      <CardContent>
        <FileUploadDropzone
          onUploadComplete={(files) => console.log('Upload complete:', files)}
          onUploadError={(error) => console.error('Upload error:', error)}
          maxFiles={5}
          maxSize={10 * 1024 * 1024} // 10MB
        />
      </CardContent>
    </Card>
  ),
};

export const DropzoneWithRestrictions: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Upload with Restrictions</CardTitle>
      </CardHeader>
      <CardContent>
        <FileUploadDropzone
          onUploadComplete={(files) => console.log('Upload complete:', files)}
          onUploadError={(error) => console.error('Upload error:', error)}
          maxFiles={1}
          maxSize={5 * 1024 * 1024} // 5MB
          accept={{
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
          }}
        />
      </CardContent>
    </Card>
  ),
};

// FileList stories
export const FileListComponent: Story = {
  render: () => (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Uploaded Files</CardTitle>
      </CardHeader>
      <CardContent>
        <FileList refreshTrigger={1} />
      </CardContent>
    </Card>
  ),
};

// FilePreview stories
export const FilePreviewComponent: Story = {
  render: () => (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>File Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <FilePreview
          fileId={1}
          fileName="financial_data_2024.xlsx"
          onStatementSelect={(statement) => console.log('Selected statement:', statement)}
        />
      </CardContent>
    </Card>
  ),
};

// ProcessingProgress stories
export const ProcessingProgressComponent: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Processing Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ProcessingProgress
          fileId={1}
          fileName="financial_data_2024.xlsx"
          onComplete={(result) => console.log('Processing complete:', result)}
          onError={(error) => console.error('Processing error:', error)}
        />
      </CardContent>
    </Card>
  ),
};

// StatementSelector stories
export const StatementSelectorComponent: Story = {
  render: () => (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Statement Assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <StatementSelector
          sheets={mockSheetInfo}
          detectedStatements={mockDetectedStatements}
          onAssignmentsChange={(assignments) => console.log('Assignments changed:', assignments)}
          onConfirm={(assignments) => console.log('Assignments confirmed:', assignments)}
        />
      </CardContent>
    </Card>
  ),
};

// ExcelProcessingWorkflow stories
export const ExcelProcessingWorkflowComponent: Story = {
  render: () => (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Excel Processing Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <ExcelProcessingWorkflow
          onProcessingComplete={(result) => console.log('Workflow complete:', result)}
          onError={(error) => console.error('Workflow error:', error)}
          maxFiles={1}
          maxFileSize={50 * 1024 * 1024} // 50MB
        />
      </CardContent>
    </Card>
  ),
};

// Complete workflow example
export const CompleteWorkflow: Story = {
  render: () => (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Step 1: Upload Files</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadDropzone
            onUploadComplete={(files) => console.log('Upload complete:', files)}
            onUploadError={(error) => console.error('Upload error:', error)}
            maxFiles={1}
            maxSize={10 * 1024 * 1024}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 2: File Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <ProcessingProgress
            fileId={1}
            fileName="financial_data_2024.xlsx"
            onComplete={(result) => console.log('Processing complete:', result)}
            onError={(error) => console.error('Processing error:', error)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 3: Preview & Assign Statements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">File Preview</h4>
              <FilePreview
                fileId={1}
                fileName="financial_data_2024.xlsx"
                onStatementSelect={(statement) => console.log('Selected statement:', statement)}
              />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Statement Assignment</h4>
              <StatementSelector
                sheets={mockSheetInfo}
                detectedStatements={mockDetectedStatements}
                onAssignmentsChange={(assignments) => console.log('Assignments changed:', assignments)}
                onConfirm={(assignments) => console.log('Assignments confirmed:', assignments)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step 4: File Management</CardTitle>
        </CardHeader>
        <CardContent>
          <FileList refreshTrigger={1} />
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Error states
export const UploadError: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Upload with Error</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Upload Failed</h4>
            <p className="text-red-700 text-sm">
              File "invalid_file.txt" is not supported. Please upload Excel files only.
            </p>
          </div>
          <FileUploadDropzone
            onUploadComplete={(files) => console.log('Upload complete:', files)}
            onUploadError={(error) => console.error('Upload error:', error)}
            maxFiles={1}
            maxSize={5 * 1024 * 1024}
          />
        </div>
      </CardContent>
    </Card>
  ),
};

export const ProcessingError: Story = {
  render: () => (
    <Card className="w-[500px]">
      <CardHeader>
        <CardTitle>Processing Error</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Processing Failed</h4>
            <p className="text-red-700 text-sm">
              Unable to parse Excel file. Please ensure the file contains valid financial data.
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              Retry Processing
            </Button>
          </div>
          <ProcessingProgress
            fileId={1}
            fileName="corrupted_file.xlsx"
            onComplete={(result) => console.log('Processing complete:', result)}
            onError={(error) => console.error('Processing error:', error)}
          />
        </div>
      </CardContent>
    </Card>
  ),
};

// Loading states
export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-6">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Uploading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">financial_data_2024.xlsx</span>
              <span className="text-sm text-muted-foreground">75%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Processing...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Analyzing file structure...</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: '45%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

// File type variations
export const DifferentFileTypes: Story = {
  render: () => (
    <div className="space-y-4">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Excel Files (.xlsx)</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadDropzone
            onUploadComplete={(files) => console.log('Upload complete:', files)}
            onUploadError={(error) => console.error('Upload error:', error)}
            accept={{
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            }}
          />
        </CardContent>
      </Card>

      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>Legacy Excel Files (.xls)</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadDropzone
            onUploadComplete={(files) => console.log('Upload complete:', files)}
            onUploadError={(error) => console.error('Upload error:', error)}
            accept={{
              'application/vnd.ms-excel': ['.xls'],
            }}
          />
        </CardContent>
      </Card>

      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>CSV Files</CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadDropzone
            onUploadComplete={(files) => console.log('Upload complete:', files)}
            onUploadError={(error) => console.error('Upload error:', error)}
            accept={{
              'text/csv': ['.csv'],
            }}
          />
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
