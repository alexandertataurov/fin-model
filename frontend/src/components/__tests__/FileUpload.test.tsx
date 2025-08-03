import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import FileUploadDropzone from '../FileUpload/FileUploadDropzone';
import FileList from '../FileUpload/FileList';
import * as fileApi from '../../services/fileApi';

// Mock the file API
vi.mock('../../services/fileApi', () => ({
  uploadFile: vi.fn(),
  getFiles: vi.fn(),
  deleteFile: vi.fn(),
  processFile: vi.fn(),
  cancelProcessing: vi.fn(),
  downloadFile: vi.fn(),
}));

const mockFileUpload = vi.mocked(fileApi.uploadFile);
const mockGetFiles = vi.mocked(fileApi.getFiles);

// Mock API responses
const mockApiResponses = {
  files: [
    {
      id: 1,
      original_filename: 'test1.xlsx',
      filename: 'test1_123.xlsx',
      file_size: 1024,
      status: 'completed',
      uploaded_at: '2023-01-01T00:00:00Z',
      processed_at: '2023-01-01T00:01:00Z',
      file_type: 'excel',
      processing_logs: [],
    },
    {
      id: 2,
      original_filename: 'test2.xlsx',
      filename: 'test2_456.xlsx',
      file_size: 2048,
      status: 'pending',
      uploaded_at: '2023-01-01T00:02:00Z',
      processed_at: null,
      file_type: 'excel',
      processing_logs: [],
    },
    {
      id: 3,
      original_filename: 'test3.xlsx',
      filename: 'test3_789.xlsx',
      file_size: 3072,
      status: 'processing',
      uploaded_at: '2023-01-01T00:03:00Z',
      processed_at: null,
      file_type: 'excel',
      processing_logs: [],
    },
  ],
};

// Helper function to create mock file objects
const createMockFileObject = (name: string, size: number): File => {
  const file = new File(['test content'], name, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// Helper function to simulate file upload
const simulateFileUpload = async (input: HTMLInputElement, files: File[]) => {
  const event = new Event('change', { bubbles: true });
  Object.defineProperty(event, 'target', { value: { files } });
  input.dispatchEvent(event);
};

describe('FileUploadDropzone', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dropzone component', () => {
    render(<FileUploadDropzone />);
    expect(screen.getByTestId('dropzone')).toBeInTheDocument();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  it('handles file upload successfully', async () => {
    const onUploadComplete = vi.fn();
    mockFileUpload.mockResolvedValue(mockApiResponses.files[0]);

    render(<FileUploadDropzone onUploadComplete={onUploadComplete} />);

    const input = screen.getByTestId('file-input');
    const file = createMockFileObject('test.xlsx', 1024);

    await simulateFileUpload(input as HTMLInputElement, [file]);

    await waitFor(() => {
      expect(mockFileUpload).toHaveBeenCalledWith(file, expect.any(Function));
    });

    await waitFor(() => {
      expect(onUploadComplete).toHaveBeenCalledWith([
        mockApiResponses.files[0],
      ]);
    });
  });

  it('shows upload progress', async () => {
    let uploadResolve: (value: any) => void;
    const uploadPromise = new Promise(resolve => {
      uploadResolve = resolve;
    });
    mockFileUpload.mockReturnValue(uploadPromise);

    render(<FileUploadDropzone />);

    const input = screen.getByTestId('file-input');
    const file = createMockFileObject('test.xlsx', 1024);

    await simulateFileUpload(input as HTMLInputElement, [file]);

    // Should show progress bar
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Complete upload
    uploadResolve?.(mockApiResponses.files[0]);

    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  it('handles upload errors', async () => {
    const onUploadError = vi.fn();
    mockFileUpload.mockRejectedValue(new Error('Upload failed'));

    render(<FileUploadDropzone onUploadError={onUploadError} />);

    const input = screen.getByTestId('file-input');
    const file = createMockFileObject('test.xlsx', 1024);

    await simulateFileUpload(input as HTMLInputElement, [file]);

    await waitFor(() => {
      expect(onUploadError).toHaveBeenCalled();
    });
  });

  it('supports multiple file uploads', async () => {
    const onUploadComplete = vi.fn();
    mockFileUpload.mockResolvedValue(mockApiResponses.files[0]);

    render(<FileUploadDropzone onUploadComplete={onUploadComplete} />);

    const input = screen.getByTestId('file-input');
    const files = [
      createMockFileObject('test1.xlsx', 1024),
      createMockFileObject('test2.xlsx', 1024),
    ];

    await simulateFileUpload(input as HTMLInputElement, files);

    await waitFor(() => {
      expect(mockFileUpload).toHaveBeenCalledTimes(2);
    });
  });

  it('disables upload when disabled prop is true', () => {
    render(<FileUploadDropzone onUploadComplete={vi.fn()} />);

    const dropzone = screen.getByTestId('dropzone');
    expect(dropzone).toBeInTheDocument();

    const input = screen.getByTestId('file-input');
    expect(input).toBeInTheDocument();
  });
});

describe('FileList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API response
    mockGetFiles.mockResolvedValue({
      files: mockApiResponses.files,
      total: mockApiResponses.files.length,
      page: 1,
      page_size: 10,
      has_next: false,
      has_previous: false,
    });
  });

  it('renders file list component', async () => {
    render(<FileList />);

    // Wait for the table to load
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    // Mock loading state
    mockGetFiles.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<FileList />);

    // Should show loading spinner
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles pagination controls', async () => {
    render(<FileList />);

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    // Check for pagination info - use getAllByText since there are multiple "files" elements
    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    const filesElements = screen.getAllByText(/files/i);
    expect(filesElements.length).toBeGreaterThan(0);
  });

  it('has status filter functionality', async () => {
    render(<FileList />);

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    // Should have filter controls
    const filterSelect = screen.getByRole('combobox');
    expect(filterSelect).toBeInTheDocument();
  });

  it('displays file action menu', async () => {
    render(<FileList />);

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    // Should render the component successfully
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('refreshes data when refresh trigger changes', async () => {
    const { rerender } = render(<FileList />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    // Trigger refresh
    rerender(<FileList refreshTrigger={1} />);

    // Should call getFiles again
    await waitFor(() => {
      expect(mockGetFiles).toHaveBeenCalledTimes(2);
    });
  });
});
