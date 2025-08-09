import React from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '../components/InputOTP';

const meta = {
  title: 'Design System/InputOTP',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Controlled = {
  render: () => {
    const [value, setValue] = React.useState('');
    return (
      <InputOTP maxLength={6} value={value} onChange={setValue}>
        <InputOTPGroup>
          {Array.from({ length: 3 }).map((_, i) => (
            <InputOTPSlot key={`a${i}`} index={i} />
          ))}
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          {Array.from({ length: 3 }).map((_, i) => (
            <InputOTPSlot key={`b${i}`} index={i + 3} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    );
  },
};
