import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';

const meta: Meta = {
  title: '🧪 Performance Tests',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Performance testing stories for measuring component rendering and interaction performance.',
      },
    },
  },
  tags: ['autodocs', 'performance'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Large component grid for performance testing
export const LargeGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 20 }, (_, i) => (
        <Card key={i} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Component {i + 1}
              <Badge variant="secondary">{i + 1}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full">
              Action {i + 1}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};

// Interactive performance test
export const InteractiveTest: Story = {
  render: () => {
    const [count, setCount] = React.useState(0);
    const [items, setItems] = React.useState(Array.from({ length: 10 }, (_, i) => i));
    
    const addItem = () => {
      setItems(prev => [...prev, prev.length]);
      setCount(prev => prev + 1);
    };
    
    const removeItem = (index: number) => {
      setItems(prev => prev.filter((_, i) => i !== index));
      setCount(prev => prev - 1);
    };
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button onClick={addItem}>Add Item</Button>
          <Badge>Count: {count}</Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <Card key={item} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Item {item}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeItem(index)}
                  >
                    Remove
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is item number {item} for performance testing
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  },
};
