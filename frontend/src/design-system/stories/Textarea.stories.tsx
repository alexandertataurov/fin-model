import React from 'react';
import { Textarea } from '../components/Textarea';

const meta = {
  title: 'Design System/Textarea',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <Textarea placeholder="Type your message here" className="w-80" />
  ),
};
