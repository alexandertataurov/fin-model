import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/design-system/molecules';
import { Button } from '@/design-system/atoms';
import { Input } from '@/design-system/atoms';
import { Label } from '@/design-system/atoms';
import { Badge } from '@/design-system/atoms';
import { Target, TrendingUp, Calculator, DollarSign, Play } from 'lucide-react';

const DCFTab: React.FC = () => {
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);
    // Simulate calculation
    setTimeout(() => setIsCalculating(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">DCF Valuation</h2>
          <p className="text-muted-foreground">
            Discounted Cash Flow valuation with comprehensive analysis
          </p>
        </div>
        <Button onClick={handleCalculate} disabled={isCalculating}>
          <Play className="h-4 w-4 mr-2" />
          {isCalculating ? 'Calculating...' : 'Run Valuation'}
        </Button>
      </div>

      {/* Key Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Revenue Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Annual Growth Rate (%)</Label>
              <Input placeholder="10.0" type="number" step="0.1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Operating Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Target Margin (%)</Label>
              <Input placeholder="15.0" type="number" step="0.1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              WACC
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Discount Rate (%)</Label>
              <Input placeholder="9.8" type="number" step="0.1" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Terminal Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Growth Rate (%)</Label>
              <Input placeholder="3.0" type="number" step="0.1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Valuation Results</CardTitle>
          <CardDescription>
            DCF valuation summary and key metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">$1,250M</div>
              <div className="text-sm text-muted-foreground">
                Enterprise Value
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">$1,180M</div>
              <div className="text-sm text-muted-foreground">Equity Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">$45.20</div>
              <div className="text-sm text-muted-foreground">
                Per Share Value
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">9.8%</div>
              <div className="text-sm text-muted-foreground">WACC</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensitivity Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Sensitivity Analysis</CardTitle>
          <CardDescription>
            Key value drivers and their impact on valuation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Revenue Growth Impact</span>
              <Badge variant="outline">±15%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Margin Impact</span>
              <Badge variant="outline">±25%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">WACC Impact</span>
              <Badge variant="outline">±20%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                Terminal Growth Impact
              </span>
              <Badge variant="outline">±10%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DCFTab;
