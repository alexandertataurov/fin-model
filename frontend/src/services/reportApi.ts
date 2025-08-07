import { apiClient } from './api';

const API_BASE_URL = '/api/v1/reports';

export interface ReportTemplate {
  id: number;
  name: string;
  description?: string;
  report_type: 'financial' | 'performance' | 'risk' | 'custom' | 'dashboard' | 'executive';
  category: string;
  is_system: boolean;
  is_active: boolean;
  is_shared: boolean;
  template_config: {
    sections: ReportSection[];
    styling: ReportStyling;
    filters: ReportFilter[];
    charts: ReportChart[];
    tables: ReportTable[];
    metadata: Record<string, any>;
  };
  branding_config: {
    logo_url?: string;
    company_name?: string;
    color_scheme?: string;
    font_family?: string;
    header_footer?: boolean;
  };
  permissions: {
    can_edit: boolean;
    can_share: boolean;
    can_delete: boolean;
  };
  usage_stats: {
    times_used: number;
    last_used?: string;
    average_generation_time?: number;
  };
  created_by: number;
  created_at: string;
  updated_at?: string;
}

export interface ReportSection {
  id: string;
  name: string;
  type: 'header' | 'content' | 'chart' | 'table' | 'summary' | 'footer';
  order: number;
  config: Record<string, any>;
  data_source?: string;
  conditions?: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  }>;
}

export interface ReportStyling {
  theme: 'light' | 'dark' | 'corporate';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography: {
    heading_font: string;
    body_font: string;
    font_sizes: Record<string, number>;
  };
  layout: {
    margins: Record<string, number>;
    spacing: Record<string, number>;
    page_size: 'A4' | 'Letter' | 'Legal';
    orientation: 'portrait' | 'landscape';
  };
}

export interface ReportFilter {
  id: string;
  name: string;
  type: 'date_range' | 'select' | 'multiselect' | 'number_range' | 'text';
  field: string;
  options?: Array<{ label: string; value: any }>;
  default_value?: any;
  required: boolean;
}

export interface ReportChart {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap';
  data_source: string;
  config: Record<string, any>;
  position: { x: number; y: number; width: number; height: number };
}

export interface ReportTable {
  id: string;
  title: string;
  data_source: string;
  columns: Array<{
    field: string;
    header: string;
    type: 'text' | 'number' | 'currency' | 'percentage' | 'date';
    format?: string;
    sortable?: boolean;
  }>;
  aggregations?: Array<{
    column: string;
    function: 'sum' | 'avg' | 'count' | 'min' | 'max';
  }>;
  position: { x: number; y: number; width: number; height: number };
}

export interface ReportExport {
  id: number;
  name: string;
  export_format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON' | 'POWERPOINT';
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  template_id?: number;
  template_name?: string;
  file_path?: string;
  file_size?: number;
  file_url?: string;
  download_count: number;
  processing_started_at?: string;
  processing_completed_at?: string;
  processing_duration_seconds?: number;
  error_message?: string;
  filters_applied?: Record<string, any>;
  data_range?: {
    start_date: string;
    end_date: string;
  };
  quality_metrics?: {
    completeness: number;
    accuracy: number;
    data_points: number;
  };
  created_by: number;
  created_at: string;
  expires_at?: string;
  is_scheduled: boolean;
  schedule_config?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    next_run: string;
  };
}

export interface GenerateReportRequest {
  template_id: number;
  export_format: 'PDF' | 'EXCEL' | 'CSV' | 'JSON' | 'POWERPOINT';
  name?: string;
  source_file_ids?: number[];
  model_ids?: number[];
  scenario_ids?: number[];
  data_period_start?: string;
  data_period_end?: string;
  filters?: Record<string, any>;
  custom_config?: {
    include_charts: boolean;
    include_raw_data: boolean;
    include_calculations: boolean;
    include_metadata: boolean;
    watermark?: string;
    password_protect?: boolean;
    password?: string;
  };
  delivery_options?: {
    email_recipients?: string[];
    auto_download?: boolean;
    notification_webhook?: string;
  };
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    start_date: string;
    end_date?: string;
    time: string;
    timezone: string;
  };
}

export interface ChartExportRequest {
  chart_type: 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap' | 'custom';
  chart_data: Record<string, unknown>;
  export_format: 'PNG' | 'SVG' | 'PDF' | 'JPEG';
  width?: number;
  height?: number;
  dpi?: number;
  title?: string;
  subtitle?: string;
  filename?: string;
  styling?: {
    theme: 'light' | 'dark' | 'corporate';
    colors: string[];
    background_color: string;
    font_family: string;
    font_size: number;
  };
  annotations?: Array<{
    type: 'text' | 'line' | 'rectangle';
    position: { x: number; y: number };
    content: string;
    style: Record<string, any>;
  }>;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  report_type: string;
  template_config?: Record<string, unknown>;
  branding_config?: Record<string, unknown>;
}

// Additional interfaces for enhanced functionality
export interface ReportSchedule {
  id: number;
  template_id: number;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  schedule_time: string;
  timezone: string;
  is_active: boolean;
  next_run: string;
  last_run?: string;
  recipients: string[];
  filters?: Record<string, any>;
  created_by: number;
  created_at: string;
}

export interface ReportAnalytics {
  template_id: number;
  total_generations: number;
  successful_generations: number;
  failed_generations: number;
  average_generation_time_seconds: number;
  most_used_format: string;
  usage_by_format: Record<string, number>;
  usage_over_time: Array<{
    date: string;
    count: number;
  }>;
  top_users: Array<{
    user_id: number;
    username: string;
    generation_count: number;
  }>;
}

export class ReportApi {
  // Template Management
  static async getTemplates(filters?: {
    report_type?: string;
    category?: string;
    include_system?: boolean;
    include_shared?: boolean;
    created_by?: number;
    search?: string;
  }): Promise<ReportTemplate[]> {
    const response = await apiClient.get(`${API_BASE_URL}/templates`, { params: filters });
    return response.data;
  }

  static async getTemplate(templateId: number): Promise<ReportTemplate> {
    const response = await apiClient.get(`${API_BASE_URL}/templates/${templateId}`);
    return response.data;
  }

  static async createTemplate(templateData: CreateTemplateRequest): Promise<ReportTemplate> {
    const response = await apiClient.post(`${API_BASE_URL}/templates`, templateData);
    return response.data;
  }

  static async updateTemplate(templateId: number, templateData: Partial<CreateTemplateRequest>): Promise<ReportTemplate> {
    const response = await apiClient.put(`${API_BASE_URL}/templates/${templateId}`, templateData);
    return response.data;
  }

  static async deleteTemplate(templateId: number): Promise<void> {
    await apiClient.delete(`${API_BASE_URL}/templates/${templateId}`);
  }

  // Template Sharing and Collaboration
  static async shareTemplate(templateId: number, shareConfig: {
    users?: number[];
    roles?: string[];
    permissions: 'view' | 'edit' | 'copy';
    message?: string;
  }): Promise<{ shared_with_count: number }> {
    const response = await apiClient.post(`${API_BASE_URL}/templates/${templateId}/share`, shareConfig);
    return response.data;
  }

  static async duplicateTemplate(templateId: number, newName?: string): Promise<ReportTemplate> {
    const response = await apiClient.post(`${API_BASE_URL}/templates/${templateId}/duplicate`, {
      name: newName,
    });
    return response.data;
  }

  static async getTemplateVersions(templateId: number): Promise<Array<{
    version: number;
    created_at: string;
    created_by: number;
    changes_summary: string;
  }>> {
    const response = await apiClient.get(`${API_BASE_URL}/templates/${templateId}/versions`);
    return response.data;
  }

  static async restoreTemplateVersion(templateId: number, version: number): Promise<ReportTemplate> {
    const response = await apiClient.post(`${API_BASE_URL}/templates/${templateId}/versions/${version}/restore`);
    return response.data;
  }

  // Advanced Report Generation
  static async generateReport(reportData: GenerateReportRequest): Promise<ReportExport> {
    const response = await apiClient.post(`${API_BASE_URL}/generate`, reportData);
    return response.data;
  }

  static async generateBatchReports(requests: GenerateReportRequest[]): Promise<{
    batch_id: string;
    report_ids: number[];
    estimated_completion: string;
  }> {
    const response = await apiClient.post(`${API_BASE_URL}/generate/batch`, { reports: requests });
    return response.data;
  }

  static async getBatchStatus(batchId: string): Promise<{
    batch_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    completed_reports: number;
    total_reports: number;
    reports: Array<{ id: number; status: string; error?: string }>;
  }> {
    const response = await apiClient.get(`${API_BASE_URL}/generate/batch/${batchId}/status`);
    return response.data;
  }

  static async previewReport(templateId: number, filters?: Record<string, any>): Promise<{
    preview_url: string;
    data_summary: {
      total_records: number;
      date_range: { start: string; end: string };
      key_metrics: Record<string, number>;
    };
  }> {
    const response = await apiClient.post(`${API_BASE_URL}/templates/${templateId}/preview`, { filters });
    return response.data;
  }

  static async exportChart(chartData: ChartExportRequest): Promise<{ message: string; file_path: string; download_url: string }> {
    const response = await apiClient.post(`${API_BASE_URL}/charts/export`, chartData);
    return response.data;
  }

  static async exportChartCollection(charts: ChartExportRequest[], options?: {
    combine_into_pdf?: boolean;
    filename?: string;
    layout?: 'grid' | 'vertical' | 'horizontal';
  }): Promise<{ download_urls: string[]; combined_url?: string }> {
    const response = await apiClient.post(`${API_BASE_URL}/charts/export-collection`, {
      charts,
      options,
    });
    return response.data;
  }

  static async exportData(exportData: {
    export_format: 'CSV' | 'JSON' | 'EXCEL' | 'PARQUET';
    source_file_ids?: number[];
    model_ids?: number[];
    scenario_ids?: number[];
    date_range?: { start: string; end: string };
    filters?: Record<string, any>;
    include_raw_data?: boolean;
    include_calculations?: boolean;
    include_metadata?: boolean;
    include_parameters?: boolean;
    aggregation_level?: 'raw' | 'daily' | 'weekly' | 'monthly';
    compression?: 'none' | 'gzip' | 'zip';
  }): Promise<{ message: string; file_path: string; download_url: string; file_size_mb: number }> {
    const response = await apiClient.post(`${API_BASE_URL}/data/export`, exportData);
    return response.data;
  }

  static async exportDataStreaming(exportData: {
    export_format: 'CSV' | 'JSON';
    source_file_ids?: number[];
    filters?: Record<string, any>;
    chunk_size?: number;
  }): Promise<{
    stream_id: string;
    chunk_urls: string[];
    total_chunks: number;
    estimated_size_mb: number;
  }> {
    const response = await apiClient.post(`${API_BASE_URL}/data/export-streaming`, exportData);
    return response.data;
  }

  // Enhanced Export Management
  static async getExports(filters?: {
    status?: string;
    template_id?: number;
    created_by?: number;
    start_date?: string;
    end_date?: string;
    export_format?: string;
    limit?: number;
    offset?: number;
    sort_by?: 'created_at' | 'name' | 'size' | 'duration';
    sort_order?: 'asc' | 'desc';
  }): Promise<{ exports: ReportExport[]; total_count: number; summary: Record<string, any> }> {
    const response = await apiClient.get(`${API_BASE_URL}/exports`, { params: filters });
    return response.data;
  }

  static async getExport(exportId: number): Promise<ReportExport> {
    const response = await apiClient.get(`${API_BASE_URL}/exports/${exportId}`);
    return response.data;
  }

  static async getExportWithAnalytics(exportId: number): Promise<ReportExport & {
    download_analytics: {
      total_downloads: number;
      unique_downloaders: number;
      download_history: Array<{
        downloaded_at: string;
        downloaded_by: number;
        user_agent: string;
      }>;
    };
  }> {
    const response = await apiClient.get(`${API_BASE_URL}/exports/${exportId}/analytics`);
    return response.data;
  }

  static async deleteExport(exportId: number): Promise<void> {
    await apiClient.delete(`${API_BASE_URL}/exports/${exportId}`);
  }

  static async bulkDeleteExports(exportIds: number[]): Promise<{ deleted_count: number; failed_deletions: number[] }> {
    const response = await apiClient.post(`${API_BASE_URL}/exports/bulk-delete`, { export_ids: exportIds });
    return response.data;
  }

  static async archiveOldExports(olderThanDays: number): Promise<{ archived_count: number; freed_space_mb: number }> {
    const response = await apiClient.post(`${API_BASE_URL}/exports/archive`, { older_than_days: olderThanDays });
    return response.data;
  }

  static async getExportStatus(exportId: number): Promise<{
    export_id: number;
    status: string;
    progress_percentage?: number;
    estimated_completion?: string;
    current_step?: string;
    error_message?: string;
    performance_metrics?: {
      data_processing_time: number;
      rendering_time: number;
      total_records_processed: number;
    };
  }> {
    const response = await apiClient.get(`${API_BASE_URL}/exports/${exportId}/status`);
    return response.data;
  }

  static async getExportSummary(timeRange?: string): Promise<{
    total_exports: number;
    completed_exports: number;
    failed_exports: number;
    pending_exports: number;
    total_file_size_bytes: number;
    exports_by_format: Record<string, number>;
    exports_by_template: Record<string, number>;
    average_generation_time: number;
    success_rate: number;
    recent_exports: ReportExport[];
    trending_templates: Array<{
      template_id: number;
      template_name: string;
      usage_count: number;
      growth_rate: number;
    }>;
    storage_usage: {
      used_space_mb: number;
      available_space_mb: number;
      cleanup_recommendations: string[];
    };
  }> {
    const response = await apiClient.get(`${API_BASE_URL}/summary`, {
      params: timeRange ? { time_range: timeRange } : undefined,
    });
    return response.data;
  }

  // Report Scheduling
  static async createSchedule(scheduleData: {
    template_id: number;
    name: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    schedule_time: string;
    timezone: string;
    recipients: string[];
    export_format: 'PDF' | 'EXCEL' | 'CSV';
    filters?: Record<string, any>;
    delivery_options?: {
      email_subject?: string;
      email_body?: string;
      include_summary?: boolean;
    };
  }): Promise<ReportSchedule> {
    const response = await apiClient.post(`${API_BASE_URL}/schedules`, scheduleData);
    return response.data;
  }

  static async getSchedules(templateId?: number): Promise<ReportSchedule[]> {
    const response = await apiClient.get(`${API_BASE_URL}/schedules`, {
      params: templateId ? { template_id: templateId } : undefined,
    });
    return response.data;
  }

  static async updateSchedule(scheduleId: number, updates: Partial<ReportSchedule>): Promise<ReportSchedule> {
    const response = await apiClient.put(`${API_BASE_URL}/schedules/${scheduleId}`, updates);
    return response.data;
  }

  static async deleteSchedule(scheduleId: number): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`${API_BASE_URL}/schedules/${scheduleId}`);
    return response.data;
  }

  static async pauseSchedule(scheduleId: number): Promise<{ success: boolean }> {
    const response = await apiClient.post(`${API_BASE_URL}/schedules/${scheduleId}/pause`);
    return response.data;
  }

  static async resumeSchedule(scheduleId: number): Promise<{ success: boolean }> {
    const response = await apiClient.post(`${API_BASE_URL}/schedules/${scheduleId}/resume`);
    return response.data;
  }

  // Template Analytics
  static async getTemplateAnalytics(templateId: number, timeRange?: string): Promise<ReportAnalytics> {
    const response = await apiClient.get(`${API_BASE_URL}/templates/${templateId}/analytics`, {
      params: timeRange ? { time_range: timeRange } : undefined,
    });
    return response.data;
  }

  static async getSystemAnalytics(timeRange?: string): Promise<{
    total_templates: number;
    active_templates: number;
    total_reports_generated: number;
    success_rate: number;
    average_generation_time: number;
    most_popular_formats: Record<string, number>;
    user_engagement: {
      active_users: number;
      power_users: number;
      new_users: number;
    };
    performance_trends: Array<{
      date: string;
      generation_count: number;
      success_rate: number;
      avg_time: number;
    }>;
    error_analysis: Array<{
      error_type: string;
      count: number;
      percentage: number;
    }>;
  }> {
    const response = await apiClient.get(`${API_BASE_URL}/system/analytics`, {
      params: timeRange ? { time_range: timeRange } : undefined,
    });
    return response.data;
  }

  // System Management
  static async initializeTemplates(): Promise<{ created_templates: number; updated_templates: number }> {
    const response = await apiClient.post(`${API_BASE_URL}/system/initialize-templates`);
    return response.data;
  }

  static async cleanupExpiredExports(): Promise<{ deleted_count: number; freed_space_mb: number }> {
    const response = await apiClient.post(`${API_BASE_URL}/system/cleanup-expired`);
    return response.data;
  }

  static async optimizeStorage(): Promise<{
    compressed_files: number;
    space_saved_mb: number;
    moved_to_archive: number;
    recommendations: string[];
  }> {
    const response = await apiClient.post(`${API_BASE_URL}/system/optimize-storage`);
    return response.data;
  }

  static async validateTemplates(): Promise<Array<{
    template_id: number;
    template_name: string;
    is_valid: boolean;
    issues: string[];
    suggestions: string[];
  }>> {
    const response = await apiClient.post(`${API_BASE_URL}/system/validate-templates`);
    return response.data;
  }

  // Enhanced File Download and Management
  static getDownloadUrl(filename: string): string {
    return `${API_BASE_URL}/download/${filename}`;
  }

  static async getDownloadToken(exportId: number): Promise<{ token: string; expires_in: number }> {
    const response = await apiClient.post(`${API_BASE_URL}/exports/${exportId}/download-token`);
    return response.data;
  }

  static async downloadWithToken(exportId: number, token: string): Promise<void> {
    const response = await apiClient.get(`${API_BASE_URL}/exports/${exportId}/download`, {
      params: { token },
      responseType: 'blob',
    });
    
    const exportItem = await this.getExport(exportId);
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = exportItem.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  static async downloadFile(exportId: number): Promise<void> {
    const exportItem = await this.getExport(exportId);
    if (exportItem.file_url) {
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = exportItem.file_url;
      link.download = exportItem.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (exportItem.file_path) {
      // Use the file path to create download URL
      const filename = exportItem.file_path.split('/').pop();
      if (filename) {
        const downloadUrl = this.getDownloadUrl(filename);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = exportItem.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  // Utility methods for chart export
  static async exportChartFromElement(
    chartElement: HTMLElement,
    options: {
      format: 'PNG' | 'SVG' | 'PDF';
      filename?: string;
      width?: number;
      height?: number;
      title?: string;
    }
  ): Promise<string> {
    // This would work with canvas-based charts (like Chart.js)
    // For Recharts (which uses SVG), we need to extract the SVG
    
    const svgElement = chartElement.querySelector('svg');
    if (!svgElement) {
      throw new Error('No SVG chart found in element');
    }

    // Extract chart data from SVG
    const chartData = {
      type: 'svg_export',
      svg_content: svgElement.outerHTML,
      width: options.width || svgElement.clientWidth,
      height: options.height || svgElement.clientHeight
    };

    const response = await this.exportChart({
      chart_type: 'recharts',
      chart_data: chartData,
      export_format: options.format,
      width: options.width,
      height: options.height,
      title: options.title,
      filename: options.filename
    });

    return response.download_url;
  }

  // Batch operations
  static async batchExportCharts(
    charts: Array<{
      element: HTMLElement;
      title: string;
      filename?: string;
    }>,
    format: 'PNG' | 'SVG' | 'PDF' = 'PNG'
  ): Promise<string[]> {
    const exportPromises = charts.map(chart =>
      this.exportChartFromElement(chart.element, {
        format,
        title: chart.title,
        filename: chart.filename
      })
    );

    return Promise.all(exportPromises);
  }

  // Polling for export status
  static async pollExportStatus(
    exportId: number,
    onProgress?: (progress: number) => void,
    intervalMs = 2000,
    timeoutMs = 300000 // 5 minutes
  ): Promise<ReportExport> {
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          if (Date.now() - startTime > timeoutMs) {
            reject(new Error('Export timeout'));
            return;
          }

          const status = await this.getExportStatus(exportId);
          
          if (onProgress && status.progress_percentage !== undefined) {
            onProgress(status.progress_percentage);
          }

          if (status.status === 'COMPLETED') {
            const exportItem = await this.getExport(exportId);
            resolve(exportItem);
          } else if (status.status === 'FAILED' || status.status === 'CANCELLED') {
            reject(new Error(status.error_message || 'Export failed'));
          } else {
            // Still processing, continue polling
            setTimeout(poll, intervalMs);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  // Enhanced polling with detailed callbacks
  static async pollExportStatus(
    exportId: number,
    callbacks: {
      onProgress?: (progress: number, currentStep?: string) => void;
      onStatusChange?: (status: string) => void;
      onPerformanceUpdate?: (metrics: any) => void;
    } = {},
    options: {
      intervalMs?: number;
      timeoutMs?: number;
      exponentialBackoff?: boolean;
    } = {}
  ): Promise<ReportExport> {
    const {
      intervalMs = 2000,
      timeoutMs = 600000, // 10 minutes
      exponentialBackoff = false
    } = options;
    
    const startTime = Date.now();
    let currentInterval = intervalMs;
    let lastStatus = '';

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          if (Date.now() - startTime > timeoutMs) {
            reject(new Error(`Export timeout after ${timeoutMs / 1000} seconds`));
            return;
          }

          const status = await this.getExportStatus(exportId);
          
          // Status change callback
          if (status.status !== lastStatus) {
            lastStatus = status.status;
            callbacks.onStatusChange?.(status.status);
          }
          
          // Progress callback
          if (callbacks.onProgress && status.progress_percentage !== undefined) {
            callbacks.onProgress(status.progress_percentage, status.current_step);
          }
          
          // Performance metrics callback
          if (callbacks.onPerformanceUpdate && status.performance_metrics) {
            callbacks.onPerformanceUpdate(status.performance_metrics);
          }

          if (status.status === 'COMPLETED') {
            const exportItem = await this.getExport(exportId);
            resolve(exportItem);
          } else if (status.status === 'FAILED' || status.status === 'CANCELLED') {
            reject(new Error(status.error_message || `Export ${status.status.toLowerCase()}`));
          } else {
            // Exponential backoff for long-running exports
            if (exponentialBackoff) {
              currentInterval = Math.min(currentInterval * 1.2, 10000); // Max 10 seconds
            }
            
            setTimeout(poll, currentInterval);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  // Utility methods for report templates
  static validateTemplate(template: Partial<ReportTemplate>): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!template.name || template.name.trim().length === 0) {
      errors.push('Template name is required');
    }
    
    if (!template.report_type) {
      errors.push('Report type is required');
    }
    
    if (template.template_config) {
      if (!template.template_config.sections || template.template_config.sections.length === 0) {
        warnings.push('Template has no sections defined');
      }
      
      // Check for duplicate section IDs
      const sectionIds = template.template_config.sections?.map(s => s.id) || [];
      const duplicateIds = sectionIds.filter((id, index) => sectionIds.indexOf(id) !== index);
      if (duplicateIds.length > 0) {
        errors.push(`Duplicate section IDs found: ${duplicateIds.join(', ')}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  static getRecommendedFormats(templateType: string, dataSize: 'small' | 'medium' | 'large'): Array<{
    format: string;
    recommended: boolean;
    reason: string;
  }> {
    const recommendations = {
      'financial': {
        'small': [{ format: 'PDF', recommended: true, reason: 'Best for sharing and printing' }],
        'medium': [{ format: 'EXCEL', recommended: true, reason: 'Allows further analysis' }],
        'large': [{ format: 'CSV', recommended: true, reason: 'Efficient for large datasets' }]
      },
      'executive': {
        'small': [{ format: 'PDF', recommended: true, reason: 'Professional presentation format' }],
        'medium': [{ format: 'POWERPOINT', recommended: true, reason: 'Easy to present and modify' }],
        'large': [{ format: 'PDF', recommended: true, reason: 'Consistent formatting across pages' }]
      }
    };
    
    return recommendations[templateType]?.[dataSize] || [
      { format: 'PDF', recommended: true, reason: 'Universal compatibility' }
    ];
  }
}

/**
 * Enhanced report utilities
 */
export const reportUtils = {
  /**
   * Format file size in human readable format
   */
  formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Get status badge configuration
   */
  getStatusBadge(status: string): { color: string; icon: string; label: string } {
    const badges: Record<string, { color: string; icon: string; label: string }> = {
      'PENDING': { color: '#6B7280', icon: '⏳', label: 'Pending' },
      'PROCESSING': { color: '#3B82F6', icon: '🔄', label: 'Processing' },
      'COMPLETED': { color: '#10B981', icon: '✅', label: 'Completed' },
      'FAILED': { color: '#EF4444', icon: '❌', label: 'Failed' },
      'CANCELLED': { color: '#9CA3AF', icon: '🚫', label: 'Cancelled' },
    };
    return badges[status] || { color: '#9CA3AF', icon: '❓', label: 'Unknown' };
  },

  /**
   * Estimate export time based on template complexity
   */
  estimateExportTime(template: ReportTemplate, dataSize: number): number {
    let baseTime = 30; // 30 seconds base
    
    // Adjust for template complexity
    const sectionCount = template.template_config?.sections?.length || 0;
    const chartCount = template.template_config?.charts?.length || 0;
    const tableCount = template.template_config?.tables?.length || 0;
    
    baseTime += sectionCount * 5;
    baseTime += chartCount * 15;
    baseTime += tableCount * 10;
    
    // Adjust for data size (assuming dataSize is in MB)
    if (dataSize > 100) {
      baseTime *= 2;
    } else if (dataSize > 10) {
      baseTime *= 1.5;
    }
    
    return Math.max(baseTime, 15); // Minimum 15 seconds
  },

  /**
   * Generate suggested filename
   */
  generateFilename(templateName: string, format: string, includeDatetime = true): string {
    let filename = templateName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    if (includeDatetime) {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
      filename += `_${dateStr}_${timeStr}`;
    }
    
    return `${filename}.${format.toLowerCase()}`;
  },

  /**
   * Parse filter values for API requests
   */
  parseFilters(filters: Record<string, any>): Record<string, any> {
    const parsed: Record<string, any> = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          parsed[key] = value;
        } else if (typeof value === 'object' && value.start && value.end) {
          // Date range handling
          parsed[`${key}_start`] = value.start;
          parsed[`${key}_end`] = value.end;
        } else {
          parsed[key] = value;
        }
      }
    });
    
    return parsed;
  },

  /**
   * Format duration in human readable format
   */
  formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const remainingMinutes = Math.floor((seconds % 3600) / 60);
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  },

  /**
   * Get format-specific export options
   */
  getFormatOptions(format: string): Array<{ key: string; label: string; type: string; default?: any }> {
    const options: Record<string, Array<{ key: string; label: string; type: string; default?: any }>> = {
      'PDF': [
        { key: 'page_size', label: 'Page Size', type: 'select', default: 'A4' },
        { key: 'orientation', label: 'Orientation', type: 'select', default: 'portrait' },
        { key: 'margins', label: 'Margins (mm)', type: 'number', default: 20 },
        { key: 'include_page_numbers', label: 'Include Page Numbers', type: 'boolean', default: true },
      ],
      'EXCEL': [
        { key: 'include_charts', label: 'Include Charts', type: 'boolean', default: true },
        { key: 'separate_sheets', label: 'Separate Sheets by Section', type: 'boolean', default: false },
        { key: 'freeze_headers', label: 'Freeze Header Rows', type: 'boolean', default: true },
      ],
      'CSV': [
        { key: 'delimiter', label: 'Delimiter', type: 'select', default: ',' },
        { key: 'include_headers', label: 'Include Headers', type: 'boolean', default: true },
        { key: 'encoding', label: 'Encoding', type: 'select', default: 'UTF-8' },
      ],
    };
    
    return options[format] || [];
  }
};

export default ReportApi; 