import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { GripVertical, Maximize2, Minimize2, X } from 'lucide-react'

interface DraggableWidgetProps {
  title: string
  children: React.ReactNode
  id: string
  onRemove?: (id: string) => void
  className?: string
}

export function DraggableWidget({
  title,
  children,
  id,
  onRemove,
  className = ""
}: DraggableWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('.widget-controls')) {
      return
    }
    // Simplified drag handling for now - just show visual feedback
    setIsDragging(true)
  }

  const handleMouseMove = (_e: React.MouseEvent) => {
    // Simplified - just maintain visual state
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <Card
      className={`group transition-all duration-200 ${
        isDragging ? 'shadow-lg scale-105' : 'hover:shadow-md'
      } ${isExpanded ? 'col-span-2 row-span-2' : ''} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
            {title}
          </CardTitle>
          <div className="widget-controls flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? (
                <Minimize2 className="h-3 w-3" />
              ) : (
                <Maximize2 className="h-3 w-3" />
              )}
            </Button>
            {onRemove && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(id)}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  )
}
