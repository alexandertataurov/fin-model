import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/molecules';
import { CoreFinancialModeling } from '@/components/CoreFinancialModeling';
import { toast } from 'sonner';

const FinancialModeling: React.FC = () => {
  const handleFileUpload = async (file: File) => {
    toast.success(`File "${file.name}" uploaded`);
  };

  const handleParameterChange = (parameters: any) => {
    console.debug('Parameters changed', parameters);
  };

  const handleScenarioCreate = (scenario: any) => {
    console.debug('Scenario created', scenario);
  };

  const handleValuationChange = (valuation: any) => {
    console.debug('Valuation updated', valuation);
  };

  const handleExportResults = (results: any) => {
    const asBlob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(asBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial_model_results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="py-6">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Modeling</CardTitle>
            </CardHeader>
            <CardContent>
              <CoreFinancialModeling
                onFileUpload={handleFileUpload}
                onParameterChange={handleParameterChange}
                onScenarioCreate={handleScenarioCreate}
                onValuationChange={handleValuationChange}
                onExportResults={handleExportResults}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default FinancialModeling;
