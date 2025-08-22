import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

// Test basic imports
import { Button } from '../../atoms/Button';
import { Icon } from '../../atoms/Icon';
import { Badge } from '../../atoms/Badge';

const meta: Meta<typeof Button> = {
  title: 'Test / Basic Components',
  component: Button,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TestButton: Story = {
  args: {
    children: 'Test Button',
    variant: 'default',
    size: 'md',
  },
};

export const TestIcon: Story = {
  render: () => <Icon name="home" size="md" />,
};

export const TestBadge: Story = {
  render: () => <Badge variant="default">Test Badge</Badge>,
};
