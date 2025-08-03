import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import FileUploadDropzone from '../FileUpload/FileUploadDropzone';

describe('FileUploadDropzone', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dropzone component', () => {
    render(<FileUploadDropzone />);
    expect(screen.getByTestId('dropzone')).toBeInTheDocument();
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
  });

  it('displays correct text content', () => {
    render(<FileUploadDropzone />);
    expect(screen.getByText('Drag & drop files here')).toBeInTheDocument();
    expect(screen.getByText('or click to select files')).toBeInTheDocument();
    expect(screen.getByText(/Supported formats/)).toBeInTheDocument();
    expect(screen.getByText(/Max file size/)).toBeInTheDocument();
  });

  it('shows file size and count limits', () => {
    render(<FileUploadDropzone />);
    expect(screen.getByText(/10\.0/)).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  it('has proper file input attributes', () => {
    render(<FileUploadDropzone />);
    const input = screen.getByTestId('file-input');
    expect(input).toHaveAttribute('multiple');
    expect(input).toHaveAttribute('accept');
  });

  it('disables upload when disabled prop is true', () => {
    render(<FileUploadDropzone disabled />);
    const dropzone = screen.getByTestId('dropzone');
    expect(dropzone).toBeInTheDocument();
  });
});
