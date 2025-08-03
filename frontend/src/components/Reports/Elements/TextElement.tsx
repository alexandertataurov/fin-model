import React from 'react';
import { TextConfig } from '@/types/template-builder';

interface TextElementProps {
  config?: TextConfig;
}

export const TextElement: React.FC<TextElementProps> = ({ config }) => {
  if (!config) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded">
        <div className="text-center text-gray-500">
          <div className="text-sm">Text Block</div>
          <div className="text-xs mt-1">Configure content and styling</div>
        </div>
      </div>
    );
  }

  const style = {
    fontSize: config.fontSize || 14,
    fontWeight: config.fontWeight || 'normal',
    textAlign: config.textAlign || 'left',
    color: config.color || '#000000'
  } as React.CSSProperties;

  return (
    <div className="w-full h-full p-2 flex items-center">
      <div style={style} className="w-full">
        {config.content || 'Text content'}
      </div>
    </div>
  );
};