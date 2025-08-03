import React from 'react';
import { ImageIcon } from 'lucide-react';
import { ImageConfig } from '@/types/template-builder';

interface ImageElementProps {
  config?: ImageConfig;
}

export const ImageElement: React.FC<ImageElementProps> = ({ config }) => {
  if (!config || !config.src) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded">
        <div className="text-center text-gray-500">
          <ImageIcon className="h-8 w-8 mx-auto mb-2" />
          <div className="text-sm">Image</div>
          <div className="text-xs mt-1">Set image source</div>
        </div>
      </div>
    );
  }

  const objectFitMap = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill'
  };

  return (
    <div className="w-full h-full overflow-hidden rounded">
      <img
        src={config.src}
        alt={config.alt || 'Report image'}
        className={`w-full h-full ${objectFitMap[config.fit || 'cover']}`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div class="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded">
              <div class="text-center text-gray-500">
                <div class="text-sm">Image not found</div>
                <div class="text-xs mt-1">${config.src}</div>
              </div>
            </div>
          `;
        }}
      />
    </div>
  );
};