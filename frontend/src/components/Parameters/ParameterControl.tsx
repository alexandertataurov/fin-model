import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Slider } from '../ui/slider'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import { AlertTriangle, Clock, BarChart, History } from 'lucide-react'
import type { Parameter } from './ParameterPanel'

interface ParameterControlProps {
  parameter: Parameter
  value: number
  onChange: (value: number) => void
  error?: string
  readOnly?: boolean
  onShowImpact?: () => void
  onShowHistory?: () => void
}

export function ParameterControl({
  parameter,
  value,
  onChange,
  error,
  readOnly = false,
  onShowImpact,
  onShowHistory
}: ParameterControlProps) {
  const [localValue, setLocalValue] = useState(value.toString())
  const [isEditing, setIsEditing] = useState(false)

  const formatValue = useCallback((val: number) => {
    switch (parameter.display_format) {
      case 'percentage':
        return `${(val * 100).toFixed(2)}%`
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(val)
      default:
        return val.toFixed(parameter.step_size ? Math.log10(1 / parameter.step_size) : 2)
    }
  }, [parameter.display_format, parameter.step_size])

  const parseValue = useCallback((val: string) => {
    const cleanVal = val.replace(/[^\d.-]/g, '')
    const numVal = parseFloat(cleanVal)
    
    if (isNaN(numVal)) return value
    
    // Convert percentage back to decimal
    if (parameter.display_format === 'percentage') {
      return numVal / 100
    }
    
    return numVal
  }, [parameter.display_format, value])

  const handleInputChange = useCallback((newValue: string) => {
    setLocalValue(newValue)
  }, [])

  const handleInputBlur = useCallback(() => {
    const numValue = parseValue(localValue)
    
    // Validate against constraints
    let validatedValue = numValue
    if (parameter.min_value !== undefined) {
      validatedValue = Math.max(validatedValue, parameter.min_value)
    }
    if (parameter.max_value !== undefined) {
      validatedValue = Math.min(validatedValue, parameter.max_value)
    }
    
    setLocalValue(formatValue(validatedValue))
    onChange(validatedValue)
    setIsEditing(false)
  }, [localValue, parseValue, formatValue, onChange, parameter.min_value, parameter.max_value])

  const handleInputFocus = useCallback(() => {
    setIsEditing(true)
    setLocalValue(value.toString())
  }, [value])

  const handleSliderChange = useCallback((values: number[]) => {
    const newValue = values[0]
    onChange(newValue)
    setLocalValue(formatValue(newValue))
  }, [onChange, formatValue])

  const renderControl = () => {
    if (readOnly) {
      return (
        <div className="text-lg font-medium">
          {formatValue(value)}
        </div>
      )
    }

    switch (parameter.control_type) {
      case 'slider':
        return (
          <div className="space-y-3">
            <Slider
              value={[value]}
              onValueChange={handleSliderChange}
              min={parameter.min_value ?? 0}
              max={parameter.max_value ?? 100}
              step={parameter.step_size ?? 0.01}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatValue(parameter.min_value ?? 0)}</span>
              <span className="font-medium">{formatValue(value)}</span>
              <span>{formatValue(parameter.max_value ?? 100)}</span>
            </div>
          </div>
        )
      
      case 'input':
      default:
        return (
          <Input
            value={isEditing ? localValue : formatValue(value)}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className={error ? 'border-red-500' : ''}
            placeholder={formatValue(parameter.default_value)}
          />
        )
    }
  }

  return (
    <Card className={`${error ? 'border-red-200' : ''} ${!parameter.is_editable ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {parameter.display_name || parameter.name}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {parameter.category}
            </Badge>
            {parameter.source_cell && (
              <Badge variant="secondary" className="text-xs">
                {parameter.source_cell}
              </Badge>
            )}
          </div>
        </div>
        {parameter.description && (
          <p className="text-xs text-muted-foreground">
            {parameter.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-3">
        {renderControl()}
        
        {error && (
          <Alert variant="destructive" className="py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-between">
          {parameter.updated_at && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Updated {new Date(parameter.updated_at).toLocaleString()}</span>
            </div>
          )}
          
          {!readOnly && (
            <div className="flex gap-1">
              {onShowImpact && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowImpact}
                  className="h-6 w-6 p-0"
                  title="Show impact analysis"
                >
                  <BarChart className="h-3 w-3" />
                </Button>
              )}
              {onShowHistory && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowHistory}
                  className="h-6 w-6 p-0"
                  title="Show parameter history"
                >
                  <History className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}