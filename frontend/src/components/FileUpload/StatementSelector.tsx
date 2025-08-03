import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  FileSpreadsheet,
  Check,
  X,
  AlertCircle,
  Info
} from 'lucide-react';

interface DetectedStatement {
  sheet_name: string;
  statement_type: 'PROFIT_LOSS' | 'BALANCE_SHEET' | 'CASH_FLOW';
  confidence: number;
}

interface SheetInfo {
  name: string;
  row_count: number;
  column_count: number;
  columns: string[];
}

interface StatementAssignment {
  sheet_name: string;
  assigned_type: StatementType | null;
  confidence: number;
  is_manual: boolean;
}

type StatementType = 'PROFIT_LOSS' | 'BALANCE_SHEET' | 'CASH_FLOW' | 'OTHER';

interface StatementSelectorProps {
  sheets: SheetInfo[];
  detectedStatements: DetectedStatement[];
  onAssignmentsChange?: (assignments: StatementAssignment[]) => void;
  onConfirm?: (assignments: StatementAssignment[]) => void;
  className?: string;
}

const StatementSelector: React.FC<StatementSelectorProps> = ({
  sheets,
  detectedStatements,
  onAssignmentsChange,
  onConfirm,
  className
}) => {
  const [assignments, setAssignments] = useState<StatementAssignment[]>(() => {
    return sheets.map(sheet => {
      const detected = detectedStatements.find(d => d.sheet_name === sheet.name);
      return {
        sheet_name: sheet.name,
        assigned_type: detected?.statement_type || null,
        confidence: detected?.confidence || 0,
        is_manual: false
      };
    });
  });

  const updateAssignment = (sheetName: string, statementType: StatementType | null) => {
    const newAssignments = assignments.map(assignment => 
      assignment.sheet_name === sheetName
        ? { 
            ...assignment, 
            assigned_type: statementType,
            is_manual: true
          }
        : assignment
    );
    
    setAssignments(newAssignments);
    onAssignmentsChange?.(newAssignments);
  };

  const getStatementTypeIcon = (type: StatementType | null) => {
    switch (type) {
      case 'PROFIT_LOSS':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'BALANCE_SHEET':
        return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'CASH_FLOW':
        return <TrendingDown className="h-4 w-4 text-purple-500" />;
      case 'OTHER':
        return <FileSpreadsheet className="h-4 w-4 text-gray-500" />;
      default:
        return <FileSpreadsheet className="h-4 w-4 text-gray-400" />;
    }
  };


  const getConfidenceBadge = (assignment: StatementAssignment) => {
    if (assignment.is_manual) {
      return (
        <Badge variant="default" className="text-xs">
          Manual
        </Badge>
      );
    }

    if (assignment.confidence === 0) {
      return (
        <Badge variant="outline" className="text-xs">
          Not Detected
        </Badge>
      );
    }

    const variant = assignment.confidence >= 0.8 ? 'default' : 
                   assignment.confidence >= 0.6 ? 'secondary' : 'outline';
    const label = assignment.confidence >= 0.8 ? 'High' : 
                  assignment.confidence >= 0.6 ? 'Medium' : 'Low';
    
    return (
      <Badge variant={variant} className="text-xs">
        {label} ({Math.round(assignment.confidence * 100)}%)
      </Badge>
    );
  };

  const getValidationStatus = () => {
    const assignedStatements = assignments.filter(a => a.assigned_type && a.assigned_type !== 'OTHER');
    const statementTypes = assignedStatements.map(a => a.assigned_type);
    
    const duplicates = statementTypes.filter((type, index) => 
      statementTypes.indexOf(type) !== index
    );

    return {
      hasAssignments: assignedStatements.length > 0,
      hasDuplicates: duplicates.length > 0,
      duplicateTypes: [...new Set(duplicates)],
      assignedCount: assignedStatements.length
    };
  };

  const validation = getValidationStatus();

  const handleConfirm = () => {
    if (!validation.hasDuplicates) {
      onConfirm?.(assignments);
    }
  };

  const resetToDetected = () => {
    const resetAssignments = sheets.map(sheet => {
      const detected = detectedStatements.find(d => d.sheet_name === sheet.name);
      return {
        sheet_name: sheet.name,
        assigned_type: detected?.statement_type || null,
        confidence: detected?.confidence || 0,
        is_manual: false
      };
    });
    
    setAssignments(resetAssignments);
    onAssignmentsChange?.(resetAssignments);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileSpreadsheet className="h-5 w-5" />
          <span>Statement Type Assignment</span>
        </CardTitle>
        <CardDescription>
          Review and adjust the detected financial statement types for each sheet
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Validation Alerts */}
        {validation.hasDuplicates && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Multiple sheets are assigned the same statement type: {validation.duplicateTypes.join(', ')}. 
              Each statement type should only be assigned to one sheet.
            </AlertDescription>
          </Alert>
        )}

        {!validation.hasAssignments && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No financial statements have been assigned. Assign at least one sheet to continue with processing.
            </AlertDescription>
          </Alert>
        )}

        {/* Sheet Assignments */}
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const sheet = sheets.find(s => s.name === assignment.sheet_name);
            if (!sheet) return null;

            return (
              <div key={assignment.sheet_name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3 flex-1">
                  {getStatementTypeIcon(assignment.assigned_type)}
                  <div className="flex-1">
                    <div className="font-medium">{sheet.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {sheet.row_count} rows × {sheet.column_count} columns
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getConfidenceBadge(assignment)}
                  
                  <Select
                    value={assignment.assigned_type || 'NOT_ASSIGNED'}
                    onValueChange={(value: string) => 
                      updateAssignment(assignment.sheet_name, value === 'NOT_ASSIGNED' ? null : value as StatementType)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOT_ASSIGNED">
                        <div className="flex items-center space-x-2">
                          <X className="h-4 w-4 text-gray-400" />
                          <span>Not Assigned</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="PROFIT_LOSS">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>Profit & Loss</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="BALANCE_SHEET">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-blue-500" />
                          <span>Balance Sheet</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="CASH_FLOW">
                        <div className="flex items-center space-x-2">
                          <TrendingDown className="h-4 w-4 text-purple-500" />
                          <span>Cash Flow</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="OTHER">
                        <div className="flex items-center space-x-2">
                          <FileSpreadsheet className="h-4 w-4 text-gray-500" />
                          <span>Other</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium mb-2">Assignment Summary</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Total Sheets:</span>
              <div className="font-medium">{sheets.length}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Assigned:</span>
              <div className="font-medium">{validation.assignedCount}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Auto-detected:</span>
              <div className="font-medium">{detectedStatements.length}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Manual:</span>
              <div className="font-medium">
                {assignments.filter(a => a.is_manual).length}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={resetToDetected}>
            Reset to Detected
          </Button>
          
          <div className="space-x-2">
            <Button
              onClick={handleConfirm}
              disabled={!validation.hasAssignments || validation.hasDuplicates}
              className="flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>Confirm Assignments</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatementSelector;