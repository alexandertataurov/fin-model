import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportElement, ReportTemplate } from '@/types/template-builder';

interface PropertiesPanelProps {
  element: ReportElement | null;
  onElementUpdate: (element: ReportElement) => void;
  template: ReportTemplate;
  onTemplateUpdate: (template: ReportTemplate) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  element,
  onElementUpdate,
  template,
  onTemplateUpdate
}) => {
  if (!element) {
    return (
      <div className="h-full">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-gray-500 mt-8">
              <p>Select an element to edit its properties</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const updateElement = (updates: Partial<ReportElement>) => {
    onElementUpdate({ ...element, ...updates });
  };

  const updateConfig = (configUpdates: any) => {
    updateElement({
      config: { ...element.config, ...configUpdates }
    });
  };

  const updateStyle = (styleUpdates: any) => {
    updateElement({
      style: { ...element.style, ...styleUpdates }
    });
  };

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Properties</CardTitle>
          <p className="text-sm text-gray-600 capitalize">{element.type} Element</p>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="position">Position</TabsTrigger>
              <TabsTrigger value="style">Style</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-4 space-y-4">
              {element.type === 'chart' && (
                <ChartConfiguration
                  config={element.config.chart}
                  onChange={(config) => updateConfig({ chart: config })}
                />
              )}
              {element.type === 'table' && (
                <TableConfiguration
                  config={element.config.table}
                  onChange={(config) => updateConfig({ table: config })}
                />
              )}
              {element.type === 'metric' && (
                <MetricConfiguration
                  config={element.config.metric}
                  onChange={(config) => updateConfig({ metric: config })}
                />
              )}
              {element.type === 'text' && (
                <TextConfiguration
                  config={element.config.text}
                  onChange={(config) => updateConfig({ text: config })}
                />
              )}
              {element.type === 'image' && (
                <ImageConfiguration
                  config={element.config.image}
                  onChange={(config) => updateConfig({ image: config })}
                />
              )}
            </TabsContent>

            <TabsContent value="position" className="mt-4 space-y-4">
              <PositionControls element={element} onChange={updateElement} />
            </TabsContent>

            <TabsContent value="style" className="mt-4 space-y-4">
              <StyleControls element={element} onChange={updateStyle} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Position Controls Component
const PositionControls: React.FC<{
  element: ReportElement;
  onChange: (updates: Partial<ReportElement>) => void;
}> = ({ element, onChange }) => (
  <div className="space-y-4">
    <div>
      <Label className="text-sm font-medium">Position</Label>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div>
          <Label htmlFor="x" className="text-xs">X</Label>
          <Input
            id="x"
            type="number"
            value={element.position.x}
            onChange={(e) => onChange({
              position: { ...element.position, x: Number(e.target.value) }
            })}
          />
        </div>
        <div>
          <Label htmlFor="y" className="text-xs">Y</Label>
          <Input
            id="y"
            type="number"
            value={element.position.y}
            onChange={(e) => onChange({
              position: { ...element.position, y: Number(e.target.value) }
            })}
          />
        </div>
      </div>
    </div>

    <div>
      <Label className="text-sm font-medium">Size</Label>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div>
          <Label htmlFor="width" className="text-xs">Width</Label>
          <Input
            id="width"
            type="number"
            value={element.size.width}
            onChange={(e) => onChange({
              size: { ...element.size, width: Number(e.target.value) }
            })}
          />
        </div>
        <div>
          <Label htmlFor="height" className="text-xs">Height</Label>
          <Input
            id="height"
            type="number"
            value={element.size.height}
            onChange={(e) => onChange({
              size: { ...element.size, height: Number(e.target.value) }
            })}
          />
        </div>
      </div>
    </div>
  </div>
);

// Style Controls Component
const StyleControls: React.FC<{
  element: ReportElement;
  onChange: (updates: any) => void;
}> = ({ element, onChange }) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="bg-color" className="text-sm font-medium">Background Color</Label>
      <Input
        id="bg-color"
        type="color"
        value={element.style?.backgroundColor || '#ffffff'}
        onChange={(e) => onChange({ backgroundColor: e.target.value })}
      />
    </div>

    <div>
      <Label htmlFor="border-color" className="text-sm font-medium">Border Color</Label>
      <Input
        id="border-color"
        type="color"
        value={element.style?.borderColor || '#e2e8f0'}
        onChange={(e) => onChange({ borderColor: e.target.value })}
      />
    </div>

    <div>
      <Label htmlFor="border-width" className="text-sm font-medium">Border Width</Label>
      <Input
        id="border-width"
        type="number"
        min="0"
        value={element.style?.borderWidth || 1}
        onChange={(e) => onChange({ borderWidth: Number(e.target.value) })}
      />
    </div>

    <div>
      <Label htmlFor="border-radius" className="text-sm font-medium">Border Radius</Label>
      <Input
        id="border-radius"
        type="number"
        min="0"
        value={element.style?.borderRadius || 4}
        onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
      />
    </div>

    <div>
      <Label htmlFor="padding" className="text-sm font-medium">Padding</Label>
      <Input
        id="padding"
        type="number"
        min="0"
        value={element.style?.padding || 8}
        onChange={(e) => onChange({ padding: Number(e.target.value) })}
      />
    </div>
  </div>
);

// Chart Configuration Component
const ChartConfiguration: React.FC<{
  config: any;
  onChange: (config: any) => void;
}> = ({ config = {}, onChange }) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="chart-title" className="text-sm font-medium">Title</Label>
      <Input
        id="chart-title"
        value={config.title || ''}
        onChange={(e) => onChange({ ...config, title: e.target.value })}
        placeholder="Chart title"
      />
    </div>

    <div>
      <Label htmlFor="chart-type" className="text-sm font-medium">Chart Type</Label>
      <Select
        value={config.chartType || 'line'}
        onValueChange={(value) => onChange({ ...config, chartType: value })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="line">Line Chart</SelectItem>
          <SelectItem value="bar">Bar Chart</SelectItem>
          <SelectItem value="pie">Pie Chart</SelectItem>
          <SelectItem value="waterfall">Waterfall Chart</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="data-source" className="text-sm font-medium">Data Source</Label>
      <Input
        id="data-source"
        value={config.dataSource || ''}
        onChange={(e) => onChange({ ...config, dataSource: e.target.value })}
        placeholder="Data source path or query"
      />
    </div>

    <div className="flex items-center space-x-2">
      <Switch
        id="show-legend"
        checked={config.showLegend !== false}
        onCheckedChange={(checked) => onChange({ ...config, showLegend: checked })}
      />
      <Label htmlFor="show-legend" className="text-sm">Show Legend</Label>
    </div>
  </div>
);

// Table Configuration Component
const TableConfiguration: React.FC<{
  config: any;
  onChange: (config: any) => void;
}> = ({ config = {}, onChange }) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="table-data-source" className="text-sm font-medium">Data Source</Label>
      <Input
        id="table-data-source"
        value={config.dataSource || ''}
        onChange={(e) => onChange({ ...config, dataSource: e.target.value })}
        placeholder="Data source path or query"
      />
    </div>

    <div className="flex items-center space-x-2">
      <Switch
        id="show-headers"
        checked={config.showHeaders !== false}
        onCheckedChange={(checked) => onChange({ ...config, showHeaders: checked })}
      />
      <Label htmlFor="show-headers" className="text-sm">Show Headers</Label>
    </div>

    <div className="flex items-center space-x-2">
      <Switch
        id="pagination"
        checked={config.pagination === true}
        onCheckedChange={(checked) => onChange({ ...config, pagination: checked })}
      />
      <Label htmlFor="pagination" className="text-sm">Enable Pagination</Label>
    </div>
  </div>
);

// Metric Configuration Component
const MetricConfiguration: React.FC<{
  config: any;
  onChange: (config: any) => void;
}> = ({ config = {}, onChange }) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="metric-label" className="text-sm font-medium">Label</Label>
      <Input
        id="metric-label"
        value={config.label || ''}
        onChange={(e) => onChange({ ...config, label: e.target.value })}
        placeholder="Metric label"
      />
    </div>

    <div>
      <Label htmlFor="metric-value" className="text-sm font-medium">Value</Label>
      <Input
        id="metric-value"
        type="number"
        value={config.value || 0}
        onChange={(e) => onChange({ ...config, value: Number(e.target.value) })}
      />
    </div>

    <div>
      <Label htmlFor="metric-format" className="text-sm font-medium">Format</Label>
      <Select
        value={config.format || 'number'}
        onValueChange={(value) => onChange({ ...config, format: value })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="number">Number</SelectItem>
          <SelectItem value="currency">Currency</SelectItem>
          <SelectItem value="percentage">Percentage</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);

// Text Configuration Component
const TextConfiguration: React.FC<{
  config: any;
  onChange: (config: any) => void;
}> = ({ config = {}, onChange }) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="text-content" className="text-sm font-medium">Content</Label>
      <Textarea
        id="text-content"
        value={config.content || ''}
        onChange={(e) => onChange({ ...config, content: e.target.value })}
        placeholder="Enter text content"
        rows={3}
      />
    </div>

    <div>
      <Label htmlFor="font-size" className="text-sm font-medium">Font Size</Label>
      <Input
        id="font-size"
        type="number"
        min="8"
        max="72"
        value={config.fontSize || 14}
        onChange={(e) => onChange({ ...config, fontSize: Number(e.target.value) })}
      />
    </div>

    <div>
      <Label htmlFor="font-weight" className="text-sm font-medium">Font Weight</Label>
      <Select
        value={config.fontWeight || 'normal'}
        onValueChange={(value) => onChange({ ...config, fontWeight: value })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="normal">Normal</SelectItem>
          <SelectItem value="bold">Bold</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="text-align" className="text-sm font-medium">Text Align</Label>
      <Select
        value={config.textAlign || 'left'}
        onValueChange={(value) => onChange({ ...config, textAlign: value })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="left">Left</SelectItem>
          <SelectItem value="center">Center</SelectItem>
          <SelectItem value="right">Right</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="text-color" className="text-sm font-medium">Text Color</Label>
      <Input
        id="text-color"
        type="color"
        value={config.color || '#000000'}
        onChange={(e) => onChange({ ...config, color: e.target.value })}
      />
    </div>
  </div>
);

// Image Configuration Component
const ImageConfiguration: React.FC<{
  config: any;
  onChange: (config: any) => void;
}> = ({ config = {}, onChange }) => (
  <div className="space-y-4">
    <div>
      <Label htmlFor="image-src" className="text-sm font-medium">Image URL</Label>
      <Input
        id="image-src"
        value={config.src || ''}
        onChange={(e) => onChange({ ...config, src: e.target.value })}
        placeholder="https://example.com/image.jpg"
      />
    </div>

    <div>
      <Label htmlFor="image-alt" className="text-sm font-medium">Alt Text</Label>
      <Input
        id="image-alt"
        value={config.alt || ''}
        onChange={(e) => onChange({ ...config, alt: e.target.value })}
        placeholder="Image description"
      />
    </div>

    <div>
      <Label htmlFor="image-fit" className="text-sm font-medium">Object Fit</Label>
      <Select
        value={config.fit || 'cover'}
        onValueChange={(value) => onChange({ ...config, fit: value })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cover">Cover</SelectItem>
          <SelectItem value="contain">Contain</SelectItem>
          <SelectItem value="fill">Fill</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
);