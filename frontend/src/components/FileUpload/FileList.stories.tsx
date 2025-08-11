import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import FileList from './FileList';

const meta: Meta<typeof FileList> = {
  title: 'Components/FileList',
  component: FileList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive file list component with filtering, pagination, and file management capabilities.',
      },
    },
  },
  argTypes: {
    refreshTrigger: {
      control: { type: 'number' },
      description: 'Trigger to refresh the file list',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    refreshTrigger: 1,
  },
};

export const WithRefreshTrigger: Story = {
  args: {
    refreshTrigger: Date.now(),
  },
};

export const EmptyState: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the component when no files are available.',
      },
    },
  },
  args: {
    refreshTrigger: 0,
  },
};
