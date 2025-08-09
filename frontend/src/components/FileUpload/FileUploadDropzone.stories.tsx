import type { Meta, StoryObj } from '@storybook/react';
import FileUploadDropzone from './FileUploadDropzone';

const meta: Meta<typeof FileUploadDropzone> = {
  title: 'Components/FileUpload/Dropzone',
  component: FileUploadDropzone,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
