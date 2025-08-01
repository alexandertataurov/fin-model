import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  FileSpreadsheet, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  RefreshCw,
  AlertTriangle,
  Info
} from 'lucide-react';
import { fileApi } from '../../services/fileApi';

interface SheetPreview {
  name: string;
  row_count: number;
  column_count: number;
  columns: string[];
  preview_data: Record<string, any>[];
}

interface DetectedStatement {
  sheet_name: string;
  statement_type: 'PROFIT_LOSS' | 'BALANCE_SHEET' | 'CASH_FLOW';
  confidence: number;
}

interface FilePreviewData {
  file_id: number;
  file_name: string;
  sheets: SheetPreview[];
  preview_data: {
    max_rows_per_sheet: number;
  };
  detected_statements: DetectedStatement[];
  metadata: {
    file_size: number;
    upload_date: string | null;
    total_sheets: number;
  };
}

interface FilePreviewProps {
  fileId: number;
  fileName: string;
  onStatementSelect?: (statement: DetectedStatement) => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  fileId,
  onStatementSelect
}) => {
  const [previewData, setPreviewData] = useState<FilePreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSheets, setExpandedSheets] = useState<Set<string>>(new Set());

  const loadPreview = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fileApi.getFilePreview(fileId);
      setPreviewData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load file preview');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreview();
  }, [fileId]);

  const toggleSheetExpansion = (sheetName: string) => {
    setExpandedSheets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sheetName)) {
        newSet.delete(sheetName);
      } else {
        newSet.add(sheetName);
      }
      return newSet;
    });
  };

  const getStatementTypeIcon = (type: DetectedStatement['statement_type']) => {
    switch (type) {
      case 'PROFIT_LOSS':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'BALANCE_SHEET':
        return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'CASH_FLOW':
        return <TrendingDown className="h-4 w-4 text-purple-500" />;
      default:
        return <FileSpreadsheet className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatementTypeLabel = (type: DetectedStatement['statement_type']) => {
    switch (type) {
      case 'PROFIT_LOSS':
        return 'Profit & Loss';
      case 'BALANCE_SHEET':
        return 'Balance Sheet';
      case 'CASH_FLOW':
        return 'Cash Flow';
      default:
        return 'Unknown';
    }
  };

  const getConfidenceBadge = (confidence: number) => {
    const variant = confidence >= 0.8 ? 'default' : confidence >= 0.6 ? 'secondary' : 'outline';
    const label = confidence >= 0.8 ? 'High' : confidence >= 0.6 ? 'Medium' : 'Low';
    return (
      <Badge variant={variant} className="text-xs">
        {label} ({Math.round(confidence * 100)}%)
      </Badge>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderPreviewTable = (sheet: SheetPreview) => {
    if (!sheet.preview_data || sheet.preview_data.length === 0) {
      return (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>No data to preview for this sheet.</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {sheet.columns.slice(0, 10).map((column, index) => (
                <TableHead key={index} className="min-w-[100px]">
                  {column || `Column ${index + 1}`}
                </TableHead>
              ))}
              {sheet.columns.length > 10 && (
                <TableHead className="text-muted-foreground">
                  ... {sheet.columns.length - 10} more columns
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sheet.preview_data.slice(0, 10).map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {sheet.columns.slice(0, 10).map((column, colIndex) => (
                  <TableCell key={colIndex} className="font-mono text-xs">
                    {row[column] !== null && row[column] !== undefined
                      ? String(row[column])
                      : '—'}
                  </TableCell>
                ))}
                {sheet.columns.length > 10 && (
                  <TableCell className="text-muted-foreground">...</TableCell>
                )}
              </TableRow>
            ))}
            {sheet.preview_data.length > 10 && (
              <TableRow>
                <TableCell colSpan={Math.min(sheet.columns.length, 10) + (sheet.columns.length > 10 ? 1 : 0)} 
                          className="text-center text-muted-foreground">
                  ... {sheet.preview_data.length - 10} more rows
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading file preview...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={loadPreview} className="mt-4" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!previewData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* File Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              <div>
                <CardTitle className="text-lg">{previewData.file_name}</CardTitle>
                <CardDescription>Excel File Preview</CardDescription>
              </div>
            </div>
            <Badge variant="outline">
              {previewData.metadata.total_sheets} sheets
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">File Size:</span>
              <div className="font-medium">{formatFileSize(previewData.metadata.file_size)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Total Sheets:</span>
              <div className="font-medium">{previewData.metadata.total_sheets}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Upload Date:</span>
              <div className="font-medium">
                {previewData.metadata.upload_date
                  ? new Date(previewData.metadata.upload_date).toLocaleDateString()
                  : 'Unknown'}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Preview Rows:</span>
              <div className="font-medium">{previewData.preview_data.max_rows_per_sheet}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detected Financial Statements */}
      {previewData.detected_statements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detected Financial Statements</CardTitle>
            <CardDescription>
              Automatically detected statement types based on sheet content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {previewData.detected_statements.map((statement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => onStatementSelect?.(statement)}
                >
                  <div className="flex items-center space-x-3">
                    {getStatementTypeIcon(statement.statement_type)}
                    <div>
                      <div className="font-medium">{statement.sheet_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {getStatementTypeLabel(statement.statement_type)}
                      </div>
                    </div>
                  </div>
                  {getConfidenceBadge(statement.confidence)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sheet Previews */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sheet Previews</CardTitle>
          <CardDescription>
            Preview of the first few rows from each sheet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={previewData.sheets[0]?.name} className="w-full">
            <TabsList className="grid w-full grid-cols-auto overflow-x-auto">
              {previewData.sheets.map((sheet) => (
                <TabsTrigger key={sheet.name} value={sheet.name} className="text-xs">
                  {sheet.name}
                  <Badge variant="outline" className="ml-2 text-xs">
                    {sheet.row_count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {previewData.sheets.map((sheet) => (
              <TabsContent key={sheet.name} value={sheet.name} className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {sheet.row_count} rows × {sheet.column_count} columns
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSheetExpansion(sheet.name)}
                    >
                      {expandedSheets.has(sheet.name) ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Collapse
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Expand
                        </>
                      )}
                    </Button>
                  </div>

                  {(expandedSheets.has(sheet.name) || previewData.sheets.length === 1) && (
                    renderPreviewTable(sheet)
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilePreview;