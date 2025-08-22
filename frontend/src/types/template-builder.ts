export interface ReportElement {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'text' | 'image';
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: ReportElementConfig;
  style: ElementStyle;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  elements: ReportElement[];
  layout: {
    pageSize: 'A4' | 'Letter' | 'Legal';
    orientation: 'portrait' | 'landscape';
    margins: { top: number; right: number; bottom: number; left: number };
  };
  metadata: {
    created_by: string;
    created_at: string;
    last_modified: string;
    version: number;
  };
}

export interface ReportElementConfig {
  chart?: ChartConfig;
  table?: TableConfig;
  metric?: MetricConfig;
  text?: TextConfig;
  image?: ImageConfig;
}

export interface ChartConfig {
  chartType: 'line' | 'bar' | 'pie' | 'waterfall' | 'scatter';
  dataSource: string;
  xAxis?: string;
  yAxis?: string[];
  title?: string;
  showLegend?: boolean;
  colors?: string[];
}

export interface TableConfig {
  dataSource: string;
  columns: TableColumn[];
  showHeaders?: boolean;
  pagination?: boolean;
  sortable?: boolean;
}

export interface TableColumn {
  key: string;
  title: string;
  width?: number;
  format?: 'currency' | 'percentage' | 'number' | 'text';
}

export interface MetricConfig {
  value: string | number;
  label: string;
  format: 'currency' | 'percentage' | 'number';
  comparison?: {
    value: string | number;
    type: 'previous_period' | 'target' | 'benchmark';
  };
}

export interface TextConfig {
  content: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
}

export interface ImageConfig {
  src: string;
  alt?: string;
  fit?: 'cover' | 'contain' | 'fill';
}

export interface ElementStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
  margin?: number;
  opacity?: number;
}

export interface DragItem {
  type: string;
  elementType: ReportElement['type'];
  id?: string;
}

export interface TemplateCanvasProps {
  template: ReportTemplate;
  onTemplateChange: (template: ReportTemplate) => void;
  selectedElement: string | null;
  onElementSelect: (elementId: string | null) => void;
  previewMode: boolean;
}

export interface DraggableElementProps {
  element: ReportElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (element: ReportElement) => void;
  previewMode: boolean;
}

export interface PropertiesPanelProps {
  element: ReportElement | null;
  onElementUpdate: (element: ReportElement) => void;
}

export interface ElementPaletteProps {
  onElementDrag: (elementType: ReportElement['type']) => void;
}

// Collaboration types
export interface Collaborator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  permission: CollaborationPermission;
  isActive: boolean;
  lastSeen?: string;
}

export enum CollaborationPermission {
  VIEW = 'view',
  EDIT = 'edit',
  ADMIN = 'admin',
}

export interface ReportCollaboration {
  id: string;
  report_template_id: string;
  user_id: string;
  permission: CollaborationPermission;
  invited_by: string;
  invited_at: string;
  accepted_at?: string;
}

export interface ReportEdit {
  id: string;
  report_template_id: string;
  user_id: string;
  edit_type:
    | 'element_add'
    | 'element_update'
    | 'element_delete'
    | 'template_update';
  element_id?: string;
  changes: Record<string, any>;
  timestamp: string;
}

export interface CollaborationMessage {
  type: 'template_edit' | 'user_presence' | 'cursor_move';
  data: any;
  sender_id: string;
  timestamp: string;
}

// AI Insights types
export interface AIInsight {
  id: string;
  report_id: string;
  user_id: string;
  insight_type:
    | 'trend_analysis'
    | 'ratio_analysis'
    | 'risk_assessment'
    | 'comprehensive';
  input_data: Record<string, any>;
  ai_response: {
    summary: string;
    insights: string[];
    recommendations: string[];
    risks: string[];
  };
  confidence_score: number;
  created_at: string;
  feedback_rating?: number;
}

export interface ReportElementSuggestion {
  id: string;
  type: ReportElement['type'];
  subtype?: string;
  title: string;
  description: string;
  confidence: number;
  data_mapping?: Record<string, any>;
  suggested_config: Partial<ReportElementConfig>;
}

export interface AIInsightsProps {
  reportData: Record<string, any>;
  onInsightGenerated?: (insight: AIInsight) => void;
}

export interface SmartRecommendationsProps {
  dataContext: Record<string, any>;
  onAddElement: (suggestion: ReportElementSuggestion) => void;
}

export interface CollaborationBarProps {
  templateId: string;
  collaborators: Collaborator[];
  isConnected: boolean;
  onInviteCollaborator: () => void;
}
