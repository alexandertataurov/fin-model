import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card'
import { Button } from '@/design-system/components/Button'
import { Badge } from '@/design-system/components/Badge'
import { Alert, AlertDescription } from '@/design-system/components/Alert'
import { ScrollArea } from '@/design-system/components/ScrollArea'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/design-system/components/Dialog'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/design-system/components/Table'
import { LayoutTemplate, Download, CheckCircle, AlertTriangle } from 'lucide-react'

interface ParameterTemplatesProps {
  modelId: string
  onClose: () => void
  onTemplateApplied?: () => void
}

interface ParameterTemplate {
  id: string
  name: string
  description: string
  parameters: Array<{
    name: string
    type: string
    default: number
    min_value?: number
    max_value?: number
    description?: string
  }>
  category: string
  created_by?: string
  usage_count?: number
}

export function ParameterTemplates({ 
  modelId, 
  onClose, 
  onTemplateApplied 
}: ParameterTemplatesProps) {
  const [templates, setTemplates] = useState<ParameterTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<ParameterTemplate | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/v1/parameter-templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      } else {
        setError('Failed to load parameter templates')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const handlePreviewTemplate = (template: ParameterTemplate) => {
    setSelectedTemplate(template)
    setShowPreview(true)
  }

  const applyTemplate = async (template: ParameterTemplate) => {
    setApplying(true)
    setError(null)

    try {
      const response = await fetch(`/api/v1/models/${modelId}/apply-template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: template.id })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          onTemplateApplied?.()
          onClose()
        } else {
          setError(result.message || 'Failed to apply template')
        }
      } else {
        setError('Failed to apply template')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setApplying(false)
    }
  }

  const getTemplatesByCategory = () => {
    const grouped: Record<string, ParameterTemplate[]> = {}
    templates.forEach(template => {
      const category = template.category || 'Other'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(template)
    })
    return grouped
  }

  const formatParameterType = (type: string) => {
    switch (type) {
      case 'growth_rate':
        return 'Growth Rate'
      case 'discount_rate':
        return 'Discount Rate'
      case 'tax_rate':
        return 'Tax Rate'
      case 'currency':
        return 'Currency'
      case 'percentage':
        return 'Percentage'
      default:
        return type.charAt(0).toUpperCase() + type.slice(1)
    }
  }

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'percentage':
      case 'growth_rate':
      case 'discount_rate':
      case 'tax_rate':
        return `${(value * 100).toFixed(1)}%`
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value)
      default:
        return value.toString()
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <LayoutTemplate className="h-5 w-5" />
                Parameter Templates
              </CardTitle>
              <Button variant="outline" onClick={onClose}>×</Button>
            </div>
            <p className="text-muted-foreground">
              Choose from pre-built parameter configurations for common financial models
            </p>
          </CardHeader>

          <CardContent>
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading templates...</p>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!loading && !error && (
              <ScrollArea className="h-[600px]">
                <div className="space-y-6">
                  {Object.entries(getTemplatesByCategory()).map(([category, categoryTemplates]) => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold mb-3 text-primary">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categoryTemplates.map(template => (
                          <Card key={template.id} className="border-2 hover:border-primary/50 transition-colors">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-base">
                                  {template.name}
                                </CardTitle>
                                <Badge variant="outline">
                                  {template.parameters.length} params
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {template.description}
                              </p>
                            </CardHeader>
                            
                            <CardContent className="pt-0">
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-muted-foreground">
                                  {template.usage_count && (
                                    <span>Used {template.usage_count} times</span>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePreviewTemplate(template)}
                                  >
                                    Preview
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => applyTemplate(template)}
                                    disabled={applying}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Apply
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}

                  {templates.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No parameter templates available
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Template Preview Dialog */}
      {showPreview && selectedTemplate && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>{selectedTemplate.name}</DialogTitle>
              <DialogDescription>
                {selectedTemplate.description}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="h-[400px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Default Value</TableHead>
                    <TableHead>Range</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTemplate.parameters.map((param, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {param.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {formatParameterType(param.type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">
                        {formatValue(param.default, param.type)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {param.min_value !== undefined && param.max_value !== undefined ? (
                          `${formatValue(param.min_value, param.type)} - ${formatValue(param.max_value, param.type)}`
                        ) : (
                          'No limits'
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {param.description || 'No description'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close
              </Button>
              <Button 
                onClick={() => {
                  setShowPreview(false)
                  applyTemplate(selectedTemplate)
                }}
                disabled={applying}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Apply Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}