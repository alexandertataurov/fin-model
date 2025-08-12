/**
 * Enhanced Maintenance Tools
 *
 * Advanced maintenance operations with dry-run previews, audit tracking, and safety checks
 */

import React, { useState, useEffect, memo, useMemo, useCallback } from 'react';
import {
  Play,
  RefreshCw,
  Database,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  FileX,
  History,
  Users,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/design-system/components/Dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/design-system/components/Table';
import { Textarea } from '@/design-system/components/Textarea';
import { tokens } from '@/design-system/tokens';
import { toast } from 'sonner';
import * as AdminApi from '@/services/admin';
import { applyTypographyStyle } from '@/design-system/stories/components';

// Maintenance operation types
export interface MaintenanceOperation {
  id: string;
  type: MaintenanceType;
  title: string;
  description: string;
  icon: React.ReactNode;
  risk: 'low' | 'medium' | 'high';
  estimatedDuration: string;
  requiresConfirmation: boolean;
  supportsDryRun: boolean;
  category: 'database' | 'files' | 'system' | 'security';
}

export type MaintenanceType =
  | 'database-cleanup'
  | 'file-cleanup'
  | 'cache-clear'
  | 'database-backup'
  | 'database-reindex'
  | 'log-rotation'
  | 'user-cleanup'
  | 'security-scan';

export interface MaintenanceResult {
  success: boolean;
  message: string;
  details: Record<string, any>;
  affectedItems: number;
  duration: number;
  timestamp: Date;
}

export interface MaintenanceHistory {
  id: string;
  operation: MaintenanceType;
  executedBy: string;
  timestamp: Date;
  result: MaintenanceResult;
  dryRun: boolean;
}

// Available maintenance operations
const MAINTENANCE_OPERATIONS: MaintenanceOperation[] = [
  {
    id: 'database-cleanup',
    type: 'database-cleanup',
    title: 'Database Cleanup',
    description: 'Remove orphaned records and optimize database performance',
    icon: <Database className="h-5 w-5" />,
    risk: 'medium',
    estimatedDuration: '5-15 minutes',
    requiresConfirmation: true,
    supportsDryRun: true,
    category: 'database',
  },
  {
    id: 'file-cleanup',
    type: 'file-cleanup',
    title: 'File System Cleanup',
    description: 'Remove orphaned files and temporary data',
    icon: <FileX className="h-5 w-5" />,
    risk: 'low',
    estimatedDuration: '2-5 minutes',
    requiresConfirmation: true,
    supportsDryRun: true,
    category: 'files',
  },
  {
    id: 'database-backup',
    type: 'database-backup',
    title: 'Database Backup',
    description: 'Create a full backup of the database',
    icon: <Download className="h-5 w-5" />,
    risk: 'low',
    estimatedDuration: '10-30 minutes',
    requiresConfirmation: false,
    supportsDryRun: false,
    category: 'database',
  },
  {
    id: 'database-reindex',
    type: 'database-reindex',
    title: 'Database Reindex',
    description: 'Rebuild database indexes for optimal performance',
    icon: <RefreshCw className="h-5 w-5" />,
    risk: 'medium',
    estimatedDuration: '15-45 minutes',
    requiresConfirmation: true,
    supportsDryRun: false,
    category: 'database',
  },
  {
    id: 'user-cleanup',
    type: 'user-cleanup',
    title: 'User Account Cleanup',
    description: 'Remove inactive users and cleanup user data',
    icon: <Users className="h-5 w-5" />,
    risk: 'high',
    estimatedDuration: '5-10 minutes',
    requiresConfirmation: true,
    supportsDryRun: true,
    category: 'security',
  },
];

interface MaintenanceToolsProps {
  onOperationComplete?: (result: MaintenanceResult) => void;
}

export const MaintenanceTools: React.FC<MaintenanceToolsProps> = memo(({
  onOperationComplete,
}) => {

  const [history, setHistory] = useState<MaintenanceHistory[]>([]);
  const [runningOperations, setRunningOperations] = useState<Set<string>>(new Set());
  const [selectedOperation, setSelectedOperation] = useState<MaintenanceOperation | null>(null);
  const [dryRunResult, setDryRunResult] = useState<MaintenanceResult | null>(null);
  const [confirmationNote, setConfirmationNote] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load maintenance history
  useEffect(() => {
    // In a real app, this would load from the API
    const savedHistory = localStorage.getItem('maintenance-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
          result: {
            ...item.result,
            timestamp: new Date(item.result.timestamp),
          },
        })));
      } catch (error) {
        console.error('Failed to load maintenance history:', error);
      }
    }
  }, []);

  // Save history to localStorage
  const saveHistory = useCallback((newEntry: MaintenanceHistory) => {
    const updatedHistory = [newEntry, ...history].slice(0, 50); // Keep last 50 entries
    setHistory(updatedHistory);
    localStorage.setItem('maintenance-history', JSON.stringify(updatedHistory));
  }, [history]);

  const executeOperation = useCallback(async (operation: MaintenanceOperation, dryRun: boolean = false) => {
    const operationId = operation.id;
    setRunningOperations(prev => new Set(prev).add(operationId));

    const startTime = Date.now();

    try {
      let result: MaintenanceResult;

      // Execute the actual operation based on type
      switch (operation.type) {
        case 'database-cleanup': {
          const cleanupResult = await AdminApi.cleanupDatabase(dryRun);
          result = {
            success: true,
            message: cleanupResult.message || 'Database cleanup completed',
            details: cleanupResult,
            affectedItems: cleanupResult.orphaned_records || 0,
            duration: Date.now() - startTime,
            timestamp: new Date(),
          };
          break;
        }

        case 'file-cleanup': {
          const fileResult = await AdminApi.cleanupFiles(dryRun);
          result = {
            success: true,
            message: fileResult.message || 'File cleanup completed',
            details: fileResult,
            affectedItems: fileResult.orphaned_files || 0,
            duration: Date.now() - startTime,
            timestamp: new Date(),
          };
          break;
        }

        case 'database-backup': {
          const backupResult = await AdminApi.backupDatabase();
          result = {
            success: true,
            message: backupResult.message || 'Database backup completed',
            details: backupResult,
            affectedItems: 1,
            duration: Date.now() - startTime,
            timestamp: new Date(),
          };
          break;
        }

        case 'database-reindex': {
          const reindexResult = await AdminApi.reindexDatabase();
          result = {
            success: true,
            message: reindexResult.message || 'Database reindex completed',
            details: reindexResult,
            affectedItems: 0,
            duration: Date.now() - startTime,
            timestamp: new Date(),
          };
          break;
        }

        default:
          throw new Error(`Operation ${operation.type} not implemented`);
      }

      // Save to history
      const historyEntry: MaintenanceHistory = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        operation: operation.type,
        executedBy: 'Current User', // Would come from auth context
        timestamp: new Date(),
        result,
        dryRun,
      };

      saveHistory(historyEntry);

      if (dryRun) {
        setDryRunResult(result);
        toast.info(`Dry run completed: ${result.message}`);
      } else {
        toast.success(`Operation completed: ${result.message}`);
        onOperationComplete?.(result);
        setIsDialogOpen(false);
      }

    } catch (error) {
      const errorResult: MaintenanceResult = {
        success: false,
        message: error instanceof Error ? error.message : 'Operation failed',
        details: { error: error },
        affectedItems: 0,
        duration: Date.now() - startTime,
        timestamp: new Date(),
      };

      const historyEntry: MaintenanceHistory = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        operation: operation.type,
        executedBy: 'Current User',
        timestamp: new Date(),
        result: errorResult,
        dryRun,
      };

      saveHistory(historyEntry);
      toast.error(`Operation failed: ${errorResult.message}`);

    } finally {
      setRunningOperations(prev => {
        const newSet = new Set(prev);
        newSet.delete(operationId);
        return newSet;
      });
    }
  });

  const getRiskColor = (risk: MaintenanceOperation['risk']) => {
    switch (risk) {
      case 'low': return 'text-success bg-success/10';
      case 'medium': return 'text-warning bg-warning/10';
      case 'high': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getRiskIcon = (risk: MaintenanceOperation['risk']) => {
    switch (risk) {
      case 'low': return <CheckCircle className="h-4 w-4" />;
      case 'medium': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <XCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Operations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MAINTENANCE_OPERATIONS.map((operation) => {
          const isRunning = runningOperations.has(operation.id);

          return (
            <Card key={operation.id} className="relative">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    {operation.icon}
                    <span>{operation.title}</span>
                  </div>
                  <Badge className={getRiskColor(operation.risk)}>
                    {getRiskIcon(operation.risk)}
                    <span className="ml-1">{operation.risk}</span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {operation.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Duration: {operation.estimatedDuration}</span>
                  <span>Category: {operation.category}</span>
                </div>

                <div className="flex space-x-2">
                  {operation.supportsDryRun && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedOperation(operation);
                        setDryRunResult(null);
                        setIsDialogOpen(true);
                      }}
                      disabled={isRunning}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  )}

                  <Button
                    variant={operation.risk === 'high' ? 'destructive' : 'default'}
                    size="sm"
                    onClick={() => {
                      if (operation.requiresConfirmation) {
                        setSelectedOperation(operation);
                        setDryRunResult(null);
                        setIsDialogOpen(true);
                      } else {
                        executeOperation(operation);
                      }
                    }}
                    disabled={isRunning}
                    className="flex-1"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        Execute
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>

              {isRunning && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Executing...</p>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Maintenance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            Maintenance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operation</TableHead>
                  <TableHead>Executed By</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.slice(0, 10).map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {MAINTENANCE_OPERATIONS.find(op => op.type === entry.operation)?.title || entry.operation}
                    </TableCell>
                    <TableCell>{entry.executedBy}</TableCell>
                    <TableCell>{entry.timestamp.toLocaleString()}</TableCell>
                    <TableCell>{(entry.result.duration / 1000).toFixed(1)}s</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {entry.result.success ? (
                          <CheckCircle className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <span className="text-sm">{entry.result.message}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={entry.dryRun ? 'secondary' : 'default'}>
                        {entry.dryRun ? 'Dry Run' : 'Live'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No maintenance operations have been performed yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedOperation?.icon}
              <span className="ml-2">{selectedOperation?.title}</span>
            </DialogTitle>
            <DialogDescription>
              {selectedOperation?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Operation Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <span className="text-sm font-medium">Risk Level:</span>
                <Badge className={`ml-2 ${getRiskColor(selectedOperation?.risk || 'low')}`}>
                  {selectedOperation?.risk}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Estimated Duration:</span>
                <span className="ml-2 text-sm">{selectedOperation?.estimatedDuration}</span>
              </div>
            </div>

            {/* Dry Run Result */}
            {dryRunResult && (
              <Alert className={dryRunResult.success ? 'border-success' : 'border-destructive'}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>Dry Run Result:</strong> {dryRunResult.message}</p>
                    <p><strong>Affected Items:</strong> {dryRunResult.affectedItems}</p>
                    {dryRunResult.details && (
                      <details className="text-xs">
                        <summary className="cursor-pointer">Details</summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                          {JSON.stringify(dryRunResult.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Confirmation Note */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Confirmation Note (Optional):
              </label>
              <Textarea
                value={confirmationNote}
                onChange={(e) => setConfirmationNote(e.target.value)}
                placeholder="Add a note about why this operation is being performed..."
                rows={3}
              />
            </div>

            {/* Safety Warnings */}
            {selectedOperation?.risk === 'high' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>High Risk Operation:</strong> This operation may affect system performance or data integrity. Ensure you have recent backups and proceed with caution.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex space-x-2">
              {selectedOperation?.supportsDryRun && (
                <Button
                  variant="outline"
                  onClick={() => selectedOperation && executeOperation(selectedOperation, true)}
                  disabled={runningOperations.has(selectedOperation?.id || '')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Dry Run
                </Button>
              )}
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant={selectedOperation?.risk === 'high' ? 'destructive' : 'default'}
                onClick={() => selectedOperation && executeOperation(selectedOperation, false)}
                disabled={runningOperations.has(selectedOperation?.id || '')}
              >
                <Play className="h-4 w-4 mr-2" />
                Execute Now
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});

MaintenanceTools.displayName = 'MaintenanceTools';

export default MaintenanceTools;
