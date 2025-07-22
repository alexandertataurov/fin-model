import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Download,
  Delete,
  MoreVert,
  PlayArrow,
  Stop,
  Visibility,
  Refresh,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fileApi, FileInfo, FileListResponse } from '../../services/fileApi';

interface FileListProps {
  refreshTrigger?: number;
}

const FileList: React.FC<FileListProps> = ({ refreshTrigger }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<FileInfo | null>(null);

  const queryClient = useQueryClient();

  // Fetch files query
  const {
    data: filesData,
    isLoading,
    error,
    refetch,
  } = useQuery<FileListResponse, Error>({
    queryKey: ['files', page + 1, rowsPerPage, statusFilter],
    queryFn: () => fileApi.getFiles(page + 1, rowsPerPage, statusFilter || undefined),
    refetchInterval: 5000, // Refresh every 5 seconds for status updates
  });

  // Refresh when trigger changes
  useEffect(() => {
    if (refreshTrigger) {
      refetch();
    }
  }, [refreshTrigger, refetch]);

  // Delete file mutation
  const deleteFileMutation = useMutation({
    mutationFn: (fileId: number) => fileApi.deleteFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      setDeleteDialogOpen(false);
      setFileToDelete(null);
    },
  });

  // Process file mutation
  const processFileMutation = useMutation({
    mutationFn: (fileId: number) => fileApi.processFile(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });

  // Cancel processing mutation
  const cancelProcessingMutation = useMutation({
    mutationFn: (fileId: number) => fileApi.cancelProcessing(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, file: FileInfo) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedFile(file);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedFile(null);
  };

  const handleDownload = async (file: FileInfo) => {
    try {
      await fileApi.downloadFile(file.id, file.original_filename);
    } catch (error) {
      console.error('Download failed:', error);
    }
    handleActionMenuClose();
  };

  const handleProcessFile = (file: FileInfo) => {
    processFileMutation.mutate(file.id);
    handleActionMenuClose();
  };

  const handleCancelProcessing = (file: FileInfo) => {
    cancelProcessingMutation.mutate(file.id);
    handleActionMenuClose();
  };

  const handleDeleteClick = (file: FileInfo) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
    handleActionMenuClose();
  };

  const handleDeleteConfirm = () => {
    if (fileToDelete) {
      deleteFileMutation.mutate(fileToDelete.id);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
  };

  const getStatusChip = (file: FileInfo) => {
    const color = fileApi.getStatusColor(file.status);
    const text = fileApi.getStatusText(file.status);
    
    return (
      <Chip
        size="small"
        label={text}
        color={color}
        variant={file.status === 'processing' ? 'filled' : 'outlined'}
        icon={file.status === 'processing' ? <CircularProgress size={12} /> : undefined}
      />
    );
  };

  const canProcess = (file: FileInfo) => {
    return file.status === 'uploaded' || file.status === 'failed';
  };

  const canCancel = (file: FileInfo) => {
    return file.status === 'processing';
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Error loading files: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header with filters and refresh */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Uploaded Files</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="uploaded">Uploaded</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => refetch()}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Files table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Uploaded</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filesData?.files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No files uploaded yet
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filesData?.files.map((file) => (
                <TableRow key={file.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {file.original_filename}
                      </Typography>
                      {file.validation_errors && (
                        <Typography variant="caption" color="error">
                          Validation errors
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {fileApi.formatFileSize(file.file_size)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ textTransform: 'uppercase' }}>
                      {file.file_type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(file)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(file.created_at)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => handleActionMenuOpen(e, file)}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {filesData && filesData.total > 0 && (
          <TablePagination
            component="div"
            count={filesData.total}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        )}
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={() => selectedFile && handleDownload(selectedFile)}>
          <Download sx={{ mr: 1 }} />
          Download
        </MenuItem>
        
        {selectedFile && canProcess(selectedFile) && (
          <MenuItem onClick={() => handleProcessFile(selectedFile)}>
            <PlayArrow sx={{ mr: 1 }} />
            Process File
          </MenuItem>
        )}
        
        {selectedFile && canCancel(selectedFile) && (
          <MenuItem onClick={() => handleCancelProcessing(selectedFile)}>
            <Stop sx={{ mr: 1 }} />
            Cancel Processing
          </MenuItem>
        )}
        
        <MenuItem onClick={() => selectedFile && handleDeleteClick(selectedFile)}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{fileToDelete?.original_filename}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteFileMutation.isPending}
          >
            {deleteFileMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileList; 