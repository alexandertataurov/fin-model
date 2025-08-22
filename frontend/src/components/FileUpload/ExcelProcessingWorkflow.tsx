import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/design-system/molecules';
import { Button } from '@/design-system/atoms';
import { Alert, AlertDescription } from '@/design-system/molecules';
import { Badge } from '@/design-system/atoms';
import {
  Upload,
  FileSpreadsheet,
  Eye,
  Settings,
  Play,
  CheckCircle,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

import FileUploadDropzone from './FileUploadDropzone';
import FilePreview from './FilePreview';
import StatementSelector from './StatementSelector';
import ProcessingProgress from './ProcessingProgress';
import { FileUploadResponse } from '../../services/fileApi';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface ExcelProcessingWorkflowProps {
  onProcessingComplete?: (result: any) => void;
  onError?: (error: string) => void;
  maxFiles?: number;
  maxFileSize?: number;
  className?: string;
}

const ExcelProcessingWorkflow: React.FC<ExcelProcessingWorkflowProps> = ({
  onProcessingComplete,
  onError,
  maxFiles = 1,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  className,
}) => {
  const [currentStep, setCurrentStep] = useState<string>('upload');
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResponse[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileUploadResponse | null>(
    null
  );
  const [processingTaskId, setProcessingTaskId] = useState<string | null>(null);
  const [, setStatementAssignments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const steps: WorkflowStep[] = [
    {
      id: 'upload',
      title: 'Upload File',
      description: 'Upload your Excel file',
      icon: <Upload className="h-4 w-4" />,
      status:
        currentStep === 'upload'
          ? 'active'
          : uploadedFiles.length > 0
            ? 'completed'
            : 'pending',
    },
    {
      id: 'preview',
      title: 'Preview Data',
      description: 'Review file contents',
      icon: <Eye className="h-4 w-4" />,
      status:
        currentStep === 'preview'
          ? 'active'
          : currentStep === 'configure' ||
              currentStep === 'processing' ||
              currentStep === 'complete'
            ? 'completed'
            : uploadedFiles.length > 0
              ? 'pending'
              : 'pending',
    },
    {
      id: 'configure',
      title: 'Configure Processing',
      description: 'Set statement types',
      icon: <Settings className="h-4 w-4" />,
      status:
        currentStep === 'configure'
          ? 'active'
          : currentStep === 'processing' || currentStep === 'complete'
            ? 'completed'
            : 'pending',
    },
    {
      id: 'processing',
      title: 'Process File',
      description: 'Extract financial data',
      icon: <Play className="h-4 w-4" />,
      status:
        currentStep === 'processing'
          ? 'active'
          : currentStep === 'complete'
            ? 'completed'
            : 'pending',
    },
    {
      id: 'complete',
      title: 'Complete',
      description: 'Review results',
      icon: <CheckCircle className="h-4 w-4" />,
      status: currentStep === 'complete' ? 'completed' : 'pending',
    },
  ];

  const handleUploadComplete = useCallback((files: FileUploadResponse[]) => {
    setUploadedFiles(files);
    setSelectedFile(files[0]);
    setCurrentStep('preview');
    setError(null);
  }, []);

  const handleUploadError = useCallback(
    (error: string) => {
      setError(error);
      onError?.(error);
    },
    [onError]
  );

  const handlePreviewNext = () => {
    if (selectedFile) {
      setCurrentStep('configure');
    }
  };

  const handleConfigurationConfirm = (assignments: any[]) => {
    setStatementAssignments(assignments);
    setCurrentStep('processing');
  };

  const handleProcessingComplete = (result: any) => {
    setCurrentStep('complete');
    onProcessingComplete?.(result);
  };

  const handleProcessingError = (error: string) => {
    setError(error);
    onError?.(error);
  };

  const resetWorkflow = () => {
    setCurrentStep('upload');
    setUploadedFiles([]);
    setSelectedFile(null);
    setProcessingTaskId(null);
    setStatementAssignments([]);
    setError(null);
  };

  const goToStep = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentStep);

    // Only allow going back to previous steps or the next immediate step
    if (stepIndex <= currentIndex) {
      setCurrentStep(stepId);
    }
  };

  const getStepStatusColor = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'active':
        return 'bg-blue-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'upload':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <FileSpreadsheet className="h-12 w-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Upload Your Excel File
              </h3>
              <p className="text-muted-foreground mb-6">
                Upload your financial Excel file to get started. We support
                .xlsx and .xls formats up to{' '}
                {Math.round(maxFileSize / (1024 * 1024))}MB.
              </p>
            </div>

            <FileUploadDropzone
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              maxFiles={maxFiles}
              maxSize={maxFileSize}
            />
          </div>
        );

      case 'preview':
        return selectedFile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">File Preview</h3>
                <p className="text-muted-foreground">
                  Review your file contents and detected financial statements
                </p>
              </div>
              <Button onClick={handlePreviewNext}>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <FilePreview
              fileId={selectedFile.id}
              fileName={selectedFile.original_filename}
            />
          </div>
        ) : null;

      case 'configure':
        return selectedFile ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Configure Processing</h3>
              <p className="text-muted-foreground">
                Review and adjust the detected financial statement types
              </p>
            </div>

            <StatementSelector
              sheets={[]} // This would be populated from the preview data
              detectedStatements={[]} // This would be populated from the preview data
              onAssignmentsChange={setStatementAssignments}
              onConfirm={handleConfigurationConfirm}
            />
          </div>
        ) : null;

      case 'processing':
        return selectedFile ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Processing File</h3>
              <p className="text-muted-foreground">
                Extracting and analyzing your financial data
              </p>
            </div>

            <ProcessingProgress
              fileId={selectedFile.id}
              taskId={processingTaskId || undefined}
              fileName={selectedFile.original_filename}
              onComplete={handleProcessingComplete}
              onError={handleProcessingError}
            />
          </div>
        ) : null;

      case 'complete':
        return (
          <div className="space-y-4 text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold">Processing Complete!</h3>
            <p className="text-muted-foreground mb-6">
              Your Excel file has been successfully processed and financial
              statements have been extracted.
            </p>

            <div className="space-y-2">
              <Button
                onClick={() => setCurrentStep('preview')}
                variant="outline"
              >
                View Results
              </Button>
              <Button onClick={resetWorkflow}>Process Another File</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileSpreadsheet className="h-5 w-5" />
            <span>Excel Processing Workflow</span>
          </CardTitle>
          <CardDescription>
            Follow these steps to upload and process your Excel financial data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={() => goToStep(step.id)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors ${getStepStatusColor(
                      step.status
                    )} ${step.status === 'active' ? 'ring-2 ring-blue-200' : ''}`}
                    disabled={step.status === 'pending'}
                  >
                    {step.icon}
                  </button>
                  <div className="text-center">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {step.description}
                    </div>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200 mx-4" />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Current Step Content */}
      <Card>
        <CardContent className="p-6">{renderStepContent()}</CardContent>
      </Card>

      {/* File Info */}
      {selectedFile && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Current File</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">
                  {selectedFile.original_filename}
                </span>
                <Badge variant="outline" className="text-xs">
                  {Math.round(selectedFile.file_size / 1024)} KB
                </Badge>
              </div>
              <Badge
                variant={
                  selectedFile.status === 'completed' ? 'default' : 'secondary'
                }
              >
                {selectedFile.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExcelProcessingWorkflow;
