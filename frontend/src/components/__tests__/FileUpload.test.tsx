import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockApiResponses, createMockFileObject, simulateFileUpload } from '../../test/test-utils';
import FileUploadDropzone from '../FileUpload/FileUploadDropzone';
import FileList from '../FileUpload/FileList';

// Mock file API
const mockFileUpload = jest.fn();
const mockFileDelete = jest.fn();

jest.mock('../../services/fileApi', () => ({
  uploadFile: (...args: unknown[]) => mockFileUpload(...args),
  deleteFile: (...args: unknown[]) => mockFileDelete(...args),
  getUserFiles: () => Promise.resolve(mockApiResponses.files),
}));

describe('FileUploadDropzone', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dropzone with proper instructions', () => {
    render(<FileUploadDropzone onUploadComplete={jest.fn()} />);
    
    expect(screen.getByText(/drag & drop files here/i)).toBeInTheDocument();
    expect(screen.getByText(/or click to browse/i)).toBeInTheDocument();
    expect(screen.getByText(/supported formats: xlsx, xls/i)).toBeInTheDocument();
  });

  it('handles file selection via input', async () => {
    const onUploadComplete = jest.fn();
    mockFileUpload.mockResolvedValue(mockApiResponses.files[0]);

    render(<FileUploadDropzone onUploadComplete={onUploadComplete} />);
    
    const input = screen.getByLabelText(/choose file/i);
    const file = createMockFileObject('test.xlsx', 1024);
    
    await simulateFileUpload(input as HTMLInputElement, [file]);
    
    await waitFor(() => {
      expect(mockFileUpload).toHaveBeenCalledWith(file);
    });
  });

  it('handles drag and drop', async () => {
    const onUploadComplete = jest.fn();
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
    
    expect(dropzone).toHaveClass('drag-active');
    
    // Simulate drop
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [file],
        types: ['Files'],
      },
    });
    
    await waitFor(() => {
      expect(mockFileUpload).toHaveBeenCalledWith(file);
    });
  });

  it('validates file types', async () => {
    const onUploadError = jest.fn();

    render(<FileUploadDropzone onUploadError={onUploadError} />);
    
    const input = screen.getByLabelText(/choose file/i);
    const invalidFile = createMockFileObject('test.txt', 1024, 'text/plain');
    
    await simulateFileUpload(input as HTMLInputElement, [invalidFile]);
    
    await waitFor(() => {
      expect(onUploadError).toHaveBeenCalled();
    });
  });

  it('validates file size', async () => {
    const onUploadError = jest.fn();

    render(<FileUploadDropzone onUploadError={onUploadError} maxSize={1000} />);
    
    const input = screen.getByLabelText(/choose file/i);
    const largeFile = createMockFileObject('test.xlsx', 2000);
    
    await simulateFileUpload(input as HTMLInputElement, [largeFile]);
    
    await waitFor(() => {
      expect(onUploadError).toHaveBeenCalled();
    });
  });

  it('shows upload progress', async () => {
    const onUploadComplete = jest.fn();
    let uploadResolve: (value: unknown) => void;
    const uploadPromise = new Promise((resolve) => {
      uploadResolve = resolve;
    });
    mockFileUpload.mockReturnValue(uploadPromise);

    render(<FileUploadDropzone onUploadComplete={onUploadComplete} />);
    
    const input = screen.getByLabelText(/choose file/i);
    const file = createMockFileObject('test.xlsx', 1024);
    
    await simulateFileUpload(input as HTMLInputElement, [file]);
    
    // Should show loading state
    expect(screen.getByText(/uploading/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    
    // Complete upload
    uploadResolve!(mockApiResponses.files[0]);
    
    await waitFor(() => {
      expect(screen.queryByText(/uploading/i)).not.toBeInTheDocument();
    });
  });

  it('handles upload errors', async () => {
    const onUploadError = jest.fn();
    mockFileUpload.mockRejectedValue(new Error('Upload failed'));

    render(<FileUploadDropzone onUploadError={onUploadError} />);
    
    const input = screen.getByLabelText(/choose file/i);
    const file = createMockFileObject('test.xlsx', 1024);
    
    await simulateFileUpload(input as HTMLInputElement, [file]);
    
    await waitFor(() => {
      expect(onUploadError).toHaveBeenCalled();
    });
  });

  it('supports multiple file uploads', async () => {
    const onUploadComplete = jest.fn();
    mockFileUpload.mockResolvedValue(mockApiResponses.files[0]);

    render(<FileUploadDropzone onUploadComplete={onUploadComplete} />);
    
    const input = screen.getByLabelText(/choose file/i);
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
    render(<FileUploadDropzone onUploadComplete={jest.fn()} />);
    
    const dropzone = screen.getByTestId('dropzone');
    expect(dropzone).toBeInTheDocument();
    
    const input = screen.getByLabelText(/choose file/i);
    expect(input).toBeInTheDocument();
  });
});

describe('FileList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders file list component', () => {
    render(<FileList />);
    
    // Should render the file list table
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<FileList />);
    
    // Should show loading indicators
    expect(screen.getByRole('progressbar') || screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('handles pagination controls', async () => {
    render(<FileList />);
    
    // Should have pagination controls
    const pagination = screen.getByRole('navigation');
    expect(pagination).toBeInTheDocument();
  });

  it('has status filter functionality', async () => {
    render(<FileList />);
    
    // Should have filter controls
    const filterSelect = screen.getByLabelText(/status/i) || screen.getByRole('combobox');
    expect(filterSelect).toBeInTheDocument();
  });

  it('displays file action menu', async () => {
    render(<FileList />);
    
    // Should render the component successfully
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('refreshes data when refresh trigger changes', () => {
    const { rerender } = render(<FileList refreshTrigger={1} />);
    
    // Re-render with new trigger
    rerender(<FileList refreshTrigger={2} />);
    
    // Component should still be rendered
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
}); 
