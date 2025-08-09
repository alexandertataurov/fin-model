import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card'
import { Button } from '@/design-system/components/Button'
import { Badge } from '@/design-system/components/Badge'
import { ScrollArea } from '@/design-system/components/ScrollArea'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/design-system/components/Table'
import { Clock, User, TrendingUp, TrendingDown, RotateCcw } from 'lucide-react'
import LoadingState from './LoadingState'
import type { Parameter } from './ParameterPanel'

interface ParameterHistoryProps {
  parameter: Parameter
  onClose: () => void
  onRevertToValue?: (value: number) => void
}

interface HistoryEntry {
  id: string
  parameter_id: string
  value: number
  original_value: number
  change_reason: string
  changed_at: string
  changed_by: {
    id: string
    name: string
    email: string
  }
  is_valid: boolean
  validation_errors: string[]
}

export function ParameterHistory({ 
  parameter, 
  onClose, 
  onRevertToValue 
}: ParameterHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadHistory = useCallback(async () => {
    try {
      const response = await fetch(`/api/v1/parameters/${parameter.id}/history?limit=50`)
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      } else {
        setError('Failed to load parameter history')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }, [parameter.id])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  const formatValue = (value: number) => {
    switch (parameter.display_format) {
      case 'percentage':
        return `${(value * 100).toFixed(2)}%`
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value)
      default:
        return value.toFixed(4)
    }
  }

  const calculateChange = (oldValue: number, newValue: number) => {
    if (oldValue === 0) return newValue > 0 ? 100 : 0
    return ((newValue - oldValue) / oldValue * 100)
  }

  const handleRevert = (value: number) => {
    if (onRevertToValue) {
      onRevertToValue(value)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Parameter History: {parameter.display_name || parameter.name}
            </CardTitle>
            <Button variant="outline" onClick={onClose}>×</Button>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Current Value: {formatValue(parameter.value)}</span>
            <Badge variant="outline">{parameter.category}</Badge>
            {parameter.source_cell && (
              <Badge variant="secondary">{parameter.source_cell}</Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {loading && <LoadingState message="Loading history..." />}

          {error && (
            <div className="text-center py-8 text-red-500">
              {error}
            </div>
          )}

          {!loading && !error && (
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Changed By</TableHead>
                    <TableHead>Previous Value</TableHead>
                    <TableHead>New Value</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((entry, _index) => {
                    const change = calculateChange(entry.original_value, entry.value)
                    const isIncrease = change > 0
                    const isCurrentValue = Math.abs(entry.value - parameter.value) < 0.0001

                    return (
                      <TableRow 
                        key={entry.id}
                        className={isCurrentValue ? 'bg-blue-50 border-blue-200' : ''}
                      >
                        <TableCell>
                          <div className="text-sm">
                            {new Date(entry.changed_at).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(entry.changed_at).toLocaleTimeString()}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <div>
                              <div className="text-sm font-medium">
                                {entry.changed_by.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {entry.changed_by.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <span className="font-mono text-sm">
                            {formatValue(entry.original_value)}
                          </span>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">
                              {formatValue(entry.value)}
                            </span>
                            {isCurrentValue && (
                              <Badge variant="default" className="text-xs">
                                Current
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {isIncrease ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : change < 0 ? (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            ) : null}
                            <span className={`text-sm font-medium ${
                              isIncrease ? 'text-green-600' : 
                              change < 0 ? 'text-red-600' : 
                              'text-gray-600'
                            }`}>
                              {change > 0 ? '+' : ''}{change.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <span className="text-sm">
                            {entry.change_reason || 'No reason provided'}
                          </span>
                        </TableCell>
                        
                        <TableCell>
                          {!isCurrentValue && onRevertToValue && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRevert(entry.value)}
                              className="text-xs"
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Revert
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {history.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No history available for this parameter
                </div>
              )}
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}