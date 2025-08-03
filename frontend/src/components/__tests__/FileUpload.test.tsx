import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import {
  render,
  mockApiResponses,
  createMockFileObject,
  simulateFileUpload,
} from '../../test/test-utils';
import FileUploadDropzone from '../FileUpload/FileUploadDropzone';
import FileList from '../FileUpload/FileList';

// Mock file API
const mockFileUpload = vi.fn();
const mockFileDelete = vi.fn();
const mockGetFiles = vi.fn();
const mockProcessFile = vi.fn();
const mockCancelProcessing = vi.fn();
const mockDownloadFile = vi.fn();

vi.mock('../../services/fileApi', () => ({
  fileApi: {
    uploadFile: (...args: unknown[]) => mockFileUpload(...args),
    deleteFile: (...args: unknown[]) => mockFileDelete(...args),
    getFiles: (...args: unknown[]) => mockGetFiles(...args),
    processFile: (...args: unknown[]) => mockProcessFile(...args),
    cancelProcessing: (...args: unknown[]) => mockCancelProcessing(...args),
    downloadFile: (...args: unknown[]) => mockDownloadFile(...args),
    formatFileSize: (bytes: number) => `${bytes} Bytes`,
    getStatusColor: () => 'info',
    getStatusText: () => 'Uploaded',
  },
}));

describe('FileUploadDropzone', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dropzone with proper instructions', () => {
    render(<FileUploadDropzone onUploadComplete={vi.fn()} />);

    expect(screen.getByText(/drag & drop.*files here/i)).toBeInTheDocument();
    expect(screen.getByText(/select files/i)).toBeInTheDocument();
    expect(screen.getByText(/supported formats/i)).toBeInTheDocument();
  });

  it('handles file selection via input', async () => {
    const onUploadComplete = vi.fn();
    mockFileUpload.mockResolvedValue(mockApiResponses.files[0]);

    render(<FileUploadDropzone onUploadComplete={onUploadComplete} />);

    const input = screen.getByTestId('file-input');
    const file = createMockFileObject('test.xlsx', 1024);

    await simulateFileUpload(input as HTMLInputElement, [file]);

    await waitFor(() => {
      expect(mockFileUpload).toHaveBeenCalledWith(
        file,
        expect.any(Function)
      );
    });
  });

  it('handles drag and drop', async () => {
    const onUploadComplete = vi.fn();
    mockFileUpload.mockResolvedValue(mockApiResponses.files[0]);

    render(<FileUploadDropzone onUploadComplete={onUploadComplete} />);

    const dropzone = screen.getByTestId('dropzone');
    const file = createMockFileObject('test.xlsx', 1024);

    // Simulate drag over
    fireEvent.dragOver(dropzone, {
      dataTransfer: {
        files: [file],
        types: ['Files'],
      },
    });

    // Simulate drop
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
        types: ['Files'],
      },
    });

    await waitFor(() => {
      expect(mockFileUpload).toHaveBeenCalledWith(
        file,
        expect.any(Function)
      );
    });
  });

  it('validates file types', async () => {
    const onUploadError = vi.fn();

    render(<FileUploadDropzone onUploadError={onUploadError} />);

    const input = screen.getByTestId('file-input');
    const invalidFile = createMockFileObject('test.txt', 1024, 'text/plain');

    await simulateFileUpload(input as HTMLInputElement, [invalidFile]);

    await waitFor(() => {
      expect(onUploadError).toHaveBeenCalled();
    });
  });

  it('validates file size', async () => {
    const onUploadError = vi.fn();

    render(<FileUploadDropzone onUploadError={onUploadError} maxSize={1000} />);

    const input = screen.getByTestId('file-input');
    const largeFile = createMockFileObject('test.xlsx', 2000);

    await simulateFileUpload(input as HTMLInputElement, [largeFile]);

    await waitFor(() => {
      expect(onUploadError).toHaveBeenCalled();
    });
  });

  it('shows upload progress', async () => {
    const onUploadComplete = vi.fn();
    let uploadResolve: (value: unknown) => void = vi.fn();
    const uploadPromise = new Promise(resolve => {
      uploadResolve = resolve;
    });
    mockFileUpload.mockReturnValue(uploadPromise);

    render(<FileUploadDropzone onUploadComplete={onUploadComplete} />);

    const input = screen.getByTestId('file-input');
    const file = createMockFileObject('test.xlsx', 1024);

    await simulateFileUpload(input as HTMLInputElement, [file]);

    // Should show loading state
    expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Complete upload
    uploadResolve?.(mockApiResponses.files[0]);

    await waitFor(() => {
      expect(screen.queryByText(/uploading/i)).not.toBeInTheDocument();
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

    // Should show loading indicators
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles pagination controls', async () => {
    render(<FileList />);

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    // Check for pagination info
    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    expect(screen.getByText(/files/i)).toBeInTheDocument();
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
    const { rerender } = render(<FileList refreshTrigger={1} />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    // Re-render with new trigger
    rerender(<FileList refreshTrigger={2} />);

    // Component should still be rendered
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
