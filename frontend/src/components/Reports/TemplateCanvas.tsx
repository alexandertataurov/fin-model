import React, { useCallback, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { ReportTemplate, ReportElement, DragItem } from '@/types/template-builder';
import { DraggableElement } from './DraggableElement';

interface TemplateCanvasProps {
  template: ReportTemplate;
  onTemplateChange: (template: ReportTemplate) => void;
  selectedElement: string | null;
  onElementSelect: (elementId: string | null) => void;
  previewMode: boolean;
  showGrid?: boolean;
  readonly?: boolean;
}

export const TemplateCanvas: React.FC<TemplateCanvasProps> = ({
  template,
  onTemplateChange,
  selectedElement,
  onElementSelect,
  previewMode,
  showGrid = true,
  readonly = false
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const addElementToCanvas = useCallback((item: DragItem, position: { x: number; y: number }) => {
    if (readonly) return;

    const newElement: ReportElement = {
      id: `element-${Date.now()}`,
      type: item.elementType,
      position,
      size: getDefaultSize(item.elementType),
      config: getDefaultConfig(item.elementType),
      style: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        borderRadius: 4,
        padding: 8
      }
    };

    onTemplateChange({
      ...template,
      elements: [...template.elements, newElement]
    });

    onElementSelect(newElement.id);
  }, [template, onTemplateChange, onElementSelect, readonly]);

  const [{ isOver }, drop] = useDrop({
    accept: 'palette-element',
    drop: (item: DragItem, monitor: any) => {
      if (!canvasRef.current) return;

      const clientOffset = monitor.getClientOffset();
      const canvasRect = canvasRef.current.getBoundingClientRect();
      
      if (clientOffset) {
        const position = {
          x: clientOffset.x - canvasRect.left,
          y: clientOffset.y - canvasRect.top
        };
        addElementToCanvas(item, position);
      }
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver()
    })
  });

  const updateElement = useCallback((updatedElement: ReportElement) => {
    if (readonly) return;

    onTemplateChange({
      ...template,
      elements: template.elements.map(el => 
        el.id === updatedElement.id ? updatedElement : el
      )
    });
  }, [template, onTemplateChange, readonly]);

  const deleteElement = useCallback((elementId: string) => {
    if (readonly) return;

    onTemplateChange({
      ...template,
      elements: template.elements.filter(el => el.id !== elementId)
    });

    if (selectedElement === elementId) {
      onElementSelect(null);
    }
  }, [template, onTemplateChange, selectedElement, onElementSelect, readonly]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onElementSelect(null);
    }
  }, [onElementSelect]);

  // Calculate canvas dimensions based on page size
  const getCanvasDimensions = () => {
    const { pageSize, orientation } = template.layout;
    
    let width = 210; // A4 width in mm
    let height = 297; // A4 height in mm
    
    if (pageSize === 'Letter') {
      width = 216;
      height = 279;
    } else if (pageSize === 'Legal') {
      width = 216;
      height = 356;
    }
    
    if (orientation === 'landscape') {
      [width, height] = [height, width];
    }
    
    // Convert mm to pixels (assuming 96 DPI)
    const scale = 3.77953; // 1mm = 3.77953px at 96 DPI
    return {
      width: width * scale,
      height: height * scale
    };
  };

  const canvasDimensions = getCanvasDimensions();

  return (
    <div 
      ref={drop}
      className="flex-1 bg-gray-100 overflow-auto p-8 relative"
      onClick={handleCanvasClick}
    >
      <div
        ref={canvasRef}
        className={`relative mx-auto bg-white shadow-lg ${
          isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
        }`}
        style={{
          width: canvasDimensions.width,
          height: canvasDimensions.height,
          minHeight: canvasDimensions.height,
          backgroundImage: showGrid && !previewMode
            ? 'radial-gradient(circle, #e2e8f0 1px, transparent 1px)'
            : undefined,
          backgroundSize: showGrid && !previewMode ? '20px 20px' : undefined,
          backgroundPosition: showGrid && !previewMode ? '0 0' : undefined
        }}
      >
        {/* Margin guides */}
        {!previewMode && (
          <div
            className="absolute border border-dashed border-gray-300 pointer-events-none"
            style={{
              top: template.layout.margins.top,
              left: template.layout.margins.left,
              right: template.layout.margins.right,
              bottom: template.layout.margins.bottom,
              width: `calc(100% - ${template.layout.margins.left + template.layout.margins.right}px)`,
              height: `calc(100% - ${template.layout.margins.top + template.layout.margins.bottom}px)`
            }}
          />
        )}

        {/* Render elements */}
        {template.elements.map(element => (
          <DraggableElement
            key={element.id}
            element={element}
            isSelected={selectedElement === element.id}
            onSelect={() => onElementSelect(element.id)}
            onUpdate={updateElement}
            onDelete={() => deleteElement(element.id)}
            previewMode={previewMode}
            readonly={readonly}
          />
        ))}

        {/* Drop zone indicator */}
        {isOver && !readonly && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-dashed border-blue-500 pointer-events-none flex items-center justify-center">
            <div className="bg-blue-500 text-white px-4 py-2 rounded">
              Drop element here
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
function getDefaultSize(elementType: ReportElement['type']) {
  switch (elementType) {
    case 'chart':
      return { width: 300, height: 200 };
    case 'table':
      return { width: 400, height: 200 };
    case 'metric':
      return { width: 150, height: 100 };
    case 'text':
      return { width: 200, height: 50 };
    case 'image':
      return { width: 200, height: 150 };
    default:
      return { width: 200, height: 150 };
  }
}

function getDefaultConfig(elementType: ReportElement['type']) {
  switch (elementType) {
    case 'chart':
      return {
        chart: {
          chartType: 'line' as const,
          dataSource: '',
          title: 'Chart Title',
          showLegend: true
        }
      };
    case 'table':
      return {
        table: {
          dataSource: '',
          columns: [],
          showHeaders: true,
          pagination: false
        }
      };
    case 'metric':
      return {
        metric: {
          value: 0,
          label: 'Metric Label',
          format: 'number' as const
        }
      };
    case 'text':
      return {
        text: {
          content: 'Text content',
          fontSize: 14,
          fontWeight: 'normal' as const,
          textAlign: 'left' as const
        }
      };
    case 'image':
      return {
        image: {
          src: '',
          alt: 'Image',
          fit: 'cover' as const
        }
      };
    default:
      return {};
  }
}