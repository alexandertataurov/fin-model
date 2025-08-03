import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { ReportElement } from '@/types/template-builder';
import { ElementRenderer } from './ElementRenderer';

interface DraggableElementProps {
  element: ReportElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (element: ReportElement) => void;
  onDelete: () => void;
  previewMode: boolean;
  readonly?: boolean;
}

interface ResizeHandle {
  position: 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w';
  cursor: string;
}

const resizeHandles: ResizeHandle[] = [
  { position: 'nw', cursor: 'nw-resize' },
  { position: 'ne', cursor: 'ne-resize' },
  { position: 'sw', cursor: 'sw-resize' },
  { position: 'se', cursor: 'se-resize' },
  { position: 'n', cursor: 'n-resize' },
  { position: 's', cursor: 's-resize' },
  { position: 'e', cursor: 'e-resize' },
  { position: 'w', cursor: 'w-resize' },
];

export const DraggableElement: React.FC<DraggableElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  previewMode,
  readonly = false,
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [resizeStart, setResizeStart] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    handle: string;
  } | null>(null);

  const [{ isDragInProgress }] = useDrag({
    type: 'canvas-element',
    item: { id: element.id, type: element.type },
    collect: monitor => ({
      isDragInProgress: monitor.isDragging(),
    }),
    canDrag: !readonly && !previewMode,
  });

  // Handle mouse down for dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (readonly || previewMode || isResizing) return;

      e.preventDefault();
      e.stopPropagation();

      onSelect();

      const startX = e.clientX - element.position.x;
      const startY = e.clientY - element.position.y;

      setDragStart({ x: startX, y: startY });
      setIsDragging(true);
    },
    [element.position, onSelect, readonly, previewMode, isResizing]
  );

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent, handle: string) => {
      if (readonly || previewMode) return;

      e.preventDefault();
      e.stopPropagation();

      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: element.size.width,
        height: element.size.height,
        handle,
      });
      setIsResizing(true);
    },
    [element.size, readonly, previewMode]
  );

  // Handle mouse move for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStart) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;

        onUpdate({
          ...element,
          position: {
            x: Math.max(0, newX),
            y: Math.max(0, newY),
          },
        });
      } else if (isResizing && resizeStart) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        let newWidth = resizeStart.width;
        let newHeight = resizeStart.height;
        let newX = element.position.x;
        let newY = element.position.y;

        switch (resizeStart.handle) {
          case 'se':
            newWidth = Math.max(50, resizeStart.width + deltaX);
            newHeight = Math.max(30, resizeStart.height + deltaY);
            break;
          case 'sw':
            newWidth = Math.max(50, resizeStart.width - deltaX);
            newHeight = Math.max(30, resizeStart.height + deltaY);
            newX = element.position.x + (resizeStart.width - newWidth);
            break;
          case 'ne':
            newWidth = Math.max(50, resizeStart.width + deltaX);
            newHeight = Math.max(30, resizeStart.height - deltaY);
            newY = element.position.y + (resizeStart.height - newHeight);
            break;
          case 'nw':
            newWidth = Math.max(50, resizeStart.width - deltaX);
            newHeight = Math.max(30, resizeStart.height - deltaY);
            newX = element.position.x + (resizeStart.width - newWidth);
            newY = element.position.y + (resizeStart.height - newHeight);
            break;
          case 'e':
            newWidth = Math.max(50, resizeStart.width + deltaX);
            break;
          case 'w':
            newWidth = Math.max(50, resizeStart.width - deltaX);
            newX = element.position.x + (resizeStart.width - newWidth);
            break;
          case 's':
            newHeight = Math.max(30, resizeStart.height + deltaY);
            break;
          case 'n':
            newHeight = Math.max(30, resizeStart.height - deltaY);
            newY = element.position.y + (resizeStart.height - newHeight);
            break;
        }

        onUpdate({
          ...element,
          position: { x: Math.max(0, newX), y: Math.max(0, newY) },
          size: { width: newWidth, height: newHeight },
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setDragStart(null);
      setResizeStart(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, element, onUpdate]);

  // Handle element click
  const handleElementClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect();
    },
    [onSelect]
  );

  // Handle delete
  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onDelete();
    },
    [onDelete]
  );

  if (previewMode) {
    return (
      <div
        style={{
          position: 'absolute',
          left: element.position.x,
          top: element.position.y,
          width: element.size.width,
          height: element.size.height,
          ...element.style,
        }}
      >
        <ElementRenderer element={element} />
      </div>
    );
  }

  return (
    <div
      ref={elementRef}
      className={`absolute select-none ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isDragInProgress ? 'opacity-50' : ''}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        ...element.style,
      }}
      onClick={handleElementClick}
      onMouseDown={handleMouseDown}
    >
      <div className="w-full h-full relative">
        <ElementRenderer element={element} />

        {/* Selection overlay */}
        {isSelected && !readonly && (
          <>
            {/* Resize handles */}
            {resizeHandles.map(handle => (
              <div
                key={handle.position}
                className="absolute w-2 h-2 bg-blue-500 border border-white"
                style={{
                  cursor: handle.cursor,
                  ...(handle.position.includes('n') && { top: -4 }),
                  ...(handle.position.includes('s') && { bottom: -4 }),
                  ...(handle.position.includes('w') && { left: -4 }),
                  ...(handle.position.includes('e') && { right: -4 }),
                  ...(handle.position === 'n' && {
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }),
                  ...(handle.position === 's' && {
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }),
                  ...(handle.position === 'w' && {
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }),
                  ...(handle.position === 'e' && {
                    top: '50%',
                    transform: 'translateY(-50%)',
                  }),
                }}
                onMouseDown={e => handleResizeStart(e, handle.position)}
              />
            ))}

            {/* Action buttons */}
            <div className="absolute -top-8 left-0 flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0 bg-white"
                onClick={handleDelete}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
