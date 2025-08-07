import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  fileApi,
  FileUploadResponse,
  UploadProgressCallback,
} from '../../services/fileApi';

interface UploadingFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  uploadedInfo?: FileUploadResponse;
  error?: string;
}

interface FileUploadDropzoneProps {
  onUploadComplete?: (files: FileUploadResponse[]) => void;
  onUploadError?: (error: string) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
}

const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onUploadComplete,
  onUploadError,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept = {
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
      '.xlsx',
    ],
    'application/vnd.ms-excel': ['.xls'],
    'text/csv': ['.csv'],
  },
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map(file => {
          const reasons = file.errors.map(error => {
            switch (error.code) {
              case 'file-too-large':
                return `File is too large (max ${(maxSize / 1024 / 1024).toFixed(1)}MB)`;
              case 'file-invalid-type':
                return 'File type not supported';
              case 'too-many-files':
                return `Too many files (max ${maxFiles})`;
              default:
                return error.message;
            }
          });
          return `${file.file.name}: ${reasons.join(', ')}`;
        });

        onUploadError?.(errors.join('\n'));
        return;
      }

      if (acceptedFiles.length === 0) return;

      // Initialize uploading files state
      const initialUploadingFiles: UploadingFile[] = acceptedFiles.map(
        file => ({
          file,
          progress: 0,
          status: 'uploading',
        })
      );

      setUploadingFiles(initialUploadingFiles);

      // Upload files
      const uploadPromises = acceptedFiles.map(async (file, index) => {
        const progressCallback: UploadProgressCallback = progress => {
          setUploadingFiles(prev =>
            prev.map((uploadingFile, i) =>
              i === index ? { ...uploadingFile, progress } : uploadingFile
            )
          );
        };

        try {
          const result = await fileApi.uploadFile(file, progressCallback);

          setUploadingFiles(prev =>
            prev.map((uploadingFile, i) =>
              i === index
                ? {
                    ...uploadingFile,
                    status: 'completed',
                    uploadedInfo: result,
                  }
                : uploadingFile
            )
          );

          return result;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Upload failed';

          setUploadingFiles(prev =>
            prev.map((uploadingFile, i) =>
              i === index
                ? { ...uploadingFile, status: 'error', error: errorMessage }
                : uploadingFile
            )
          );

          throw error;
        }
      });

      try {
        const results = await Promise.all(uploadPromises);
        onUploadComplete?.(results);
      } catch (error) {
        onUploadError?.(
          error instanceof Error ? error.message : 'Upload failed'
        );
      }
    },
    [maxFiles, maxSize, onUploadComplete, onUploadError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
  });

  const removeUploadingFile = (index: number) => {
    setUploadingFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setUploadingFiles(prev => prev.filter(file => file.status !== 'completed'));
  };

  const getStatusIcon = (status: UploadingFile['status']) => {
    switch (status) {
      case 'uploading':
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        );
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            data-testid="dropzone"
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} data-testid="file-input" />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              or click to select files
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: Excel (.xlsx, .xls), CSV (.csv)
              <br />
              Max file size: {(maxSize / 1024 / 1024).toFixed(1)}MB | Max files:{' '}
              {maxFiles}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upload Progress</h3>
              <Button variant="outline" size="sm" onClick={clearCompleted}>
                Clear Completed
              </Button>
            </div>

            <div className="space-y-4">
              {uploadingFiles.map((uploadingFile, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">
                          {uploadingFile.file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadingFile.file.size / 1024 / 1024).toFixed(2)}{' '}
                          MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(uploadingFile.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUploadingFile(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {uploadingFile.status === 'uploading' && (
                    <Progress value={uploadingFile.progress} className="h-2" />
                  )}

                  {uploadingFile.status === 'completed' && (
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Uploaded successfully
                      </Badge>
                      {uploadingFile.uploadedInfo && (
                        <span className="text-xs text-muted-foreground">
                          ID: {uploadingFile.uploadedInfo.id}
                        </span>
                      )}
                    </div>
                  )}

                  {uploadingFile.status === 'error' && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        {uploadingFile.error || 'Upload failed'}
                      </AlertDescription>
                    </Alert>
                  )}

                  {index < uploadingFiles.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUploadDropzone;
