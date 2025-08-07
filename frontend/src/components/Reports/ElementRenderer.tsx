import React from 'react';
import { ReportElement } from '@/types/template-builder';
import { ChartElement } from './Elements/ChartElement';
import { TableElement } from './Elements/TableElement';
import { MetricElement } from './Elements/MetricElement';
import { TextElement } from './Elements/TextElement';
import { ImageElement } from './Elements/ImageElement';

interface ElementRendererProps {
  element: ReportElement;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({ element }) => {
  switch (element.type) {
    case 'chart':
      return <ChartElement config={element.config.chart} />;
    case 'table':
      return <TableElement config={element.config.table} />;
    case 'metric':
      return <MetricElement config={element.config.metric} />;
    case 'text':
      return <TextElement config={element.config.text} />;
    case 'image':
      return <ImageElement config={element.config.image} />;
    default:
      return <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">Unknown element type</div>;
  }
};