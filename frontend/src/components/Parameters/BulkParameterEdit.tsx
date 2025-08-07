import React, { useState, useCallback } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/design-system/components/Dialog'
import { Button } from '@/design-system/components/Button'
import { Input } from '@/design-system/components/Input'
import { Label } from '@/design-system/components/Label'
import { Checkbox } from '@/design-system/components/Checkbox'
import { Badge } from '@/design-system/components/Badge'
import { Alert, AlertDescription } from '@/design-system/components/Alert'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/design-system/components/Table'
import { ScrollArea } from '@/design-system/components/ScrollArea'
import { Separator } from '@/design-system/components/Separator'
import { CheckCircle, X, Settings, Save } from 'lucide-react'
import type { Parameter } from './ParameterPanel'

interface BulkParameterEditProps {
  parameters: Parameter[]
  onBulkUpdate: (updates: Array<{id: string, value: number}>) => void
  onClose: () => void
}

interface ParameterUpdate {
  id: string
  name: string
  currentValue: number
  newValue: number
  category: string
  selected: boolean
}

export function BulkParameterEdit({
  parameters,
  onBulkUpdate,
  onClose
}: BulkParameterEditProps) {
  const [updates, setUpdates] = useState<ParameterUpdate[]>(
    parameters.map(param => ({
      id: param.id,
      name: param.display_name || param.name,
      currentValue: param.value,
      newValue: param.value,
      category: param.category,
      selected: false
    }))
  )
  
  const [globalMultiplier, setGlobalMultiplier] = useState('1.0')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [applyMode, setApplyMode] = useState<'replace' | 'multiply' | 'add'>('replace')

  const categories = ['all', ...new Set(parameters.map(p => p.category))]
  const selectedUpdates = updates.filter(u => u.selected)

  const handleParameterToggle = useCallback((id: string, selected: boolean) => {
    setUpdates(prev => prev.map(update => 
      update.id === id ? { ...update, selected } : update
    ))
  }, [])

  const handleValueChange = useCallback((id: string, value: string) => {
    const numValue = parseFloat(value) || 0
    setUpdates(prev => prev.map(update => 
      update.id === id ? { ...update, newValue: numValue } : update
    ))
  }, [])

  const handleSelectAll = useCallback(() => {
    const filteredUpdates = selectedCategory === 'all' 
      ? updates 
      : updates.filter(u => u.category === selectedCategory)
    
    const allSelected = filteredUpdates.every(u => u.selected)
    
    setUpdates(prev => prev.map(update => {
      if (selectedCategory === 'all' || update.category === selectedCategory) {
        return { ...update, selected: !allSelected }
      }
      return update
    }))
  }, [updates, selectedCategory])

  const applyGlobalChange = useCallback(() => {
    const multiplier = parseFloat(globalMultiplier) || 1
    
    setUpdates(prev => prev.map(update => {
      if (!update.selected) return update
      
      let newValue = update.currentValue
      switch (applyMode) {
        case 'multiply':
          newValue = update.currentValue * multiplier
          break
        case 'add':
          newValue = update.currentValue + multiplier
          break
        case 'replace':
          newValue = multiplier
          break
      }
      
      return { ...update, newValue }
    }))
  }, [globalMultiplier, applyMode])

  const handleSave = useCallback(() => {
    const changedUpdates = updates.filter(u => 
      u.selected && u.newValue !== u.currentValue
    )
    
    if (changedUpdates.length === 0) {
      onClose()
      return
    }
    
    onBulkUpdate(changedUpdates.map(u => ({
      id: u.id,
      value: u.newValue
    })))
    
    onClose()
  }, [updates, onBulkUpdate, onClose])

  const filteredUpdates = selectedCategory === 'all' 
    ? updates 
    : updates.filter(u => u.category === selectedCategory)

  const hasChanges = updates.some(u => u.selected && u.newValue !== u.currentValue)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Bulk Parameter Edit
          </DialogTitle>
          <DialogDescription>
            Select parameters and apply changes in bulk. Changes will trigger model recalculation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Global Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="category-filter">Filter by Category</Label>
              <select
                id="category-filter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="apply-mode">Apply Mode</Label>
              <select
                id="apply-mode"
                value={applyMode}
                onChange={(e) => setApplyMode(e.target.value as any)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="replace">Replace Value</option>
                <option value="multiply">Multiply by Factor</option>
                <option value="add">Add Value</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="global-value">
                {applyMode === 'replace' ? 'New Value' : 
                 applyMode === 'multiply' ? 'Multiplier' : 'Add Value'}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="global-value"
                  type="number"
                  step="0.01"
                  value={globalMultiplier}
                  onChange={(e) => setGlobalMultiplier(e.target.value)}
                  placeholder={applyMode === 'multiply' ? '1.0' : '0'}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={applyGlobalChange}
                  disabled={selectedUpdates.length === 0}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {/* Selection Summary */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {filteredUpdates.every(u => u.selected) ? 'Deselect All' : 'Select All'}
              </Button>
              <span className="text-sm text-muted-foreground">
                {selectedUpdates.length} of {updates.length} parameters selected
              </span>
            </div>
            
            {hasChanges && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                {updates.filter(u => u.selected && u.newValue !== u.currentValue).length} changes pending
              </Badge>
            )}
          </div>

          <Separator />

          {/* Parameters Table */}
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Select</TableHead>
                  <TableHead>Parameter</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Value</TableHead>
                  <TableHead>New Value</TableHead>
                  <TableHead>Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUpdates.map(update => {
                  const hasChange = update.newValue !== update.currentValue
                  const changePercent = update.currentValue !== 0 
                    ? ((update.newValue - update.currentValue) / update.currentValue * 100).toFixed(1)
                    : 'N/A'

                  return (
                    <TableRow key={update.id} className={hasChange && update.selected ? 'bg-muted/50' : ''}>
                      <TableCell>
                        <Checkbox
                          checked={update.selected}
                          onCheckedChange={(checked) => 
                            handleParameterToggle(update.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {update.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {update.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{update.currentValue.toFixed(4)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.0001"
                          value={update.newValue}
                          onChange={(e) => handleValueChange(update.id, e.target.value)}
                          className={`w-24 ${hasChange ? 'border-orange-300' : ''}`}
                          disabled={!update.selected}
                        />
                      </TableCell>
                      <TableCell>
                        {hasChange && (
                          <Badge variant={update.newValue > update.currentValue ? 'default' : 'secondary'}>
                            {update.newValue > update.currentValue ? '+' : ''}
                            {changePercent}%
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </ScrollArea>

          {hasChanges && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {updates.filter(u => u.selected && u.newValue !== u.currentValue).length} parameters 
                will be updated. This will trigger model recalculation.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            Apply Changes ({updates.filter(u => u.selected && u.newValue !== u.currentValue).length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}