import React from 'react';
import { useDrag } from 'react-dnd';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TrendingUp, 
  Type, 
  Image as ImageIcon,
  PieChart,
  LineChart,
  BarChart
} from 'lucide-react';
import { ReportElement } from '@/types/template-builder';

interface ElementPaletteProps {
  onElementAdd: (elementType: ReportElement['type']) => void;
}

interface PaletteItemProps {
  type: ReportElement['type'];
  icon: React.ReactNode;
  label: string;
  description: string;
  onAdd: (elementType: ReportElement['type']) => void;
}

const PaletteItem: React.FC<PaletteItemProps> = ({ type, icon, label, description, onAdd }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'palette-element',
    item: { elementType: type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  return (
    <div
      ref={drag}
      className={`
        p-3 border border-gray-200 rounded-lg cursor-grab hover:bg-gray-50 
        transition-colors duration-200 select-none
        ${isDragging ? 'opacity-50' : ''}
      `}
      onClick={() => onAdd(type)}
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-blue-100 rounded-md text-blue-600">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900">{label}</h4>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export const ElementPalette: React.FC<ElementPaletteProps> = ({ onElementAdd }) => {
  const chartElements = [
    {
      type: 'chart' as const,
      icon: <LineChart className="h-4 w-4" />,
      label: 'Line Chart',
      description: 'Show trends over time'
    },
    {
      type: 'chart' as const,
      icon: <BarChart className="h-4 w-4" />,
      label: 'Bar Chart',
      description: 'Compare categories'
    },
    {
      type: 'chart' as const,
      icon: <PieChart className="h-4 w-4" />,
      label: 'Pie Chart',
      description: 'Show proportions'
    }
  ];

  const dataElements = [
    {
      type: 'table' as const,
      icon: <Table className="h-4 w-4" />,
      label: 'Data Table',
      description: 'Display structured data'
    },
    {
      type: 'metric' as const,
      icon: <TrendingUp className="h-4 w-4" />,
      label: 'Key Metric',
      description: 'Highlight important numbers'
    }
  ];

  const contentElements = [
    {
      type: 'text' as const,
      icon: <Type className="h-4 w-4" />,
      label: 'Text Block',
      description: 'Add headings and paragraphs'
    },
    {
      type: 'image' as const,
      icon: <ImageIcon className="h-4 w-4" />,
      label: 'Image',
      description: 'Insert charts or logos'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Elements</CardTitle>
        <p className="text-sm text-gray-600">
          Drag elements onto the canvas to build your report
        </p>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto space-y-6">
        {/* Charts Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Charts</h3>
          <div className="space-y-2">
            {chartElements.map((element) => (
              <PaletteItem
                key={`${element.type}-${element.label}`}
                type={element.type}
                icon={element.icon}
                label={element.label}
                description={element.description}
                onAdd={onElementAdd}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Data Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Data</h3>
          <div className="space-y-2">
            {dataElements.map((element) => (
              <PaletteItem
                key={`${element.type}-${element.label}`}
                type={element.type}
                icon={element.icon}
                label={element.label}
                description={element.description}
                onAdd={onElementAdd}
              />
            ))}
          </div>
        </div>

        <Separator />

        {/* Content Section */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Content</h3>
          <div className="space-y-2">
            {contentElements.map((element) => (
              <PaletteItem
                key={`${element.type}-${element.label}`}
                type={element.type}
                icon={element.icon}
                label={element.label}
                description={element.description}
                onAdd={onElementAdd}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default ElementPalette;