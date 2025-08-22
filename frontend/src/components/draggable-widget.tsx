import React from 'react';

interface DraggableWidgetProps {
  id: string;
  title?: string;
  onRemove?: (id: string) => void;
  children?: React.ReactNode;
  className?: string;
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  title,
  onRemove,
  children,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">{title}</h3>
          {onRemove && (
            <button
              onClick={() => onRemove(id)}
              className="text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
