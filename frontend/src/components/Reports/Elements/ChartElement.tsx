import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ChartConfig } from '@/types/template-builder';

interface ChartElementProps {
  config?: ChartConfig;
}

// Sample data for preview
const sampleData = [
  { name: 'Jan', value: 400, value2: 240 },
  { name: 'Feb', value: 300, value2: 139 },
  { name: 'Mar', value: 500, value2: 980 },
  { name: 'Apr', value: 780, value2: 390 },
  { name: 'May', value: 690, value2: 480 },
  { name: 'Jun', value: 920, value2: 380 }
];

const pieData = [
  { name: 'Assets', value: 400, color: '#0088FE' },
  { name: 'Liabilities', value: 300, color: '#00C49F' },
  { name: 'Equity', value: 300, color: '#FFBB28' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const ChartElement: React.FC<ChartElementProps> = ({ config }) => {
  if (!config) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200 rounded">
        <div className="text-center text-gray-500">
          <div className="text-sm">Chart Element</div>
          <div className="text-xs mt-1">Configure in properties panel</div>
        </div>
      </div>
    );
  }

  const renderChart = () => {
    switch (config.chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              {config.showLegend && <Legend />}
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={config.colors?.[0] || '#0088FE'} 
                strokeWidth={2}
              />
              {config.yAxis && config.yAxis.length > 1 && (
                <Line 
                  type="monotone" 
                  dataKey="value2" 
                  stroke={config.colors?.[1] || '#00C49F'} 
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              {config.showLegend && <Legend />}
              <Bar dataKey="value" fill={config.colors?.[0] || '#0088FE'} />
              {config.yAxis && config.yAxis.length > 1 && (
                <Bar dataKey="value2" fill={config.colors?.[1] || '#00C49F'} />
              )}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={config.colors?.[index] || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              {config.showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      case 'waterfall':
        // Simplified waterfall chart representation
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              {config.showLegend && <Legend />}
              <Bar dataKey="value" fill={config.colors?.[0] || '#0088FE'} />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Unsupported chart type: {config.chartType}
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full p-2">
      {config.title && (
        <div className="text-sm font-medium text-gray-800 mb-2 text-center">
          {config.title}
        </div>
      )}
      <div className="w-full" style={{ height: config.title ? 'calc(100% - 2rem)' : '100%' }}>
        {renderChart()}
      </div>
    </div>
  );
};