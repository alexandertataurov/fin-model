import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Download,
  Upload,
  Database,
  CheckCircle,
  AlertTriangle,
  X,
} from 'lucide-react';
import type { Parameter, ParameterGroupData } from './ParameterPanel';

interface ParameterExportProps {
  modelId: string;
  parameters: Parameter[];
  parameterGroups: ParameterGroupData[];
  onClose: () => void;
  onImportComplete?: () => void;
}

interface ExportConfig {
  includeValues: boolean;
  includeMetadata: boolean;
  includeHistory: boolean;
  includeGroups: boolean;
  selectedCategories: string[];
  format: 'json' | 'csv' | 'excel';
}

export function ParameterExport({
  modelId,
  parameters,
  parameterGroups,
  onClose,
  onImportComplete,
}: ParameterExportProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    includeValues: true,
    includeMetadata: true,
    includeHistory: false,
    includeGroups: true,
    selectedCategories: [],
    format: 'json',
  });
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importPreview, setImportPreview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const categories = [...new Set(parameters.map(p => p.category))];

  const handleExport = async () => {
    setExporting(true);
    setError(null);

    try {
      const exportData = {
        modelId,
        exportDate: new Date().toISOString(),
        config: exportConfig,
        parameters: filterParametersForExport(),
        groups: exportConfig.includeGroups ? parameterGroups : [],
        metadata: {
          totalParameters: parameters.length,
          categories: categories,
          exportVersion: '1.0',
        },
      };

      const filename = `parameters-${modelId}-${
        new Date().toISOString().split('T')[0]
      }`;

      if (exportConfig.format === 'json') {
        downloadJSON(exportData, `${filename}.json`);
      } else if (exportConfig.format === 'csv') {
        downloadCSV(exportData.parameters, `${filename}.csv`);
      } else if (exportConfig.format === 'excel') {
        // For Excel export, we'd typically use a library like xlsx
        // For now, fallback to CSV
        downloadCSV(exportData.parameters, `${filename}.csv`);
      }

      setSuccess('Parameters exported successfully!');
    } catch (err) {
      setError('Failed to export parameters');
    } finally {
      setExporting(false);
    }
  };

  const filterParametersForExport = () => {
    let filtered = parameters;

    // Filter by selected categories
    if (exportConfig.selectedCategories.length > 0) {
      filtered = filtered.filter(p =>
        exportConfig.selectedCategories.includes(p.category)
      );
    }

    // Remove sensitive data if not included
    return filtered.map(param => ({
      ...param,
      ...(exportConfig.includeValues
        ? {}
        : { value: undefined, current_value: undefined }),
      ...(exportConfig.includeMetadata
        ? {}
        : {
            created_at: undefined,
            updated_at: undefined,
            source_file_id: undefined,
          }),
    }));
  };

  const downloadJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row =>
        headers
          .map(header => {
            const value = row[header];
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`;
            }
            return value || '';
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // setImportFile(file) // Remove this unused line
    setError(null);

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        let parsed: any;

        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          parsed = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          // Simple CSV parsing - in production, use a proper CSV parser
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          parsed = {
            parameters: lines.slice(1).map(line => {
              const values = line.split(',');
              const obj: any = {};
              headers.forEach((header, index) => {
                obj[header] = values[index];
              });
              return obj;
            }),
          };
        }

        setImportPreview(parsed);
      } catch (err) {
        setError('Failed to parse file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!importPreview) return;

    setImporting(true);
    setError(null);

    try {
      // In a real implementation, this would send the import data to the backend
      const response = await fetch(
        `/api/v1/models/${modelId}/import-parameters`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(importPreview),
        }
      );

      if (response.ok) {
        setSuccess('Parameters imported successfully!');
        onImportComplete?.();
        setTimeout(() => onClose(), 2000);
      } else {
        setError('Failed to import parameters');
      }
    } catch (err) {
      setError('Failed to import parameters');
    } finally {
      setImporting(false);
    }
  };

  const toggleCategory = (category: string) => {
    setExportConfig(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category],
    }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Parameter Export/Import
          </DialogTitle>
          <DialogDescription>
            Export parameter configurations or import from external sources
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={v => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </TabsTrigger>
              <TabsTrigger value="import" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import
              </TabsTrigger>
            </TabsList>

            <TabsContent value="export" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Export Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Include Data</Label>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-values"
                            checked={exportConfig.includeValues}
                            onCheckedChange={checked =>
                              setExportConfig(prev => ({
                                ...prev,
                                includeValues: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="include-values" className="text-sm">
                            Parameter values
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-metadata"
                            checked={exportConfig.includeMetadata}
                            onCheckedChange={checked =>
                              setExportConfig(prev => ({
                                ...prev,
                                includeMetadata: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="include-metadata" className="text-sm">
                            Metadata & timestamps
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-groups"
                            checked={exportConfig.includeGroups}
                            onCheckedChange={checked =>
                              setExportConfig(prev => ({
                                ...prev,
                                includeGroups: checked as boolean,
                              }))
                            }
                          />
                          <Label htmlFor="include-groups" className="text-sm">
                            Parameter groups
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Export Format</Label>
                      <div className="space-y-2">
                        {(['json', 'csv', 'excel'] as const).map(format => (
                          <div
                            key={format}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="radio"
                              id={format}
                              name="format"
                              checked={exportConfig.format === format}
                              onChange={() =>
                                setExportConfig(prev => ({ ...prev, format }))
                              }
                            />
                            <Label htmlFor={format} className="text-sm">
                              {format.toUpperCase()}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setExportConfig(prev => ({
                            ...prev,
                            selectedCategories:
                              prev.selectedCategories.length ===
                              categories.length
                                ? []
                                : categories,
                          }))
                        }
                      >
                        {exportConfig.selectedCategories.length ===
                        categories.length
                          ? 'Deselect All'
                          : 'Select All'}
                      </Button>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {categories.map(category => (
                          <div
                            key={category}
                            className="flex items-center justify-between p-2 border rounded"
                          >
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={category}
                                checked={exportConfig.selectedCategories.includes(
                                  category
                                )}
                                onCheckedChange={() => toggleCategory(category)}
                              />
                              <Label htmlFor={category} className="text-sm">
                                {category.charAt(0).toUpperCase() +
                                  category.slice(1)}
                              </Label>
                            </div>
                            <Badge variant="outline">
                              {
                                parameters.filter(p => p.category === category)
                                  .length
                              }
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {exportConfig.selectedCategories.length === 0
                    ? parameters.length
                    : parameters.filter(p =>
                        exportConfig.selectedCategories.includes(p.category)
                      ).length}{' '}
                  parameters will be exported
                </div>
                <Button onClick={handleExport} disabled={exporting}>
                  {exporting ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Parameters
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="import" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Import Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="import-file">Select File</Label>
                    <Input
                      id="import-file"
                      type="file"
                      accept=".json,.csv"
                      onChange={handleFileUpload}
                    />
                    <p className="text-xs text-muted-foreground">
                      Supported formats: JSON, CSV
                    </p>
                  </div>

                  {importPreview && (
                    <div className="space-y-2">
                      <Label>Import Preview</Label>
                      <div className="p-3 bg-muted rounded border">
                        <div className="text-sm">
                          <div className="font-medium">
                            {importPreview.parameters?.length || 0} parameters
                            found
                          </div>
                          {importPreview.groups && (
                            <div className="text-muted-foreground">
                              {importPreview.groups.length} groups found
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  onClick={handleImport}
                  disabled={!importPreview || importing}
                >
                  {importing ? (
                    <>Loading...</>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import Parameters
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
