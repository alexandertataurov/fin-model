import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { Progress } from '@/design-system/components/Progress';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye,
  Trash2
} from 'lucide-react';

interface FileUploadProps {
  onFileUpload?: (file: File) => void;
  onFileProcess?: (fileId: string) => void;
  onFileDelete?: (fileId: string) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  uploadedAt: Date;
  error?: string;
}

export function FileUpload({
  onFileUpload,
  onFileProcess,
  onFileDelete
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel') {
        
        const fileId = Math.random().toString(36).substr(2, 9);
        const newFile: UploadedFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'uploading',
          progress: 0,
          uploadedAt: new Date()
        };

        setUploadedFiles(prev => [...prev, newFile]);
        setIsUploading(true);

        // Simulate file upload
        const interval = setInterval(() => {
          setUploadedFiles(prev => prev.map(f => {
            if (f.id === fileId) {
              const newProgress = Math.min(f.progress + 10, 100);
              const newStatus = newProgress === 100 ? 'processing' : 'uploading';
              return { ...f, progress: newProgress, status: newStatus };
            }
            return f;
          }));
        }, 200);

        // Simulate processing completion
        setTimeout(() => {
          setUploadedFiles(prev => prev.map(f => {
            if (f.id === fileId) {
              return { ...f, status: 'complete', progress: 100 };
            }
            return f;
          }));
          setIsUploading(false);
          clearInterval(interval);
          onFileUpload?.(file);
        }, 3000);
      }
    });
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleFileDelete = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    onFileDelete?.(fileId);
  }, [onFileDelete]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-4 w-4 animate-pulse" />;
      case 'processing':
        return <FileSpreadsheet className="h-4 w-4 animate-spin" />;
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Upload className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'complete':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">File Upload</h2>
          <p className="text-muted-foreground">
            Upload Excel files for financial modeling and analysis
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Template
          </Button>
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Excel Files</CardTitle>
          <CardDescription>
            Drag and drop Excel files here or click to browse. Supported formats: .xlsx, .xls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">
              {isDragOver ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              or click to select files
            </p>
            <input
              type="file"
              multiple
              accept=".xlsx,.xls"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button asChild>
                <span>Choose Files</span>
              </Button>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <FileSpreadsheet className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(file.size)} • {file.uploadedAt.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge className={getStatusColor(file.status)}>
                      {getStatusIcon(file.status)}
                      <span className="ml-1 capitalize">{file.status}</span>
                    </Badge>
                    
                    {file.status === 'uploading' || file.status === 'processing' ? (
                      <div className="w-24">
                        <Progress value={file.progress} className="h-2" />
                      </div>
                    ) : null}
                    
                    {file.status === 'complete' && (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFileDelete(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Guidelines</CardTitle>
          <CardDescription>
            Best practices for uploading financial model files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">File Requirements</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Excel format (.xlsx or .xls)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Maximum file size: 50MB
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Clear sheet names and structure
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Consistent date formats
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Recommended Structure</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Separate sheets for P&L, Balance Sheet, Cash Flow
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Historical data in first columns
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Assumptions clearly labeled
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Consistent formatting throughout
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
