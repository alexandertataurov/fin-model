import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import {
  Box,
  Typography,
  LinearProgress,
  Alert,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  CloudUpload,
  InsertDriveFile,
  Delete as DeleteIcon,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { Button } from './Button';

export interface FileUploadFile extends File {
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
}

export interface FileUploadZoneProps {
  accept?: string[];
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  onFilesChange?: (files: FileUploadFile[]) => void;
  onUpload?: (files: FileUploadFile[]) => Promise<void>;
  autoUpload?: boolean;
  showFileList?: boolean;
  height?: number | string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  accept = ['.xlsx', '.xls', '.csv'],
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  multiple = true,
  disabled = false,
  onFilesChange,
  onUpload,
  autoUpload = false,
  showFileList = true,
  height = 200,
}) => {
  const [files, setFiles] = useState<FileUploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[], _rejectedFiles: FileRejection[]) => {
      const newFiles: FileUploadFile[] = acceptedFiles.map((file) => ({
        ...file,
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        status: 'pending' as const,
      }));

      const updatedFiles = multiple ? [...files, ...newFiles] : newFiles;
      
      // Limit to maxFiles
      const limitedFiles = updatedFiles.slice(0, maxFiles);
      
      setFiles(limitedFiles);
      onFilesChange?.(limitedFiles);

      // Auto upload if enabled
      if (autoUpload && onUpload && newFiles.length > 0) {
        handleUpload(limitedFiles);
      }
    },
    [files, multiple, maxFiles, onFilesChange, autoUpload, onUpload]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, ext) => {
      acc[getMimeType(ext)] = [ext];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple,
    disabled: disabled || uploading,
  });

  const handleUpload = async (filesToUpload: FileUploadFile[]) => {
    if (!onUpload) return;

    setUploading(true);
    
    try {
      // Update files to uploading status
      const uploadingFiles = filesToUpload.map(file => ({
        ...file,
        status: 'uploading' as const,
        progress: 0,
      }));
      setFiles(uploadingFiles);
      onFilesChange?.(uploadingFiles);

      await onUpload(uploadingFiles);

      // Update to success status
      const successFiles = uploadingFiles.map(file => ({
        ...file,
        status: 'success' as const,
        progress: 100,
      }));
      setFiles(successFiles);
      onFilesChange?.(successFiles);

    } catch (error) {
      // Update to error status
      const errorFiles = filesToUpload.map(file => ({
        ...file,
        status: 'error' as const,
        error: error instanceof Error ? error.message : 'Upload failed',
      }));
      setFiles(errorFiles);
      onFilesChange?.(errorFiles);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const handleClearAll = () => {
    setFiles([]);
    onFilesChange?.([]);
  };

  const getDropzoneStyle = () => {
    let borderColor = 'grey.300';
    let backgroundColor = 'grey.50';

    if (isDragActive) {
      borderColor = 'primary.main';
      backgroundColor = 'primary.50';
    }

    if (isDragReject) {
      borderColor = 'error.main';
      backgroundColor = 'error.50';
    }

    if (isDragAccept) {
      borderColor = 'success.main';
      backgroundColor = 'success.50';
    }

    if (disabled || uploading) {
      borderColor = 'grey.200';
      backgroundColor = 'grey.100';
    }

    return {
      borderColor,
      backgroundColor,
    };
  };

  const getFileIcon = (file: FileUploadFile) => {
    switch (file.status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'uploading':
        return <CloudUpload color="primary" />;
      default:
        return <InsertDriveFile />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const pendingFiles = files.filter(file => file.status === 'pending');
  const canUpload = !uploading && pendingFiles.length > 0 && onUpload;

  return (
    <Box>
      {/* Dropzone */}
      <Box
        {...getRootProps()}
        sx={{
          border: 2,
          borderStyle: 'dashed',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: disabled || uploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease-in-out',
          height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          ...getDropzoneStyle(),
        }}
      >
        <input {...getInputProps()} />
        
        <CloudUpload 
          sx={{ 
            fontSize: 48, 
            color: 'text.secondary',
            mb: 2,
            opacity: disabled || uploading ? 0.5 : 1,
          }} 
        />
        
        <Typography variant="h6" gutterBottom>
          {isDragActive
            ? 'Drop files here...'
            : 'Drag & drop files here, or click to select'}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Supported formats: {accept.join(', ')}
        </Typography>
        
        <Typography variant="caption" color="text.secondary">
          Max file size: {formatFileSize(maxSize)} • Max files: {maxFiles}
        </Typography>

        {(disabled || uploading) && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            {uploading ? 'Uploading...' : 'Upload disabled'}
          </Typography>
        )}
      </Box>

      {/* File List */}
      {showFileList && files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Selected Files ({files.length})
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {canUpload && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleUpload(pendingFiles)}
                  loading={uploading}
                  startIcon={<CloudUpload />}
                >
                  Upload {pendingFiles.length} file{pendingFiles.length !== 1 ? 's' : ''}
                </Button>
              )}
              
              <Button
                variant="outlined"
                size="small"
                onClick={handleClearAll}
                disabled={uploading}
              >
                Clear All
              </Button>
            </Box>
          </Box>

          <List dense>
            {files.map((file) => (
              <ListItem key={file.id} divider>
                <ListItemIcon>
                  {getFileIcon(file)}
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" noWrap>
                        {file.name}
                      </Typography>
                      <Chip
                        label={file.status}
                        size="small"
                        color={
                          file.status === 'success' ? 'success' :
                          file.status === 'error' ? 'error' :
                          file.status === 'uploading' ? 'primary' : 'default'
                        }
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                      
                      {file.status === 'uploading' && (
                        <LinearProgress
                          variant="determinate"
                          value={file.progress || 0}
                          sx={{ mt: 0.5 }}
                        />
                      )}
                      
                      {file.status === 'error' && file.error && (
                        <Alert severity="error" sx={{ mt: 0.5 }}>
                          {file.error}
                        </Alert>
                      )}
                    </Box>
                  }
                />
                
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveFile(file.id)}
                    disabled={uploading}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  );
};

// Helper function to get MIME type from extension
function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xls': 'application/vnd.ms-excel',
    '.csv': 'text/csv',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
  };
  
  return mimeTypes[extension] || '*/*';
}

export default FileUploadZone; 