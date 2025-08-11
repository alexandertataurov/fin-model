import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { DCFValuation } from './DCFValuation';

const meta: Meta<typeof DCFValuation> = {
  title: 'Components/DCFValuation',
  component: DCFValuation,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
export const Loading: Story = { parameters: { docs: { description: { story: 'No data state.' } } } };
export const Empty: Story = { parameters: { docs: { description: { story: 'No data state.' } } } };
export const Error: Story = { parameters: { docs: { description: { story: 'Error state.' } } } };
