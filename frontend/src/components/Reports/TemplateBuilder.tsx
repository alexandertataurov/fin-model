import React, { useState, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Save, Download, Share } from 'lucide-react';
import { ReportTemplate, ReportElement } from '@/types/template-builder';
import { TemplateCanvas } from './TemplateCanvas';
import { ElementPalette } from './ElementPalette';
import { PropertiesPanel } from './PropertiesPanel';
import { CollaborationBar } from './CollaborationBar';

const defaultTemplate: ReportTemplate = {
  id: '',
  name: 'Untitled Report',
  description: '',
  elements: [],
  layout: {
    pageSize: 'A4',
    orientation: 'portrait',
    margins: { top: 20, right: 20, bottom: 20, left: 20 },
  },
  metadata: {
    created_by: '',
    created_at: new Date().toISOString(),
    last_modified: new Date().toISOString(),
    version: 1,
  },
};

interface TemplateBuilderProps {
  initialTemplate?: ReportTemplate;
  onSave?: (template: ReportTemplate) => void;
  onExport?: (template: ReportTemplate) => void;
  readonly?: boolean;
}

export const TemplateBuilder: React.FC<TemplateBuilderProps> = ({
  initialTemplate = defaultTemplate,
  onSave,
  onExport,
  readonly = false,
}) => {
  const [template, setTemplate] = useState<ReportTemplate>(initialTemplate);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleTemplateChange = useCallback(
    (updatedTemplate: ReportTemplate) => {
      setTemplate({
        ...updatedTemplate,
        metadata: {
          ...updatedTemplate.metadata,
          last_modified: new Date().toISOString(),
        },
      });
    },
    []
  );

  const handleElementSelect = useCallback((elementId: string | null) => {
    setSelectedElement(elementId);
  }, []);

  const handleElementUpdate = useCallback((updatedElement: ReportElement) => {
    setTemplate(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        el.id === updatedElement.id ? updatedElement : el
      ),
      metadata: {
        ...prev.metadata,
        last_modified: new Date().toISOString(),
      },
    }));
  }, []);

  const handleAddElement = useCallback((elementType: ReportElement['type']) => {
    const newElement: ReportElement = {
      id: `element-${Date.now()}`,
      type: elementType,
      position: { x: 50, y: 50 },
      size: { width: 200, height: 150 },
      config: {},
      style: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        borderRadius: 4,
        padding: 8,
      },
    };

    setTemplate(prev => ({
      ...prev,
      elements: [...prev.elements, newElement],
      metadata: {
        ...prev.metadata,
        last_modified: new Date().toISOString(),
      },
    }));

    setSelectedElement(newElement.id);
  }, []);

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave(template);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport(template);
    }
  };

  const selectedElementData = selectedElement
    ? template.elements.find(el => el.id === selectedElement) || null
    : null;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Top Toolbar */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <Input
                  value={template.name}
                  onChange={e =>
                    setTemplate(prev => ({
                      ...prev,
                      name: e.target.value,
                      metadata: {
                        ...prev.metadata,
                        last_modified: new Date().toISOString(),
                      },
                    }))
                  }
                  className="text-lg font-medium border-none p-0 h-auto"
                  placeholder="Report name"
                  disabled={readonly}
                />
                <Input
                  value={template.description}
                  onChange={e =>
                    setTemplate(prev => ({
                      ...prev,
                      description: e.target.value,
                      metadata: {
                        ...prev.metadata,
                        last_modified: new Date().toISOString(),
                      },
                    }))
                  }
                  className="text-sm text-gray-600 border-none p-0 h-auto mt-1"
                  placeholder="Add a description..."
                  disabled={readonly}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="show-grid" className="text-sm">
                  Grid
                </Label>
                <Switch
                  id="show-grid"
                  checked={showGrid}
                  onCheckedChange={setShowGrid}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="preview-mode" className="text-sm">
                  Preview
                </Label>
                <Switch
                  id="preview-mode"
                  checked={previewMode}
                  onCheckedChange={setPreviewMode}
                />
              </div>

              <Separator orientation="vertical" className="h-6" />

              {!readonly && (
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              )}

              <Button onClick={handleExport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Collaboration Bar */}
        {!readonly && (
          <CollaborationBar
            templateId={template.id}
            collaborators={[]}
            isConnected={false}
            onInviteCollaborator={() => {
              // Handle invite collaborator
            }}
          />
        )}

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Element Palette */}
          {!readonly && !previewMode && (
            <div className="w-64 bg-white border-r">
              <ElementPalette onElementAdd={handleAddElement} />
            </div>
          )}

          {/* Canvas Area */}
          <div className="flex-1 relative">
            <TemplateCanvas
              template={template}
              onTemplateChange={handleTemplateChange}
              selectedElement={selectedElement}
              onElementSelect={handleElementSelect}
              previewMode={previewMode}
              showGrid={showGrid}
              readonly={readonly}
            />
          </div>

          {/* Properties Panel */}
          {!readonly && !previewMode && (
            <div className="w-80 bg-white border-l">
              <PropertiesPanel
                element={selectedElementData}
                onElementUpdate={handleElementUpdate}
                template={template}
                onTemplateUpdate={handleTemplateChange}
              />
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default TemplateBuilder;
