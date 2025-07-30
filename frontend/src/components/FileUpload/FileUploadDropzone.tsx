import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import {
  Box,
  Typography,
  LinearProgress,
  Alert,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Button,
} from '@mui/material';
import {
  CloudUpload,
  InsertDriveFile,
  Delete,
  CheckCircle,
  Error,
} from '@mui/icons-material';
import { fileApi, FileUploadResponse, UploadProgressCallback } from '../../services/fileApi';
import { tokens } from '@/theme';

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
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.ms-excel': ['.xls'],
    'text/csv': ['.csv'],
  },
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map((file) => {
          const reasons = file.errors.map((error) => {
            switch (error.code) {
              case 'file-too-large':
                return `File is too large (max ${fileApi.formatFileSize(maxSize)})`;
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

      setIsUploading(true);

      // Initialize uploading files state
      const initialUploadingFiles: UploadingFile[] = acceptedFiles.map((file) => ({
        file,
        progress: 0,
        status: 'uploading',
      }));

      setUploadingFiles(initialUploadingFiles);

      // Upload files sequentially to avoid overwhelming the server
      const uploadedFiles: FileUploadResponse[] = [];

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];

        try {
          const onProgress: UploadProgressCallback = (progress) => {
            setUploadingFiles((prev) =>
              prev.map((uf, index) =>
                index === i ? { ...uf, progress } : uf
              )
            );
          };

          const uploadedFile = await fileApi.uploadFile(file, onProgress);

          setUploadingFiles((prev) =>
            prev.map((uf, index) =>
              index === i
                ? {
                    ...uf,
                    progress: 100,
                    status: 'completed',
                    uploadedInfo: uploadedFile,
                  }
                : uf
            )
          );

          uploadedFiles.push(uploadedFile);
        } catch (error: unknown) {
          let errorMessage = 'Upload failed';
          if ((error as Error)?.message) {
            errorMessage = (error as Error).message;
          } else if (typeof error === 'object' && error !== null && 'response' in error) {
            const httpError = error as { response?: { data?: { detail?: string } } };
            errorMessage = httpError?.response?.data?.detail || 'Upload failed';
          }

          setUploadingFiles((prev) =>
            prev.map((uf, index) =>
              index === i
                ? {
                    ...uf,
                    status: 'error',
                    error: errorMessage,
                  }
                : uf
            )
          );

          onUploadError?.(errorMessage);
        }
      }

      setIsUploading(false);

      if (uploadedFiles.length > 0) {
        onUploadComplete?.(uploadedFiles);
      }
    },
    [maxFiles, maxSize, onUploadComplete, onUploadError]
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    multiple: true,
    disabled: isUploading,
  });

  const removeUploadingFile = (index: number) => {
    setUploadingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCompleted = () => {
    setUploadingFiles((prev) => prev.filter((file) => file.status !== 'completed'));
  };

  // DESIGN_FIX: replace hardcoded colors with design tokens
  const getDropzoneStyles = () => {
    let borderColor = tokens.colors.grey[400];
    let backgroundColor = tokens.colors.grey[50];

    if (isDragAccept) {
      borderColor = tokens.colors.success[500];
      backgroundColor = tokens.colors.success[50];
    } else if (isDragReject) {
      borderColor = tokens.colors.error[500];
      backgroundColor = tokens.colors.error[50];
    } else if (isDragActive) {
      borderColor = tokens.colors.primary[500];
      backgroundColor = tokens.colors.primary[50];
    }

    return {
      borderColor,
      backgroundColor,
      borderWidth: 2,
      borderStyle: 'dashed',
      borderRadius: '8px',
      padding: '40px 20px',
      textAlign: 'center' as const,
      cursor: isUploading ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      opacity: isUploading ? 0.6 : 1,
    };
  };

  const getStatusIcon = (status: UploadingFile['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      case 'uploading':
        return <CloudUpload color="primary" />;
      default:
        return <InsertDriveFile />;
    }
  };

  const getStatusColor = (status: UploadingFile['status']) => {
    switch (status) {
      case 'completed':
        return 'success' as const;
      case 'error':
        return 'error' as const;
      case 'uploading':
        return 'primary' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Box>
      {/* Dropzone */}
      <Paper elevation={1} sx={getDropzoneStyles()}>
        <div data-testid="dropzone" {...getRootProps()}>
          <input aria-label="file input" data-testid="file-input" {...getInputProps()} />
          <CloudUpload
            sx={{ fontSize: 48, color: tokens.colors.grey[600], mb: 2 }}
          />

          {isDragActive ? (
            isDragAccept ? (
              <Typography variant="h6" color="success.main">
                Drop files here to upload
              </Typography>
            ) : (
              <Typography variant="h6" color="error.main">
                Some files are not supported
              </Typography>
            )
          ) : (
            <>
              <Typography variant="h6" gutterBottom>
                Drag & drop Excel files here, or click to select files
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Supported formats: .xlsx, .xls, .csv (max {fileApi.formatFileSize(maxSize)} each)
              </Typography>
              <Button variant="outlined" disabled={isUploading}>
                Choose Files
              </Button>
            </>
          )}
        </div>
      </Paper>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Upload Progress ({uploadingFiles.filter(f => f.status === 'completed').length}/{uploadingFiles.length})
            </Typography>
            {uploadingFiles.some(f => f.status === 'completed') && (
              <Button variant="outlined" size="small" onClick={clearCompleted}>
                Clear Completed
              </Button>
            )}
          </Box>

          <List>
            {uploadingFiles.map((uploadingFile, index) => (
              <ListItem key={`${uploadingFile.file.name}-${index}`}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  {getStatusIcon(uploadingFile.status)}
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">{uploadingFile.file.name}</Typography>
                      <Chip
                        size="small"
                        label={uploadingFile.status}
                        color={getStatusColor(uploadingFile.status)}
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {fileApi.formatFileSize(uploadingFile.file.size)}
                      </Typography>

                      {uploadingFile.status === 'uploading' && (
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={uploadingFile.progress}
                            sx={{ borderRadius: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {uploadingFile.progress}%
                          </Typography>
                        </Box>
                      )}

                      {uploadingFile.status === 'error' && uploadingFile.error && (
                        <Alert severity="error" sx={{ mt: 1 }}>
                          {uploadingFile.error}
                        </Alert>
                      )}

                      {uploadingFile.status === 'completed' && uploadingFile.uploadedInfo && (
                        <Typography variant="caption" color="success.main">
                          ✓ Uploaded successfully (ID: {uploadingFile.uploadedInfo.id})
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => removeUploadingFile(index)}
                    disabled={uploadingFile.status === 'uploading'}
                  >
                    <Delete />
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

export default FileUploadDropzone;
