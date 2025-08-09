import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '../components/Avatar';

const meta = {
  title: 'Design System/Avatar',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Basic = {
  render: () => (
    <Avatar className="h-16 w-16">
      <AvatarImage src="https://github.com/shadcn.png" alt="User" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback = {
  render: () => (
    <Avatar className="h-16 w-16">
      <AvatarImage src="/invalid.png" alt="Broken" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};
