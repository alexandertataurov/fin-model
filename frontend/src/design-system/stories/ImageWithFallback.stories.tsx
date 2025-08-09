import React from 'react';
import { ImageWithFallback } from '../components/ImageWithFallback';

const meta = {
  title: 'Design System/ImageWithFallback',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

const VALID_DATA_URI =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100"><rect width="160" height="100" fill="%23ddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="14">Demo Image</text></svg>';

export const Valid = {
  render: () => (
    <ImageWithFallback
      src={VALID_DATA_URI}
      alt="Demo"
      width={160}
      height={100}
    />
  ),
};

export const ErrorFallback = {
  render: () => (
    <ImageWithFallback
      src="invalid-image.jpg"
      alt="Broken"
      width={160}
      height={100}
    />
  ),
};
