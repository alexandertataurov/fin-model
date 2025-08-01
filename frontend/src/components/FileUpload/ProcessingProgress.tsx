import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  FileText,
  Loader2,
  Play,
  Square
} from 'lucide-react';
import { fileApi } from '../../services/fileApi';

interface ProcessingJob {
  id: string;
  fileName: string;
  fileSize: number;
  progress: number;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  startTime: Date;
  estimatedCompletion?: Date;
  errorMessage?: string;
  currentStep?: string;
}

interface ProcessingProgressProps {
  fileId: number;
  taskId?: string;
  fileName: string;
  onComplete?: (result: any) => void;
  onError?: (error: string) => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const ProcessingProgress: React.FC<ProcessingProgressProps> = ({
  fileId,
  taskId,
  fileName,
  onComplete,
  onError,
  autoRefresh = true,
  refreshInterval = 2000
}) => {
  const [job, setJob] = useState<ProcessingJob>({
    id: taskId || '',
    fileName,
    fileSize: 0,
    progress: 0,
    status: 'idle',
    startTime: new Date()
  });
  const [isPolling, setIsPolling] = useState(false);

  // Processing steps for visual feedback
  const processingSteps = [
    { id: 'validation', label: 'Validating file', progress: 10 },
    { id: 'parsing', label: 'Parsing Excel sheets', progress: 30 },
    { id: 'detection', label: 'Detecting financial statements', progress: 50 },
    { id: 'extraction', label: 'Extracting data', progress: 70 },
    { id: 'validation_final', label: 'Final validation', progress: 90 },
    { id: 'completion', label: 'Processing complete', progress: 100 }
  ];

  const getCurrentStep = (progress: number) => {
    for (let i = processingSteps.length - 1; i >= 0; i--) {
      if (progress >= processingSteps[i].progress) {
        return processingSteps[i];
      }
    }
    return processingSteps[0];
  };

  const pollTaskStatus = async () => {
    if (!taskId || !isPolling) return;

    try {
      const status = await fileApi.getTaskStatus(taskId);
      
      setJob(prev => ({
        ...prev,
        progress: status.current || 0,
        status: status.state === 'SUCCESS' ? 'completed' : 
                status.state === 'FAILURE' ? 'error' : 'processing',
        currentStep: status.status || 'Processing...',
        errorMessage: status.error
      }));

      if (status.state === 'SUCCESS') {
        setIsPolling(false);
        onComplete?.(status.result);
      } else if (status.state === 'FAILURE') {
        setIsPolling(false);
        onError?.(status.error || 'Processing failed');
      }
    } catch (error) {
      console.error('Failed to poll task status:', error);
      // Continue polling on error, might be temporary
    }
  };

  useEffect(() => {
    if (autoRefresh && taskId && job.status === 'processing') {
      setIsPolling(true);
      const interval = setInterval(pollTaskStatus, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [taskId, autoRefresh, refreshInterval, job.status, isPolling]);

  const startProcessing = async () => {
    try {
      setJob(prev => ({ ...prev, status: 'processing', progress: 0 }));
      
      const result = await fileApi.startProcessing(fileId, {
        auto_detect_statements: true,
        preserve_formulas: true,
        validate_data: true,
        extract_metadata: true
      });

      setJob(prev => ({
        ...prev,
        id: result.task_id,
        status: 'processing'
      }));

      if (autoRefresh) {
        setIsPolling(true);
      }
    } catch (error: any) {
      setJob(prev => ({
        ...prev,
        status: 'error',
        errorMessage: error.message || 'Failed to start processing'
      }));
      onError?.(error.message || 'Failed to start processing');
    }
  };

  const cancelProcessing = async () => {
    if (!taskId) return;
    
    try {
      await fileApi.cancelProcessing(fileId);
      setJob(prev => ({ ...prev, status: 'idle', progress: 0 }));
      setIsPolling(false);
    } catch (error: any) {
      console.error('Failed to cancel processing:', error);
    }
  };

  const getStatusIcon = () => {
    switch (job.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'idle':
        return <Clock className="h-5 w-5 text-gray-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    const variants = {
      idle: 'secondary',
      uploading: 'default',
      processing: 'default',
      completed: 'default',
      error: 'destructive'
    } as const;

    const labels = {
      idle: 'Ready to Process',
      uploading: 'Uploading',
      processing: 'Processing',
      completed: 'Completed',
      error: 'Failed'
    };

    return (
      <Badge variant={variants[job.status] || 'secondary'}>
        {labels[job.status] || job.status}
      </Badge>
    );
  };

  const formatDuration = (startTime: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentStep = getCurrentStep(job.progress);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <div>
              <CardTitle className="text-lg">{fileName}</CardTitle>
              <CardDescription>Excel Processing</CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {job.currentStep || currentStep.label}
            </span>
            <span className="font-medium">{job.progress}%</span>
          </div>
          <Progress value={job.progress} className="h-2" />
        </div>

        {/* Processing Steps */}
        {job.status === 'processing' && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Processing Steps:</div>
            <div className="grid grid-cols-1 gap-1">
              {processingSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 text-sm ${
                    job.progress >= step.progress
                      ? 'text-green-600'
                      : job.progress >= (processingSteps[index - 1]?.progress || 0)
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-400'
                  }`}
                >
                  {job.progress >= step.progress ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : job.progress >= (processingSteps[index - 1]?.progress || 0) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-gray-300" />
                  )}
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Message */}
        {job.status === 'error' && job.errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{job.errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {job.status === 'completed' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Processing completed successfully! Your Excel file has been analyzed and financial statements have been detected.
            </AlertDescription>
          </Alert>
        )}

        {/* Timing Information */}
        {(job.status === 'processing' || job.status === 'completed') && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Duration: {formatDuration(job.startTime)}</span>
            {job.estimatedCompletion && job.status === 'processing' && (
              <span>
                ETA: {job.estimatedCompletion.toLocaleTimeString()}
              </span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {job.status === 'idle' && (
            <Button onClick={startProcessing} className="flex items-center space-x-2">
              <Play className="h-4 w-4" />
              <span>Start Processing</span>
            </Button>
          )}

          {job.status === 'processing' && (
            <Button
              variant="outline"
              onClick={cancelProcessing}
              className="flex items-center space-x-2"
            >
              <Square className="h-4 w-4" />
              <span>Cancel</span>
            </Button>
          )}

          {job.status === 'error' && (
            <Button
              variant="outline"
              onClick={startProcessing}
              className="flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Retry</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingProgress;