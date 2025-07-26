import axios from 'axios';

const API_BASE_URL = '/api/v1/reports';

export interface ReportTemplate {
  id: number;
  name: string;
  description?: string;
  report_type: string;
  is_system: boolean;
  is_active: boolean;
  template_config?: Record<string, unknown>;
  branding_config?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

export interface ReportExport {
  id: number;
  name: string;
  export_format: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  file_path?: string;
  file_size?: number;
  file_url?: string;
  processing_started_at?: string;
  processing_completed_at?: string;
  processing_duration_seconds?: number;
  error_message?: string;
  created_at: string;
  expires_at?: string;
}

export interface GenerateReportRequest {
  template_id?: number;
  export_format: 'PDF' | 'EXCEL' | 'CSV';
  name?: string;
  source_file_ids?: number[];
  data_period_start?: string;
  data_period_end?: string;
  custom_config?: Record<string, unknown>;
}

export interface ChartExportRequest {
  chart_type: string;
  chart_data: Record<string, unknown>;
  export_format: 'PNG' | 'SVG' | 'PDF';
  width?: number;
  height?: number;
  title?: string;
  filename?: string;
}

export interface CreateTemplateRequest {
  name: string;
  description?: string;
  report_type: string;
  template_config?: Record<string, unknown>;
  branding_config?: Record<string, unknown>;
}

export class ReportApi {
  // Template Management
  static async getTemplates(reportType?: string, includeSystem = true): Promise<ReportTemplate[]> {
    const params = new URLSearchParams();
    if (reportType) params.append('report_type', reportType);
    if (!includeSystem) params.append('include_system', 'false');
    
    const response = await axios.get(`${API_BASE_URL}/templates?${params}`);
    return response.data;
  }

  static async getTemplate(templateId: number): Promise<ReportTemplate> {
    const response = await axios.get(`${API_BASE_URL}/templates/${templateId}`);
    return response.data;
  }

  static async createTemplate(templateData: CreateTemplateRequest): Promise<ReportTemplate> {
    const response = await axios.post(`${API_BASE_URL}/templates`, templateData);
    return response.data;
  }

  static async updateTemplate(templateId: number, templateData: Partial<CreateTemplateRequest>): Promise<ReportTemplate> {
    const response = await axios.put(`${API_BASE_URL}/templates/${templateId}`, templateData);
    return response.data;
  }

  static async deleteTemplate(templateId: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/templates/${templateId}`);
  }

  // Report Generation
  static async generateReport(reportData: GenerateReportRequest): Promise<ReportExport> {
    const response = await axios.post(`${API_BASE_URL}/generate`, reportData);
    return response.data;
  }

  static async exportChart(chartData: ChartExportRequest): Promise<{ message: string; file_path: string; download_url: string }> {
    const response = await axios.post(`${API_BASE_URL}/charts/export`, chartData);
    return response.data;
  }

  static async exportData(exportData: {
    export_format: 'CSV' | 'JSON';
    source_file_ids?: number[];
    date_range?: Record<string, unknown>;
    filters?: Record<string, unknown>;
    include_raw_data?: boolean;
    include_calculations?: boolean;
    include_metadata?: boolean;
  }): Promise<{ message: string; file_path: string; download_url: string }> {
    const response = await axios.post(`${API_BASE_URL}/data/export`, exportData);
    return response.data;
  }

  // Export Management
  static async getExports(
    status?: string,
    limit = 50,
    offset = 0
  ): Promise<ReportExport[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const response = await axios.get(`${API_BASE_URL}/exports?${params}`);
    return response.data;
  }

  static async getExport(exportId: number): Promise<ReportExport> {
    const response = await axios.get(`${API_BASE_URL}/exports/${exportId}`);
    return response.data;
  }

  static async deleteExport(exportId: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/exports/${exportId}`);
  }

  static async getExportStatus(exportId: number): Promise<{
    export_id: number;
    status: string;
    progress_percentage?: number;
    estimated_completion?: string;
    current_step?: string;
    error_message?: string;
  }> {
    const response = await axios.get(`${API_BASE_URL}/exports/${exportId}/status`);
    return response.data;
  }

  static async getExportSummary(): Promise<{
    total_exports: number;
    completed_exports: number;
    failed_exports: number;
    pending_exports: number;
    total_file_size_bytes: number;
    exports_by_format: Record<string, number>;
    recent_exports: ReportExport[];
  }> {
    const response = await axios.get(`${API_BASE_URL}/summary`);
    return response.data;
  }

  // File Download
  static getDownloadUrl(filename: string): string {
    return `${API_BASE_URL}/download/${filename}`;
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
} 