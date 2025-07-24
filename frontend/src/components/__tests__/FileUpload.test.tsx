import React from 'react';
import { screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, mockApiResponses, createMockFile, simulateFileUpload } from '../../test/test-utils';
import { FileUploadDropzone } from '../FileUpload/FileUploadDropzone';
import { FileList } from '../FileUpload/FileList';

import { vi } from 'vitest';

// Mock file API
const mockFileUpload = vi.fn();
const mockFileDelete = vi.fn();

vi.mock('../../services/fileApi', () => ({
  uploadFile: (...args: unknown[]) => mockFileUpload(...args),
  deleteFile: (...args: unknown[]) => mockFileDelete(...args),
  getUserFiles: () => Promise.resolve(mockApiResponses.files),
}));

describe('FileUploadDropzone', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dropzone with proper instructions', () => {
    render(<FileUploadDropzone onUpload={vi.fn()} />);
    
    expect(screen.getByText(/drag & drop files here/i)).toBeInTheDocument();
    expect(screen.getByText(/or click to browse/i)).toBeInTheDocument();
    expect(screen.getByText(/supported formats: xlsx, xls/i)).toBeInTheDocument();
  });

  it('handles file selection via input', async () => {
    const onUpload = vi.fn();
    mockFileUpload.mockResolvedValue(mockApiResponses.files[0]);

    render(<FileUploadDropzone onUpload={onUpload} />);
    
    const input = screen.getByLabelText(/choose file/i);
    const file = createMockFile('test.xlsx', 1024);
    
    await simulateFileUpload(input as HTMLInputElement, [file]);
    
    await waitFor(() => {
      expect(mockFileUpload).toHaveBeenCalledWith(file);
    });
  });

  it('handles drag and drop', async () => {
    const onUpload = vi.fn();
    mockFileUpload.mockResolvedValue(mockApiResponses.files[0]);

    render(<FileUploadDropzone onUpload={onUpload} />);
    
    const dropzone = screen.getByTestId('dropzone');
    const file = createMockFile('test.xlsx', 1024);
    
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
    const onUpload = vi.fn();

    render(<FileUploadDropzone onUpload={onUpload} />);
    
    const input = screen.getByLabelText(/choose file/i);
    const invalidFile = createMockFile('test.txt', 1024, 'text/plain');
    
    await simulateFileUpload(input as HTMLInputElement, [invalidFile]);
    
    expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
    expect(mockFileUpload).not.toHaveBeenCalled();
  });

  it('validates file size', async () => {
    const onUpload = vi.fn();

    render(<FileUploadDropzone onUpload={onUpload} maxSize={1000} />);
    
    const input = screen.getByLabelText(/choose file/i);
    const largeFile = createMockFile('test.xlsx', 2000);
    
    await simulateFileUpload(input as HTMLInputElement, [largeFile]);
    
    expect(screen.getByText(/file too large/i)).toBeInTheDocument();
    expect(mockFileUpload).not.toHaveBeenCalled();
  });

  it('shows upload progress', async () => {
    const onUpload = vi.fn();
    let uploadResolve: (value: any) => void;
    const uploadPromise = new Promise((resolve) => {
      uploadResolve = resolve;
    });
    mockFileUpload.mockReturnValue(uploadPromise);

    render(<FileUploadDropzone onUpload={onUpload} />);
    
    const input = screen.getByLabelText(/choose file/i);
    const file = createMockFile('test.xlsx', 1024);
    
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
    const onUpload = vi.fn();
    mockFileUpload.mockRejectedValue(new Error('Upload failed'));

    render(<FileUploadDropzone onUpload={onUpload} />);
    
    const input = screen.getByLabelText(/choose file/i);
    const file = createMockFile('test.xlsx', 1024);
    
    await simulateFileUpload(input as HTMLInputElement, [file]);
    
    await waitFor(() => {
      expect(screen.getByText(/upload failed/i)).toBeInTheDocument();
    });
  });

  it('supports multiple file uploads', async () => {
    const onUpload = vi.fn();
    mockFileUpload.mockResolvedValue(mockApiResponses.files[0]);

    render(<FileUploadDropzone onUpload={onUpload} multiple />);
    
    const input = screen.getByLabelText(/choose file/i);
    const files = [
      createMockFile('test1.xlsx', 1024),
      createMockFile('test2.xlsx', 1024),
    ];
    
    await simulateFileUpload(input as HTMLInputElement, files);
    
    await waitFor(() => {
      expect(mockFileUpload).toHaveBeenCalledTimes(2);
    });
  });

  it('disables upload when disabled prop is true', () => {
    render(<FileUploadDropzone onUpload={vi.fn()} disabled />);
    
    const dropzone = screen.getByTestId('dropzone');
    expect(dropzone).toHaveClass('disabled');
    
    const input = screen.getByLabelText(/choose file/i);
    expect(input).toBeDisabled();
  });
});

describe('FileList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders list of files', () => {
    const files = mockApiResponses.files;
    render(<FileList files={files} onDelete={vi.fn()} />);
    
    expect(screen.getByText('test.xlsx')).toBeInTheDocument();
    expect(screen.getByText('1024 bytes')).toBeInTheDocument();
  });

  it('handles file deletion', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const files = mockApiResponses.files;
    mockFileDelete.mockResolvedValue(true);

    render(<FileList files={files} onDelete={onDelete} />);
    
    const deleteButton = screen.getByLabelText(/delete file/i);
    await user.click(deleteButton);
    
    // Should show confirmation dialog
    expect(screen.getByText(/confirm deletion/i)).toBeInTheDocument();
    
    const confirmButton = screen.getByText(/delete/i);
    await user.click(confirmButton);
    
    await waitFor(() => {
      expect(mockFileDelete).toHaveBeenCalledWith(files[0].id);
      expect(onDelete).toHaveBeenCalledWith(files[0].id);
    });
  });

  it('shows processing status', () => {
    const files = [
      { ...mockApiResponses.files[0], processing_status: 'processing' },
      { ...mockApiResponses.files[0], processing_status: 'completed', id: 2 },
      { ...mockApiResponses.files[0], processing_status: 'failed', id: 3 },
    ];

    render(<FileList files={files} onDelete={vi.fn()} />);
    
    expect(screen.getByText(/processing/i)).toBeInTheDocument();
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
    expect(screen.getByText(/failed/i)).toBeInTheDocument();
  });

  it('shows empty state when no files', () => {
    render(<FileList files={[]} onDelete={vi.fn()} />);
    
    expect(screen.getByText(/no files uploaded/i)).toBeInTheDocument();
  });

  it('handles file download', async () => {
    const user = userEvent.setup();
    const files = mockApiResponses.files;
    
    // Mock URL.createObjectURL
    const mockCreateObjectURL = jest.fn(() => 'mock-url');
    global.URL.createObjectURL = mockCreateObjectURL;
    
    render(<FileList files={files} onDelete={vi.fn()} />);
    
    const downloadButton = screen.getByLabelText(/download file/i);
    await user.click(downloadButton);
    
    // Should trigger download
    expect(mockCreateObjectURL).toHaveBeenCalled();
  });

  it('supports sorting by different columns', async () => {
    const user = userEvent.setup();
    const files = [
      { ...mockApiResponses.files[0], original_filename: 'b.xlsx', id: 1 },
      { ...mockApiResponses.files[0], original_filename: 'a.xlsx', id: 2 },
    ];

    render(<FileList files={files} onDelete={vi.fn()} />);
    
    // Initially shows files in original order
    const rows = screen.getAllByRole('row');
    expect(within(rows[1]).getByText('b.xlsx')).toBeInTheDocument();
    expect(within(rows[2]).getByText('a.xlsx')).toBeInTheDocument();
    
    // Click on filename header to sort
    const nameHeader = screen.getByText(/filename/i);
    await user.click(nameHeader);
    
    // Should be sorted alphabetically
    const sortedRows = screen.getAllByRole('row');
    expect(within(sortedRows[1]).getByText('a.xlsx')).toBeInTheDocument();
    expect(within(sortedRows[2]).getByText('b.xlsx')).toBeInTheDocument();
  });

  it('filters files by search term', async () => {
    const user = userEvent.setup();
    const files = [
      { ...mockApiResponses.files[0], original_filename: 'financial-data.xlsx', id: 1 },
      { ...mockApiResponses.files[0], original_filename: 'budget-2023.xlsx', id: 2 },
    ];

    render(<FileList files={files} onDelete={vi.fn()} />);
    
    const searchInput = screen.getByLabelText(/search files/i);
    await user.type(searchInput, 'financial');
    
    expect(screen.getByText('financial-data.xlsx')).toBeInTheDocument();
    expect(screen.queryByText('budget-2023.xlsx')).not.toBeInTheDocument();
  });

  it('shows file details in expanded view', async () => {
    const user = userEvent.setup();
    const files = mockApiResponses.files;

    render(<FileList files={files} onDelete={vi.fn()} />);
    
    const expandButton = screen.getByLabelText(/show details/i);
    await user.click(expandButton);
    
    expect(screen.getByText(/upload date/i)).toBeInTheDocument();
    expect(screen.getByText(/file size/i)).toBeInTheDocument();
    expect(screen.getByText(/processing status/i)).toBeInTheDocument();
  });
}); 
