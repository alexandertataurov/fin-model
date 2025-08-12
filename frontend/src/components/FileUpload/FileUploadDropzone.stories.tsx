import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import FileUploadDropzone from './FileUploadDropzone';

const meta: Meta<typeof FileUploadDropzone> = {
  title: 'Components/FileUpload/Dropzone',
  component: FileUploadDropzone,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    maxFiles: {
      control: { type: 'number', min: 1, max: 20 },
      description: 'Maximum number of files that can be uploaded',
    },
    maxSize: {
      control: { type: 'number', min: 1024, max: 100 * 1024 * 1024 },
      description: 'Maximum file size in bytes',
    },
    onUploadComplete: {
      action: 'upload-complete',
      description: 'Callback when upload completes successfully',
    },
    onUploadError: {
      action: 'upload-error',
      description: 'Callback when upload fails',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
  },
};

export const SingleFile: Story = {
  args: {
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  },
};

export const LargeFiles: Story = {
  args: {
    maxFiles: 10,
    maxSize: 50 * 1024 * 1024, // 50MB
  },
};

export const CustomAcceptTypes: Story = {
  args: {
    maxFiles: 3,
    maxSize: 10 * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/plain': ['.txt'],
    },
  },
};
