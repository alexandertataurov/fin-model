import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/design-system/molecules';
import { Button, Badge } from '@/design-system/atoms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/design-system/molecules';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/design-system/molecules';
import { Alert, AlertDescription } from '@/design-system/molecules';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/design-system/molecules';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import {
  Download,
  Trash2,
  MoreHorizontal,
  Play,
  Square,
  RefreshCw,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fileApi, FileInfo, FileListResponse } from '../../services/fileApi';

interface FileListProps {
  refreshTrigger?: number;
}

const FileList: React.FC<FileListProps> = ({ refreshTrigger }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
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
    queryFn: () =>
      fileApi.getFiles(
        page + 1,
        rowsPerPage,
        statusFilter === 'ALL' ? undefined : statusFilter
      ),
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

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleDownload = async (file: FileInfo) => {
    try {
      await fileApi.downloadFile(file.id, file.original_filename);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleProcessFile = (file: FileInfo) => {
    processFileMutation.mutate(file.id);
  };

  const handleCancelProcessing = (file: FileInfo) => {
    cancelProcessingMutation.mutate(file.id);
  };

  const handleDeleteClick = (file: FileInfo) => {
    setFileToDelete(file);
    setDeleteDialogOpen(true);
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
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };

    return (
      <Badge
        variant="secondary"
        className={
          statusColors[file.status as keyof typeof statusColors] ||
          'bg-gray-100 text-gray-800'
        }
      >
        {file.status}
      </Badge>
    );
  };

  const canProcess = (file: FileInfo) => {
    return file.status === 'pending' || file.status === 'failed';
  };

  const canCancel = (file: FileInfo) => {
    return file.status === 'processing';
  };

  if (error) {
    return (
      <Alert>
        <AlertDescription>
          Failed to load files: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Files</h2>
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Files Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">File List</h3>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Filename</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filesData?.files.map(file => (
                  <TableRow key={file.id}>
                    <TableCell className="font-medium">
                      {file.filename}
                    </TableCell>
                    <TableCell>{getStatusChip(file)}</TableCell>
                    <TableCell>
                      {(file.file_size / 1024 / 1024).toFixed(2)} MB
                    </TableCell>
                    <TableCell>{formatDate(file.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(file)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {canProcess(file) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleProcessFile(file)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {canCancel(file) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelProcessing(file)}
                          >
                            <Square className="h-4 w-4" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(file)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {filesData && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {page * rowsPerPage + 1} to{' '}
            {Math.min((page + 1) * rowsPerPage, filesData.total)} of{' '}
            {filesData.total} files
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {page + 1} of {Math.ceil(filesData.total / rowsPerPage)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={(page + 1) * rowsPerPage >= filesData.total}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{fileToDelete?.filename}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteFileMutation.isPending}
            >
              {deleteFileMutation.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileList;
