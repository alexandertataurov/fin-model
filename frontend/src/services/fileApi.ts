import axios from 'axios';

const API_BASE_URL = '/api/v1';

export interface FileUploadResponse {
  id: number;
  filename: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  status: string;
  created_at: string;
}

export interface FileInfo {
  id: number;
  filename: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  mime_type: string;
  status: string;
  is_valid?: boolean;
  validation_errors?: string;
  processing_started_at?: string;
  processing_completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProcessingLogEntry {
  id: number;
  step: string;
  message: string;
  level: string;
  details?: string;
  timestamp: string;
}

export interface FileWithLogs extends FileInfo {
  processing_logs: ProcessingLogEntry[];
}

export interface FileListResponse {
  files: FileInfo[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface FileProcessingStatus {
  file_id: number;
  status: string;
  progress?: number;
  message?: string;
  current_step?: string;
  total_steps?: number;
  errors?: string[];
}

export interface UploadProgressCallback {
  (progress: number): void;
}

class FileApiService {
  private baseURL = API_BASE_URL;

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Upload a file with progress tracking
   */
  async uploadFile(
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post<FileUploadResponse>(
      `${this.baseURL}/files/upload`,
      formData,
      {
        headers: {
          ...this.getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      }
    );

    return response.data;
  }

  /**
   * Get list of uploaded files
   */
  async getFiles(
    page = 1,
    pageSize = 20,
    statusFilter?: string
  ): Promise<FileListResponse> {
    const params: Record<string, any> = {
      skip: (page - 1) * pageSize,
      limit: pageSize,
    };

    if (statusFilter) {
      params.status_filter = statusFilter;
    }

    const response = await axios.get<FileListResponse>(
      `${this.baseURL}/files/`,
      {
        params,
        headers: this.getAuthHeaders(),
      }
    );

    return response.data;
  }

  /**
   * Get information about a specific file
   */
  async getFileInfo(fileId: number): Promise<FileInfo> {
    const response = await axios.get<FileInfo>(
      `${this.baseURL}/files/${fileId}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    return response.data;
  }

  /**
   * Get file with processing logs
   */
  async getFileWithLogs(fileId: number): Promise<FileWithLogs> {
    const response = await axios.get<FileWithLogs>(
      `${this.baseURL}/files/${fileId}/details`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    return response.data;
  }

  /**
   * Get processing logs for a file
   */
  async getFileLogs(fileId: number): Promise<ProcessingLogEntry[]> {
    const response = await axios.get<ProcessingLogEntry[]>(
      `${this.baseURL}/files/${fileId}/logs`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    return response.data;
  }

  /**
   * Download a file
   */
  async downloadFile(fileId: number, originalFilename: string): Promise<void> {
    const response = await axios.get(
      `${this.baseURL}/files/${fileId}/download`,
      {
        headers: this.getAuthHeaders(),
        responseType: 'blob',
      }
    );

    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', originalFilename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: number): Promise<void> {
    await axios.delete(`${this.baseURL}/files/${fileId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  /**
   * Trigger file processing
   */
  async processFile(
    fileId: number,
    options?: Record<string, any>
  ): Promise<{ message: string; file_id: number }> {
    const response = await axios.post(
      `${this.baseURL}/files/${fileId}/process`,
      {
        file_id: fileId,
        processing_options: options,
      },
      {
        headers: this.getAuthHeaders(),
      }
    );

    return response.data;
  }

  /**
   * Cancel file processing
   */
  async cancelProcessing(
    fileId: number
  ): Promise<{ message: string; file_id: number }> {
    const response = await axios.post(
      `${this.baseURL}/files/${fileId}/cancel`,
      {},
      {
        headers: this.getAuthHeaders(),
      }
    );

    return response.data;
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get status color for Material-UI components
   */
  getStatusColor(status: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
    switch (status.toLowerCase()) {
      case 'uploaded':
        return 'info';
      case 'processing':
        return 'warning';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  }

  /**
   * Get status display text
   */
  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'uploaded':
        return 'Uploaded';
      case 'processing':
        return 'Processing';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  }
}

export const fileApi = new FileApiService(); 